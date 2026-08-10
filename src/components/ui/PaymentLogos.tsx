import type { CSSProperties } from "react";

export const paymentProviders = [
  {
    id: "sslcommerz",
    src: "https://cdn.brandfetch.io/id3q3A-eCg/w/462/h/100/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    label: "SSLCommerz",
    width: 160,
    height: 40,
  },
  {
    id: "bkash",
    src: "/payments/bkash.svg",
    label: "bKash",
    width: 110,
    height: 40,
  },
  {
    id: "nagad",
    src: "/payments/nagad.svg",
    label: "Nagad",
    width: 110,
    height: 40,
  },
  {
    id: "visa",
    src: "/payments/visa.svg",
    label: "Visa",
    width: 80,
    height: 32,
  },
  {
    id: "mastercard",
    src: "/payments/mastercard.svg",
    label: "Mastercard",
    width: 80,
    height: 48,
  },
  {
    id: "cod",
    src: "/payments/cod.svg",
    label: "Cash on Delivery",
    width: 140,
    height: 40,
  },
] as const;

const logoStyles: Record<
  (typeof paymentProviders)[number]["id"],
  { img: string; tile?: string }
> = {
  sslcommerz: { img: "h-9 w-auto max-w-full", tile: "sm:col-span-2" },
  bkash: { img: "h-10 w-auto max-w-full" },
  nagad: { img: "h-9 w-auto max-w-full" },
  visa: { img: "h-7 w-auto max-w-full" },
  mastercard: { img: "h-9 w-auto max-w-full" },
  cod: { img: "h-8 w-auto max-w-full", tile: "sm:col-span-2 lg:col-span-1" },
};

interface PaymentLogoProps {
  provider: (typeof paymentProviders)[number];
  className?: string;
}

export function PaymentLogo({ provider, className }: PaymentLogoProps) {
  const style = logoStyles[provider.id];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand marks render reliably via native img
    <img
      src={provider.src}
      alt={provider.label}
      width={provider.width}
      height={provider.height}
      loading="lazy"
      decoding="async"
      className={className ?? style.img}
      style={{ display: "block", maxHeight: "2.75rem" } satisfies CSSProperties}
    />
  );
}

export function getPaymentLogoTileClass(providerId: (typeof paymentProviders)[number]["id"]) {
  return logoStyles[providerId].tile ?? "";
}
