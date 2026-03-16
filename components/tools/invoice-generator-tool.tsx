"use client";

import jsPDF from "jspdf";
import { useMemo, useState } from "react";

type InvoiceItem = { id: string; name: string; quantity: number; price: number };
type InvoiceTemplate = "classic" | "modern" | "gst" | "retail";
type PaperSize = "a4" | "letter" | "letterhead" | "receipt-80" | "receipt-58";

const TEMPLATE_META: Record<InvoiceTemplate, { title: string; accent: string; surface: string }> = {
  classic: { title: "Classic Professional", accent: "#1d4ed8", surface: "#f8fafc" },
  modern: { title: "Modern Minimal", accent: "#111827", surface: "#f8fafc" },
  gst: { title: "GST Business Layout", accent: "#166534", surface: "#f0fdf4" },
  retail: { title: "Retail Style Invoice", accent: "#9a3412", surface: "#fff7ed" },
};

const PAPER_META: Record<PaperSize, { title: string; format: string | [number, number]; printCss: string; isReceipt: boolean }> = {
  a4: { title: "A4", format: "a4", printCss: "A4", isReceipt: false },
  letter: { title: "Letter", format: "letter", printCss: "Letter", isReceipt: false },
  letterhead: { title: "Letterhead", format: "a4", printCss: "A4", isReceipt: false },
  "receipt-80": { title: "Receipt Printer 80mm", format: [226.77, 841.89], printCss: "80mm auto", isReceipt: true },
  "receipt-58": { title: "Receipt Printer 58mm", format: [164.41, 841.89], printCss: "58mm auto", isReceipt: true },
};

const inr = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number.isFinite(v) ? v : 0);

const today = () => new Date().toISOString().slice(0, 10);

const imageFormat = (dataUrl: string): "PNG" | "JPEG" => (/^data:image\/jpe?g/i.test(dataUrl) ? "JPEG" : "PNG");

export function InvoiceGeneratorTool() {
  const [logoDataUrl, setLogoDataUrl] = useState("");

  const [businessName, setBusinessName] = useState("ToolHub Services");
  const [businessGst, setBusinessGst] = useState("");
  const [businessAddress, setBusinessAddress] = useState("Mumbai, Maharashtra");
  const [businessPhone, setBusinessPhone] = useState("+91 90000 00000");
  const [businessEmail, setBusinessEmail] = useState("hello@toolhubsite.in");
  const [businessWebsite, setBusinessWebsite] = useState("toolhubsite.in");

  const [customerName, setCustomerName] = useState("Customer Name");
  const [customerGst, setCustomerGst] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+91 98888 88888");
  const [customerEmail, setCustomerEmail] = useState("customer@email.com");
  const [customerAddress1, setCustomerAddress1] = useState("Customer Address Line 1");
  const [customerAddress2, setCustomerAddress2] = useState("Customer Address Line 2");
  const [placeOfSupply, setPlaceOfSupply] = useState("Maharashtra");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-1001");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState(today());
  const [invoiceTemplate, setInvoiceTemplate] = useState<InvoiceTemplate>("classic");
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");

  const [items, setItems] = useState<InvoiceItem[]>([{ id: crypto.randomUUID(), name: "Website maintenance", quantity: 1, price: 2500 }]);
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstRate, setGstRate] = useState(18);

  const [notes, setNotes] = useState("Thank you for your business.");
  const [terms, setTerms] = useState("Payment due within 7 days.");
  const [paymentInstructions, setPaymentInstructions] = useState("UPI: payments@toolhub\nBank transfer accepted");
  const [showSignature, setShowSignature] = useState(true);
  const [showStamp, setShowStamp] = useState(false);

  const subtotal = useMemo(() => items.reduce((s, item) => s + (item.quantity || 0) * (item.price || 0), 0), [items]);
  const gstAmount = gstEnabled ? (subtotal * (gstRate || 0)) / 100 : 0;
  const grandTotal = subtotal + gstAmount;

  const templateMeta = TEMPLATE_META[invoiceTemplate];
  const paperMeta = PAPER_META[paperSize];

  const updateItem = (id: string, key: keyof Omit<InvoiceItem, "id">, value: string) => {
    setItems((curr) =>
      curr.map((item) => {
        if (item.id !== id) return item;
        if (key === "name") return { ...item, name: value };
        const n = Number(value);
        return { ...item, [key]: Number.isFinite(n) ? n : 0 };
      }),
    );
  };

  const addItem = () => setItems((curr) => [...curr, { id: crypto.randomUUID(), name: "", quantity: 1, price: 0 }]);
  const removeItem = (id: string) => setItems((curr) => (curr.length <= 1 ? curr : curr.filter((i) => i.id !== id)));

  const getInvoiceHtml = () => {
    const isReceipt = paperMeta.isReceipt;
    const itemRows = items
      .map((item) => {
        const lineTotal = (item.quantity || 0) * (item.price || 0);
        return `<tr><td style="padding:8px 6px;border-bottom:1px solid #e5e7eb;">${item.name || "Untitled item"}</td><td style="padding:8px 6px;text-align:right;border-bottom:1px solid #e5e7eb;">${item.quantity || 0}</td><td style="padding:8px 6px;text-align:right;border-bottom:1px solid #e5e7eb;">${(item.price || 0).toFixed(2)}</td><td style="padding:8px 6px;text-align:right;border-bottom:1px solid #e5e7eb;">${lineTotal.toFixed(2)}</td></tr>`;
      })
      .join("");

    return `<!doctype html><html><head><meta charset="utf-8"/><title>Invoice ${invoiceNumber || "-"}</title><style>
      @page { size: ${paperMeta.printCss}; margin: 10mm; }
      body { margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif;color:#0f172a; }
      .sheet { max-width:${isReceipt ? "100%" : "900px"}; margin:16px auto; background:#fff; border:1px solid #dbe3f0; border-radius:${isReceipt ? "10px" : "14px"}; overflow:hidden; }
      .header { display:flex;justify-content:space-between;gap:16px;padding:${isReceipt ? "12px" : "18px"};border-bottom:1px solid #e2e8f0;background:${templateMeta.surface}; }
      .grid { display:grid;grid-template-columns:${isReceipt ? "1fr" : "1fr 1fr"};gap:12px;padding:${isReceipt ? "12px" : "16px"}; }
      .panel { border:1px solid #e2e8f0;border-radius:10px;padding:12px;background:#fff; }
      .meta { font-size:12px;color:#475569; }
      table { width:100%;border-collapse:collapse; }
      th { text-align:left;font-size:12px;padding:8px 6px;background:${templateMeta.surface};border-bottom:1px solid #e5e7eb; }
      .totals { margin-left:auto;width:${isReceipt ? "100%" : "320px"};padding:${isReceipt ? "12px" : "16px"}; }
      .row { display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px; }
      .grand { font-weight:800;font-size:16px;border-top:1px solid #cbd5e1;padding-top:8px; }
      .wm { text-align:right;color:#94a3b8;font-size:11px;padding:8px 12px 12px; }
      @media print { body { background:#fff; } .sheet { margin:0;border:none;border-radius:0; } }
    </style></head><body>
      <div class="sheet">
        <div class="header">
          <div>
            <div style="display:flex;gap:10px;align-items:center;">
              ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Business logo" style="width:${isReceipt ? 42 : 58}px;height:${isReceipt ? 42 : 58}px;border:1px solid #e5e7eb;border-radius:10px;object-fit:contain;background:#fff;"/>` : ""}
              <div><div style="font-size:${isReceipt ? 16 : 22}px;font-weight:800;">${businessName || "Business Name"}</div>${businessGst ? `<div class="meta">GST: ${businessGst}</div>` : ""}</div>
            </div>
            <div class="meta" style="margin-top:8px;">${businessAddress || ""}</div>
            <div class="meta">${[businessPhone, businessEmail, businessWebsite].filter(Boolean).join(" • ")}</div>
          </div>
          <div style="text-align:right;">
            <div style="color:${templateMeta.accent};font-weight:900;font-size:${isReceipt ? 18 : 30}px;letter-spacing:.08em;">INVOICE</div>
            <div class="meta">Template: ${templateMeta.title}</div>
            <div class="meta">Invoice #: ${invoiceNumber || "-"}</div>
            <div class="meta">Date: ${invoiceDate || "-"}</div>
            <div class="meta">Due: ${dueDate || "-"}</div>
          </div>
        </div>

        <div class="grid">
          <div class="panel">
            <div style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;">Bill To</div>
            <div style="font-weight:700;margin-top:6px;">${customerName || "Customer Name"}</div>
            ${customerGst ? `<div class="meta">Customer GST: ${customerGst}</div>` : ""}
            ${customerPhone ? `<div class="meta">Phone: ${customerPhone}</div>` : ""}
            ${customerEmail ? `<div class="meta">Email: ${customerEmail}</div>` : ""}
            <div class="meta">${[customerAddress1, customerAddress2].filter(Boolean).join(", ")}</div>
            ${placeOfSupply ? `<div class="meta">Place of Supply: ${placeOfSupply}</div>` : ""}
          </div>
          <div class="panel">
            <div style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;">Payment & Terms</div>
            ${paymentInstructions ? `<div class="meta" style="white-space:pre-line;margin-top:6px;">${paymentInstructions}</div>` : ""}
            ${terms ? `<div class="meta" style="margin-top:8px;">${terms}</div>` : ""}
            ${notes ? `<div class="meta" style="margin-top:8px;">Notes: ${notes}</div>` : ""}
          </div>
        </div>

        <div style="padding:${isReceipt ? "0 12px 6px" : "0 16px 10px"};"><table><thead><tr><th>Item</th><th style="text-align:right;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Total</th></tr></thead><tbody>${itemRows}</tbody></table></div>

        <div class="totals">
          <div class="row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          ${gstEnabled ? `<div class="row"><span>GST (${gstRate}%)</span><strong>${gstAmount.toFixed(2)}</strong></div>` : ""}
          <div class="row grand"><span>Grand Total</span><span>${grandTotal.toFixed(2)}</span></div>
          ${showStamp ? `<div style="height:60px;border:1px dashed #94a3b8;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#64748b;margin-top:10px;font-size:12px;">Stamp Area</div>` : ""}
          ${showSignature ? `<div style="margin-top:14px;text-align:right;"><div style="height:36px"></div><div style="display:inline-block;min-width:170px;border-top:1px solid #94a3b8;padding-top:6px;font-size:12px;color:#475569;">Authorized Signature</div></div>` : ""}
        </div>
        <div class="wm">Generated with ToolHubsite.in</div>
      </div>
    </body></html>`;
  };

  const openPrint = (triggerPrint: boolean) => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.open();
    w.document.write(getInvoiceHtml());
    w.document.close();
    w.focus();
    if (triggerPrint) w.print();
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({ unit: "pt", format: paperMeta.format });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const isReceipt = paperMeta.isReceipt;
    const margin = isReceipt ? 18 : 36;
    const qtyX = pageWidth - (isReceipt ? 108 : 200);
    const priceX = pageWidth - (isReceipt ? 62 : 130);
    const totalX = pageWidth - margin;
    let y = margin;

    if (logoDataUrl) {
      try {
        pdf.addImage(logoDataUrl, imageFormat(logoDataUrl), margin, y, isReceipt ? 34 : 52, isReceipt ? 34 : 52);
      } catch {
        // keep export stable
      }
    }

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(templateMeta.accent);
    pdf.setFontSize(isReceipt ? 14 : 22);
    pdf.text("INVOICE", pageWidth - margin, y + (isReceipt ? 14 : 18), { align: "right" });

    pdf.setTextColor("#0f172a");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(isReceipt ? 8.5 : 10.5);
    pdf.text(`Invoice #: ${invoiceNumber || "-"}`, pageWidth - margin, y + (isReceipt ? 28 : 38), { align: "right" });
    pdf.text(`Date: ${invoiceDate || "-"}`, pageWidth - margin, y + (isReceipt ? 40 : 53), { align: "right" });
    pdf.text(`Due: ${dueDate || "-"}`, pageWidth - margin, y + (isReceipt ? 51 : 68), { align: "right" });

    const businessStartX = logoDataUrl ? margin + (isReceipt ? 42 : 62) : margin;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(isReceipt ? 11 : 15);
    pdf.text(businessName || "Business Name", businessStartX, y + (isReceipt ? 11 : 14));
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(isReceipt ? 8.5 : 10);
    [businessGst ? `GST: ${businessGst}` : "", businessAddress, [businessPhone, businessEmail, businessWebsite].filter(Boolean).join(" • ")]
      .filter(Boolean)
      .forEach((line, idx) => {
        const wrapped = pdf.splitTextToSize(line, pageWidth - businessStartX - margin - 20);
        pdf.text(wrapped, businessStartX, y + (isReceipt ? 23 : 28) + idx * (isReceipt ? 12 : 14));
      });

    y += isReceipt ? 74 : 95;
    pdf.setDrawColor(220);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 14;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(isReceipt ? 9 : 11);
    pdf.text("Bill To", margin, y);
    y += 12;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(isReceipt ? 8.5 : 10);
    [
      customerName,
      customerGst ? `Customer GST: ${customerGst}` : "",
      customerPhone ? `Phone: ${customerPhone}` : "",
      customerEmail ? `Email: ${customerEmail}` : "",
      [customerAddress1, customerAddress2].filter(Boolean).join(", "),
      placeOfSupply ? `Place of Supply: ${placeOfSupply}` : "",
    ]
      .filter(Boolean)
      .forEach((line) => {
        const wrapped = pdf.splitTextToSize(line, pageWidth - margin * 2);
        pdf.text(wrapped, margin, y);
        y += wrapped.length * (isReceipt ? 10 : 12);
      });

    y += 6;
    pdf.setDrawColor(220);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 14;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(isReceipt ? 8.5 : 10);
    pdf.text("Item", margin, y);
    pdf.text("Qty", qtyX, y, { align: "right" });
    pdf.text("Price", priceX, y, { align: "right" });
    pdf.text("Total", totalX, y, { align: "right" });
    y += 10;
    pdf.setDrawColor(235);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 12;
    pdf.setFont("helvetica", "normal");

    items.forEach((item) => {
      const lineTotal = (item.quantity || 0) * (item.price || 0);
      const wrapped = pdf.splitTextToSize(item.name || "Untitled item", pageWidth - margin * 2 - 170);
      pdf.text(wrapped, margin, y);
      pdf.text(String(item.quantity || 0), qtyX, y, { align: "right" });
      pdf.text((item.price || 0).toFixed(2), priceX, y, { align: "right" });
      pdf.text(lineTotal.toFixed(2), totalX, y, { align: "right" });
      y += Math.max(isReceipt ? 12 : 16, wrapped.length * (isReceipt ? 10 : 12));
    });

    y += 4;
    pdf.setDrawColor(235);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 14;

    pdf.text(`Subtotal: ${subtotal.toFixed(2)}`, totalX, y, { align: "right" });
    y += 14;
    if (gstEnabled) {
      pdf.text(`GST (${gstRate}%): ${gstAmount.toFixed(2)}`, totalX, y, { align: "right" });
      y += 14;
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(isReceipt ? 10.5 : 13);
    pdf.text(`Grand Total: ${grandTotal.toFixed(2)}`, totalX, y, { align: "right" });

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#94a3b8");
    pdf.setFontSize(isReceipt ? 7 : 8);
    pdf.text("Generated with ToolHubsite.in", pageWidth - margin, pageHeight - 14, { align: "right" });
    pdf.save(`${(invoiceNumber || "invoice").replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-4">
        <label className="text-sm">Template
          <select className="select" value={invoiceTemplate} onChange={(e) => setInvoiceTemplate(e.target.value as InvoiceTemplate)}>
            {Object.entries(TEMPLATE_META).map(([k, v]) => <option key={k} value={k}>{v.title}</option>)}
          </select>
        </label>
        <label className="text-sm">Paper size
          <select className="select" value={paperSize} onChange={(e) => setPaperSize(e.target.value as PaperSize)}>
            {Object.entries(PAPER_META).map(([k, v]) => <option key={k} value={k}>{v.title}</option>)}
          </select>
        </label>
        <label className="text-sm">Invoice number<input className="field" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} /></label>
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" className="btn btn-primary" onClick={downloadPdf}>Download PDF</button>
          <button type="button" className="btn btn-secondary" onClick={() => openPrint(false)}>Print-ready View</button>
          <button type="button" className="btn btn-secondary" onClick={() => openPrint(true)}>Print Invoice</button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Business logo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setLogoDataUrl(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
          />
        </div>
        <div className="flex items-end gap-2"><button type="button" className="btn btn-secondary" onClick={() => setLogoDataUrl("")}>Remove logo</button></div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Business details</h3>
          <div className="space-y-3">
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" />
            <input className="field" value={businessGst} onChange={(e) => setBusinessGst(e.target.value)} placeholder="Business GST number" />
            <textarea className="field min-h-20" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Business address" />
            <input className="field" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="Business phone" />
            <input className="field" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="Business email" />
            <input className="field" value={businessWebsite} onChange={(e) => setBusinessWebsite(e.target.value)} placeholder="Business website" />
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Customer details</h3>
          <div className="space-y-3">
            <input className="field" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
            <input className="field" value={customerGst} onChange={(e) => setCustomerGst(e.target.value)} placeholder="Customer GST number (optional)" />
            <input className="field" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Customer phone" />
            <input className="field" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Customer email" />
            <input className="field" value={customerAddress1} onChange={(e) => setCustomerAddress1(e.target.value)} placeholder="Customer address line 1" />
            <input className="field" value={customerAddress2} onChange={(e) => setCustomerAddress2(e.target.value)} placeholder="Customer address line 2" />
            <input className="field" value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} placeholder="Place of supply (GST)" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <input type="date" className="field" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
        <input type="date" className="field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Invoice items</h3>
          <button type="button" className="btn btn-secondary" onClick={addItem}>+ Add item</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                <th className="py-2 pr-2">Item name</th><th className="py-2 pr-2">Quantity</th><th className="py-2 pr-2">Price</th><th className="py-2 pr-2">Line total</th><th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const lineTotal = (item.quantity || 0) * (item.price || 0);
                return (
                  <tr key={item.id} className="border-b" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2 pr-2"><input className="field" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Item name" /></td>
                    <td className="py-2 pr-2"><input className="field" type="number" min={0} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} /></td>
                    <td className="py-2 pr-2"><input className="field" type="number" min={0} value={item.price} onChange={(e) => updateItem(item.id, "price", e.target.value)} /></td>
                    <td className="py-2 pr-2 font-medium">{inr(lineTotal)}</td>
                    <td className="py-2"><button type="button" className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--border)" }} onClick={() => removeItem(item.id)} disabled={items.length <= 1}>Remove</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Tax & optional sections</h3>
          <label className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} /> Apply GST</label>
          <input type="number" min={0} className="field" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} disabled={!gstEnabled} placeholder="GST rate %" />
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} /> Show authorized signature area</label>
          <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={showStamp} onChange={(e) => setShowStamp(e.target.checked)} /> Show stamp area</label>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Totals</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span style={{ color: "var(--muted)" }}>Subtotal</span><strong>{inr(subtotal)}</strong></div>
            <div className="flex items-center justify-between"><span style={{ color: "var(--muted)" }}>GST {gstEnabled ? `(${gstRate}%)` : "(off)"}</span><strong>{inr(gstAmount)}</strong></div>
            <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: "var(--border)" }}><span className="font-semibold">Grand total</span><strong className="text-base">{inr(grandTotal)}</strong></div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <textarea className="textarea" value={paymentInstructions} onChange={(e) => setPaymentInstructions(e.target.value)} placeholder="Payment instructions" />
        <div className="grid gap-3">
          <textarea className="textarea min-h-[96px]" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Terms" />
          <textarea className="textarea min-h-[96px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 text-black sm:p-6" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: templateMeta.accent }}>Preview · {templateMeta.title} · {paperMeta.title}</p>
          <p className="text-xs text-slate-500">Generated with ToolHubsite.in</p>
        </div>
        <iframe title="invoice-preview" srcDoc={getInvoiceHtml()} className="h-[580px] w-full rounded-xl border" style={{ borderColor: "#e2e8f0" }} />
      </section>
    </div>
  );
}
