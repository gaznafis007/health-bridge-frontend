"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LabBookingForm } from "@/features/labs/components/LabBookingForm";
import { LabPackageCard } from "@/features/labs/components/LabPackageCard";
import { LabSelectionPanel } from "@/features/labs/components/LabSelectionPanel";
import { LabTestCard } from "@/features/labs/components/LabTestCard";
import { useLabSelection } from "@/features/labs/hooks/useLabSelection";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getCenterPackages, getCenterTests } from "@/lib/labs/labs.api";
import type { LabPackage, LabTest } from "@/lib/labs/labs.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

interface CenterDetailShellProps {
  centerId: string;
}

type Tab = "tests" | "packages";

export function CenterDetailShell({ centerId }: CenterDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [packages, setPackages] = useState<LabPackage[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("tests");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const {
    selections,
    selectionCount,
    toggle,
    isSelected,
    totalAmount,
    clear,
  } = useLabSelection();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!accessToken) {
      router.replace(`/auth/login?redirect=/lab-tests/${centerId}`);
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadCenterCatalog() {
      setIsLoading(true);

      try {
        const [testsData, packagesData] = await Promise.all([
          getCenterTests(token, centerId),
          getCenterPackages(token, centerId),
        ]);

        if (!isMounted) return;

        setTests(testsData.filter((test) => test.isActive));
        setPackages(packagesData.filter((pkg) => pkg.isActive));
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/lab-tests/${centerId}`);
          return;
        }

        setError(getApiErrorMessage(err, "We could not load tests and packages."));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCenterCatalog();

    return () => {
      isMounted = false;
    };
  }, [accessToken, centerId, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return <CenterDetailSkeleton />;
  }

  const catalogEmpty = tests.length === 0 && packages.length === 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 pb-28 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/lab-tests"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              ← Back to centers
            </Link>
            <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
              Select tests & packages
            </h1>
          </div>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {catalogEmpty && !error ? (
          <EmptyState
            title="No tests available"
            description="This center has no active tests or packages yet."
            icon={<FlaskIcon />}
            action={
              <Link
                href="/lab-tests"
                className="text-sm font-semibold text-[var(--color-primary)]"
              >
                Browse other centers
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex gap-2">
              <TabButton
                active={activeTab === "tests"}
                onClick={() => setActiveTab("tests")}
                label={`Tests (${tests.length})`}
              />
              <TabButton
                active={activeTab === "packages"}
                onClick={() => setActiveTab("packages")}
                label={`Packages (${packages.length})`}
              />
            </div>

            {activeTab === "tests" ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {tests.map((test) => (
                  <LabTestCard
                    key={test.id}
                    test={test}
                    isSelected={isSelected(test.id)}
                    onToggle={() => toggle("test", test)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {packages.map((pkg) => (
                  <LabPackageCard
                    key={pkg.id}
                    packageItem={pkg}
                    isSelected={isSelected(pkg.id)}
                    onToggle={() => toggle("package", pkg)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {showBookingForm && accessToken ? (
          <LabBookingForm
            accessToken={accessToken}
            centerId={centerId}
            selections={selections}
            onCancel={() => setShowBookingForm(false)}
            onSuccess={() => {
              clear();
              setShowBookingForm(false);
            }}
          />
        ) : null}

        <LabSelectionPanel
          selectionCount={selectionCount}
          totalAmount={totalAmount}
          onBook={() => setShowBookingForm(true)}
        />
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "bg-white text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]"
      }`}
    >
      {label}
    </button>
  );
}

function CenterDetailSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="h-10 w-64 rounded-full bg-slate-200" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 rounded-[2rem] border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M9 3h6v4l5 9a2 2 0 0 1-1.7 3H5.7A2 2 0 0 1 4 16l5-9V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
