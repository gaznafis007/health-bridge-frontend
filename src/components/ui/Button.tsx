import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] !text-white hover:bg-[var(--color-primary-dark)]",
  secondary:
    "bg-[var(--color-secondary)] !text-white hover:bg-[var(--color-secondary-dark)]",
  outline:
    "border border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-cyan-50",
  danger: "bg-[var(--color-danger)] text-white hover:bg-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-2 text-xs",
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-12 px-6 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}
