import { PharmacyClientShell } from "@/features/pharmacy/components/PharmacyClientShell";
import { listCategories, listMedicines } from "@/features/pharmacy/lib/pharmacy.api";

export default async function PharmacyPage() {
  const [categories, medicines] = await Promise.all([
    listCategories(),
    listMedicines({ inStockOnly: true }),
  ]);

  return <PharmacyClientShell categories={categories} initialMedicines={medicines} />;
}
