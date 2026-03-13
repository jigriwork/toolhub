import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read ToolHub privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-4 max-w-3xl space-y-3" style={{ color: "var(--muted)" }}>
        <p>
          ToolHub respects your privacy. Most tool operations are performed in
          your browser.
        </p>
        <p>
          We may use analytics and advertising partners in the future to improve
          service and support monetization.
        </p>
        <p>
          By using this site, you agree to this policy and future updates.
        </p>
      </div>
    </main>
  );
}
