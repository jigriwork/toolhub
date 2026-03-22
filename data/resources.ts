export type ResourceSection = {
  heading: string;
  paragraphs: string[];
};

export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  toolSlugs: string[];
  sections: ResourceSection[];
};

export const resources: ResourceArticle[] = [
  {
    slug: "how-to-create-invoice-online",
    title: "How to Create an Invoice Online (Step-by-Step)",
    description:
      "Learn how to create a professional GST-ready invoice online with the right fields, item structure, tax setup, and export workflow.",
    excerpt:
      "A practical guide for small businesses and freelancers to generate clean invoices quickly and avoid billing mistakes.",
    publishedAt: "2026-03-20",
    toolSlugs: ["invoice-generator", "gst-billing-helper", "receipt-generator"],
    sections: [
      {
        heading: "1) Add business identity first",
        paragraphs: [
          "Start every invoice with your business name, GST number (if applicable), address, and contact details. This improves trust and makes the invoice usable for compliance and bookkeeping.",
          "If you invoice repeatedly, keep your branding and contact format consistent so customers can identify your bills instantly.",
        ],
      },
      {
        heading: "2) Add customer details and supply location",
        paragraphs: [
          "Enter customer name, contact information, and billing address. For GST billing, place of supply matters because intrastate and interstate taxes are calculated differently.",
          "Use the GST helper first if you are unsure about CGST/SGST versus IGST split.",
        ],
      },
      {
        heading: "3) Build item rows correctly",
        paragraphs: [
          "Each line item should include clear item name, quantity, unit price, and line total. Avoid vague names like ‘service charges’ when more context can be added.",
          "Accurate itemization reduces payment disputes and helps faster reconciliation.",
        ],
      },
      {
        heading: "4) Apply tax, terms, and payment instructions",
        paragraphs: [
          "After subtotal, apply GST rate and confirm total payable. Add payment due date, accepted payment modes, and notes like late fee terms if needed.",
          "Always include an invoice number and date so each bill remains traceable.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-festival-posters",
    title: "How to Make Festival Posters for Your Business",
    description:
      "Create festive social creatives that look professional, stay on-brand, and convert better with strong offers and visual hierarchy.",
    excerpt:
      "Use ready formats, festive themes, and clear CTA blocks to publish better posters in minutes.",
    publishedAt: "2026-03-19",
    toolSlugs: ["festival-post-generator", "offer-poster-generator", "whatsapp-template-builder"],
    sections: [
      {
        heading: "1) Pick format before design",
        paragraphs: [
          "Start with output format: Instagram post, story, portrait, or landscape. Designing first and resizing later usually breaks composition.",
          "Use fixed format presets so text remains readable on mobile screens.",
        ],
      },
      {
        heading: "2) Keep message simple and visible",
        paragraphs: [
          "Use one main headline, one offer block, and one CTA. Too much text lowers readability and lowers campaign response.",
          "Prioritize essential details: offer validity, discount, and contact channel.",
        ],
      },
      {
        heading: "3) Add brand elements consistently",
        paragraphs: [
          "Use your logo, business name, and contact footer in fixed positions. Consistency builds recognition over multiple posts.",
          "If you publish daily posters, save your preferred text positions and colors as your default style.",
        ],
      },
      {
        heading: "4) Distribute fast",
        paragraphs: [
          "After export, reuse the same campaign message in WhatsApp follow-ups for faster reach. Pair visual creatives with clear message templates for better conversion.",
        ],
      },
    ],
  },
  {
    slug: "best-free-business-tools",
    title: "Best Free Business Tools for Daily Operations",
    description:
      "A curated list of practical free tools for billing, pricing, purchase operations, and customer communication.",
    excerpt:
      "If you run a local business, these tools can reduce manual effort in invoicing, estimates, receipts, and messaging.",
    publishedAt: "2026-03-18",
    toolSlugs: [
      "quotation-generator",
      "invoice-generator",
      "receipt-generator",
      "purchase-order-generator",
      "profit-pricing-calculator",
      "whatsapp-template-builder",
    ],
    sections: [
      {
        heading: "Billing and sales documents",
        paragraphs: [
          "Use quotation and invoice tools together: send estimate first, then convert details into final bill. This keeps sales workflow organized and quick.",
          "Use receipt generator for payment acknowledgment when customers pay by cash, UPI, or transfer.",
        ],
      },
      {
        heading: "Purchase and inventory planning",
        paragraphs: [
          "For supplier operations, use purchase order documents with expected delivery and status tracking. It helps avoid confusion in repeated procurement.",
          "If you need better selling decisions, run your cost and margin through a pricing calculator before publishing offers.",
        ],
      },
      {
        heading: "Customer communication",
        paragraphs: [
          "Prepared WhatsApp templates reduce response time and maintain consistent tone across reminders, promotions, and support messages.",
          "Use prebuilt placeholders for name, amount, and due date to personalize outreach quickly.",
        ],
      },
    ],
  },
  {
    slug: "how-to-create-quotation",
    title: "How to Create a Quotation That Gets Approved Faster",
    description:
      "Learn the structure of a professional quotation with pricing clarity, taxes, terms, and approval-friendly layout.",
    excerpt:
      "Avoid common estimate mistakes and send cleaner quotations that reduce back-and-forth.",
    publishedAt: "2026-03-17",
    toolSlugs: ["quotation-generator", "proforma-invoice-generator", "invoice-generator"],
    sections: [
      {
        heading: "Use a clear estimate structure",
        paragraphs: [
          "A strong quotation includes customer details, quote number/date, line items, subtotal, discount, tax, and final amount. Keep sequence consistent in every quote.",
          "Mention validity period so pricing disputes are minimized.",
        ],
      },
      {
        heading: "Write line items like a proposal",
        paragraphs: [
          "Line item names should explain scope, not just product labels. This helps buyers compare value quickly and approve without multiple clarification calls.",
        ],
      },
      {
        heading: "Separate quotation and invoice intent",
        paragraphs: [
          "Quotation is pre-sale intent; invoice is final billing. If you need a pre-sales formal document, use proforma invoice format with clear labeling.",
        ],
      },
    ],
  },
  {
    slug: "how-to-use-gst-invoice-generator",
    title: "How to Use a GST Invoice Generator Correctly",
    description:
      "A practical GST invoicing checklist for small businesses in India, including tax split, supply location, and clean export handling.",
    excerpt:
      "Get GST-ready invoices with fewer mistakes by following this short compliance-focused workflow.",
    publishedAt: "2026-03-16",
    toolSlugs: ["gst-billing-helper", "invoice-generator", "pos-mvp"],
    sections: [
      {
        heading: "Step 1: Validate business and customer tax details",
        paragraphs: [
          "Ensure GSTIN format is correct, especially for B2B invoices. Invalid GST data creates filing issues and reconciliation delays.",
        ],
      },
      {
        heading: "Step 2: Select the right tax split",
        paragraphs: [
          "Use CGST+SGST for intrastate supply and IGST for interstate supply. The GST helper simplifies this split before final invoice creation.",
        ],
      },
      {
        heading: "Step 3: Export and archive safely",
        paragraphs: [
          "Download invoice PDFs with clear numbering and store them in monthly folders. This habit improves filing readiness and audit response time.",
          "If you bill in-store frequently, use POS billing and export summaries for day-close records.",
        ],
      },
    ],
  },
];

export const getResourceBySlug = (slug: string) =>
  resources.find((resource) => resource.slug === slug);
