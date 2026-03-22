"use client";

import jsPDF from "jspdf";
import { useMemo, useState } from "react";

type QuoteItem = { id: string; name: string; quantity: number; rate: number };
type DiscountType = "percent" | "flat";
type WhatsappTemplate = "quotation-share" | "follow-up" | "payment-reminder" | "festival-offer";

const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

const today = () => new Date().toISOString().slice(0, 10);

const WHATSAPP_TEMPLATES: Record<WhatsappTemplate, string> = {
  "quotation-share":
    "Hi {{name}}, please find your quotation {{quoteNumber}} from {{business}}. Total: {{amount}}. Valid till {{validUntil}}. Reply here for confirmation.",
  "follow-up":
    "Hi {{name}}, just following up on quotation {{quoteNumber}} from {{business}} ({{amount}}). Let us know if you would like any changes.",
  "payment-reminder":
    "Hi {{name}}, gentle reminder for payment against quotation/invoice {{quoteNumber}}. Payable amount: {{amount}}. Thanks - {{business}}.",
  "festival-offer":
    "Hi {{name}}, festive offer from {{business}} 🎉 Get special pricing this week. Your prepared quote {{quoteNumber}} is {{amount}}. Let's finalize today!",
};

export function QuotationGeneratorTool() {
  const [businessName, setBusinessName] = useState("ToolHub Services");
  const [businessPhone, setBusinessPhone] = useState("+91 90000 00000");
  const [businessEmail, setBusinessEmail] = useState("hello@toolhubsite.in");
  const [businessAddress, setBusinessAddress] = useState("Mumbai, Maharashtra");

  const [customerName, setCustomerName] = useState("Customer Name");
  const [customerPhone, setCustomerPhone] = useState("+91 98888 88888");
  const [customerEmail, setCustomerEmail] = useState("customer@email.com");
  const [customerAddress, setCustomerAddress] = useState("Customer Address");

  const [quotationNumber, setQuotationNumber] = useState("QT-1001");
  const [quotationDate, setQuotationDate] = useState(today());
  const [validUntil, setValidUntil] = useState(today());

  const [items, setItems] = useState<QuoteItem[]>([
    { id: crypto.randomUUID(), name: "Consulting package", quantity: 1, rate: 5000 },
  ]);

  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstRate, setGstRate] = useState(18);

  const [notes, setNotes] = useState("Prices are valid during quotation validity period.");
  const [terms, setTerms] = useState("50% advance to confirm order. Remaining on delivery.");

  const [whatsappTemplate, setWhatsappTemplate] = useState<WhatsappTemplate>("quotation-share");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0),
    [items],
  );

  const discountAmount = useMemo(() => {
    if (discountType === "percent") {
      const applied = (subtotal * Math.max(0, discountValue || 0)) / 100;
      return Math.min(applied, subtotal);
    }
    return Math.min(Math.max(0, discountValue || 0), subtotal);
  }, [discountType, discountValue, subtotal]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = gstEnabled ? (taxableAmount * Math.max(0, gstRate || 0)) / 100 : 0;
  const grandTotal = taxableAmount + gstAmount;
  const estimatedProfit = grandTotal * 0.25;

  const updateItem = (id: string, key: keyof Omit<QuoteItem, "id">, value: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (key === "name") return { ...item, name: value };
        const parsed = Number(value);
        return { ...item, [key]: Number.isFinite(parsed) ? parsed : 0 };
      }),
    );
  };

  const addItem = () => setItems((current) => [...current, { id: crypto.randomUUID(), name: "", quantity: 1, rate: 0 }]);

  const removeItem = (id: string) => {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
  };

  const quoteHtml = () => {
    const rows = items
      .map((item) => {
        const lineTotal = (item.quantity || 0) * (item.rate || 0);
        return `<tr>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.name || "Untitled item"}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #e2e8f0">${item.quantity || 0}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #e2e8f0">${(item.rate || 0).toFixed(2)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #e2e8f0">${lineTotal.toFixed(2)}</td>
        </tr>`;
      })
      .join("");

    return `<!doctype html><html><head><meta charset="utf-8" /><title>Quotation ${quotationNumber}</title>
      <style>
      @page { size: A4; margin: 10mm; }
      body { margin:0; background:#f8fafc; font-family: Inter, Arial, sans-serif; color:#0f172a; }
      .sheet { max-width:900px; margin:14px auto; background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; }
      .header { display:flex; justify-content:space-between; gap:12px; padding:18px; background:#f0f9ff; border-bottom:1px solid #dbeafe; }
      .meta { font-size:12px; color:#475569; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:14px 18px; }
      .card { border:1px solid #e2e8f0; border-radius:10px; padding:12px; }
      table { width:100%; border-collapse:collapse; }
      th { text-align:left; padding:8px; background:#f8fafc; border-bottom:1px solid #e2e8f0; font-size:12px; }
      .totals { width:320px; margin-left:auto; padding:14px 18px 18px; }
      .row { display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; }
      .grand { border-top:1px solid #cbd5e1; padding-top:8px; font-size:16px; font-weight:800; }
      .foot { padding:0 18px 18px; font-size:12px; color:#64748b; }
      @media print { body{background:#fff;} .sheet{margin:0;border:none;border-radius:0;} }
      </style>
      </head><body>
      <div class="sheet">
        <div class="header">
          <div>
            <div style="font-size:22px;font-weight:800;">${businessName || "Business Name"}</div>
            <div class="meta">${businessAddress || ""}</div>
            <div class="meta">${[businessPhone, businessEmail].filter(Boolean).join(" • ")}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:28px;font-weight:900;color:#0369a1;">QUOTATION</div>
            <div class="meta">No: ${quotationNumber || "-"}</div>
            <div class="meta">Date: ${quotationDate || "-"}</div>
            <div class="meta">Valid Until: ${validUntil || "-"}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;font-weight:700;">Customer</div>
            <div style="margin-top:6px;font-weight:700;">${customerName || "Customer Name"}</div>
            ${customerPhone ? `<div class="meta">Phone: ${customerPhone}</div>` : ""}
            ${customerEmail ? `<div class="meta">Email: ${customerEmail}</div>` : ""}
            ${customerAddress ? `<div class="meta">${customerAddress}</div>` : ""}
          </div>
          <div class="card">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;font-weight:700;">Summary</div>
            <div class="meta" style="margin-top:8px;">Subtotal: ${inr(subtotal)}</div>
            <div class="meta">Discount: ${inr(discountAmount)}</div>
            ${gstEnabled ? `<div class="meta">GST (${gstRate}%): ${inr(gstAmount)}</div>` : ""}
            <div style="margin-top:8px;font-weight:800;">Total: ${inr(grandTotal)}</div>
          </div>
        </div>

        <div style="padding:0 18px 10px;"><table><thead><tr><th>Item</th><th style="text-align:right;">Qty</th><th style="text-align:right;">Rate</th><th style="text-align:right;">Amount</th></tr></thead><tbody>${rows}</tbody></table></div>

        <div class="totals">
          <div class="row"><span>Subtotal</span><strong>${inr(subtotal)}</strong></div>
          <div class="row"><span>Discount</span><strong>- ${inr(discountAmount)}</strong></div>
          ${gstEnabled ? `<div class="row"><span>GST (${gstRate}%)</span><strong>${inr(gstAmount)}</strong></div>` : ""}
          <div class="row grand"><span>Grand Total</span><span>${inr(grandTotal)}</span></div>
        </div>

        <div class="foot">
          ${notes ? `<div><strong>Notes:</strong> ${notes}</div>` : ""}
          ${terms ? `<div style="margin-top:6px;"><strong>Terms:</strong> ${terms}</div>` : ""}
        </div>
      </div>
      </body></html>`;
  };

  const openPrintPreview = (triggerPrint: boolean) => {
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) return;
    popup.document.open();
    popup.document.write(quoteHtml());
    popup.document.close();
    popup.focus();
    if (triggerPrint) popup.print();
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const margin = 36;
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#0369a1");
    pdf.setFontSize(22);
    pdf.text("QUOTATION", width - margin, y + 8, { align: "right" });

    pdf.setTextColor("#0f172a");
    pdf.setFontSize(16);
    pdf.text(businessName || "Business Name", margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    [businessAddress, [businessPhone, businessEmail].filter(Boolean).join(" • ")].filter(Boolean).forEach((line, index) => {
      pdf.text(line, margin, y + 18 + index * 12);
    });

    pdf.text(`No: ${quotationNumber || "-"}`, width - margin, y + 24, { align: "right" });
    pdf.text(`Date: ${quotationDate || "-"}`, width - margin, y + 37, { align: "right" });
    pdf.text(`Valid Until: ${validUntil || "-"}`, width - margin, y + 50, { align: "right" });

    y += 70;
    pdf.setDrawColor(220);
    pdf.line(margin, y, width - margin, y);
    y += 16;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Customer", margin, y);
    y += 12;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    [customerName, customerPhone ? `Phone: ${customerPhone}` : "", customerEmail ? `Email: ${customerEmail}` : "", customerAddress]
      .filter(Boolean)
      .forEach((line) => {
        pdf.text(String(line), margin, y);
        y += 12;
      });

    y += 8;
    pdf.setDrawColor(230);
    pdf.line(margin, y, width - margin, y);
    y += 14;

    const qtyX = width - 220;
    const rateX = width - 140;
    const totalX = width - margin;

    pdf.setFont("helvetica", "bold");
    pdf.text("Item", margin, y);
    pdf.text("Qty", qtyX, y, { align: "right" });
    pdf.text("Rate", rateX, y, { align: "right" });
    pdf.text("Amount", totalX, y, { align: "right" });
    y += 10;
    pdf.setDrawColor(235);
    pdf.line(margin, y, width - margin, y);
    y += 14;
    pdf.setFont("helvetica", "normal");

    items.forEach((item) => {
      const lineTotal = (item.quantity || 0) * (item.rate || 0);
      const wrapped = pdf.splitTextToSize(item.name || "Untitled item", width - 280);
      pdf.text(wrapped, margin, y);
      pdf.text(String(item.quantity || 0), qtyX, y, { align: "right" });
      pdf.text((item.rate || 0).toFixed(2), rateX, y, { align: "right" });
      pdf.text(lineTotal.toFixed(2), totalX, y, { align: "right" });
      y += Math.max(16, wrapped.length * 12);
    });

    y += 6;
    pdf.line(margin, y, width - margin, y);
    y += 14;

    pdf.text(`Subtotal: ${inr(subtotal)}`, totalX, y, { align: "right" });
    y += 13;
    pdf.text(`Discount: - ${inr(discountAmount)}`, totalX, y, { align: "right" });
    y += 13;
    if (gstEnabled) {
      pdf.text(`GST (${gstRate}%): ${inr(gstAmount)}`, totalX, y, { align: "right" });
      y += 13;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(`Grand Total: ${inr(grandTotal)}`, totalX, y, { align: "right" });
    y += 20;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    if (notes) {
      const wrapped = pdf.splitTextToSize(`Notes: ${notes}`, width - margin * 2);
      pdf.text(wrapped, margin, Math.min(y, height - 48));
      y += wrapped.length * 10;
    }
    if (terms) {
      const wrapped = pdf.splitTextToSize(`Terms: ${terms}`, width - margin * 2);
      pdf.text(wrapped, margin, Math.min(y, height - 28));
    }

    pdf.save(`${(quotationNumber || "quotation").replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const whatsappMessage = useMemo(() => {
    return WHATSAPP_TEMPLATES[whatsappTemplate]
      .replaceAll("{{name}}", customerName || "Customer")
      .replaceAll("{{quoteNumber}}", quotationNumber || "-")
      .replaceAll("{{business}}", businessName || "Business")
      .replaceAll("{{amount}}", inr(grandTotal))
      .replaceAll("{{validUntil}}", validUntil || "-");
  }, [businessName, customerName, grandTotal, quotationNumber, validUntil, whatsappTemplate]);

  const whatsappUrl = `https://wa.me/${(customerPhone || "").replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-6">
      <section className="grid gap-3 lg:grid-cols-4">
        <label className="text-sm">
          Quotation number
          <input className="field" value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} />
        </label>
        <label className="text-sm">
          Quotation date
          <input type="date" className="field" value={quotationDate} onChange={(e) => setQuotationDate(e.target.value)} />
        </label>
        <label className="text-sm">
          Valid until
          <input type="date" className="field" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" className="btn btn-primary" onClick={downloadPdf}>
            Download PDF
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => openPrintPreview(false)}>
            Print-ready View
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => openPrintPreview(true)}>
            Print
          </button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Business details</h3>
          <div className="space-y-3">
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" />
            <input className="field" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="Business phone" />
            <input className="field" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="Business email" />
            <textarea className="field min-h-20" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Business address" />
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Customer details</h3>
          <div className="space-y-3">
            <input className="field" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
            <input className="field" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Customer phone" />
            <input className="field" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Customer email" />
            <textarea className="field min-h-20" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Customer address" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Items</h3>
          <button type="button" className="btn btn-secondary" onClick={addItem}>
            + Add item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                <th className="py-2 pr-2">Item name</th>
                <th className="py-2 pr-2">Quantity</th>
                <th className="py-2 pr-2">Rate</th>
                <th className="py-2 pr-2">Line total</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const lineTotal = (item.quantity || 0) * (item.rate || 0);
                return (
                  <tr key={item.id} className="border-b" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2 pr-2">
                      <input className="field" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                    </td>
                    <td className="py-2 pr-2">
                      <input className="field" type="number" min={0} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} />
                    </td>
                    <td className="py-2 pr-2">
                      <input className="field" type="number" min={0} value={item.rate} onChange={(e) => updateItem(item.id, "rate", e.target.value)} />
                    </td>
                    <td className="py-2 pr-2 font-medium">{inr(lineTotal)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        className="rounded-lg border px-3 py-2 text-xs"
                        style={{ borderColor: "var(--border)" }}
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Pricing controls (Profit/Pricing helper)</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Discount type
              <select className="select" value={discountType} onChange={(e) => setDiscountType(e.target.value as DiscountType)}>
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat amount (₹)</option>
              </select>
            </label>
            <label className="text-sm">
              Discount value
              <input type="number" min={0} className="field" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
            </label>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} /> Apply GST
          </label>
          <input
            type="number"
            min={0}
            className="field mt-2"
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            disabled={!gstEnabled}
            placeholder="GST rate %"
          />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <strong>{inr(subtotal)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted)" }}>Discount</span>
              <strong>- {inr(discountAmount)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted)" }}>Taxable amount</span>
              <strong>{inr(taxableAmount)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted)" }}>GST {gstEnabled ? `(${gstRate}%)` : "(off)"}</span>
              <strong>{inr(gstAmount)}</strong>
            </div>
            <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: "var(--border)" }}>
              <span className="font-semibold">Grand total</span>
              <strong className="text-base">{inr(grandTotal)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
              <span>Estimated profit (25% demo)</span>
              <strong>{inr(estimatedProfit)}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">WhatsApp message templates</h3>
          <label className="text-sm">
            Template
            <select className="select" value={whatsappTemplate} onChange={(e) => setWhatsappTemplate(e.target.value as WhatsappTemplate)}>
              <option value="quotation-share">Quotation share</option>
              <option value="follow-up">Follow-up</option>
              <option value="payment-reminder">Payment reminder</option>
              <option value="festival-offer">Festival offer</option>
            </select>
          </label>
          <textarea className="textarea mt-3 min-h-[170px]" value={whatsappMessage} readOnly />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(whatsappMessage);
              }}
            >
              Copy message
            </button>
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Open WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <textarea className="textarea" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Terms" />
        <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      </section>

      <section className="rounded-2xl border bg-white p-4 text-black sm:p-6" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-sky-700">Preview · Quotation</p>
          <p className="text-xs text-slate-500">Generated with ToolHubsite.in</p>
        </div>
        <iframe title="quotation-preview" srcDoc={quoteHtml()} className="h-[580px] w-full rounded-xl border" style={{ borderColor: "#e2e8f0" }} />
      </section>
    </div>
  );
}
