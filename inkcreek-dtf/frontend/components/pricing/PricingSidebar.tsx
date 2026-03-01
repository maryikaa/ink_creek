'use client';

import { useBuilderStore, SHEET_SIZES } from '@/store/builder-store';

const TRANSFER_ADDONS = { standard: 0, glow: 2.5, reflective: 3 };
const RUSH_FEE = 15;

export function PricingSidebar() {
  const { sheetSize, setSheetSize, quantity, setQuantity, transferType, setTransferType, rushOrder, setRushOrder, designs } = useBuilderStore();

  const sheetsNeeded = Math.max(1, Math.ceil(designs.length / 6));
  const basePrice = sheetSize.pricePerSheet * sheetsNeeded * quantity;
  const transferAddon = (TRANSFER_ADDONS[transferType] || 0) * sheetsNeeded * quantity;
  const rush = rushOrder ? RUSH_FEE : 0;
  const subtotal = basePrice + transferAddon + rush;
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 sticky top-4">
      <h3 className="font-semibold text-gray-900">Order summary</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sheet size</label>
        <select
          value={sheetSize.id}
          onChange={(e) => {
            const s = SHEET_SIZES.find((x) => x.id === e.target.value);
            if (s) setSheetSize(s);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {SHEET_SIZES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — ${s.pricePerSheet}/sheet
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (sets)</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transfer type</label>
        <select
          value={transferType}
          onChange={(e) => setTransferType(e.target.value as 'standard' | 'glow' | 'reflective')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="standard">Standard</option>
          <option value="glow">Glow (+$2.50/sheet)</option>
          <option value="reflective">Reflective (+$3/sheet)</option>
        </select>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={rushOrder}
          onChange={(e) => setRushOrder(e.target.checked)}
          className="rounded border-gray-300 text-accent"
        />
        <span className="text-sm">Rush order (+$15)</span>
      </label>

      <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Sheets × {quantity}</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
        {transferAddon > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Transfer add-on</span>
            <span>${transferAddon.toFixed(2)}</span>
          </div>
        )}
        {rush > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Rush</span>
            <span>${rush.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>GST (12%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)} CAD</span>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        InkCreek Studio · Vancouver, BC · Prices in CAD
      </p>
    </div>
  );
}
