export type Tool = {
  name: string;
  slug: string;
  description: string;
};

export const tools: Tool[] = [
  {
    name: "Word Counter",
    slug: "word-counter",
    description:
      "Count words, characters, sentences, paragraphs, and reading time instantly.",
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    description:
      "Create secure passwords with length and character type controls.",
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Calculate exact age in years, months, and days.",
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Generate and download QR codes for text and URLs.",
  },
  {
    name: "Text Case Converter",
    slug: "text-case-converter",
    description:
      "Convert text to lowercase, uppercase, sentence case, or capitalize words.",
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description:
      "Compress images directly in browser and download optimized results.",
  },
];
