import type { LabPackage, LabTest } from "@/lib/labs/labs.types";

type LabCatalogApiRow = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  duration?: string | null;
  isActive?: boolean;
  active?: boolean;
  status?: string;
  tests?: LabCatalogApiRow[];
};

const LIST_KEYS = ["data", "items", "tests", "packages"] as const;

export function unwrapLabList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    for (const key of LIST_KEYS) {
      const value = record[key];
      if (Array.isArray(value)) {
        return value as T[];
      }
    }
  }

  return [];
}

export function resolveLabItemActive(item: {
  isActive?: boolean;
  active?: boolean;
  status?: string;
}): boolean {
  if (typeof item.isActive === "boolean") {
    return item.isActive;
  }

  if (typeof item.active === "boolean") {
    return item.active;
  }

  if (typeof item.status === "string") {
    return item.status.toUpperCase() === "ACTIVE";
  }

  // Backend list endpoints may omit an active flag when all rows are active.
  return true;
}

export function normalizeLabTest(raw: LabCatalogApiRow): LabTest {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? null,
    price: String(raw.price),
    duration: raw.duration ?? null,
    isActive: resolveLabItemActive(raw),
  };
}

export function normalizeLabPackage(raw: LabCatalogApiRow): LabPackage {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? null,
    price: String(raw.price),
    tests: Array.isArray(raw.tests) ? raw.tests.map(normalizeLabTest) : [],
    isActive: resolveLabItemActive(raw),
  };
}

export function normalizeLabTests(payload: unknown): LabTest[] {
  return unwrapLabList<LabCatalogApiRow>(payload).map(normalizeLabTest);
}

export function normalizeLabPackages(payload: unknown): LabPackage[] {
  return unwrapLabList<LabCatalogApiRow>(payload).map(normalizeLabPackage);
}
