"use client";

import { useEffect } from "react";

const ADSENSE_SCRIPT_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9786270531690599";

export function GoogleAdSense() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${ADSENSE_SCRIPT_SRC}"]`,
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = ADSENSE_SCRIPT_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }, []);

  return null;
}