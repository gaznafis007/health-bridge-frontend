"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AppointmentStatusBadge } from "@/features/appointments/components/AppointmentStatusBadge";
import { PrescriptionCard } from "@/features/appointments/components/PrescriptionCard";
import { VisitNoteCard } from "@/features/appointments/components/VisitNoteCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  cancelAppointment,
  getMyAppointments,
  getPrescription,
  getVisitNote,
} from "@/lib/appointments/appointments.api";
import type {
  Appointment,
  CancelAppointmentFormValues,
  Prescription,
  VisitNote,
} from "@/lib/appointments/appointments.types";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  mapApiErrorMessage,
} from "@/lib/api/errors";

interface AppointmentDetailShellProps {
  appointmentId: string;
}

export function AppointmentDetailShell({
  appointmentId,
}: AppointmentDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [visitNote, setVisitNote] = useState<VisitNote | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelPanel, setShowCancelPanel] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CancelAppointmentFormValues>({
    defaultValues: { reason: "" },
  });

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace(`/auth/login?redirect=/appointments/${appointmentId}`);
      return;
    }

    let isMounted = true;

    async function loadAppointmentDetail() {
      setIsLoading(true);

      try {
        const page = await getMyAppointments(accessToken!, 0, 100);
        const match = page.items.find((item) => item.id === appointmentId);

        if (!match) {
          if (!isMounted) return;
          setError("Appointment not found.");
          setIsLoading(false);
          return;
        }

        let note: VisitNote | null = null;
        let rx: Prescription | null = null;

        if (match.status === "COMPLETED") {
          const [noteResult, rxResult] = await Promise.allSettled([
            getVisitNote(accessToken!, appointmentId),
            getPrescription(accessToken!, appointmentId),
          ]);

          if (noteResult.status === "fulfilled") {
            note = noteResult.value;
          }

          if (rxResult.status === "fulfilled") {
            rx = rxResult.value;
          }
        }

        if (!isMounted) return;

        setAppointment(match);
        setVisitNote(note);
        setPrescription(rx);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/appointments/${appointmentId}`);
          return;
        }

        setError(getApiErrorMessage(err, "We could not load this appointment."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAppointmentDetail();

    return () => {
      isMounted = false;
    };
  }, [accessToken, appointmentId, isAuthLoading, router]);

  async function onCancel(values: CancelAppointmentFormValues) {
    if (!accessToken || !appointment) return;

    setCancelError(null);

    try {
      const updated = await cancelAppointment(
        accessToken,
        appointment.id,
        values.reason.trim() || undefined,
      );
      setAppointment(updated);
      setShowCancelPanel(false);
    } catch (err) {
      setCancelError(mapApiErrorMessage(err, "We could not cancel this appointment."));
    }
  }

  if (isAuthLoading || isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !appointment) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          title={error === "Appointment not found." ? "Appointment not found" : "Something went wrong"}
          description={error ?? "This appointment could not be loaded."}
          icon={<CalendarIcon />}
          action={
            <Link
              href="/appointments/history"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Back to history
            </Link>
          }
        />
      </section>
    );
  }

  const canCancel =
    appointment.status === "SCHEDULED" || appointment.status === "IN_PROGRESS";

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <Link
            href="/appointments/history"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            ← Back to history
          </Link>
          <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
            Appointment details
          </h1>
        </div>

        <article className="surface-card space-y-5 rounded-[2rem] border border-[var(--color-border)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
                {appointment.doctor?.fullName ?? "Doctor"}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {appointment.doctor?.specialization}
              </p>
            </div>
            <AppointmentStatusBadge status={appointment.status} />
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Date" value={appointment.date} />
            <InfoItem
              label="Time"
              value={`${appointment.startTime} (${appointment.durationMinutes} min)`}
            />
            <InfoItem
              label="Health center"
              value={appointment.healthCenter?.name ?? "—"}
            />
            <InfoItem
              label="Fee"
              value={`৳${Number.parseFloat(appointment.fee).toFixed(0)}`}
            />
            {appointment.reasonForVisit ? (
              <InfoItem
                label="Reason for visit"
                value={appointment.reasonForVisit}
                className="sm:col-span-2"
              />
            ) : null}
            {appointment.cancelReason ? (
              <InfoItem
                label="Cancel reason"
                value={appointment.cancelReason}
                className="sm:col-span-2"
              />
            ) : null}
          </dl>
        </article>

        {appointment.status === "COMPLETED" ? (
          <>
            <VisitNoteCard visitNote={visitNote} />
            {prescription ? (
              <PrescriptionCard prescription={prescription} />
            ) : (
              <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
                  Prescription
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  No prescription recorded for this appointment.
                </p>
              </article>
            )}
          </>
        ) : null}

        {canCancel ? (
          <div className="space-y-3">
            {cancelError ? <ErrorMessage message={cancelError} /> : null}
            {!showCancelPanel ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowCancelPanel(true)}
              >
                Cancel appointment
              </Button>
            ) : (
              <form
                onSubmit={handleSubmit(onCancel)}
                className="surface-card space-y-4 rounded-[2rem] border border-red-200 bg-red-50 p-5"
              >
                <p className="text-sm text-red-800">
                  Are you sure you want to cancel this appointment?
                </p>
                <div>
                  <label
                    htmlFor="cancel-reason"
                    className="mb-2 block text-sm font-semibold text-red-900"
                  >
                    Reason (optional)
                  </label>
                  <textarea
                    id="cancel-reason"
                    rows={3}
                    aria-invalid={!!errors.reason}
                    className="w-full resize-none rounded-xl border border-red-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    {...register("reason", {
                      maxLength: {
                        value: 2000,
                        message: "Maximum 2000 characters.",
                      },
                    })}
                  />
                  {errors.reason ? (
                    <p role="alert" className="mt-2 text-sm text-red-600">
                      {errors.reason.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="danger" disabled={isSubmitting}>
                    {isSubmitting ? "Cancelling..." : "Confirm cancel"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCancelPanel(false)}
                    disabled={isSubmitting}
                  >
                    Keep appointment
                  </Button>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--color-text-primary)]">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 rounded bg-slate-200" />
        <div className="h-72 rounded-[2rem] bg-white" />
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
