"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE = {
  pwaInstalled: "toolhub:pwa-installed",
  shareCount: "toolhub:creative-share-count",
  referralCode: "toolhub:creative-ref-code",
  seenRefs: "toolhub:creative-seen-refs",
  referralVisits: "toolhub:creative-ref-visits",
  watermarkDisabled: "toolhub:creative-watermark-disabled",
};

type ShareResult = { ok: boolean; message: string };

function getNumber(key: string, fallback = 0) {
  const value = Number(window.localStorage.getItem(key) ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

function getOrCreateReferralCode() {
  const existing = window.localStorage.getItem(STORAGE.referralCode);
  if (existing) return existing;
  const generated = `th${Math.random().toString(36).slice(2, 8)}`;
  window.localStorage.setItem(STORAGE.referralCode, generated);
  return generated;
}

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

export function useCreativeUnlocks() {
  const [referralCode] = useState(() => {
    if (typeof window === "undefined") return "thuser";
    return getOrCreateReferralCode();
  });

  const [pwaInstalled, setPwaInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    const hydratedPwa = window.localStorage.getItem(STORAGE.pwaInstalled) === "1";
    const standalone = isStandaloneMode();
    const nextPwa = hydratedPwa || standalone;
    if (nextPwa) window.localStorage.setItem(STORAGE.pwaInstalled, "1");
    return nextPwa;
  });

  const [shareCount, setShareCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return getNumber(STORAGE.shareCount);
  });

  const [referralVisits] = useState(() => {
    if (typeof window === "undefined") return 0;
    const ownRef = getOrCreateReferralCode();
    const params = new URLSearchParams(window.location.search);
    const incomingRef = params.get("thref");
    let visits = getNumber(STORAGE.referralVisits);

    if (incomingRef && incomingRef !== ownRef) {
      const seen = new Set(JSON.parse(window.localStorage.getItem(STORAGE.seenRefs) ?? "[]") as string[]);
      if (!seen.has(incomingRef)) {
        seen.add(incomingRef);
        visits += 1;
        window.localStorage.setItem(STORAGE.referralVisits, String(visits));
        window.localStorage.setItem(STORAGE.seenRefs, JSON.stringify(Array.from(seen)));
      }
    }
    return visits;
  });

  const [watermarkDisabled, setWatermarkDisabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE.watermarkDisabled) === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onInstalled = () => {
      window.localStorage.setItem(STORAGE.pwaInstalled, "1");
      setPwaInstalled(true);
    };
    window.addEventListener("toolhub:pwa-installed", onInstalled as EventListener);

    return () => {
      window.removeEventListener("toolhub:pwa-installed", onInstalled as EventListener);
    };
  }, []);

  const premiumUnlocked = pwaInstalled || shareCount >= 3 || referralVisits >= 2;
  const hdUnlocked = pwaInstalled || shareCount >= 2;
  const watermarkRemovable = pwaInstalled || shareCount >= 3 || referralVisits >= 3;
  const watermarkEnabled = watermarkRemovable ? !watermarkDisabled : true;

  const shareLink = useMemo(() => {
    if (typeof window === "undefined") return "https://toolhubsite.in";
    return `${window.location.origin}${window.location.pathname}?thref=${referralCode}`;
  }, [referralCode]);

  const incrementShare = useCallback(() => {
    const next = shareCount + 1;
    setShareCount(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE.shareCount, String(next));
    }
  }, [shareCount]);

  const handleShare = useCallback(async (): Promise<ShareResult> => {
    const text = "Create business creatives in seconds on ToolHub";
    try {
      if (navigator.share) {
        await navigator.share({ title: "ToolHub Creative Suite", text, url: shareLink });
        incrementShare();
        return { ok: true, message: "Thanks! Share tracked. Unlock progress updated." };
      }
      await navigator.clipboard.writeText(shareLink);
      incrementShare();
      return { ok: true, message: "Link copied. Share it to unlock premium features." };
    } catch {
      return { ok: false, message: "Share cancelled. You can try again anytime." };
    }
  }, [incrementShare, shareLink]);

  const toggleWatermarkDisabled = useCallback((disabled: boolean) => {
    setWatermarkDisabled(disabled);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE.watermarkDisabled, disabled ? "1" : "0");
    }
  }, []);

  return {
    pwaInstalled,
    premiumUnlocked,
    hdUnlocked,
    watermarkRemovable,
    watermarkEnabled,
    shareCount,
    referralVisits,
    referralCode,
    shareLink,
    handleShare,
    toggleWatermarkDisabled,
  };
}
