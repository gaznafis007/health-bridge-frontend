"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { checkout } from "@/features/pharmacy/lib/pharmacy.api";
import type { ApiError, Cart } from "@/features/pharmacy/lib/pharmacy.types";
import { generateIdempotencyKey } from "@/features/pharmacy/lib/pharmacy.utils";

interface CheckoutFormProps {
  cart: Cart;
  sessionId: string;
  onSuccess: () => void;
}

interface FormState {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: "CASH" | "ONLINE";
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const phonePattern = /^\+?[1-9]\d{7,14}$/;

export function CheckoutForm({ cart, sessionId, onSuccess }: CheckoutFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "CASH",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setFieldErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await checkout({
        guestSessionId: sessionId,
        paymentMethod: form.paymentMethod,
        deliveryAddress: `Recipient: ${form.fullName.trim()}\nAddress: ${form.address.trim()}`,
        deliveryPhone: form.phone.trim(),
        idempotencyKey: generateIdempotencyKey(),
      });

      onSuccess();
      router.push(`/pharmacy/orders/${order.id}?session=${encodeURIComponent(sessionId)}`);
    } catch (error) {
      const apiError = error as ApiError;
      const nextFieldErrors: FieldErrors = {};

      if (apiError.errors?.length) {
        for (const issue of apiError.errors) {
          if (issue.path.toLowerCase().includes("phone")) {
            nextFieldErrors.phone = issue.message;
          }
          if (issue.path.toLowerCase().includes("address")) {
            nextFieldErrors.address = issue.message;
          }
        }
      }

      setFieldErrors((current) => ({ ...current, ...nextFieldErrors }));

      if (apiError.status === 404) {
        setSubmitError("Session expired. Please refresh the page.");
      } else if (apiError.message.toLowerCase().includes("cart is empty")) {
        setSubmitError("Your cart is empty — add items first.");
      } else {
        setSubmitError(apiError.message || "We could not place your order.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          aria-invalid={fieldErrors.fullName ? "true" : "false"}
          className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
        />
        {fieldErrors.fullName ? <p role="alert" className="mt-2 text-sm text-red-600">{fieldErrors.fullName}</p> : null}
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          aria-invalid={fieldErrors.phone ? "true" : "false"}
          className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
        />
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">e.g. +8801712345678</p>
        {fieldErrors.phone ? <p role="alert" className="mt-2 text-sm text-red-600">{fieldErrors.phone}</p> : null}
      </div>

      <div>
        <label htmlFor="address" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
          Delivery Address
        </label>
        <textarea
          id="address"
          value={form.address}
          maxLength={300}
          rows={4}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          aria-invalid={fieldErrors.address ? "true" : "false"}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>Minimum 5 characters</span>
          <span>{form.address.length}/300</span>
        </div>
        {fieldErrors.address ? <p role="alert" className="mt-2 text-sm text-red-600">{fieldErrors.address}</p> : null}
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">
          Payment Method
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["CASH", "Cash on Delivery", "Pay with cash when your order arrives."],
            ["ONLINE", "Online Payment", "You will be redirected to SSLCommerz to complete payment."],
          ].map(([value, label, description]) => {
            const selected = form.paymentMethod === value;

            return (
              <label
                key={value}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  selected
                    ? "border-[var(--color-primary)] bg-sky-50"
                    : "border-[var(--color-border)] bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={selected}
                  onChange={() =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: value as FormState["paymentMethod"],
                    }))
                  }
                  className="sr-only"
                />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {value === "CASH" ? "💵 " : "💳 "}
                  {label}
                </p>
                <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                  {description}
                </p>
              </label>
            );
          })}
        </div>
      </fieldset>

      {submitError ? <ErrorMessage message={submitError} /> : null}

      <Button
        type="submit"
        variant="primary"
        className="w-full rounded-2xl"
        disabled={isSubmitting || cart.items.length === 0}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Placing Order...
          </span>
        ) : (
          "Place Order →"
        )}
      </Button>
    </form>
  );
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = "Please enter the full name for delivery.";
  }

  if (!phonePattern.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  const trimmedAddress = form.address.trim();
  if (trimmedAddress.length < 5 || trimmedAddress.length > 300) {
    errors.address = "Delivery address must be between 5 and 300 characters.";
  }

  return errors;
}
