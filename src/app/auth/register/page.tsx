import { AuthPageIntro } from "@/features/auth/components/AuthPageIntro";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <AuthPageIntro
        eyebrow="Get started"
        title="Create your account"
        description="Register as a patient or doctor to access HealthBridge services."
      />

      <RegisterForm />
    </>
  );
}
