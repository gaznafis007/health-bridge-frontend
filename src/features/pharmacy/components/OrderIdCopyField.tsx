"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

interface OrderIdCopyFieldProps {
  orderId: string;
}

export function OrderIdCopyField({ orderId }: OrderIdCopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Order ID
        </p>
        <p className="mt-1 break-all font-mono text-sm text-[var(--color-text-primary)]">
          {orderId}
        </p>
      </div>
      <Button type="button" variant="outline" onClick={handleCopy} className="rounded-2xl">
        {copied ? "Copied!" : "Copy ID"}
      </Button>
    </div>
  );
}
