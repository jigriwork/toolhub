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
    slug: "how-to-make-gst-invoice-online",
    title: "How to Make a GST Invoice Online (Practical Guide)",
    description:
      "A practical GST invoicing guide for businesses that need cleaner billing, correct tax split, and faster payment collection.",
    excerpt:
      "Learn the exact structure of a GST-ready invoice and avoid common mistakes before sending bills to customers.",
    publishedAt: "2026-03-29",
    toolSlugs: ["invoice-generator", "gst-billing-helper", "receipt-generator"],
    sections: [
      {
        heading: "Start with business compliance details",
        paragraphs: [
          "A GST invoice should begin with your legal business identity: registered business name, GSTIN, address, and contact details. If these fields are incomplete, customers and accountants often reject the document for records.",
          "Use one consistent invoice format across all clients. Consistency builds trust and makes your monthly filing workflow significantly easier.",
        ],
      },
      {
        heading: "Add customer and place-of-supply details correctly",
        paragraphs: [
          "For GST billing, place of supply is important because it decides whether you apply CGST/SGST or IGST. Enter customer billing details clearly before adding line items.",
          "If your team is unsure about tax split, run values through the GST Billing Helper first and then move to final invoice creation.",
        ],
      },
      {
        heading: "Build item rows that are audit-friendly",
        paragraphs: [
          "Each row should contain item name, quantity, unit price, and line total. Vague labels create disputes and slow down payment approval from procurement teams.",
          "Where applicable, mention HSN/SAC context and keep invoice numbering sequential for better traceability.",
        ],
      },
      {
        heading: "Close with payment instructions and follow-up workflow",
        paragraphs: [
          "Always include due date, accepted payment method (UPI, bank transfer, cash), and terms. This reduces customer confusion and speeds up collections.",
          "After payment, issue a receipt linked to the same invoice number so your billing and accounting records stay aligned.",
        ],
      },
    ],
  },
  {
    slug: "how-to-create-quotation-for-clients",
    title: "How to Create a Quotation for Clients That Gets Approved",
    description:
      "A step-by-step guide to writing professional client quotations with clear scope, pricing, terms, and conversion-ready structure.",
    excerpt:
      "Improve quote approval rates by making pricing and deliverables easy to understand from the first draft.",
    publishedAt: "2026-03-28",
    toolSlugs: ["quotation-generator", "proforma-invoice-generator", "invoice-generator"],
    sections: [
      {
        heading: "Define client requirement and scope before pricing",
        paragraphs: [
          "Before entering numbers, lock scope clearly: what is included, what is optional, and what is out-of-scope. This one step prevents revisions and discount pressure later.",
          "If your service is modular, separate base package and add-ons in different rows so clients can decide faster.",
        ],
      },
      {
        heading: "Use a structured quotation layout",
        paragraphs: [
          "A high-trust quotation includes quote number, date, client details, line-item pricing, subtotal, discount, tax, and final total. Keep this order fixed in every quote.",
          "Also include quote validity (for example 7 or 15 days) so pricing discussions stay under control.",
        ],
      },
      {
        heading: "Add terms that reduce back-and-forth",
        paragraphs: [
          "Mention delivery timeline, payment milestone, revision limits, and payment mode. These terms help clients approve faster because operational details are already clear.",
          "For pre-sales formalization, a proforma invoice can be shared after quotation acceptance.",
        ],
      },
      {
        heading: "Convert approved quotation into billing flow",
        paragraphs: [
          "Once approved, convert quotation details into invoice with minimal changes so the client sees continuity and professionalism.",
          "Keep references between quotation and invoice numbers for internal tracking and dispute prevention.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-festival-posts-for-business",
    title: "How to Make Festival Posts for Business Marketing",
    description:
      "Create festival creatives that look premium, stay on-brand, and help local businesses get stronger social reach.",
    excerpt:
      "Use better visual hierarchy, campaign messaging, and posting flow to make festival posts perform better.",
    publishedAt: "2026-03-27",
    toolSlugs: ["festival-post-generator", "instagram-caption-generator", "whatsapp-template-builder"],
    sections: [
      {
        heading: "Choose campaign objective before design",
        paragraphs: [
          "Festival posts should serve a clear goal: brand recall, festive greetings, or direct offer conversion. Design decisions become easier when objective is defined first.",
          "For conversion-focused campaigns, place offer or CTA as a visible text block rather than only in caption.",
        ],
      },
      {
        heading: "Use a premium visual hierarchy",
        paragraphs: [
          "Keep one main headline, one support line, and one contact CTA. Too many decorative elements weaken readability, especially on mobile feeds.",
          "Use consistent brand colors and logo placement so every festive post strengthens identity over time.",
        ],
      },
      {
        heading: "Pair visuals with smarter caption strategy",
        paragraphs: [
          "Many businesses publish good visuals with weak captions. Use caption tools to generate tone-specific lines and campaign hashtags.",
          "A strong caption should include value, urgency (if offer-based), and one clear action for the customer.",
        ],
      },
      {
        heading: "Repurpose posts for WhatsApp distribution",
        paragraphs: [
          "After social posting, reuse the same campaign in WhatsApp outreach with a short offer message and direct response trigger.",
          "This cross-channel reuse gives better returns from the same creative work.",
        ],
      },
    ],
  },
  {
    slug: "how-to-create-retail-offer-posters",
    title: "How to Create Retail Offer Posters That Convert",
    description:
      "Build retail offer posters with stronger pricing communication, visual contrast, and campaign-ready export formats.",
    excerpt:
      "A practical poster checklist for shops and local brands running discounts, combo deals, and festival offers.",
    publishedAt: "2026-03-26",
    toolSlugs: ["offer-poster-generator", "festival-post-generator", "whatsapp-link-generator"],
    sections: [
      {
        heading: "Lead with offer clarity, not decoration",
        paragraphs: [
          "Customers should understand offer type in the first glance: flat discount, percentage discount, buy-one-get-one, or bundle pricing.",
          "Prioritize price communication first, then festive/seasonal visuals as support.",
        ],
      },
      {
        heading: "Use contrast and spacing for readability",
        paragraphs: [
          "Retail posters fail when text and background blend together. Use strong contrast and enough spacing between headline, offer, and contact blocks.",
          "Keep typography hierarchy consistent: headline > offer value > validity > CTA.",
        ],
      },
      {
        heading: "Add business trust anchors",
        paragraphs: [
          "Include shop name, phone, and location or ordering channel. A poster without trust anchors gets lower response, even with strong discounts.",
          "When relevant, attach a direct WhatsApp link or QR for instant inquiry.",
        ],
      },
      {
        heading: "Export by channel and test quickly",
        paragraphs: [
          "Prepare platform-wise sizes for stories, feed posts, and print displays. One-size exports often reduce quality or crop key details.",
          "Publish, track response, and iterate weekly with fresh headlines for better retail campaign performance.",
        ],
      },
    ],
  },
  {
    slug: "how-to-use-whatsapp-tools-for-business-marketing",
    title: "How to Use WhatsApp Tools for Business Marketing",
    description:
      "Use WhatsApp links, templates, and campaign assets together to create faster outreach and higher conversion conversations.",
    excerpt:
      "A practical WhatsApp marketing workflow for local businesses, service teams, and online sellers.",
    publishedAt: "2026-03-25",
    toolSlugs: ["whatsapp-link-generator", "whatsapp-template-builder", "upi-qr-generator"],
    sections: [
      {
        heading: "Start with click-to-chat entry points",
        paragraphs: [
          "Use a WhatsApp link generator to create clean wa.me links with optional prefilled intent messages. Add these links to posters, bio pages, and campaign creatives.",
          "Prefilled messages reduce friction because customers can start conversations without typing context manually.",
        ],
      },
      {
        heading: "Prepare message templates for speed and consistency",
        paragraphs: [
          "Template-based replies improve response speed and maintain professional tone for every inquiry. Keep separate templates for offers, follow-ups, reminders, and after-sales support.",
          "Include dynamic placeholders like name, amount, due date, and offer expiry for personalization.",
        ],
      },
      {
        heading: "Pair campaign creatives with conversation CTA",
        paragraphs: [
          "Festival and offer posters should always include clear WhatsApp CTA. Creative without chat CTA loses high-intent leads.",
          "Add short replies such as 'Reply OFFER for details' to increase message engagement rates.",
        ],
      },
      {
        heading: "Close transactions faster with payment tools",
        paragraphs: [
          "For quick conversions, share UPI QR after customer confirmation and issue receipts after payment.",
          "This creates a simple end-to-end flow: awareness → chat → payment → confirmation.",
        ],
      },
    ],
  },
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
