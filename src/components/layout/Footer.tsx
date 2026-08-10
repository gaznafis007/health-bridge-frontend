import Link from "next/link";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/ui/BrandIcons";
import { Icon } from "@/components/ui/Icon";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Services", href: "/services" },
];

const serviceLinks = [
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "Lab Tests", href: "/lab-tests" },
  { label: "Ambulance", href: "/ambulance" },
  { label: "Appointments", href: "/appointments" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "X (Twitter)", href: "https://x.com", Icon: XIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
] as const;

const contactItems = [
  {
    icon: "map-pin" as const,
    text: "House 11, Road 7, Dhanmondi, Dhaka",
  },
  {
    icon: "phone" as const,
    text: "+880 1700 123456",
    href: "tel:+8801700123456",
  },
  {
    icon: "mail" as const,
    text: "support@healthbridge.com",
    href: "mailto:support@healthbridge.com",
  },
  {
    icon: "clock" as const,
    text: "Support Hours: 24/7 for emergency care",
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-900/40 text-cyan-300">
              <Icon name="heart-pulse" className="h-5 w-5" />
            </span>
            <span className="font-heading text-xl font-bold">HealthBridge</span>
          </div>
          <p className="max-w-xs text-sm leading-7 text-slate-300">
            Trusted digital healthcare for consultations, medicines, lab tests, and
            urgent care across Bangladesh.
          </p>
          <div className="flex gap-2">
            {socialLinks.map(({ label, href, Icon: SocialIcon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300"
              >
                <SocialIcon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterList title="Quick Links" links={quickLinks} />
        <FooterList title="Services" links={serviceLinks} />

        <div>
          <h2 className="font-heading text-base font-semibold">Contact</h2>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            {contactItems.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <Icon
                  name={item.icon}
                  className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                />
                {item.href ? (
                  <a href={item.href} className="transition hover:text-white">
                    {item.text}
                  </a>
                ) : (
                  <span>{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2025 HealthBridge. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="transition hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-heading text-base font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
