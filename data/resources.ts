export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  toolSlugs: string[];
  content: string[];
};

export const resources: ResourceArticle[] = [
  {
    slug: "how-to-write-seo-meta-descriptions",
    title: "How to Write SEO Meta Descriptions That Actually Improve CTR",
    description:
      "Learn practical steps to craft concise, compelling meta descriptions using ToolHub text and SEO tools.",
    excerpt:
      "Meta descriptions can be short but strategic. Here is a practical framework with examples.",
    publishedAt: "2026-03-01",
    toolSlugs: ["character-counter", "word-counter", "slug-generator"],
    content: [
      "Strong meta descriptions combine intent, clarity, and a subtle call to action. Keep them concise and user-focused.",
      "Use the Character Counter to stay inside optimal length ranges and avoid SERP truncation on mobile devices.",
      "Draft variants quickly, then test which phrasing better matches search intent and page purpose.",
    ],
  },
  {
    slug: "image-optimization-checklist-for-fast-websites",
    title: "Image Optimization Checklist for Faster Websites",
    description:
      "A practical image workflow using compressor, resizer, and converter tools for better performance.",
    excerpt:
      "Images often dominate page size. This checklist helps reduce bytes without hurting quality.",
    publishedAt: "2026-03-02",
    toolSlugs: ["image-compressor", "image-resizer", "webp-converter"],
    content: [
      "Start with correct dimensions. Oversized assets are the fastest way to lose Core Web Vitals performance.",
      "Compress intelligently, then convert to modern formats like WebP where browser support is strong.",
      "Use before/after previews to ensure quality remains acceptable while reducing file size significantly.",
    ],
  },
  {
    slug: "json-formatting-best-practices-for-debugging",
    title: "JSON Formatting Best Practices for Debugging and APIs",
    description:
      "Use JSON formatting workflows to reduce errors and speed up development reviews.",
    excerpt:
      "Readable JSON saves debugging time and reduces integration mistakes across teams.",
    publishedAt: "2026-03-03",
    toolSlugs: ["json-formatter", "uuid-generator", "password-generator"],
    content: [
      "Always validate payloads before sending them to APIs, especially when nesting objects deeply.",
      "Pretty-printing JSON improves code reviews and issue triage, while minification helps payload efficiency.",
      "Generate stable test identifiers with UUIDs for reproducible QA and logging workflows.",
    ],
  },
  {
    slug: "smart-loan-planning-with-emi-and-interest-tools",
    title: "Smart Loan Planning With EMI and Interest Calculators",
    description:
      "Compare repayment scenarios and interest impact before committing to a loan.",
    excerpt:
      "A few input changes can significantly alter total loan cost over time.",
    publishedAt: "2026-03-04",
    toolSlugs: ["emi-calculator", "loan-calculator", "percentage-calculator"],
    content: [
      "When evaluating loans, monthly EMI alone is not enough; total interest burden matters just as much.",
      "Use multiple tenures and rate combinations to identify the best balance of affordability and total cost.",
      "Track percentage differences between options to make objective financial decisions.",
    ],
  },
  {
    slug: "content-cleanup-workflow-for-writers-and-marketers",
    title: "Content Cleanup Workflow for Writers and Marketing Teams",
    description:
      "Clean, normalize, and repurpose text quickly with practical formatting tools.",
    excerpt:
      "A structured text cleanup workflow helps teams publish faster with fewer quality issues.",
    publishedAt: "2026-03-05",
    toolSlugs: ["remove-extra-spaces", "text-case-converter", "text-repeater"],
    content: [
      "First remove spacing noise from copied drafts to reduce manual editing effort.",
      "Then normalize heading and sentence styles with text case conversion for consistency.",
      "Use repeater and counters for templates, QA checks, and publishing automation prep.",
    ],
  },
];

export const getResourceBySlug = (slug: string) =>
  resources.find((resource) => resource.slug === slug);
