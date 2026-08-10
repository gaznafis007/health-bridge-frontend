"use client";

import { useRef } from "react";

import {
  PaymentTrustVisual,
  usePaymentBannerAnimations,
} from "@/features/home/components/PaymentTrustVisual";
import {
  getPaymentLogoTileClass,
  PaymentLogo,
  paymentProviders,
} from "@/components/ui/PaymentLogos";

export function HomePaymentsBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  usePaymentBannerAnimations(sectionRef, panelRef, logosRef);

  return (
    <section ref={sectionRef} className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] lg:p-10"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-100/80 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-emerald-100/70 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-12">
            <div>
              <PaymentTrustVisual />

              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                PCI-compliant checkout
              </p>

              <h2 className="font-heading mt-4 text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl">
                Secure payments, your way
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                Pay through Bangladesh&apos;s trusted gateways — SSLCommerz,
                bKash, Nagad, cards, or cash on delivery.
              </p>

              <ul className="mt-5 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[var(--color-primary)]">
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Mobile wallet and card support
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[var(--color-primary)]">
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Guest checkout where available
                </li>
              </ul>
            </div>

            <div
              ref={logosRef}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              aria-label="Supported payment methods"
            >
              {paymentProviders.map((provider) => (
                <div
                  key={provider.id}
                  data-payment-tile
                  className={`flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:bg-white hover:shadow-md ${getPaymentLogoTileClass(provider.id)}`}
                >
                  <PaymentLogo provider={provider} />
                  <span className="text-center text-[11px] font-medium leading-tight text-[var(--color-text-muted)]">
                    {provider.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
