"use client";

import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { DOCTOR_SPECIALIZATIONS } from "@/lib/appointments/specializations";
import type { DoctorSearchFormValues, HealthCenter } from "@/lib/appointments/appointments.types";

interface DoctorSearchFormProps {
  healthCenters: HealthCenter[];
  defaultValues?: Partial<DoctorSearchFormValues>;
  onSubmit: (values: DoctorSearchFormValues) => void;
}

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DoctorSearchForm({
  healthCenters,
  defaultValues,
  onSubmit,
}: DoctorSearchFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DoctorSearchFormValues>({
    defaultValues: {
      specialization: defaultValues?.specialization ?? "",
      date: defaultValues?.date ?? localIsoDate(),
      healthCenterId: defaultValues?.healthCenterId ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card space-y-5 rounded-[2rem] border border-[var(--color-border)] p-6"
    >
      <div>
        <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
          Find a doctor
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Search by specialization and appointment date.
        </p>
      </div>

      <Field label="Specialization" error={errors.specialization?.message}>
        <Controller
          name="specialization"
          control={control}
          rules={{ required: "Select a specialization." }}
          render={({ field }) => (
            <select
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!errors.specialization}
              className={inputClass(!!errors.specialization)}
            >
              <option value="">Select specialization</option>
              {DOCTOR_SPECIALIZATIONS.map((specialization) => (
                <option key={specialization} value={specialization}>
                  {specialization}
                </option>
              ))}
            </select>
          )}
        />
      </Field>

      <Field label="Appointment date" error={errors.date?.message}>
        <input
          type="date"
          min={localIsoDate()}
          aria-invalid={!!errors.date}
          className={inputClass(!!errors.date)}
          {...register("date", {
            required: "Date is required.",
            validate: (value) =>
              value >= localIsoDate() || "Date must be today or later.",
          })}
        />
      </Field>

      <Field label="Health center (optional)" error={errors.healthCenterId?.message}>
        <Controller
          name="healthCenterId"
          control={control}
          render={({ field }) => (
            <select
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={inputClass(false)}
            >
              <option value="">All centers</option>
              {healthCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name} — {center.city}
                </option>
              ))}
            </select>
          )}
        />
      </Field>

      <Button type="submit">Search doctors</Button>
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
