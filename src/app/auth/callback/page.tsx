import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 py-24 text-center">
        <h1 className="text-6xl font-bold leading-tight">
          AI Go-To-Market Planner
        </h1>

        <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
          Answer 4 questions and get a complete GTM strategy in seconds.
          Built for SaaS founders and marketers.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-black text-white px-8 py-4 rounded-xl text-lg"
          >
            Get Started Free
          </Link>

          <Link
            href="/plans"
            className="border px-8 py-4 rounded-xl text-lg"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 px-8">
          <Feature
            title="Instant Strategy"
            text="Generate a full GTM plan in seconds using AI."
          />
          <Feature
            title="Built for SaaS"
            text="ICP, messaging, channels and launch plan included."
          />
          <Feature
            title="Save & Reuse"
            text="All your GTM plans saved in one dashboard."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold">
          Stop guessing your go-to-market.
        </h2>

        <Link
          href="/login"
          className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-xl text-lg"
        >
          Create Your First GTM Plan →
        </Link>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
