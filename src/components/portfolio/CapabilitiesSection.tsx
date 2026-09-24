import { Icon } from "@/components/Icon";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

// "What I build" — a server component (no JS of its own beyond the Reveal
// islands) pairing each core offering with its brand render.

const CAPABILITIES = [
  {
    title: "Websites that convert",
    body: "Custom, responsive sites for small businesses, designed to turn visitors into calls, bookings and sales.",
    image: "/media/images/cap-web.webp",
    icon: "solar:monitor-smartphone-bold",
  },
  {
    title: "Web & mobile apps",
    body: "Booking tools, dashboards and customer portals, from a simple web app to a native iOS release.",
    image: "/media/images/cap-apps.webp",
    icon: "solar:smartphone-2-bold",
  },
  {
    title: "Hosting & IT",
    body: "Domains, email, secure hosting, backups and on-site support, all handled so you never think about it.",
    image: "/media/images/cap-hosting.webp",
    icon: "solar:server-square-cloud-bold",
  },
  {
    title: "SEO & growth",
    body: "Local SEO, analytics and campaigns that get you found on Google and keep the phone ringing.",
    image: "/media/images/cap-growth.webp",
    icon: "solar:graph-up-bold",
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-20 md:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 mb-14 md:mb-20">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold-700 dark:text-gold-300">
            <Icon icon="solar:crown-minimalistic-bold" width={14} height={14} />
            What I build
          </span>
          <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
            A one-person studio,{" "}
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-silver-500 bg-clip-text text-transparent dark:from-gold-200 dark:via-gold-400 dark:to-silver-300">
              built like an agency.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            You work directly with the person designing, coding and supporting your site. There are no
            account managers and no hand-offs, just craftsmanship and a fast reply when you need one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-gold-500 dark:text-black"
            >
              See packages
              <Icon icon="solar:arrow-right-linear" width={18} height={18} />
            </Link>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-semibold transition-colors hover:border-gold-500 hover:text-gold-700 dark:border-white/15 dark:hover:border-gold-300 dark:hover:text-gold-200"
            >
              Recent work
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold-500/20 shadow-2xl shadow-black/20">
            <Image
              src="/media/images/studio.webp"
              alt="A dark, gold-lit web design workstation showing a website layout in progress"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
              <span className="text-sm uppercase tracking-[0.25em] text-gold-200">Zanesville, OH</span>
              <span className="text-sm text-silver-200">Remote nationwide</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map((cap, i) => (
          <Reveal key={cap.title} delay={i * 0.08}>
            <article className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-xl hover:shadow-gold-500/10 dark:border-white/10 dark:bg-neutral-950/80">
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={cap.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-gold-600 dark:text-gold-300">
                  <Icon icon={cap.icon} width={20} height={20} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cap.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{cap.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
