"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { createAmbulanceBooking } from "@/lib/ambulance/ambulance.api";
import type {
  AmbulanceBookingFormValues,
  AmbulanceHealthCenter,
  AmbulanceVehicleType,
} from "@/lib/ambulance/ambulance.types";
import { mapApiErrorMessage } from "@/lib/api/errors";

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
  const pickupCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLng, setDestLng] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser.");
      setShowManualCoords(true);
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        pickupCoordsRef.current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPickupLat(String(position.coords.latitude));
        setPickupLng(String(position.coords.longitude));
        setIsLocating(false);
      },
      () => {
        setGeoError(
          "Could not access your location. Enter coordinates manually or try again.",
        );
        setShowManualCoords(true);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function onSubmit(values: AmbulanceBookingFormValues) {
    setSubmitError(null);

    if (!values.originCenterId && !values.destinationCenterId) {
      setSubmitError(
        "Select at least one health center (origin or destination) to continue.",
      );
      return;
    }

    const pickupLatitude =
      pickupCoordsRef.current?.lat ?? Number.parseFloat(pickupLat);
    const pickupLongitude =
      pickupCoordsRef.current?.lng ?? Number.parseFloat(pickupLng);

    if (!Number.isFinite(pickupLatitude) || !Number.isFinite(pickupLongitude)) {
      setSubmitError("Pickup coordinates are required. Use your location or enter them manually.");
      setShowManualCoords(true);
      return;
    }

    const destinationCenter = healthCenters.find(
      (center) => center.id === values.destinationCenterId,
    );

    let destinationLatitude = destinationCenter?.latitude;
    let destinationLongitude = destinationCenter?.longitude;

    if (destLat && destLng) {
      const parsedLat = Number.parseFloat(destLat);
      const parsedLng = Number.parseFloat(destLng);
      if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
        destinationLatitude = parsedLat;
        destinationLongitude = parsedLng;
      }
    }

    try {
      const booking = await createAmbulanceBooking(
        accessToken,
        {
          pickupAddress: values.pickupAddress.trim(),
          destinationAddress: values.destinationAddress.trim(),
          pickupLatitude,
          pickupLongitude,
          destinationLatitude,
          destinationLongitude,
          vehicleTypeRequired: values.vehicleTypeRequired,
          emergencyType: values.emergencyType.trim(),
          patientCondition: values.patientCondition.trim(),
          specialRequirements: values.specialRequirements.trim() || undefined,
          originCenterId: values.originCenterId || undefined,
          destinationCenterId: values.destinationCenterId || undefined,
        },
        crypto.randomUUID(),
      );

      router.push(`/ambulance/bookings/${booking.id}`);
    } catch (error) {
      setSubmitError(
        mapApiErrorMessage(error, "We could not submit your emergency request."),
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
          Provide pickup details and select at least one registered health center.
        </p>
      </div>

      {submitError ? <ErrorMessage message={submitError} /> : null}
      {geoError ? <ErrorMessage message={geoError} /> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={handleUseLocation} disabled={isLocating}>
          {isLocating ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Locating...
            </>
          ) : (
            "Use my current location"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowManualCoords((current) => !current)}
        >
          {showManualCoords ? "Hide coordinates" : "Enter coordinates manually"}
        </Button>
      </div>

      {showManualCoords ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pickup latitude">
            <input
              type="text"
              inputMode="decimal"
              value={pickupLat}
              onChange={(event) => setPickupLat(event.target.value)}
              className={inputClass(false)}
              placeholder="23.7461"
            />
          </Field>
          <Field label="Pickup longitude">
            <input
              type="text"
              inputMode="decimal"
              value={pickupLng}
              onChange={(event) => setPickupLng(event.target.value)}
              className={inputClass(false)}
              placeholder="90.3742"
            />
          </Field>
          <Field label="Destination latitude (optional)">
            <input
              type="text"
              inputMode="decimal"
              value={destLat}
              onChange={(event) => setDestLat(event.target.value)}
              className={inputClass(false)}
              placeholder="23.8103"
            />
          </Field>
          <Field label="Destination longitude (optional)">
            <input
              type="text"
              inputMode="decimal"
              value={destLng}
              onChange={(event) => setDestLng(event.target.value)}
              className={inputClass(false)}
              placeholder="90.4125"
            />
          </Field>
        </div>
      ) : null}

      <Field label="Pickup address" error={errors.pickupAddress?.message}>
        <input
          type="text"
          aria-invalid={!!errors.pickupAddress}
          className={inputClass(!!errors.pickupAddress)}
          placeholder="Road 12, Dhanmondi"
          {...register("pickupAddress", { required: "Pickup address is required." })}
        />
      </Field>

      <Field label="Destination address" error={errors.destinationAddress?.message}>
        <input
          type="text"
          aria-invalid={!!errors.destinationAddress}
          className={inputClass(!!errors.destinationAddress)}
          placeholder="Apollo Hospital ER"
          {...register("destinationAddress", {
            required: "Destination address is required.",
          })}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Origin health center (optional)" error={errors.originCenterId?.message}>
          <Controller
            name="originCenterId"
            control={control}
            render={({ field }) => (
              <select
                value={field.value}
                onChange={field.onChange}
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
                    setDestLat(String(center.latitude));
                    setDestLng(String(center.longitude));
                  }
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
