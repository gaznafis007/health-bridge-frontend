"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { AuthNavActions } from "@/features/auth/components/AuthNavActions";
import { PharmacyTrackOrdersLink } from "@/features/pharmacy/components/PharmacyTrackOrdersLink";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/lab-tests", label: "Lab Tests" },
  { href: "/ambulance", label: "Ambulance" },
  { href: "/appointments", label: "Appointments" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SCROLL_THRESHOLD = 24;

function navLinkClass(isActive: boolean, isTransparentNav: boolean) {
  const base =
    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300";

  if (isTransparentNav) {
    return `${base} ${
      isActive
        ? "bg-white/15 !text-white"
        : "!text-white/90 hover:bg-white/10 hover:!text-white"
    }`;
  }

  return `${base} ${
    isActive
      ? "bg-cyan-50 text-[var(--color-primary)]"
      : "text-[var(--color-text-secondary)] hover:bg-cyan-50 hover:text-[var(--color-primary)]"
  }`;
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isTransparentNav = pathname === "/" && !isScrolled && !isMenuOpen;

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <header
      data-nav-theme={isTransparentNav ? "transparent" : "solid"}
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color,color,backdrop-filter] duration-300 ${
        isTransparentNav
          ? "border-b border-transparent bg-transparent text-white"
          : "border-b border-[var(--color-border)] bg-white/95 text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300 ${
              isTransparentNav
                ? "bg-white/10 text-white"
                : "bg-cyan-50 text-[var(--color-primary)]"
            }`}
          >
            <Icon name="heart-pulse" className="h-5 w-5" />
          </span>
          <span
            className={`font-heading text-lg font-bold transition-colors duration-300 ${
              isTransparentNav ? "text-white" : "text-[var(--color-text-primary)]"
            }`}
          >
            HealthBridge
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={navLinkClass(isActive, isTransparentNav)}
              >
                {link.label}
              </Link>
            );
          })}
          <PharmacyTrackOrdersLink
            pathname={pathname}
            variant={isTransparentNav ? "overDark" : "default"}
          />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <AuthNavActions variant={isTransparentNav ? "overDark" : "default"} />
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
          className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border transition-colors duration-300 lg:hidden ${
            isTransparentNav
              ? "border-white/30 text-white hover:bg-white/10"
              : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-slate-50"
          }`}
        >
          <Icon name={isMenuOpen ? "x" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[var(--color-border)] bg-white lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
          >
            {navigationLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-cyan-50 text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <PharmacyTrackOrdersLink
              pathname={pathname}
              onNavigate={() => setIsMenuOpen(false)}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-slate-50"
            />
            <div className="mt-3 grid gap-3 border-t border-[var(--color-border)] pt-4">
              <AuthNavActions
                variant="default"
                onNavigate={() => setIsMenuOpen(false)}
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
