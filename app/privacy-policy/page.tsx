import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the toolhubsite privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container section-y">
      <h1 className="page-title font-bold">Privacy Policy</h1>
      <div className="page-lead mt-4 max-w-3xl space-y-3">
        <p>
          toolhubsite (www.toolhubsite.in) respects your privacy. Most tool
          operations are performed directly in your browser.
        </p>
        <p>
          We do not store your tool input data on our servers. Text, image, and
          calculator inputs are processed locally in your browser for most tools.
        </p>
        <p>
          To improve experience, your browser may store limited local data such
          as recent tools, favorites, and anonymous interaction counters via
          localStorage. This data stays on your device unless you clear it.
        </p>
        <p>
          If analytics or ads are enabled (such as Google services), they may
          collect non-personal usage data according to their own policies.
        </p>
        <p>
          For privacy questions, contact us at{" "}
          <a className="text-blue-600" href="mailto:hello@toolhubsite.in">
            hello@toolhubsite.in
          </a>
          .
        </p>
      </div>
    </main>
  );
}
