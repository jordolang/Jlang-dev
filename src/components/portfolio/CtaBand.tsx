import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";

// Full-bleed closing call to action. Always dark (it sits on the horizon render),
// so it is scoped with `dark` like the hero and the process story.
export default function CtaBand() {
  return (
    <section className="dark relative isolate overflow-hidden bg-black py-28 text-white md:py-36">
      <Image
        src="/media/images/horizon.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-transparent to-black" />

      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-gold-300">Ready when you are</p>
        <h2 className="text-4xl font-bold leading-tight md:text-6xl">
          Let&apos;s build something{" "}
          <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-silver-300 bg-clip-text text-transparent">
            worth remembering.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-silver-200">
          Clear, fixed-price packages for every stage of business. Tell me about yours and I&apos;ll reply
          with a plan within one business day.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 px-7 py-3.5 font-semibold text-black shadow-lg shadow-gold-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            Start your project
            <Icon icon="solar:arrow-right-linear" width={18} height={18} />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-silver-300/40 bg-white/5 px-7 py-3.5 font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Compare packages
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
