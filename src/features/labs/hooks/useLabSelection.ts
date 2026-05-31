"use client";

import { useCallback, useMemo, useState } from "react";

import type { LabPackage, LabTest } from "@/lib/labs/labs.types";

export type LabSelectionType = "test" | "package";

export interface LabSelectionEntry {
  type: LabSelectionType;
  item: LabTest | LabPackage;
}

export function useLabSelection() {
  const [selections, setSelections] = useState<Map<string, LabSelectionEntry>>(
    () => new Map(),
  );

  const toggle = useCallback((type: LabSelectionType, item: LabTest | LabPackage) => {
    setSelections((current) => {
      const next = new Map(current);

      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, { type, item });
      }

      return next;
    });
  }, []);

  const isSelected = useCallback(
    (id: string) => selections.has(id),
    [selections],
  );

  const clear = useCallback(() => {
    setSelections(new Map());
  }, []);

  const totalAmount = useMemo(() => {
    let total = 0;

    for (const { item } of selections.values()) {
      total += Number.parseFloat(item.price) || 0;
    }

    return total;
  }, [selections]);

  const selectionList = useMemo(
    () => Array.from(selections.values()),
    [selections],
  );

  return {
    selections: selectionList,
    selectionCount: selections.size,
    toggle,
    isSelected,
    totalAmount,
    clear,
  };
}
