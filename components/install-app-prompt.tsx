"use client";

import { useEffect, useState } from "react";

type DeferredPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppPrompt() {
  const [promptEvent, setPromptEvent] = useState<DeferredPrompt | null>(null);
  const [installed, setInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const stored = window.localStorage.getItem("toolhub:pwa-installed") === "1";
    return standalone || stored;
  });

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as DeferredPrompt);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!promptEvent || installed) return null;

  return (
    <div className="card mt-4 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
      <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
        Install toolhubsite for a faster app-like experience.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => {
          await promptEvent.prompt();
          const choice = await promptEvent.userChoice;
          if (choice.outcome === "accepted") {
            if (typeof window !== "undefined") {
              window.localStorage.setItem("toolhub:pwa-installed", "1");
              window.dispatchEvent(new CustomEvent("toolhub:pwa-installed"));
            }
            setInstalled(true);
            setPromptEvent(null);
          }
        }}
      >
        Install App
      </button>
    </div>
  );
}
