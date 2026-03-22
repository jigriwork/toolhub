"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; sku: string; price: number; tax: number; stock: number };
type CartLine = { id: string; productId: string; name: string; qty: number; price: number; tax: number };

const POS_PRODUCTS_KEY = "toolhub-pos-products";
const POS_SUMMARY_KEY = "toolhub-pos-summary";

const inr = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

function loadProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const rawProducts = localStorage.getItem(POS_PRODUCTS_KEY);
  if (!rawProducts) return [];

  try {
    const parsed = JSON.parse(rawProducts) as Product[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (p) =>
        typeof p?.id === "string" &&
        typeof p?.name === "string" &&
        typeof p?.sku === "string" &&
        typeof p?.price === "number" &&
        typeof p?.tax === "number" &&
        typeof p?.stock === "number",
    );
  } catch {
    return [];
  }
}

function loadSummary() {
  if (typeof window === "undefined") return { salesTotal: 0, salesCount: 0 };
  const rawSummary = localStorage.getItem(POS_SUMMARY_KEY);
  if (!rawSummary) return { salesTotal: 0, salesCount: 0 };

  try {
    const parsed = JSON.parse(rawSummary) as { salesTotal?: number; salesCount?: number };
    return {
      salesTotal: typeof parsed.salesTotal === "number" ? parsed.salesTotal : 0,
      salesCount: typeof parsed.salesCount === "number" ? parsed.salesCount : 0,
    };
  } catch {
    return { salesTotal: 0, salesCount: 0 };
  }
}

const initialSummary = loadSummary();

export function PosMvpTool() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newTax, setNewTax] = useState(5);
  const [newStock, setNewStock] = useState(1);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [salesTotal, setSalesTotal] = useState(initialSummary.salesTotal);
  const [salesCount, setSalesCount] = useState(initialSummary.salesCount);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cashierRole, setCashierRole] = useState<"owner" | "cashier">("owner");
  const [returnsAmount, setReturnsAmount] = useState(0);
  const [cash, setCash] = useState(0);
  const [upi, setUpi] = useState(0);
  const [card, setCard] = useState(0);
  const [openingCash, setOpeningCash] = useState(0);
  const [closingCash, setClosingCash] = useState(0);
  const [lastBill, setLastBill] = useState<{ no: string; date: string; customer: string; lines: CartLine[]; grand: number } | null>(null);

  useEffect(() => {
    localStorage.setItem(POS_PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(POS_SUMMARY_KEY, JSON.stringify({ salesTotal, salesCount, at: Date.now() }));
  }, [salesCount, salesTotal]);

  const addToCart = (p: Product) => {
    if (p.stock <= 0) return;
    setCart((curr) => {
      const exists = curr.find((c) => c.productId === p.id);
      if (exists) {
        if (exists.qty >= p.stock) return curr;
        return curr.map((c) => (c.productId === p.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...curr, { id: crypto.randomUUID(), productId: p.id, name: p.name, qty: 1, price: p.price, tax: p.tax }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((curr) => {
      const line = curr.find((x) => x.id === id);
      if (!line) return curr;
      const product = products.find((p) => p.id === line.productId);
      const nextQty = Math.max(0, line.qty + delta);
      if (product && nextQty > product.stock) return curr;

      return curr
        .map((existing) => (existing.id === id ? { ...existing, qty: nextQty } : existing))
        .filter((existing) => existing.qty > 0);
    });
  };

  const addInventoryItem = () => {
    if (!newName.trim() || newPrice <= 0) return;
    setProducts((curr) => [
      ...curr,
      {
        id: crypto.randomUUID(),
        name: newName.trim(),
        sku: newSku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
        price: Math.max(0, newPrice),
        tax: Math.max(0, newTax),
        stock: Math.max(0, newStock),
      },
    ]);
    setNewName("");
    setNewSku("");
    setNewPrice(0);
    setNewTax(5);
    setNewStock(1);
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
    const tax = cart.reduce((s, c) => s + (c.qty * c.price * c.tax) / 100, 0);
    return { subtotal, tax, grand: subtotal + tax };
  }, [cart]);

  const netGrand = Math.max(0, totals.grand - returnsAmount);
  const splitTotal = cash + upi + card;
  const expectedCash = openingCash + cash - returnsAmount;
  const cashVariance = closingCash - expectedCash;

  const checkout = () => {
    if (!cart.length) return;
    if (splitTotal !== netGrand) return;

    setProducts((curr) =>
      curr.map((p) => {
        const line = cart.find((c) => c.productId === p.id);
        if (!line) return p;
        return { ...p, stock: Math.max(0, p.stock - line.qty) };
      }),
    );
    setSalesTotal((v) => v + netGrand);
    setSalesCount((v) => v + 1);
    setLastBill({
      no: `BILL-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString("en-IN"),
      customer: customerName.trim() || "Walk-in Customer",
      lines: cart,
      grand: netGrand,
    });
    setCart([]);
    setCash(0);
    setUpi(0);
    setCard(0);
    setReturnsAmount(0);
    window.print();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--card), transparent 10%)" }}>
        <h3 className="text-base font-semibold">Live POS workspace</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          No demo items are preloaded. Add your real products and run billing safely for live use.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}><p className="text-sm" style={{ color: "var(--muted)" }}>Catalog items</p><p className="text-xl font-bold">{products.length}</p></div>
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}><p className="text-sm" style={{ color: "var(--muted)" }}>Bills today</p><p className="text-xl font-bold">{salesCount}</p></div>
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}><p className="text-sm" style={{ color: "var(--muted)" }}>Revenue today</p><p className="text-xl font-bold">{inr(salesTotal)}</p></div>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-3 text-base font-semibold">Inventory management</h3>
        <p className="mb-3 text-xs" style={{ color: "var(--muted)" }}>
          Add only real SKU entries. Product list is saved in your browser local storage.
        </p>
        <div className="grid gap-2 md:grid-cols-6">
          <input className="field md:col-span-2" placeholder="Product name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className="field" placeholder="SKU" value={newSku} onChange={(e) => setNewSku(e.target.value)} />
          <input className="field" type="number" min={0} placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} />
          <input className="field" type="number" min={0} placeholder="Tax %" value={newTax} onChange={(e) => setNewTax(Number(e.target.value))} />
          <input className="field" type="number" min={0} placeholder="Stock" value={newStock} onChange={(e) => setNewStock(Number(e.target.value))} />
        </div>
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={addInventoryItem}>+ Add to inventory</button>
            <button type="button" className="btn btn-secondary" onClick={() => setProducts([])} disabled={products.length === 0}>Clear inventory</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Product catalog</h3>
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              Inventory is empty. Add products above to start billing.
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="font-medium">{p.name} <span className="text-xs text-slate-500">({p.sku})</span></p>
                    <p className="text-xs text-slate-500">{inr(p.price)} · GST {p.tax}% · Stock {p.stock}{p.stock <= 3 ? " · Low stock" : ""}</p>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={() => addToCart(p)} disabled={p.stock <= 0}>Add</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold">Billing</h3>
          <div className="mb-3 grid gap-2 md:grid-cols-2">
            <input className="field" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
            <input className="field" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Customer phone" />
            <label className="text-sm">Role
              <select className="select" value={cashierRole} onChange={(e) => setCashierRole(e.target.value as "owner" | "cashier")}>
                <option value="owner">Owner</option>
                <option value="cashier">Cashier</option>
              </select>
            </label>
            <label className="text-sm">Returns/refunds
              <input className="field" type="number" min={0} value={returnsAmount} onChange={(e) => setReturnsAmount(Number(e.target.value))} />
            </label>
          </div>
          <div className="space-y-2">
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500">No items in cart.</p>
            ) : (
              cart.map((line) => (
                <div key={line.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p>{line.name} × {line.qty}</p>
                    <div className="mt-1 flex gap-1">
                      <button type="button" className="btn btn-secondary" onClick={() => updateQty(line.id, -1)}>-</button>
                      <button type="button" className="btn btn-secondary" onClick={() => updateQty(line.id, 1)}>+</button>
                    </div>
                  </div>
                  <p className="font-medium">{inr(line.qty * line.price)}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Subtotal</span><strong>{inr(totals.subtotal)}</strong></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>GST</span><strong>{inr(totals.tax)}</strong></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Returns</span><strong>- {inr(returnsAmount)}</strong></div>
            <div className="flex justify-between border-t pt-2" style={{ borderColor: "var(--border)" }}><span className="font-semibold">Net total</span><strong>{inr(netGrand)}</strong></div>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input className="field" type="number" min={0} value={cash} onChange={(e) => setCash(Number(e.target.value))} placeholder="Cash" />
            <input className="field" type="number" min={0} value={upi} onChange={(e) => setUpi(Number(e.target.value))} placeholder="UPI" />
            <input className="field" type="number" min={0} value={card} onChange={(e) => setCard(Number(e.target.value))} placeholder="Card" />
          </div>
          <p className="mt-2 text-sm" style={{ color: splitTotal === netGrand ? "#166534" : "#b45309" }}>
            Payment split total: <strong>{inr(splitTotal)}</strong> {splitTotal === netGrand ? "✓ matches bill" : "⚠ mismatch"}
          </p>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <input className="field" type="number" min={0} value={openingCash} onChange={(e) => setOpeningCash(Number(e.target.value))} placeholder="Opening cash" />
            <input className="field" type="number" min={0} value={closingCash} onChange={(e) => setClosingCash(Number(e.target.value))} placeholder="Closing cash" />
          </div>
          <p className="mt-1 text-sm">Expected cash: <strong>{inr(expectedCash)}</strong> · Variance: <strong style={{ color: cashVariance === 0 ? "#166534" : "#b91c1c" }}>{inr(cashVariance)}</strong></p>

          <div className="mt-3 flex gap-2">
            <button type="button" className="btn btn-primary" onClick={checkout} disabled={cart.length === 0 || splitTotal !== netGrand}>Checkout + Print</button>
            <button type="button" className="btn btn-secondary" onClick={() => setCart([])}>Clear</button>
          </div>
        </div>
      </section>

      {lastBill && (
        <section className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-2 text-base font-semibold">Last bill preview</h3>
          <p>Bill No: <strong>{lastBill.no}</strong> · {lastBill.date}</p>
          <p>Customer: <strong>{lastBill.customer}</strong> {customerPhone ? `· ${customerPhone}` : ""} · Role: <strong>{cashierRole}</strong></p>
          <div className="mt-2 space-y-1">
            {lastBill.lines.map((l) => (
              <p key={l.id}>{l.name} × {l.qty} = {inr(l.qty * l.price)}</p>
            ))}
          </div>
          <p className="mt-2 font-semibold">Grand Total: {inr(lastBill.grand)}</p>
        </section>
      )}
    </div>
  );
}
