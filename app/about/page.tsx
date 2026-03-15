import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about toolhubsite and our mission.",
};

export default function AboutPage() {
  return (
    <main className="container section-y">
      <h1 className="page-title font-bold">About toolhubsite</h1>
      <div className="page-lead mt-4 max-w-3xl space-y-3">
        <p>
          toolhubsite is an online utility platform available at
          <strong> www.toolhubsite.in</strong>. We build practical tools for
          students, creators, developers, and professionals who need fast
          results without complicated software.
        </p>
        <p>
          Our focus is speed, clarity, and trust. Most tools run directly in
          your browser, and we do not collect or store your tool input on our
          servers.
        </p>
        <p>
          For support or partnerships, contact us at{" "}
          <a className="text-blue-600" href="mailto:hello@toolhubsite.in">
            hello@toolhubsite.in
          </a>
          .
        </p>
      </div>
    </main>
  );
}
