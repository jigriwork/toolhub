"use client";

import jsPDF from "jspdf";
import { useMemo, useState } from "react";

const inr = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

export function ReceiptGeneratorTool() {
  const [receiptNo, setReceiptNo] = useState("RCPT-1001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [business, setBusiness] = useState("ToolHub Services");
  const [customer, setCustomer] = useState("Customer Name");
  const [amount, setAmount] = useState(2500);
  const [mode, setMode] = useState("UPI");
  const [notes, setNotes] = useState("Payment received with thanks.");

  const html = useMemo(
    () => `<!doctype html><html><body style="font-family:Arial;padding:16px;color:#0f172a"><h2>PAYMENT RECEIPT</h2><p><strong>${business}</strong></p><p>Receipt: ${receiptNo}<br/>Date: ${date}</p><hr/><p>Received from: <strong>${customer}</strong></p><p>Amount: <strong>${inr(amount)}</strong></p><p>Mode: ${mode}</p><p>${notes}</p><hr/><p style="font-size:12px;color:#64748b">Generated with ToolHub</p></body></html>`,
    [amount, business, customer, date, mode, notes, receiptNo],
  );

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
    doc.text("PAYMENT RECEIPT", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`${business}`, 20, 30);
    doc.text(`Receipt: ${receiptNo}`, 20, 40);
    doc.text(`Date: ${date}`, 20, 48);
    doc.text(`Received from: ${customer}`, 20, 60);
    doc.text(`Amount: ${inr(amount)}`, 20, 68);
    doc.text(`Mode: ${mode}`, 20, 76);
    doc.text(`Notes: ${notes}`, 20, 86);
    doc.save(`${receiptNo.toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <input className="field" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} placeholder="Receipt no" />
        <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="field" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business" />
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <input className="field" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer" />
        <input type="number" className="field" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" />
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Card</option>
        </select>
        <input className="field" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      </section>
      <section className="flex gap-2">
        <button type="button" className="btn btn-primary" onClick={pdf}>Download PDF</button>
        <button type="button" className="btn btn-secondary" onClick={print}>Print Receipt</button>
      </section>
      <iframe title="receipt-preview" srcDoc={html} className="h-[380px] w-full rounded-xl border" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}
