"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataTableShell } from "@/components/ui/DataTableShell";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  approveDoctor,
  listUsers,
  suspendDoctor,
} from "@/lib/users/users.api";
import type { UserMeResponse } from "@/lib/users/users.types";

const columnHelper = createColumnHelper<UserMeResponse>();

export function AdminUsersShell() {
  const { accessToken } = useAuth();
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const swrKey = roleFilter ? `admin/users?role=${roleFilter}` : "admin/users";
  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    swrKey,
    (token) => listUsers(token, { role: roleFilter || undefined, take: 50 }),
  );

  async function handleApprove(userId: string) {
    if (!accessToken) return;
    setPendingId(userId);
    setActionError(null);
    try {
      await approveDoctor(accessToken, userId);
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not approve doctor."));
    } finally {
      setPendingId(null);
    }
  }

  async function handleSuspend(userId: string) {
    if (!accessToken) return;
    setPendingId(userId);
    setActionError(null);
    try {
      await suspendDoctor(accessToken, userId);
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not suspend doctor."));
    } finally {
      setPendingId(null);
    }
  }

  const columns = [
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: "name",
        header: "Name",
      }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("role", { header: "Role" }),
      columnHelper.accessor("isVerified", {
        header: "Verified",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          if (row.original.role !== "DOCTOR") return "—";
          const doctorStatus = (row.original.doctorProfile as { status?: string } | null)
            ?.status;
          const isPending = pendingId === row.original.id;

          return (
            <div className="flex flex-wrap gap-2">
              {doctorStatus === "PENDING" ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-9 px-3 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => handleApprove(row.original.id)}
                >
                  Approve
                </Button>
              ) : null}
              {doctorStatus === "ACTIVE" ? (
                <Button
                  type="button"
                  variant="danger"
                  className="min-h-9 px-3 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => handleSuspend(row.original.id)}
                >
                  Suspend
                </Button>
              ) : null}
            </div>
          );
        },
      }),
    ];

  return (
    <div>
      <SectionHeader
        title="Users"
        description="Review accounts and manage doctor approval status."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {["", "PATIENT", "DOCTOR", "ADMIN", "DISPATCHER", "DRIVER"].map((role) => (
          <button
            key={role || "all"}
            type="button"
            onClick={() => setRoleFilter(role)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              roleFilter === role
                ? "bg-sky-100 text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-slate-50"
            }`}
          >
            {role || "All"}
          </button>
        ))}
      </div>

      {actionError ? <ErrorMessage message={actionError} /> : null}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}

      {error ? <ErrorMessage message="Could not load users." /> : null}

      {data ? (
        <DataTableShell
          data={data.items}
          columns={columns}
          emptyMessage="No users match this filter."
        />
      ) : null}
    </div>
  );
}
