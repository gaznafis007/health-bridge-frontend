"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { AmbulanceStatusBadge } from "@/features/ambulance/components/AmbulanceStatusBadge";
import {
  AdminFormField,
  adminInputClass,
} from "@/features/admin/components/AdminFormField";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  dispatchBooking,
  getAmbulanceBooking,
  listDrivers,
  listFleet,
} from "@/lib/ambulance/ambulance.api";
import type {
  AmbulanceBooking,
  DispatchBookingPayload,
} from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

interface DispatchFormProps {
  bookingId: string;
}

export function DispatchForm({ bookingId }: DispatchFormProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [booking, setBooking] = useState<AmbulanceBooking | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: fleet } = useAuthenticatedSWR("dispatch/fleet", (token) =>
    listFleet(token, { status: "AVAILABLE" }),
  );
  const { data: drivers } = useAuthenticatedSWR("dispatch/drivers", listDrivers);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DispatchBookingPayload>();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!accessToken) {
      router.replace(`/auth/login?redirect=/dispatch/bookings/${bookingId}`);
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const data = await getAmbulanceBooking(token, bookingId);
        if (isMounted) {
          setBooking(data);
          setLoadError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/dispatch/bookings/${bookingId}`);
          return;
        }
        setLoadError(getApiErrorMessage(err, "Could not load booking."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [accessToken, bookingId, isAuthLoading, router]);

  async function onSubmit(values: DispatchBookingPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      const updated = await dispatchBooking(accessToken, bookingId, {
        ...values,
        priority: values.priority ? Number(values.priority) : undefined,
      });
      setBooking(updated);
      setSuccess(true);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not dispatch booking."));
    }
  }

  return (
    <RequireRole allowed={["DISPATCHER", "ADMIN"]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dispatch"
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          ← Back to queue
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {loadError ? (
          <div className="mt-8">
            <EmptyState title="Booking unavailable" description={loadError} />
          </div>
        ) : null}

        {booking ? (
          <div className="mt-6 space-y-6">
            <SectionHeader
              title={`Dispatch: ${booking.emergencyType}`}
              description={`${booking.pickupAddress} → ${booking.destinationAddress}`}
              action={<AmbulanceStatusBadge status={booking.status} />}
            />

            <dl className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                  Vehicle required
                </dt>
                <dd>{booking.vehicleTypeRequired}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                  Condition
                </dt>
                <dd>{booking.patientCondition}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                  Estimated fare
                </dt>
                <dd>৳{Number.parseFloat(booking.estimatedFare).toFixed(0)}</dd>
              </div>
            </dl>

            {booking.status === "REQUESTED" ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-slate-50 p-5"
              >
                <h3 className="font-heading font-semibold">Manual dispatch</h3>
                <AdminFormField label="Ambulance" error={errors.ambulanceId?.message}>
                  <select
                    {...register("ambulanceId", { required: "Select an ambulance" })}
                    className={adminInputClass}
                  >
                    <option value="">Select vehicle</option>
                    {fleet?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} ({v.vehicleType})
                      </option>
                    ))}
                  </select>
                </AdminFormField>
                <AdminFormField label="Driver" error={errors.driverId?.message}>
                  <select
                    {...register("driverId", { required: "Select a driver" })}
                    className={adminInputClass}
                  >
                    <option value="">Select driver</option>
                    {drivers
                      ?.filter((d) => d.status === "ACTIVE" && d.isVerified)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.firstName ?? d.userId.slice(0, 8)} — {d.licenseNumber}
                        </option>
                      ))}
                  </select>
                </AdminFormField>
                <AdminFormField label="Notes">
                  <textarea {...register("notes")} className={adminInputClass} rows={2} />
                </AdminFormField>
                <AdminFormField label="Priority (1–10)">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    {...register("priority", { valueAsNumber: true })}
                    className={adminInputClass}
                  />
                </AdminFormField>
                {submitError ? <ErrorMessage message={submitError} /> : null}
                {success ? (
                  <p className="text-sm font-medium text-emerald-600">
                    Booking dispatched successfully.
                  </p>
                ) : null}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Dispatching..." : "Dispatch ambulance"}
                </Button>
              </form>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                This booking is already {booking.status.toLowerCase().replace("_", " ")}.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </RequireRole>
  );
}
