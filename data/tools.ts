export const toolCategories = [
  "Text",
  "Image",
  "Utility",
  "SEO",
  "Developer",
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export type ToolFaq = {
  question: string;
  answer: string;
};

export type Tool = {
  name: string;
  slug: string;
  description: string;
  seoDescription: string;
  category: ToolCategory;
  featured?: boolean;
  faqs: ToolFaq[];
  related: string[];
};

export const tools: Tool[] = [
  {
    name: "Word Counter",
    slug: "word-counter",
    description:
      "Count words, characters, sentences, paragraphs, and reading time instantly.",
    seoDescription:
      "Free online word counter to measure words, characters, paragraphs, sentence count, and reading time in real time.",
    category: "Text",
    featured: true,
    related: ["character-counter", "remove-extra-spaces", "text-case-converter"],
    faqs: [
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time is estimated using an average speed of around 200 words per minute.",
      },
      {
        question: "Does this word counter work offline?",
        answer:
          "Yes. The calculation happens in your browser, so the tool remains fast and private.",
      },
    ],
  },
  {
    name: "Character Counter",
    slug: "character-counter",
    description: "Count characters with and without spaces for copywriting and SEO.",
    seoDescription:
      "Online character counter tool for social posts, meta titles, descriptions, and content length checks.",
    category: "SEO",
    featured: true,
    related: ["word-counter", "remove-extra-spaces", "text-repeater"],
    faqs: [
      {
        question: "Can I count characters without spaces?",
        answer:
          "Yes. This tool provides both total characters and characters excluding spaces.",
      },
      {
        question: "Who uses a character counter?",
        answer:
          "Writers, SEO professionals, social media managers, and developers commonly use it.",
      },
    ],
  },
  {
    name: "Remove Extra Spaces",
    slug: "remove-extra-spaces",
    description: "Clean extra spaces, line gaps, and messy text formatting in one click.",
    seoDescription:
      "Remove unwanted spaces and normalize text formatting for cleaner documents, forms, and content editing.",
    category: "SEO",
    related: ["text-case-converter", "word-counter", "text-repeater"],
    faqs: [
      {
        question: "What kind of spaces does it remove?",
        answer:
          "It trims extra spaces between words and around lines while keeping text readable.",
      },
      {
        question: "Can I reset the cleaned output?",
        answer: "Yes. Use Reset to restore original input or Clear to start fresh.",
      },
    ],
  },
  {
    name: "Text Repeater",
    slug: "text-repeater",
    description: "Repeat words or full text lines any number of times instantly.",
    seoDescription:
      "Text repeater tool to duplicate strings, words, or lines with custom repeat count and separators.",
    category: "Text",
    related: ["text-case-converter", "remove-extra-spaces", "character-counter"],
    faqs: [
      {
        question: "Can I add line breaks between repeats?",
        answer:
          "Yes. You can choose a separator such as space, comma, or new line between repetitions.",
      },
      {
        question: "Is there a limit to repeat count?",
        answer:
          "A safe upper limit is applied to keep the tool responsive on mobile and desktop.",
      },
    ],
  },
  {
    name: "Text Case Converter",
    slug: "text-case-converter",
    description:
      "Convert text to lowercase, uppercase, sentence case, or capitalize words.",
    seoDescription:
      "Convert text case instantly with lowercase, uppercase, sentence case, and title-style capitalization.",
    category: "Text",
    featured: true,
    related: ["remove-extra-spaces", "word-counter", "text-repeater"],
    faqs: [
      {
        question: "Does this tool support large text blocks?",
        answer:
          "Yes, it works with long content and updates in real time directly in your browser.",
      },
      {
        question: "Can I copy the converted text quickly?",
        answer: "Yes, use the Copy button to place output directly into clipboard.",
      },
    ],
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    description:
      "Create secure passwords with length and character type controls.",
    seoDescription:
      "Secure password generator with customizable length, symbols, numbers, uppercase and lowercase options.",
    category: "Developer",
    featured: true,
    related: ["qr-code-generator", "age-calculator", "percentage-calculator"],
    faqs: [
      {
        question: "Are generated passwords random?",
        answer:
          "Yes. The tool uses browser crypto APIs for stronger random generation.",
      },
      {
        question: "Is the password stored anywhere?",
        answer:
          "No, passwords are generated on your device and are not sent to a server.",
      },
    ],
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Calculate exact age in years, months, and days.",
    seoDescription:
      "Simple age calculator to find exact age by date of birth in years, months, and days.",
    category: "Utility",
    featured: true,
    related: ["bmi-calculator", "percentage-calculator", "password-generator"],
    faqs: [
      {
        question: "Can I calculate age for future dates?",
        answer: "No. This tool only accepts valid dates in the past.",
      },
      {
        question: "Is leap year handled?",
        answer: "Yes. Native date operations account for leap years automatically.",
      },
    ],
  },
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    description: "Calculate percentages, increase/decrease values, and compare changes.",
    seoDescription:
      "Percentage calculator for finding X% of Y, percentage change, and increase/decrease quickly.",
    category: "Utility",
    related: ["bmi-calculator", "age-calculator", "word-counter"],
    faqs: [
      {
        question: "What percentage formulas are available?",
        answer:
          "You can calculate percentage of a number and percentage increase/decrease between values.",
      },
      {
        question: "Can I reset all fields quickly?",
        answer: "Yes. Use the Reset button to restore sample values instantly.",
      },
    ],
  },
  {
    name: "BMI Calculator",
    slug: "bmi-calculator",
    description: "Calculate body mass index using height and weight with category result.",
    seoDescription:
      "BMI calculator with instant body mass index result, category classification, and healthy range guidance.",
    category: "Utility",
    related: ["age-calculator", "percentage-calculator", "word-counter"],
    faqs: [
      {
        question: "What units are supported?",
        answer:
          "This version uses kilograms for weight and centimeters for height.",
      },
      {
        question: "Is BMI a medical diagnosis?",
        answer:
          "No. BMI is a screening estimate and should be interpreted with professional guidance.",
      },
    ],
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Generate and download QR codes for text and URLs.",
    seoDescription:
      "Generate high quality QR codes online for links, text, and contact details, then download as PNG.",
    category: "Utility",
    related: ["password-generator", "text-case-converter", "word-counter"],
    faqs: [
      {
        question: "Can I generate QR for website links?",
        answer: "Yes. Paste any URL and generate a downloadable QR image instantly.",
      },
      {
        question: "Does ToolHub store QR data?",
        answer: "No, generation happens in browser without server-side storage.",
      },
    ],
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description:
      "Compress images directly in browser and download optimized results.",
    seoDescription:
      "Free image compressor to reduce image size online while maintaining visual quality, directly in browser.",
    category: "Image",
    featured: true,
    related: ["image-resizer", "jpg-to-png-converter", "png-to-jpg-converter"],
    faqs: [
      {
        question: "Will image quality be reduced?",
        answer:
          "Compression may reduce quality depending on the selected level. You can adjust quality before downloading.",
      },
      {
        question: "Are images uploaded to a server?",
        answer: "No. Compression runs locally in your browser for better privacy.",
      },
    ],
  },
  {
    name: "Image Resizer",
    slug: "image-resizer",
    description: "Resize images to custom width and height and download instantly.",
    seoDescription:
      "Image resizer tool to quickly change image dimensions online with custom width and height settings.",
    category: "Image",
    related: ["image-compressor", "jpg-to-png-converter", "png-to-jpg-converter"],
    faqs: [
      {
        question: "Can I maintain aspect ratio while resizing?",
        answer:
          "Yes. Enable the aspect ratio lock to auto-adjust height with width changes.",
      },
      {
        question: "Which formats are accepted?",
        answer:
          "Common image formats like JPG, PNG, and WebP are supported by modern browsers.",
      },
    ],
  },
  {
    name: "JPG to PNG Converter",
    slug: "jpg-to-png-converter",
    description: "Convert JPG/JPEG images to transparent-friendly PNG format.",
    seoDescription:
      "Convert JPG to PNG online free, fast, and private with in-browser processing and instant download.",
    category: "Image",
    related: ["png-to-jpg-converter", "image-resizer", "image-compressor"],
    faqs: [
      {
        question: "Will image resolution change?",
        answer:
          "No. The converter keeps original pixel dimensions unless edited in another tool.",
      },
      {
        question: "Is file conversion private?",
        answer: "Yes. Conversion happens in browser without cloud upload.",
      },
    ],
  },
  {
    name: "PNG to JPG Converter",
    slug: "png-to-jpg-converter",
    description: "Convert PNG images to lightweight JPG format for web sharing.",
    seoDescription:
      "Convert PNG to JPG online with adjustable quality settings and direct browser processing.",
    category: "Image",
    related: ["jpg-to-png-converter", "image-compressor", "image-resizer"],
    faqs: [
      {
        question: "What happens to PNG transparency?",
        answer:
          "Transparent pixels are flattened against a white background when converted to JPG.",
      },
      {
        question: "Can I control JPG quality?",
        answer: "Yes. You can set output quality before downloading the converted image.",
      },
    ],
  },
  {
    name: "GST Calculator",
    slug: "gst-calculator",
    description: "Calculate GST inclusive and exclusive amounts instantly.",
    seoDescription:
      "GST calculator to compute tax amount, net price, and gross total for common GST slabs.",
    category: "Utility",
    featured: true,
    related: ["discount-calculator", "emi-calculator", "loan-calculator"],
    faqs: [
      {
        question: "Can I calculate GST from inclusive amount?",
        answer:
          "Yes. Enter the gross amount and GST rate to split taxable value and GST component.",
      },
      {
        question: "Which GST rates can I use?",
        answer: "You can enter any rate manually, including 5%, 12%, 18%, or 28%.",
      },
    ],
  },
  {
    name: "EMI Calculator",
    slug: "emi-calculator",
    description: "Calculate monthly EMI, total interest, and total payable amount.",
    seoDescription:
      "EMI calculator for home, car, and personal loans with monthly payment and total interest breakdown.",
    category: "Utility",
    featured: true,
    related: ["loan-calculator", "gst-calculator", "percentage-calculator"],
    faqs: [
      {
        question: "What inputs are required for EMI?",
        answer:
          "You need principal amount, annual interest rate, and loan tenure in months.",
      },
      {
        question: "Is EMI formula accurate?",
        answer:
          "Yes. The standard reducing-balance EMI formula is used for accurate results.",
      },
    ],
  },
  {
    name: "Loan Calculator",
    slug: "loan-calculator",
    description:
      "Estimate monthly payment, interest cost, and total payment for loans.",
    seoDescription:
      "Loan calculator to estimate monthly payment, total interest, and payoff cost quickly.",
    category: "Utility",
    related: ["emi-calculator", "percentage-calculator", "discount-calculator"],
    faqs: [
      {
        question: "What is the difference between EMI and loan calculator?",
        answer:
          "This tool focuses on broad payment insights, while EMI calculator emphasizes monthly installment details.",
      },
      {
        question: "Can I test different interest rates?",
        answer: "Yes. Update rate and tenure values to compare loan scenarios instantly.",
      },
    ],
  },
  {
    name: "Discount Calculator",
    slug: "discount-calculator",
    description: "Calculate discount amount, final price, and savings in one click.",
    seoDescription:
      "Discount calculator for sale price, savings amount, and final payable after percentage discount.",
    category: "Utility",
    related: ["gst-calculator", "percentage-calculator", "currency-converter"],
    faqs: [
      {
        question: "Can I calculate savings from a percentage offer?",
        answer:
          "Yes. Enter original price and discount percent to get exact savings and final amount.",
      },
      {
        question: "Does this support decimal values?",
        answer: "Yes. Decimal prices and percentages are supported.",
      },
    ],
  },
  {
    name: "Unit Converter",
    slug: "unit-converter",
    description: "Convert length, weight, and temperature units quickly.",
    seoDescription:
      "Unit converter tool for length, weight, and temperature with instant conversion results.",
    category: "Utility",
    related: ["currency-converter", "percentage-calculator", "age-calculator"],
    faqs: [
      {
        question: "Which unit types are supported?",
        answer: "Length, weight, and temperature conversions are available in this version.",
      },
      {
        question: "Is conversion instant?",
        answer: "Yes. Values update in real time as inputs change.",
      },
    ],
  },
  {
    name: "Currency Converter",
    slug: "currency-converter",
    description: "Convert major currencies with quick estimated exchange rates.",
    seoDescription:
      "Currency converter for major global currencies with quick estimated conversion values.",
    category: "Utility",
    related: ["unit-converter", "discount-calculator", "gst-calculator"],
    faqs: [
      {
        question: "Are these live market exchange rates?",
        answer:
          "This version uses a static demo rate table for product preview. Integrate live APIs anytime later.",
      },
      {
        question: "Can I convert between non-USD pairs?",
        answer: "Yes. The converter calculates via normalized base rates.",
      },
    ],
  },
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, and minify JSON for cleaner debugging.",
    seoDescription:
      "JSON formatter and validator to pretty print, minify, and check invalid JSON syntax online.",
    category: "Developer",
    featured: true,
    related: ["uuid-generator", "slug-generator", "password-generator"],
    faqs: [
      {
        question: "Can this tool validate invalid JSON?",
        answer: "Yes. It shows a clear parsing error if syntax is invalid.",
      },
      {
        question: "Can I also minify JSON?",
        answer: "Yes. Use the Minify action to reduce JSON size.",
      },
    ],
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate UUID v4 values for IDs, APIs, and database records.",
    seoDescription:
      "UUID generator for random v4 IDs with bulk generation and one-click copy support.",
    category: "Developer",
    related: ["json-formatter", "password-generator", "slug-generator"],
    faqs: [
      {
        question: "Which UUID version is generated?",
        answer: "This tool generates random UUID v4 values.",
      },
      {
        question: "Can I generate multiple UUIDs at once?",
        answer: "Yes. Set the required count and generate in bulk.",
      },
    ],
  },
  {
    name: "Slug Generator",
    slug: "slug-generator",
    description: "Convert text to SEO-friendly URL slugs instantly.",
    seoDescription:
      "Slug generator to create clean, lowercase, hyphenated URL slugs for SEO-friendly pages.",
    category: "SEO",
    related: ["json-formatter", "text-case-converter", "character-counter"],
    faqs: [
      {
        question: "Does slug generator remove special characters?",
        answer: "Yes. It removes non-alphanumeric symbols and normalizes separators.",
      },
      {
        question: "Can I copy slug directly?",
        answer: "Yes. Use copy action to paste into CMS or codebase quickly.",
      },
    ],
  },
  {
    name: "WebP Converter",
    slug: "webp-converter",
    description: "Convert image files to WebP format for faster web delivery.",
    seoDescription:
      "WebP converter for modern image optimization with adjustable quality and instant download.",
    category: "Image",
    related: ["image-compressor", "image-resizer", "png-to-jpg-converter"],
    faqs: [
      {
        question: "Why convert images to WebP?",
        answer: "WebP often delivers smaller file sizes while maintaining good visual quality.",
      },
      {
        question: "Can I control WebP quality?",
        answer: "Yes. Use quality slider before converting.",
      },
    ],
  },
];

export const getToolBySlug = (slug: string) =>
  tools.find((tool) => tool.slug === slug);
