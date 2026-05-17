import Link from "next/link";

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="surface-card rounded-[2rem] border border-[var(--color-border)] p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Checkout
        </p>
        <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-text-primary)]">
          Pharmacy checkout happens inside your cart
        </h1>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Add your medicines, complete the delivery form, and we will redirect you
          to live order tracking as soon as your order is placed.
        </p>
        <Link
          href="/pharmacy"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white"
        >
          Return to Pharmacy
        </Link>
      </div>
    </section>
  );
}
