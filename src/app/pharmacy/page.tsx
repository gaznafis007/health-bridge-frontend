import { PharmacyClientShell } from "@/features/pharmacy/components/PharmacyClientShell";
import {
  DEFAULT_MEDICINES_PAGE_SIZE,
  listCategories,
  listMedicines,
} from "@/features/pharmacy/lib/pharmacy.api";

export default async function PharmacyPage() {
  const [categories, medicinesPage] = await Promise.all([
    listCategories(),
    listMedicines({ inStockOnly: true, skip: 0, take: DEFAULT_MEDICINES_PAGE_SIZE }),
  ]);

  return (
    <PharmacyClientShell
      categories={categories}
      initialMedicines={medicinesPage.items}
      initialTotal={medicinesPage.total}
    />
  );
}
