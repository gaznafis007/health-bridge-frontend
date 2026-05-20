import { formatPrice } from "@/features/pharmacy/lib/pharmacy.utils";
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-sky-50 text-[var(--color-text-secondary)]">
          <tr>
            <th className="px-4 py-3 font-medium">Medicine</th>
            <th className="px-4 py-3 font-medium">Qty</th>
            <th className="px-4 py-3 font-medium">Unit Price</th>
            <th className="px-4 py-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.medicineId} className="border-t border-slate-100">
              <td className="px-4 py-4 text-[var(--color-text-primary)]">{item.medicineName}</td>
              <td className="px-4 py-4 text-[var(--color-text-secondary)]">{item.quantity}</td>
              <td className="px-4 py-4 text-[var(--color-text-secondary)]">
                {formatPrice(item.unitPrice)}
              </td>
              <td className="px-4 py-4 font-medium text-[var(--color-text-primary)]">
                {formatPrice(item.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-slate-100 bg-slate-50 text-sm">
          <tr>
            <td className="px-4 py-3 font-medium text-[var(--color-text-secondary)]" colSpan={3}>
              Subtotal
            </td>
            <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
              {formatPrice(order.totalAmount)}
            </td>
          </tr>
          {order.discountAmount !== "0.00" ? (
            <tr>
              <td className="px-4 py-3 font-medium text-[var(--color-text-secondary)]" colSpan={3}>
                Discount
              </td>
              <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                {formatPrice(order.discountAmount)}
              </td>
            </tr>
          ) : null}
          {order.taxAmount !== "0.00" ? (
            <tr>
              <td className="px-4 py-3 font-medium text-[var(--color-text-secondary)]" colSpan={3}>
                Tax
              </td>
              <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                {formatPrice(order.taxAmount)}
              </td>
            </tr>
          ) : null}
          <tr>
            <td className="px-4 py-3 font-heading text-base font-bold text-[var(--color-text-primary)]" colSpan={3}>
              Final Amount
            </td>
            <td className="px-4 py-3 font-heading text-base font-bold text-[var(--color-primary)]">
              {formatPrice(order.finalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
