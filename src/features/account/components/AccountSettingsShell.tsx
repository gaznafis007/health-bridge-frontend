"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { NotificationPreferencesForm } from "@/features/notifications/components/NotificationPreferencesForm";
import { ProfileForm } from "@/features/account/components/ProfileForm";
import { RoleProfileForm } from "@/features/account/components/RoleProfileForm";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { useAuth } from "@/features/auth/hooks/useAuth";

type Tab = "profile" | "details" | "notifications";

export function AccountSettingsShell() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <RequireRole allowed={["PATIENT", "DOCTOR", "ADMIN", "DISPATCHER", "DRIVER"]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Account settings"
          description="Manage your profile, health details, and notification preferences."
          action={
            <Link
              href="/notifications/logs"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Notification history
            </Link>
          }
        />

        <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-4">
          {(
            [
              ["profile", "Profile"],
              ["details", user?.role === "DOCTOR" ? "Doctor profile" : "Patient profile"],
              ["notifications", "Notifications"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === id
                  ? "bg-sky-100 text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "profile" ? <ProfileForm /> : null}
          {tab === "details" ? <RoleProfileForm /> : null}
          {tab === "notifications" ? <NotificationPreferencesForm /> : null}
        </div>
      </div>
    </RequireRole>
  );
}
