"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { AppointmentStatusBadge } from "@/features/appointments/components/AppointmentStatusBadge";
import { PrescriptionCard } from "@/features/appointments/components/PrescriptionCard";
import { VisitNoteCard } from "@/features/appointments/components/VisitNoteCard";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  completeAppointment,
  getDoctorAppointments,
  getPrescription,
  getVisitNote,
  startAppointment,
  writePrescription,
  writeVisitNote,
} from "@/lib/appointments/appointments.api";
import type {
  DoctorAppointment,
  Prescription,
  VisitNote,
  WritePrescriptionPayload,
  WriteVisitNotePayload,
} from "@/lib/appointments/appointments.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

interface DoctorAppointmentDetailShellProps {
  appointmentId: string;
}

export function DoctorAppointmentDetailShell({
  appointmentId,
}: DoctorAppointmentDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [appointment, setAppointment] = useState<DoctorAppointment | null>(null);
  const [visitNote, setVisitNote] = useState<VisitNote | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!accessToken) {
      router.replace(`/auth/login?redirect=/appointments/doctor/${appointmentId}`);
      return;
    }

    const token = accessToken;
    let mounted = true;

    async function load() {
      try {
        const list = await getDoctorAppointments(token);
        const match = list.find((a) => a.id === appointmentId);
        if (!match) {
          if (mounted) setError("Appointment not found.");
          return;
        }
        if (mounted) setAppointment(match);

        try {
          const note = await getVisitNote(token, appointmentId);
          if (mounted) setVisitNote(note);
        } catch {
          /* no note yet */
        }

        try {
          const rx = await getPrescription(token, appointmentId);
          if (mounted) setPrescription(rx);
        } catch {
          /* no rx yet */
        }
      } catch (err) {
        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/appointments/doctor/${appointmentId}`);
          return;
        }
        if (mounted) setError(getApiErrorMessage(err, "Could not load appointment."));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [accessToken, appointmentId, isAuthLoading, router]);

  async function runAction(action: () => Promise<void>) {
    setIsActing(true);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Action failed."));
    } finally {
      setIsActing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage message={error ?? "Appointment not found."} />
        <Link href="/appointments/doctor" className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)]">
          Back to schedule
        </Link>
      </div>
    );
  }

  return (
    <RequireRole allowed={["DOCTOR"]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Visit details</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {appointment.patient?.firstName} {appointment.patient?.lastName} ·{" "}
              {appointment.startTime} · {appointment.healthCenter?.name}
            </p>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        {actionError ? <ErrorMessage message={actionError} /> : null}

        <div className="flex flex-wrap gap-2">
          {appointment.status === "SCHEDULED" ? (
            <Button
              type="button"
              disabled={isActing}
              onClick={() =>
                runAction(async () => {
                  if (!accessToken) return;
                  const updated = await startAppointment(accessToken, appointmentId);
                  setAppointment({ ...appointment, status: updated.status });
                })
              }
            >
              Start visit
            </Button>
          ) : null}
          {appointment.status === "IN_PROGRESS" || appointment.status === "SCHEDULED" ? (
            <Button
              type="button"
              variant="secondary"
              disabled={isActing}
              onClick={() =>
                runAction(async () => {
                  if (!accessToken) return;
                  const updated = await completeAppointment(accessToken, appointmentId);
                  setAppointment({ ...appointment, status: updated.status });
                })
              }
            >
              Complete visit
            </Button>
          ) : null}
        </div>

        {!visitNote ? (
          <VisitNoteWriteForm
            appointmentId={appointmentId}
            onSaved={setVisitNote}
          />
        ) : (
          <VisitNoteCard visitNote={visitNote} />
        )}

        {!prescription ? (
          <PrescriptionWriteForm
            appointmentId={appointmentId}
            onSaved={setPrescription}
          />
        ) : (
          <PrescriptionCard prescription={prescription} />
        )}
      </div>
    </RequireRole>
  );
}

function VisitNoteWriteForm({
  appointmentId,
  onSaved,
}: {
  appointmentId: string;
  onSaved: (note: VisitNote) => void;
}) {
  const { accessToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<WriteVisitNotePayload>();

  async function onSubmit(values: WriteVisitNotePayload) {
    if (!accessToken) return;
    setError(null);
    try {
      const note = await writeVisitNote(accessToken, appointmentId, values);
      onSaved(note);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save visit note."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h3 className="font-heading text-lg font-semibold">Visit note</h3>
      <textarea {...register("diagnosis")} placeholder="Diagnosis" rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" />
      <textarea {...register("treatmentPlan")} placeholder="Treatment plan" rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" />
      <textarea {...register("notes")} placeholder="Notes" rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" />
      {error ? <ErrorMessage message={error} /> : null}
      <Button type="submit" disabled={isSubmitting}>Save visit note</Button>
    </form>
  );
}

function PrescriptionWriteForm({
  appointmentId,
  onSaved,
}: {
  appointmentId: string;
  onSaved: (rx: Prescription) => void;
}) {
  const { accessToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, control, handleSubmit, formState: { isSubmitting } } =
    useForm<WritePrescriptionPayload>({
      defaultValues: { medicines: [{ name: "", dosage: "", frequency: "" }] },
    });
  const { fields, append } = useFieldArray({ control, name: "medicines" });

  async function onSubmit(values: WritePrescriptionPayload) {
    if (!accessToken) return;
    setError(null);
    try {
      const rx = await writePrescription(accessToken, appointmentId, values);
      onSaved(rx);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save prescription."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h3 className="font-heading text-lg font-semibold">Prescription</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-2 sm:grid-cols-3">
          <input {...register(`medicines.${index}.name` as const)} placeholder="Medicine" className="rounded-xl border px-3 py-2 text-sm" />
          <input {...register(`medicines.${index}.dosage` as const)} placeholder="Dosage" className="rounded-xl border px-3 py-2 text-sm" />
          <input {...register(`medicines.${index}.frequency` as const)} placeholder="Frequency" className="rounded-xl border px-3 py-2 text-sm" />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ name: "", dosage: "", frequency: "" })}>
        Add medicine
      </Button>
      <textarea {...register("notes")} placeholder="Prescription notes" rows={2} className="w-full rounded-xl border px-4 py-3 text-sm" />
      {error ? <ErrorMessage message={error} /> : null}
      <Button type="submit" disabled={isSubmitting}>Issue prescription</Button>
    </form>
  );
}
