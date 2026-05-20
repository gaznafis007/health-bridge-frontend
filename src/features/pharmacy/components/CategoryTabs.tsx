"use client";

import type { MedicineCategory } from "@/features/pharmacy/lib/pharmacy.types";

interface CategoryTabsProps {
  categories: MedicineCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Medicine categories">
      <CategoryPill
        label="All"
        selected={selectedCategoryId === null}
        onClick={() => onSelectCategory(null)}
      />
      {categories.map((category) => (
        <CategoryPill
          key={category.id}
          label={`${category.name} (${category.medicineCount})`}
          selected={selectedCategoryId === category.id}
          onClick={() => onSelectCategory(category.id)}
        />
      ))}
    </div>
  );
}

function CategoryPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${
        selected
          ? "bg-[var(--color-primary)] text-white"
          : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-sky-300 hover:text-[var(--color-primary)]"
      }`}
    >
      {label}
    </button>
  );
}
