"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/lab-tests", label: "Lab Tests" },
  { href: "/ambulance", label: "Ambulance" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [hasShadow, setHasShadow] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasShadow(window.scrollY > 0);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl transition-shadow ${
        hasShadow ? "shadow-[0_18px_45px_rgba(15,23,42,0.12)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
            <LogoMark />
          </span>
          <span className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
            HealthBridge
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition hover:bg-sky-50 hover:text-[var(--color-primary)] ${
                  isActive
                    ? "bg-sky-100 text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/auth/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50"
          >
            Login / Register
          </Link>
          <Link
            href="/appointments"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] lg:hidden"
        >
          <MenuIcon open={isMenuOpen} />
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[var(--color-border)] bg-white lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6"
          >
            {navigationLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-sky-100 text-[var(--color-primary)]"
                      : "bg-slate-50 text-[var(--color-text-secondary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 grid gap-3">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)]"
              >
                Login / Register
              </Link>
              <Link
                href="/appointments"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Book Appointment
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M8 29c4.2 0 6.8-9 10-9 3 0 4.8 8 7.8 8 2.6 0 3.5-4 6.2-4 3.5 0 4.8 7 8 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20c0-6.4 5.2-11.5 11.5-11.5 3.1 0 5.9 1.3 7.8 3.3 2-2 4.8-3.3 7.9-3.3 6.3 0 11.4 5.1 11.4 11.5 0 11.4-18.8 18.5-19.3 18.5S9 31.4 9 20Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
