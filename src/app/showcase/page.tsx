import type { Metadata } from "next";
import { CodeShowcase } from "@/components/showcase/CodeShowcase";
import { CodeComparison } from "@/components/showcase/CodeComparison";
import { codeShowcases, codeComparisons } from "@/data/codeShowcases";

export const metadata: Metadata = {
  title: "Code Showcase | Jordan Lang",
  description: "Curated code samples and before/after refactors from real projects.",
  alternates: { canonical: "/showcase" },
};

export default function ShowcasePage() {
  return (
    <main id="main-content" className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Code Showcase</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-12">
        Patterns I use in production, plus a few before/after refactors.
      </p>

      <section aria-labelledby="examples-heading" className="mb-16">
        <h2 id="examples-heading" className="text-2xl font-bold text-gray-900 dark:text-white">Examples</h2>
        {codeShowcases.map((example) => (
          <CodeShowcase
            key={example.id}
            title={example.title}
            description={example.description}
            code={example.code}
            language={example.language}
            defaultView="code"
          />
        ))}
      </section>

      <section aria-labelledby="refactors-heading">
        <h2 id="refactors-heading" className="text-2xl font-bold text-gray-900 dark:text-white">Before &amp; After</h2>
        {codeComparisons.map((comparison) => (
          <div key={comparison.id} className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{comparison.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{comparison.description}</p>
            <CodeComparison
              before={comparison.before}
              after={comparison.after}
              language={comparison.language}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
