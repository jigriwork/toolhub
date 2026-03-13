"use client";

import { useEffect, useState } from "react";

type DeferredPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppPrompt() {
  const [promptEvent, setPromptEvent] = useState<DeferredPrompt | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as DeferredPrompt);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!promptEvent) return null;

  return (
    <div className="card mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Install ToolHub for a faster app-like experience.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => {
          await promptEvent.prompt();
          const choice = await promptEvent.userChoice;
          if (choice.outcome === "accepted") setPromptEvent(null);
        }}
      >
        Install App
      </button>
    </div>
  );
}
