import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Get started
        </p>
        <h2 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text-primary)]">
          Create your account
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
          Register as a patient or doctor to access HealthBridge services.
        </p>
      </div>

      <RegisterForm />
    </>
  );
}
