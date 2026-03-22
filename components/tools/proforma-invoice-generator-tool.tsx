"use client";

import jsPDF from "jspdf";
import { useMemo, useState } from "react";

type Row = { id: string; name: string; qty: number; rate: number };

const inr = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

export function ProformaInvoiceGeneratorTool() {
  const [proformaNo, setProformaNo] = useState("PF-1001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [business, setBusiness] = useState("ToolHub Services");
  const [customer, setCustomer] = useState("Customer Name");
  const [gstRate, setGstRate] = useState(18);
  const [items, setItems] = useState<Row[]>([{ id: crypto.randomUUID(), name: "Product / Service", qty: 1, rate: 2500 }]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.rate, 0), [items]);
  const gst = (subtotal * gstRate) / 100;
  const total = subtotal + gst;

  const setRow = (id: string, key: keyof Omit<Row, "id">, value: string) => {
    setItems((curr) =>
      curr.map((r) => {
        if (r.id !== id) return r;
        if (key === "name") return { ...r, name: value };
        const n = Number(value);
        return { ...r, [key]: Number.isFinite(n) ? n : 0 };
      }),
    );
  };

  const html = `<!doctype html><html><body style="font-family:Arial;padding:18px;color:#0f172a"><h2 style="margin:0;color:#0369a1">PROFORMA INVOICE</h2><p><strong>${business}</strong><br/>Proforma No: ${proformaNo}<br/>Date: ${date}</p><p>Customer: <strong>${customer}</strong></p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;border-bottom:1px solid #ddd;padding:6px">Item</th><th style="text-align:right;border-bottom:1px solid #ddd;padding:6px">Qty</th><th style="text-align:right;border-bottom:1px solid #ddd;padding:6px">Rate</th><th style="text-align:right;border-bottom:1px solid #ddd;padding:6px">Total</th></tr></thead><tbody>${items
    .map((i) => `<tr><td style="padding:6px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:6px;text-align:right;border-bottom:1px solid #eee">${i.qty}</td><td style="padding:6px;text-align:right;border-bottom:1px solid #eee">${i.rate.toFixed(2)}</td><td style="padding:6px;text-align:right;border-bottom:1px solid #eee">${(i.qty * i.rate).toFixed(2)}</td></tr>`)
    .join("")}</tbody></table><p style="text-align:right">Subtotal: ${inr(subtotal)}<br/>GST (${gstRate}%): ${inr(gst)}<br/><strong>Total: ${inr(total)}</strong></p></body></html>`;

  const print = () => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const pdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("PROFORMA INVOICE", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`${business}`, 20, 30);
    doc.text(`No: ${proformaNo}  Date: ${date}`, 20, 38);
    doc.text(`Customer: ${customer}`, 20, 48);
    let y = 62;
    items.forEach((i) => {
      doc.text(`${i.name}  Qty:${i.qty}  Rate:${i.rate.toFixed(2)}  Total:${(i.qty * i.rate).toFixed(2)}`, 20, y);
      y += 8;
    });
    y += 4;
    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 20, y);
    doc.text(`GST (${gstRate}%): ${gst.toFixed(2)}`, 20, y + 8);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${total.toFixed(2)}`, 20, y + 16);
    doc.save(`${proformaNo.toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-4">
        <input className="field" value={proformaNo} onChange={(e) => setProformaNo(e.target.value)} placeholder="Proforma number" />
        <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="field" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business" />
        <input className="field" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer" />
      </section>
      <section className="flex items-center gap-3">
        <label className="text-sm">GST %</label>
        <input className="field max-w-36" type="number" min={0} value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} />
        <button type="button" className="btn btn-secondary" onClick={() => setItems((c) => [...c, { id: crypto.randomUUID(), name: "", qty: 1, rate: 0 }])}>+ Add item</button>
      </section>
      <div className="space-y-2">
        {items.map((r) => (
          <div key={r.id} className="grid gap-2 md:grid-cols-12">
            <input className="field md:col-span-6" value={r.name} onChange={(e) => setRow(r.id, "name", e.target.value)} placeholder="Item" />
            <input className="field md:col-span-2" type="number" min={0} value={r.qty} onChange={(e) => setRow(r.id, "qty", e.target.value)} />
            <input className="field md:col-span-2" type="number" min={0} value={r.rate} onChange={(e) => setRow(r.id, "rate", e.target.value)} />
            <button type="button" className="btn btn-secondary md:col-span-2" onClick={() => setItems((c) => (c.length > 1 ? c.filter((x) => x.id !== r.id) : c))}>Remove</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={pdf}>Download PDF</button>
        <button type="button" className="btn btn-secondary" onClick={print}>Print</button>
      </div>
      <iframe title="proforma-preview" srcDoc={html} className="h-[420px] w-full rounded-xl border" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}
