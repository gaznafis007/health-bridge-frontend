interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
    >
      <span aria-hidden="true" className="mt-0.5 text-base">
        !
      </span>
      <span>{message}</span>
    </div>
  );
}
