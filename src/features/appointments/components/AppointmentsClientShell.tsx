"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BookAppointmentForm } from "@/features/appointments/components/BookAppointmentForm";
import { DoctorCard } from "@/features/appointments/components/DoctorCard";
import { DoctorSearchForm } from "@/features/appointments/components/DoctorSearchForm";
import { SlotPicker } from "@/features/appointments/components/SlotPicker";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getDoctorDetail,
  getHealthCenters,
  searchDoctors,
} from "@/lib/appointments/appointments.api";
import type {
  DoctorDetail,
  DoctorSearchFormValues,
  DoctorSearchResult,
  HealthCenter,
  TimeSlot,
} from "@/lib/appointments/appointments.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

type Step = "search" | "results" | "doctor" | "confirm";

export function AppointmentsClientShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [step, setStep] = useState<Step>("search");
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [searchValues, setSearchValues] = useState<DoctorSearchFormValues | null>(
    null,
  );
  const [doctors, setDoctors] = useState<DoctorSearchResult[]>([]);
  const [doctorDetail, setDoctorDetail] = useState<DoctorDetail | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/appointments");
      return;
    }

    let isMounted = true;

    async function loadCenters() {
      setIsLoading(true);

      try {
        const centers = await getHealthCenters(accessToken);
        if (!isMounted) return;
        setHealthCenters(centers);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/appointments");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load health centers."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCenters();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  async function handleSearch(values: DoctorSearchFormValues) {
    if (!accessToken) return;

    setIsSearching(true);
    setError(null);
    setSearchValues(values);
    setSelectedSlot(null);
    setDoctorDetail(null);

    try {
      const results = await searchDoctors(accessToken, {
        specialization: values.specialization,
        date: values.date,
        healthCenterId: values.healthCenterId || undefined,
      });

      setDoctors(results);
      setStep("results");
    } catch (err) {
      setError(getApiErrorMessage(err, "We could not search doctors."));
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSelectDoctor(doctor: DoctorSearchResult) {
    if (!accessToken || !searchValues) return;

    setIsLoadingDoctor(true);
    setError(null);
    setSelectedSlot(null);

    try {
      const detail = await getDoctorDetail(accessToken, doctor.doctorUserId, {
        date: searchValues.date,
        healthCenterId: searchValues.healthCenterId || undefined,
      });

      setDoctorDetail(detail);
      setStep("doctor");
    } catch (err) {
      setError(getApiErrorMessage(err, "We could not load doctor details."));
    } finally {
      setIsLoadingDoctor(false);
    }
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
    setStep("confirm");
  }

  if (isAuthLoading || isLoading) {
    return <AppointmentsSkeleton />;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="surface-card overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
                <CalendarIcon />
              </div>
              <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                Appointments
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                Find in-person doctors, pick an available slot, and book your visit.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/appointments/history"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50"
              >
                My appointments
              </Link>
              <Link
                href="/appointments/prescriptions"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-slate-50"
              >
                My prescriptions
              </Link>
            </div>
          </div>
        </div>

        <nav aria-label="Booking steps" className="flex flex-wrap gap-2 text-sm">
          <StepChip label="Search" active={step === "search"} />
          <StepChip label="Results" active={step === "results"} />
          <StepChip label="Doctor & slots" active={step === "doctor"} />
          <StepChip label="Confirm" active={step === "confirm"} />
        </nav>

        {error ? <ErrorMessage message={error} /> : null}

        {step !== "search" ? (
          <button
            type="button"
            onClick={() => {
              if (step === "confirm") {
                setStep("doctor");
                return;
              }

              if (step === "doctor") {
                setStep("results");
                return;
              }

              setStep("search");
            }}
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            ← Back
          </button>
        ) : null}

        {step === "search" ? (
          <DoctorSearchForm
            healthCenters={healthCenters}
            defaultValues={searchValues ?? undefined}
            onSubmit={handleSearch}
          />
        ) : null}

        {step === "results" ? (
          doctors.length === 0 ? (
            <EmptyState
              title="No doctors found"
              description="Try a different specialization, date, or health center."
              icon={<DoctorIcon />}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctorUserId}
                  doctor={doctor}
                  onSelect={() => handleSelectDoctor(doctor)}
                />
              ))}
            </div>
          )
        ) : null}

        {step === "doctor" && doctorDetail ? (
          <div className="space-y-6">
            <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
              <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
                {doctorDetail.fullName}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {doctorDetail.specialization}
              </p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Consultation fee"
                  value={`৳${Number.parseFloat(doctorDetail.consultationFee).toFixed(0)}`}
                />
                <InfoItem label="Phone" value={doctorDetail.doctorPhone} />
              </dl>
            </article>

            {isLoadingDoctor ? (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Loading slots...
              </p>
            ) : (
              <SlotPicker
                slotsByCenter={doctorDetail.slotsByHealthCentre}
                selectedSlot={selectedSlot}
                onSelect={handleSlotSelect}
              />
            )}
          </div>
        ) : null}

        {step === "confirm" && doctorDetail && selectedSlot && searchValues && accessToken ? (
          <BookAppointmentForm
            accessToken={accessToken}
            doctor={doctorDetail}
            date={searchValues.date}
            selectedSlot={selectedSlot}
            onBack={() => setStep("doctor")}
            onSuccess={(appointmentId) =>
              router.push(`/appointments/${appointmentId}`)
            }
          />
        ) : null}

        {isSearching ? (
          <p className="text-sm text-[var(--color-text-secondary)]">Searching...</p>
        ) : null}
      </div>
    </section>
  );
}

function StepChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-semibold ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "bg-white text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]"
      }`}
    >
      {label}
    </span>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--color-text-primary)]">{value}</dd>
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-[2rem] bg-sky-100" />
        <div className="h-64 rounded-[2rem] bg-white" />
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

function DoctorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
