"use client";

import jsPDF from "jspdf";
import { useMemo, useState } from "react";

type InvoiceItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function InvoiceGeneratorTool() {
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [businessName, setBusinessName] = useState("ToolHub Services");
  const [gstNumber, setGstNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("Mumbai, Maharashtra");
  const [businessPhone, setBusinessPhone] = useState("+91 90000 00000");

  const [buyerName, setBuyerName] = useState("Customer Name");
  const [buyerAddress, setBuyerAddress] = useState("Customer Address");
  const [buyerContact, setBuyerContact] = useState("customer@email.com / +91 98888 88888");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-1001");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState(today());

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), name: "Website maintenance", quantity: 1, price: 2500 },
  ]);

  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstRate, setGstRate] = useState(18);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0),
    [items],
  );
  const gstAmount = gstEnabled ? (subtotal * (Number(gstRate) || 0)) / 100 : 0;
  const grandTotal = subtotal + gstAmount;

  const updateItem = (id: string, key: keyof Omit<InvoiceItem, "id">, value: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (key === "name") return { ...item, name: value };
        const nextNumber = Number(value);
        return { ...item, [key]: Number.isFinite(nextNumber) ? nextNumber : 0 };
      }),
    );
  };

  const addItemRow = () => {
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItemRow = (id: string) => {
    setItems((current) => (current.length <= 1 ? current : current.filter((item) => item.id !== id)));
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;
    let y = 46;

    if (logoDataUrl) {
      try {
        pdf.addImage(logoDataUrl, "PNG", margin, y, 56, 56);
      } catch {
        // Skip logo in PDF if image decode fails.
      }
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("INVOICE", pageWidth - margin, y + 18, { align: "right" });

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Invoice #: ${invoiceNumber || "-"}`, pageWidth - margin, y + 38, { align: "right" });
    pdf.text(`Invoice Date: ${invoiceDate || "-"}`, pageWidth - margin, y + 54, { align: "right" });
    pdf.text(`Due Date: ${dueDate || "-"}`, pageWidth - margin, y + 70, { align: "right" });

    y += 84;
    pdf.setDrawColor(220);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 22;

    pdf.setFont("helvetica", "bold");
    pdf.text("From", margin, y);
    pdf.text("Bill To", pageWidth / 2, y);
    y += 16;

    pdf.setFont("helvetica", "normal");
    const leftLines = [
      businessName || "-",
      gstNumber ? `GST: ${gstNumber}` : "",
      businessAddress || "",
      businessPhone || "",
    ].filter(Boolean);
    const rightLines = [buyerName || "-", buyerAddress || "", buyerContact || ""].filter(Boolean);

    leftLines.forEach((line) => {
      const wrapped = pdf.splitTextToSize(line, pageWidth / 2 - margin - 20);
      pdf.text(wrapped, margin, y);
      y += wrapped.length * 13;
    });

    let rightY = y - leftLines.join(" ").length * 0 + 0;
    rightY = y - leftLines.length * 13;
    rightLines.forEach((line) => {
      const wrapped = pdf.splitTextToSize(line, pageWidth / 2 - margin - 20);
      pdf.text(wrapped, pageWidth / 2, rightY);
      rightY += wrapped.length * 13;
    });

    y = Math.max(y, rightY) + 16;
    pdf.setDrawColor(220);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 18;

    pdf.setFont("helvetica", "bold");
    pdf.text("Item", margin, y);
    pdf.text("Qty", pageWidth - 200, y, { align: "right" });
    pdf.text("Price", pageWidth - 130, y, { align: "right" });
    pdf.text("Total", pageWidth - margin, y, { align: "right" });

    y += 12;
    pdf.setDrawColor(235);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 16;
    pdf.setFont("helvetica", "normal");

    items.forEach((item) => {
      const lineTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
      const itemName = item.name || "Untitled item";
      const wrappedName = pdf.splitTextToSize(itemName, pageWidth - 290);
      pdf.text(wrappedName, margin, y);
      pdf.text(String(item.quantity || 0), pageWidth - 200, y, { align: "right" });
      pdf.text((item.price || 0).toFixed(2), pageWidth - 130, y, { align: "right" });
      pdf.text(lineTotal.toFixed(2), pageWidth - margin, y, { align: "right" });
      y += Math.max(18, wrappedName.length * 13);
    });

    y += 4;
    pdf.setDrawColor(235);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 20;

    const totalsX = pageWidth - margin;
    pdf.text(`Subtotal: ${subtotal.toFixed(2)}`, totalsX, y, { align: "right" });
    y += 16;
    if (gstEnabled) {
      pdf.text(`GST (${gstRate}%): ${gstAmount.toFixed(2)}`, totalsX, y, { align: "right" });
      y += 16;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(`Grand Total: ${grandTotal.toFixed(2)}`, totalsX, y, { align: "right" });

    pdf.save(`${(invoiceNumber || "invoice").replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-6">
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
              reader.onload = () => setLogoDataUrl(String(reader.result ?? ""));
              reader.readAsDataURL(file);
            }}
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setLogoDataUrl("");
            }}
          >
            Remove logo
          </button>
          <button type="button" className="btn btn-primary" onClick={downloadPdf}>
            Download PDF
          </button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Business details</h3>
          <div className="space-y-3">
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="field" />
            <input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="GST number (optional)" className="field" />
            <textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Business address" className="field min-h-20" />
            <input value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="Phone number" className="field" />
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Customer details</h3>
          <div className="space-y-3">
            <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Buyer name" className="field" />
            <textarea value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} placeholder="Buyer address" className="field min-h-20" />
            <input value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)} placeholder="Buyer phone / email" className="field" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="Invoice number" className="field" />
        <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="field" />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="field" />
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Invoice items</h3>
          <button type="button" className="btn btn-secondary" onClick={addItemRow}>
            + Add item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                <th className="py-2 pr-2">Item name</th>
                <th className="py-2 pr-2">Quantity</th>
                <th className="py-2 pr-2">Price</th>
                <th className="py-2 pr-2">Line total</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const lineTotal = (item.quantity || 0) * (item.price || 0);
                return (
                  <tr key={item.id} className="border-b" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2 pr-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        placeholder="Item name"
                        className="field"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className="field"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", e.target.value)}
                        className="field"
                      />
                    </td>
                    <td className="py-2 pr-2 font-medium">{formatCurrency(lineTotal)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        className="rounded-lg border px-3 py-2 text-xs"
                        style={{ borderColor: "var(--border)" }}
                        onClick={() => removeItemRow(item.id)}
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
          <h3 className="mb-3 text-base font-semibold">Tax settings</h3>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={(e) => setGstEnabled(e.target.checked)}
            />
            Apply GST
          </label>
          <input
            type="number"
            min={0}
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            disabled={!gstEnabled}
            className="field"
            placeholder="GST rate %"
          />
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Totals</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted)" }}>GST {gstEnabled ? `(${gstRate}%)` : "(off)"}</span>
              <strong>{formatCurrency(gstAmount)}</strong>
            </div>
            <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: "var(--border)" }}>
              <span className="font-semibold">Grand total</span>
              <strong className="text-base">{formatCurrency(grandTotal)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 text-black sm:p-6" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center gap-3">
            {logoDataUrl ? <img src={logoDataUrl} alt="Business logo" className="h-14 w-14 rounded-lg border object-cover" /> : null}
            <div>
              <p className="text-xl font-bold">{businessName || "Business Name"}</p>
              {gstNumber ? <p className="text-sm text-gray-600">GST: {gstNumber}</p> : null}
              <p className="text-sm text-gray-600 whitespace-pre-line">{businessAddress}</p>
              <p className="text-sm text-gray-600">{businessPhone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold tracking-wide">INVOICE</p>
            <p className="text-sm text-gray-700">Invoice #: {invoiceNumber || "-"}</p>
            <p className="text-sm text-gray-700">Date: {invoiceDate || "-"}</p>
            <p className="text-sm text-gray-700">Due: {dueDate || "-"}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bill To</p>
            <p className="mt-1 font-semibold">{buyerName || "Customer Name"}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{buyerAddress}</p>
            <p className="text-sm text-gray-600">{buyerContact}</p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "#e5e7eb" }}>
                <th className="py-2 pr-2">Item</th>
                <th className="py-2 pr-2 text-right">Qty</th>
                <th className="py-2 pr-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const lineTotal = (item.quantity || 0) * (item.price || 0);
                return (
                  <tr key={`preview-${item.id}`} className="border-b" style={{ borderColor: "#f0f0f0" }}>
                    <td className="py-2 pr-2">{item.name || "Untitled item"}</td>
                    <td className="py-2 pr-2 text-right">{item.quantity || 0}</td>
                    <td className="py-2 pr-2 text-right">{formatCurrency(item.price || 0)}</td>
                    <td className="py-2 text-right font-medium">{formatCurrency(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-auto w-full max-w-sm space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {gstEnabled ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">GST ({gstRate}%)</span>
              <span>{formatCurrency(gstAmount)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t pt-2 text-base font-bold" style={{ borderColor: "#e5e7eb" }}>
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
