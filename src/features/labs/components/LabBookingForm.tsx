"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import type { LabSelectionEntry } from "@/features/labs/hooks/useLabSelection";
import { createBooking } from "@/lib/labs/labs.api";
import type { LabBookingFormValues, LabPaymentMethod } from "@/lib/labs/labs.types";
import { mapApiErrorMessage } from "@/lib/api/errors";

interface LabBookingFormProps {
  accessToken: string;
  centerId: string;
  selections: LabSelectionEntry[];
  onCancel: () => void;
  onSuccess?: () => void;
}

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function LabBookingForm({
  accessToken,
  centerId,
  selections,
  onCancel,
  onSuccess,
}: LabBookingFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LabBookingFormValues>({
    defaultValues: {
      sampleCollectionDate: todayIsoDate(),
      sampleCollectionTime: "09:00",
      paymentMethod: "CASH",
      notes: "",
    },
  });

  async function onSubmit(values: LabBookingFormValues) {
    setSubmitError(null);

    try {
      const booking = await createBooking(
        accessToken,
        {
          diagnosticCenterId: centerId,
          items: selections.map(({ type, item }) =>
            type === "test" ? { testId: item.id } : { packageId: item.id },
          ),
          sampleCollectionDate: values.sampleCollectionDate,
          sampleCollectionTime: values.sampleCollectionTime,
          paymentMethod: values.paymentMethod,
          notes: values.notes.trim() || undefined,
        },
        crypto.randomUUID(),
      );

      onSuccess?.();
      router.push(`/lab-tests/bookings/${booking.id}`);
    } catch (error) {
      setSubmitError(
        mapApiErrorMessage(error, "We could not create your lab booking."),
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card space-y-5 rounded-[2rem] border border-[var(--color-border)] p-6"
    >
      <div>
        <h3 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
          Complete your booking
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Choose sample collection details and payment method.
        </p>
      </div>

      {submitError ? <ErrorMessage message={submitError} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Sample collection date" error={errors.sampleCollectionDate?.message}>
          <input
            type="date"
            min={todayIsoDate()}
            aria-invalid={!!errors.sampleCollectionDate}
            className={inputClass(!!errors.sampleCollectionDate)}
            {...register("sampleCollectionDate", {
              required: "Collection date is required.",
              validate: (value) =>
                value >= todayIsoDate() || "Date must be today or later.",
            })}
          />
        </Field>

        <Field label="Sample collection time" error={errors.sampleCollectionTime?.message}>
          <input
            type="text"
            placeholder="09:00"
            aria-invalid={!!errors.sampleCollectionTime}
            className={inputClass(!!errors.sampleCollectionTime)}
            {...register("sampleCollectionTime", {
              required: "Collection time is required.",
              pattern: {
                value: timePattern,
                message: "Use 24-hour format (HH:mm).",
              },
            })}
          />
        </Field>
      </div>

      <Field label="Payment method" error={errors.paymentMethod?.message}>
        <Controller
          name="paymentMethod"
          control={control}
          rules={{ required: "Select a payment method." }}
          render={({ field }) => (
            <div className="grid gap-3 sm:grid-cols-2">
              {(["CASH", "ONLINE"] as LabPaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    field.value === method
                      ? "border-[var(--color-primary)] bg-sky-50"
                      : "border-[var(--color-border)] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={method}
                    checked={field.value === method}
                    onChange={() => field.onChange(method)}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {method === "CASH" ? "Cash on collection" : "Pay online"}
                  </span>
                </label>
              ))}
            </div>
          )}
        />
      </Field>

      <Field label="Notes (optional)" error={errors.notes?.message}>
        <textarea
          rows={3}
          placeholder="Fasting required, special instructions..."
          aria-invalid={!!errors.notes}
          className={`${inputClass(!!errors.notes)} resize-none`}
          {...register("notes")}
        />
      </Field>

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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-sky-100 ${
    hasError
      ? "border-red-300 bg-red-50"
      : "border-[var(--color-border)] bg-white"
  }`;
}
