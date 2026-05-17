import Link from "next/link";

const quickLinks = ["Home", "About", "Contact", "Careers", "Blog"];
const serviceLinks = ["Pharmacy", "Lab Tests", "Ambulance", "Appointments", "Telehealth"];

export function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
              <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" aria-hidden="true">
                <path
                  d="M8 29c4.2 0 6.8-9 10-9 3 0 4.8 8 7.8 8 2.6 0 3.5-4 6.2-4 3.5 0 4.8 7 8 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M9 20c0-6.4 5.2-11.5 11.5-11.5 3.1 0 5.9 1.3 7.8 3.3 2-2 4.8-3.3 7.9-3.3 6.3 0 11.4 5.1 11.4 11.5 0 11.4-18.8 18.5-19.3 18.5S9 31.4 9 20Z"
                  stroke="currentColor"
                  strokeWidth="2.4"
                />
              </svg>
            </span>
            <span className="font-heading text-xl font-bold">HealthBridge</span>
          </div>
          <p className="max-w-xs text-sm leading-7 text-slate-300">
            Trusted digital healthcare for consultations, medicines, lab tests, and
            urgent care across Bangladesh.
          </p>
          <div className="flex gap-3">
            {["Facebook", "Twitter", "LinkedIn", "Instagram"].map((item) => (
              <a
                key={item}
                href="#"
                aria-label={item}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-slate-200 transition hover:border-sky-400 hover:text-sky-300"
              >
                {item.slice(0, 1)}
              </a>
            ))}
          </div>
        </div>

        <FooterList title="Quick Links" items={quickLinks} />
        <FooterList title="Services" items={serviceLinks} />

        <div>
          <h2 className="font-heading text-lg font-semibold">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li>House 11, Road 7, Dhanmondi, Dhaka</li>
            <li>+880 1700 123456</li>
            <li>support@healthbridge.com</li>
            <li>Support Hours: 24/7 for emergency care</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2025 HealthBridge. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>
            <Link href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
