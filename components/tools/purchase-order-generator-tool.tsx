"use client";

import { useMemo, useState } from "react";

type PoItem = { id: string; name: string; qty: number; rate: number };

const inr = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

export function PurchaseOrderGeneratorTool() {
  const [poNo, setPoNo] = useState("PO-1001");
  const [poDate, setPoDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedDelivery, setExpectedDelivery] = useState(new Date().toISOString().slice(0, 10));
  const [supplierName, setSupplierName] = useState("Supplier Name");
  const [supplierPhone, setSupplierPhone] = useState("+91 90000 00000");
  const [status, setStatus] = useState<"Draft" | "Sent" | "Received">("Draft");
  const [items, setItems] = useState<PoItem[]>([{ id: crypto.randomUUID(), name: "Item name", qty: 1, rate: 1000 }]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.rate, 0), [items]);

  const update = (id: string, key: keyof Omit<PoItem, "id">, value: string) => {
    setItems((curr) =>
      curr.map((row) => {
        if (row.id !== id) return row;
        if (key === "name") return { ...row, name: value };
        const n = Number(value);
        return { ...row, [key]: Number.isFinite(n) ? n : 0 };
      }),
    );
  };

  const preview = `PO ${poNo} · ${status} · Supplier ${supplierName} · ${inr(subtotal)}`;

  return (
    <div className="space-y-5">
      <section className="grid gap-3 md:grid-cols-3">
        <input className="field" value={poNo} onChange={(e) => setPoNo(e.target.value)} placeholder="PO number" />
        <input type="date" className="field" value={poDate} onChange={(e) => setPoDate(e.target.value)} />
        <input type="date" className="field" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <input className="field" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Supplier name" />
        <input className="field" value={supplierPhone} onChange={(e) => setSupplierPhone(e.target.value)} placeholder="Supplier phone" />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as "Draft" | "Sent" | "Received")}>
          <option>Draft</option>
          <option>Sent</option>
          <option>Received</option>
        </select>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold">PO Items</h3>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setItems((curr) => [...curr, { id: crypto.randomUUID(), name: "", qty: 1, rate: 0 }])}
          >
            + Add item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid gap-2 md:grid-cols-12">
              <input className="field md:col-span-6" value={item.name} onChange={(e) => update(item.id, "name", e.target.value)} placeholder="Item" />
              <input className="field md:col-span-2" type="number" min={0} value={item.qty} onChange={(e) => update(item.id, "qty", e.target.value)} />
              <input className="field md:col-span-2" type="number" min={0} value={item.rate} onChange={(e) => update(item.id, "rate", e.target.value)} />
              <button
                type="button"
                className="btn btn-secondary md:col-span-2"
                onClick={() => setItems((curr) => (curr.length > 1 ? curr.filter((row) => row.id !== item.id) : curr))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between"><span style={{ color: "var(--muted)" }}>Expected delivery</span><strong>{expectedDelivery}</strong></div>
        <div className="mt-2 flex items-center justify-between"><span style={{ color: "var(--muted)" }}>PO subtotal</span><strong>{inr(subtotal)}</strong></div>
        <div className="mt-2 flex items-center justify-between"><span style={{ color: "var(--muted)" }}>Status</span><strong>{status}</strong></div>
        <div className="mt-3 rounded-lg border bg-slate-50 p-3 text-xs" style={{ borderColor: "var(--border)" }}>{preview}</div>
      </section>
    </div>
  );
}
