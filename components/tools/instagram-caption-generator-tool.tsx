"use client";

import { useMemo, useState } from "react";

type Tone = "premium" | "casual" | "bold" | "festive" | "elegant" | "hype";
type Purpose =
  | "product-launch"
  | "sale-offer"
  | "festive-greeting"
  | "store-promotion"
  | "new-arrival"
  | "engagement-post";

type CaptionResult = {
  caption: string;
  hashtags: string[];
};

const TONE_PHRASES: Record<Tone, { opener: string[]; cta: string[]; emoji: string[] }> = {
  premium: {
    opener: ["Experience refined quality", "Curated for discerning customers", "Crafted with premium detail"],
    cta: ["Discover the collection today.", "Visit us for an elevated experience.", "DM us for exclusive assistance."],
    emoji: ["✨", "🖤", "💼"],
  },
  casual: {
    opener: ["Hey everyone", "Your next favorite pick is here", "Something exciting just dropped"],
    cta: ["Check it out and tell us what you think!", "Drop by and grab yours.", "Save this post for later."],
    emoji: ["😊", "🙌", "💬"],
  },
  bold: {
    opener: ["Big update for your wardrobe", "This is your sign to upgrade", "No compromises. Only standout choices."],
    cta: ["Claim yours before it sells out.", "Step in and own the look.", "Message us now for quick booking."],
    emoji: ["🔥", "⚡", "🚀"],
  },
  festive: {
    opener: ["Celebration mode: ON", "Festive vibes with special offers", "Spreading joy, style, and savings"],
    cta: ["Celebrate with us this season.", "Visit store and make it memorable.", "Tag someone who should see this."],
    emoji: ["🎉", "🪔", "🎊"],
  },
  elegant: {
    opener: ["Timeless elegance, now available", "A graceful addition to your style", "Where sophistication meets comfort"],
    cta: ["Explore subtle luxury in-store.", "Experience effortless elegance.", "Enquire for personalized recommendations."],
    emoji: ["🌿", "🤍", "🕊️"],
  },
  hype: {
    opener: ["NEW DROP ALERT", "You asked, we delivered", "Trendsetters, this one's for you"],
    cta: ["Grab it before everyone else does!", "Hit us up right now.", "Tag your shopping partner instantly."],
    emoji: ["🚨", "💥", "👀"],
  },
};

const PURPOSE_LINES: Record<Purpose, string[]> = {
  "product-launch": [
    "Our latest launch is finally here.",
    "Introducing our newest release.",
    "Just launched: designed to stand out.",
  ],
  "sale-offer": [
    "Special sale is now live for a limited time.",
    "Your favorite picks are now at irresistible prices.",
    "Limited period offer you don't want to miss.",
  ],
  "festive-greeting": [
    "Wishing you happiness, growth, and celebration.",
    "Sending warm festive wishes from our team.",
    "May this festive season bring joy and success.",
  ],
  "store-promotion": [
    "Visit our store for fresh collections and personal assistance.",
    "We're ready to welcome you with our best picks.",
    "Step into our store and explore handpicked options.",
  ],
  "new-arrival": [
    "Fresh arrivals just landed in-store and online.",
    "New arrivals are here and they're worth the hype.",
    "Meet the newest additions to our range.",
  ],
  "engagement-post": [
    "Tell us your favorite in the comments below.",
    "Would you style this look? Vote in comments.",
    "We'd love to hear your opinion on this one.",
  ],
};

const HASHTAG_BANK: Record<Purpose, string[]> = {
  "product-launch": ["#NewLaunch", "#JustDropped", "#NowAvailable", "#ProductReveal"],
  "sale-offer": ["#SaleAlert", "#LimitedOffer", "#ShopNow", "#BestDeals"],
  "festive-greeting": ["#FestiveVibes", "#CelebrateTogether", "#SeasonGreetings", "#FestiveOffers"],
  "store-promotion": ["#VisitOurStore", "#LocalBusiness", "#ShopLocal", "#InStoreNow"],
  "new-arrival": ["#NewArrivals", "#FreshCollection", "#TrendingNow", "#StyleUpdate"],
  "engagement-post": ["#LetsTalk", "#TellUsBelow", "#CommunityLove", "#YourChoice"],
};

function normalizeTag(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join("");
}

function pickBySeed<T>(arr: T[], seed: number, offset: number) {
  if (arr.length === 0) return undefined;
  return arr[(seed + offset) % arr.length];
}

export function InstagramCaptionGeneratorTool() {
  const [businessType, setBusinessType] = useState("Fashion boutique");
  const [productName, setProductName] = useState("Summer Linen Collection");
  const [tone, setTone] = useState<Tone>("premium");
  const [purpose, setPurpose] = useState<Purpose>("sale-offer");
  const [targetAudience, setTargetAudience] = useState("Young professionals and modern families");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [seed, setSeed] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const captions = useMemo<CaptionResult[]>(() => {
    const phrases = TONE_PHRASES[tone];
    const purposeLines = PURPOSE_LINES[purpose];
    const baseTags = HASHTAG_BANK[purpose];

    const nicheTag = normalizeTag(businessType || "Business");
    const productTag = normalizeTag(productName || "Product");

    return Array.from({ length: 4 }).map((_, index) => {
      const opener = pickBySeed(phrases.opener, seed, index * 2) ?? "";
      const context = pickBySeed(purposeLines, seed, index) ?? "";
      const cta = pickBySeed(phrases.cta, seed, index * 3) ?? "";
      const emoji = pickBySeed(phrases.emoji, seed, index) ?? "✨";

      const productLine = productName.trim() ? `${productName.trim()} is ready for you.` : "";
      const audienceLine = targetAudience.trim()
        ? `Perfect for ${targetAudience.trim().toLowerCase()}.`
        : "";

      const caption = [
        `${emoji} ${opener}.`,
        context,
        productLine,
        audienceLine,
        cta,
      ]
        .filter(Boolean)
        .join(" ");

      const hashtags = includeHashtags
        ? [
            `#${nicheTag || "Business"}`,
            productTag ? `#${productTag}` : "",
            ...baseTags.slice(index % 2, index % 2 + 3),
            `#${tone[0]?.toUpperCase()}${tone.slice(1)}Tone`,
          ].filter(Boolean)
        : [];

      return { caption, hashtags };
    });
  }, [businessType, includeHashtags, productName, purpose, seed, targetAudience, tone]);

  const regenerate = () => {
    setSeed((current) => current + 1);
    setCopiedIndex(null);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-base font-semibold">Caption setup</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Business type / niche" />
          <input className="field" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product/service name (optional)" />

          <label className="space-y-1 text-sm">
            <span className="muted">Tone</span>
            <select className="select" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
              <option value="premium">Premium</option>
              <option value="casual">Casual</option>
              <option value="bold">Bold</option>
              <option value="festive">Festive</option>
              <option value="elegant">Elegant</option>
              <option value="hype">Hype</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="muted">Post purpose</span>
            <select className="select" value={purpose} onChange={(e) => setPurpose(e.target.value as Purpose)}>
              <option value="product-launch">Product Launch</option>
              <option value="sale-offer">Sale Offer</option>
              <option value="festive-greeting">Festive Greeting</option>
              <option value="store-promotion">Store Promotion</option>
              <option value="new-arrival">New Arrival</option>
              <option value="engagement-post">Engagement Post</option>
            </select>
          </label>
        </div>

        <input className="field" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Target audience (optional)" />

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} />
            Include hashtag suggestions
          </label>
          <button type="button" className="btn btn-primary" onClick={regenerate}>
            Regenerate Captions
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">Caption options</h3>
        <div className="grid gap-3">
          {captions.map((item, index) => (
            <article key={`caption-${index}`} className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
              <p className="whitespace-pre-wrap text-sm leading-7 sm:text-base">{item.caption}</p>
              {item.hashtags.length > 0 ? (
                <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                  {item.hashtags.join(" ")}
                </p>
              ) : null}
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={async () => {
                    const text = `${item.caption}${item.hashtags.length ? `\n\n${item.hashtags.join(" ")}` : ""}`;
                    await navigator.clipboard.writeText(text);
                    setCopiedIndex(index);
                    window.setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 1200);
                  }}
                >
                  {copiedIndex === index ? "Copied" : "Copy Caption"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
