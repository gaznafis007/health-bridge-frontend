"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { AddressSearchField } from "@/features/ambulance/components/AddressSearchField";
import { createAmbulanceBooking } from "@/lib/ambulance/ambulance.api";
import {
  estimateAmbulanceFare,
  generateAmbulanceIdempotencyKey,
} from "@/lib/ambulance/ambulance.utils";
import type {
  AmbulanceBookingFormValues,
  AmbulanceHealthCenter,
  AmbulanceVehicleType,
  LatLng,
} from "@/lib/ambulance/ambulance.types";
import { mapAmbulanceBookingError } from "@/lib/api/errors";
import { reverseGeocodeCoordinates } from "@/lib/geocoding/geocoding.api";

interface AmbulanceBookingFormProps {
  accessToken: string;
  healthCenters: AmbulanceHealthCenter[];
}

const vehicleOptions: { value: AmbulanceVehicleType; label: string }[] = [
  { value: "BASIC", label: "Basic life support" },
  { value: "ADVANCED", label: "Advanced life support" },
  { value: "ICU", label: "ICU / critical care" },
];

export function AmbulanceBookingForm({
  accessToken,
  healthCenters,
}: AmbulanceBookingFormProps) {
  const router = useRouter();
  const idempotencyKeyRef = useRef<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState<LatLng | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<LatLng | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AmbulanceBookingFormValues>({
    defaultValues: {
      pickupAddress: "",
      destinationAddress: "",
      vehicleTypeRequired: "ADVANCED",
      emergencyType: "",
      patientCondition: "",
      specialRequirements: "",
      originCenterId: "",
      destinationCenterId: "",
    },
  });

  const destinationCenterId = watch("destinationCenterId");
  const originCenterId = watch("originCenterId");

  const selectedDestinationCenter = healthCenters.find(
    (center) => center.id === destinationCenterId,
  );

  const effectiveDestinationCoordinates =
    destinationCoordinates ??
    (selectedDestinationCenter
      ? {
          lat: selectedDestinationCenter.latitude,
          lng: selectedDestinationCenter.longitude,
        }
      : null);

  const estimatedFarePreview = useMemo(() => {
    if (!pickupCoordinates || !effectiveDestinationCoordinates) {
      return null;
    }

    return estimateAmbulanceFare(pickupCoordinates, effectiveDestinationCoordinates);
  }, [pickupCoordinates, effectiveDestinationCoordinates]);

  function formatHealthCenterAddress(center: AmbulanceHealthCenter) {
    return [center.address, center.city, center.state, center.zipCode]
      .filter(Boolean)
      .join(", ");
  }

  function applyHealthCenterToPickup(center: AmbulanceHealthCenter) {
    setValue("pickupAddress", formatHealthCenterAddress(center), {
      shouldValidate: true,
    });
    setPickupCoordinates({ lat: center.latitude, lng: center.longitude });
  }

  function applyHealthCenterToDestination(center: AmbulanceHealthCenter) {
    setValue("destinationAddress", formatHealthCenterAddress(center), {
      shouldValidate: true,
    });
    setDestinationCoordinates({ lat: center.latitude, lng: center.longitude });
  }

  async function handleUseLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setPickupCoordinates(coordinates);

        try {
          const result = await reverseGeocodeCoordinates(
            accessToken,
            coordinates.lat,
            coordinates.lng,
          );

          if (result) {
            setValue("pickupAddress", result.label, { shouldValidate: true });
          } else {
            setValue(
              "pickupAddress",
              `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`,
              { shouldValidate: true },
            );
          }
        } catch {
          setGeoError(
            "Your location was detected, but we could not resolve an address. You can edit the pickup address before submitting.",
          );
          setValue(
            "pickupAddress",
            `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`,
            { shouldValidate: true },
          );
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setGeoError("Could not access your location. Enter your pickup address manually.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function onSubmit(values: AmbulanceBookingFormValues) {
    setSubmitError(null);
    setGeoError(null);

    if (!values.originCenterId && !values.destinationCenterId) {
      setSubmitError(
        "Select at least one health center (origin or destination) to continue.",
      );
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = generateAmbulanceIdempotencyKey();
    }

    try {
      const booking = await createAmbulanceBooking(
        accessToken,
        {
          pickupAddress: values.pickupAddress.trim(),
          destinationAddress: values.destinationAddress.trim(),
          ...(pickupCoordinates && {
            pickupLatitude: pickupCoordinates.lat,
            pickupLongitude: pickupCoordinates.lng,
          }),
          ...(effectiveDestinationCoordinates && {
            destinationLatitude: effectiveDestinationCoordinates.lat,
            destinationLongitude: effectiveDestinationCoordinates.lng,
          }),
          vehicleTypeRequired: values.vehicleTypeRequired,
          emergencyType: values.emergencyType.trim(),
          patientCondition: values.patientCondition.trim(),
          specialRequirements: values.specialRequirements.trim() || undefined,
          originCenterId: values.originCenterId || undefined,
          destinationCenterId: values.destinationCenterId || undefined,
        },
        idempotencyKeyRef.current,
      );

      router.push(`/ambulance/bookings/${booking.id}`);
    } catch (error) {
      setSubmitError(
        mapAmbulanceBookingError(error, "We could not submit your emergency request."),
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card space-y-5 rounded-[2rem] border border-[var(--color-border)] p-6"
    >
      <div>
        <Link
          href="/ambulance"
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          ← Back to ambulance
        </Link>
        <h1 className="font-heading mt-2 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
          Request emergency ambulance
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Enter pickup and destination addresses. The server resolves coordinates and fare
          when you submit.
        </p>
      </div>

      {submitError ? <ErrorMessage message={submitError} /> : null}
      {geoError ? <ErrorMessage message={geoError} /> : null}

      <Controller
        name="pickupAddress"
        control={control}
        rules={{ required: "Pickup address is required." }}
        render={({ field, fieldState }) => (
          <div className="space-y-3">
            <AddressSearchField
              accessToken={accessToken}
              label="Pickup address"
              value={field.value}
              onValueChange={field.onChange}
              coordinates={pickupCoordinates}
              onCoordinatesChange={setPickupCoordinates}
              placeholder="Road 12, Dhanmondi"
              error={fieldState.error?.message}
              helperText="Start typing and choose a suggested address, or use your current location."
            />

            <Button
              type="button"
              variant="outline"
              onClick={handleUseLocation}
              disabled={isLocating || isSubmitting}
            >
              {isLocating ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Detecting location...
                </>
              ) : (
                "Use my current location for pickup"
              )}
            </Button>
          </div>
        )}
      />

      <Controller
        name="destinationAddress"
        control={control}
        rules={{ required: "Destination address is required." }}
        render={({ field, fieldState }) => (
          <AddressSearchField
            accessToken={accessToken}
            label="Destination address"
            value={field.value}
            onValueChange={field.onChange}
            coordinates={destinationCoordinates}
            onCoordinatesChange={setDestinationCoordinates}
            placeholder="Apollo Hospital ER"
            error={fieldState.error?.message}
            helperText="Choose a hospital from the list below or type the destination address."
          />
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Origin health center (optional)" error={errors.originCenterId?.message}>
          <Controller
            name="originCenterId"
            control={control}
            render={({ field }) => (
              <select
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                  const center = healthCenters.find(
                    (item) => item.id === event.target.value,
                  );

                  if (center) {
                    applyHealthCenterToPickup(center);
                    return;
                  }

                  setPickupCoordinates(null);
                }}
                onBlur={field.onBlur}
                className={inputClass(false)}
              >
                <option value="">Select origin center</option>
                {healthCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name} — {center.city}
                  </option>
                ))}
              </select>
            )}
          />
        </Field>

        <Field
          label="Destination health center (optional)"
          error={errors.destinationCenterId?.message}
        >
          <Controller
            name="destinationCenterId"
            control={control}
            render={({ field }) => (
              <select
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                  const center = healthCenters.find(
                    (item) => item.id === event.target.value,
                  );

                  if (center) {
                    applyHealthCenterToDestination(center);
                    return;
                  }

                  setDestinationCoordinates(null);
                }}
                onBlur={field.onBlur}
                className={inputClass(false)}
              >
                <option value="">Select destination center</option>
                {healthCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name} — {center.city}
                  </option>
                ))}
              </select>
            )}
          />
        </Field>
      </div>

      {!originCenterId && !destinationCenterId ? (
        <p role="alert" className="text-sm text-amber-700">
          At least one health center must be selected (origin or destination).
        </p>
      ) : null}

      <Field label="Vehicle type" error={errors.vehicleTypeRequired?.message}>
        <Controller
          name="vehicleTypeRequired"
          control={control}
          rules={{ required: "Select a vehicle type." }}
          render={({ field }) => (
            <div className="grid gap-3 sm:grid-cols-3">
              {vehicleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    field.value === option.value
                      ? "border-[var(--color-primary)] bg-sky-50"
                      : "border-[var(--color-border)] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        />
      </Field>

      <Field label="Emergency type" error={errors.emergencyType?.message}>
        <input
          type="text"
          aria-invalid={!!errors.emergencyType}
          className={inputClass(!!errors.emergencyType)}
          placeholder="Cardiac, trauma, stroke..."
          {...register("emergencyType", { required: "Emergency type is required." })}
        />
      </Field>

      <Field label="Patient condition" error={errors.patientCondition?.message}>
        <textarea
          rows={3}
          aria-invalid={!!errors.patientCondition}
          className={`${inputClass(!!errors.patientCondition)} resize-none`}
          placeholder="Describe symptoms and urgency..."
          {...register("patientCondition", {
            required: "Patient condition is required.",
          })}
        />
      </Field>

      <Field label="Special requirements (optional)" error={errors.specialRequirements?.message}>
        <textarea
          rows={2}
          aria-invalid={!!errors.specialRequirements}
          className={`${inputClass(!!errors.specialRequirements)} resize-none`}
          placeholder="Oxygen, wheelchair, etc."
          {...register("specialRequirements")}
        />
      </Field>

      {estimatedFarePreview != null ? (
        <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-[var(--color-text-primary)]">
          Estimated fare: ~৳{Math.round(estimatedFarePreview)} — final fare confirmed after
          booking.
        </p>
      ) : null}

      <Button type="submit" variant="danger" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Submitting request...
          </>
        ) : (
          "Request ambulance now"
        )}
      </Button>
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
