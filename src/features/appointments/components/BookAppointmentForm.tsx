"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import type {
  BookAppointmentFormValues,
  DoctorDetail,
  TimeSlot,
} from "@/lib/appointments/appointments.types";
import { bookAppointment } from "@/lib/appointments/appointments.api";
import { mapApiErrorMessage } from "@/lib/api/errors";

interface BookAppointmentFormProps {
  accessToken: string;
  doctor: DoctorDetail;
  date: string;
  selectedSlot: TimeSlot;
  onBack: () => void;
  onSuccess: (appointmentId: string) => void;
}

export function BookAppointmentForm({
  accessToken,
  doctor,
  date,
  selectedSlot,
  onBack,
  onSuccess,
}: BookAppointmentFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookAppointmentFormValues>({
    defaultValues: { reasonForVisit: "" },
  });

  const center = doctor.slotsByHealthCentre.find(
    (group) => group.healthCenter.id === selectedSlot.healthCenterId,
  )?.healthCenter;

  async function onSubmit(values: BookAppointmentFormValues) {
    setSubmitError(null);

    try {
      const appointment = await bookAppointment(accessToken, {
        availabilityRuleId: selectedSlot.availabilityRuleId,
        date,
        startTime: selectedSlot.startTime,
        reasonForVisit: values.reasonForVisit.trim() || undefined,
      });

      onSuccess(appointment.id);
    } catch (error) {
      setSubmitError(
        mapApiErrorMessage(error, "We could not book this appointment."),
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card space-y-5 rounded-[2rem] border border-[var(--color-border)] p-6"
    >
      <div>
        <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
          Confirm appointment
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Review your selection before booking.
        </p>
      </div>

      {submitError ? <ErrorMessage message={submitError} /> : null}

      <dl className="grid gap-4 sm:grid-cols-2">
        <SummaryItem label="Doctor" value={doctor.fullName} />
        <SummaryItem label="Specialization" value={doctor.specialization} />
        <SummaryItem label="Date" value={date} />
        <SummaryItem
          label="Time"
          value={`${selectedSlot.startTime} (${selectedSlot.durationMinutes} min)`}
        />
        <SummaryItem label="Center" value={center?.name ?? "Selected center"} />
        <SummaryItem
          label="Consultation fee"
          value={`৳${Number.parseFloat(doctor.consultationFee).toFixed(0)}`}
        />
      </dl>

      <div>
        <label
          htmlFor="reasonForVisit"
          className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]"
        >
          Reason for visit (optional)
        </label>
        <textarea
          id="reasonForVisit"
          rows={3}
          placeholder="Describe your symptoms or reason for visit..."
          aria-invalid={!!errors.reasonForVisit}
          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-sky-100 ${
            errors.reasonForVisit
              ? "border-red-300 bg-red-50"
              : "border-[var(--color-border)] bg-white"
          }`}
          {...register("reasonForVisit", {
            maxLength: { value: 500, message: "Maximum 500 characters." },
          })}
        />
        {errors.reasonForVisit ? (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {errors.reasonForVisit.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Booking...
            </>
          ) : (
            "Confirm booking"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
      </div>
    </form>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  );
}
