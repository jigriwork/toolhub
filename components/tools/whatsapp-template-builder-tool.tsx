"use client";

import { useMemo, useState } from "react";

type TemplateKey = "offer" | "follow-up" | "payment-reminder" | "festival-greeting";

const templates: Record<TemplateKey, string> = {
  offer:
    "Hi {{name}}, special offer from {{business}} 🎉 Get {{offer}} valid till {{dueDate}}. Tap here: {{link}}",
  "follow-up":
    "Hi {{name}}, just checking in from {{business}}. Were you able to review our proposal of {{amount}}?",
  "payment-reminder":
    "Hi {{name}}, reminder from {{business}}: pending amount {{amount}} due by {{dueDate}}. Payment link: {{link}}",
  "festival-greeting":
    "Hi {{name}}, {{business}} wishes you a very happy {{festival}}! Thanks for your support 🙏",
};

export function WhatsappTemplateBuilderTool() {
  const [template, setTemplate] = useState<TemplateKey>("offer");
  const [name, setName] = useState("Customer");
  const [business, setBusiness] = useState("ToolHub Services");
  const [amount, setAmount] = useState("₹2,500");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [link, setLink] = useState("https://toolhubsite.in");
  const [offer, setOffer] = useState("15% OFF");
  const [festival, setFestival] = useState("Diwali");
  const [phone, setPhone] = useState("919999999999");

  const message = useMemo(
    () =>
      templates[template]
        .replaceAll("{{name}}", name)
        .replaceAll("{{business}}", business)
        .replaceAll("{{amount}}", amount)
        .replaceAll("{{dueDate}}", dueDate)
        .replaceAll("{{link}}", link)
        .replaceAll("{{offer}}", offer)
        .replaceAll("{{festival}}", festival),
    [amount, business, dueDate, festival, link, name, offer, template],
  );

  const waUrl = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="space-y-5">
      <section className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">
          Template
          <select className="select" value={template} onChange={(e) => setTemplate(e.target.value as TemplateKey)}>
            <option value="offer">Offer</option>
            <option value="follow-up">Follow-up</option>
            <option value="payment-reminder">Payment reminder</option>
            <option value="festival-greeting">Festival greeting</option>
          </select>
        </label>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" />
        <input className="field" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business" />
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <input className="field" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input type="date" className="field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input className="field" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Offer line" />
        <input className="field" value={festival} onChange={(e) => setFestival(e.target.value)} placeholder="Festival name" />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <input className="field" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" />
        <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp number" />
      </section>

      <textarea className="textarea min-h-[180px]" value={message} readOnly />

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(message)}>
          Copy message
        </button>
        <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
          Open in WhatsApp
        </a>
      </div>
    </div>
  );
}
