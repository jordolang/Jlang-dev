"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  project?: string;
  avatar: string;
  featured?: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isHovered: number | null;
  onHover: (index: number | null) => void;
}

interface FeaturedTestimonialProps {
  testimonial: Testimonial;
}

export const defaultTestimonials: Testimonial[] = [
  {
    content: "Jordan Lang transformed our business with his outstanding web design and strategic insights.",
    author: "Fred Amir",
    role: "CEO",
    company: "World Auto Net",
    rating: 5,
    project: "Lead Sales, Finance, and Marketing Management",
    avatar: "FA",
    featured: true
  },
  {
    content: "Jordan's attention to detail and creativity took our brand to new heights. His web design perfectly captured our company's vision and transformed how we present our services online.",
    author: "Clint Berkfield",
    role: "Owner",
    company: "Neff Paving",
    rating: 5,
    project: "Web Design and Branding",
    avatar: "CB"
  },
  {
    content: "Working with Jordan was exceptional. He delivered exactly what we needed to showcase our paving projects professionally and helped establish our strong digital presence.",
    author: "Austin Berkfield",
    role: "Owner",
    company: "Neff Paving",
    rating: 5,
    project: "Web Design and Branding",
    avatar: "AB"
  },
  {
    content: "Jordan created a beautiful and fantastic website for our church while he was a member. Unfortunately, life had different plans and we were unable to make all additions permanent.",
    author: "David Nuhfer",
    role: "Pastor",
    company: "First Baptist Church",
    rating: 5,
    project: "Community Website Development",
    avatar: "DN"
  },
  {
    content: "Jordan gave our salsa brand the online presence it always deserved. We're so grateful for everything he's done to help our business grow.",
    author: "Matt Harlin",
    role: "Owner",
    company: "Jose Madrid Salsa",
    rating: 5,
    project: "E-commerce & Marketing Site",
    avatar: "MH"
  },
  {
    content: "Working with Jordan was a true blessing for our company. He understood our vision and brought it to life beautifully — we couldn't be more thankful.",
    author: "Michael Zakany",
    role: "Owner",
    company: "Jose Madrid Salsa",
    rating: 5,
    project: "E-commerce & Marketing Site",
    avatar: "MZ"
  }

];

const TestimonialCard = ({ testimonial, index, isHovered, onHover }: TestimonialCardProps) => {
  const gradients = [
    'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
    'from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
    'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20'
  ];

  const borderGradients = [
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-green-400 to-emerald-500',
    'from-orange-400 to-red-500'
  ];

  const gradient = gradients[index % gradients.length];
  const borderGradient = borderGradients[index % borderGradients.length];

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="h-full w-full group"
    >
      <m.div
        className={`h-full w-full rounded-2xl relative overflow-hidden transition-all duration-500 border-0 ${isHovered === index
          ? 'transform scale-105 shadow-2'
          : 'shadow-lg hover:shadow-xlkk'
          }`}
        whileHover={{ y: -8 }}
      >

        {/* Main Card */}
        <div className={`relative  h-full bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-6 `}>


          {/* Quote Icon with Background */}
          <div className="relative mb-2 flex  items-center justify-between">
            <div className={`w-12 h-12 bg-gradient-to-br ${borderGradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
              <Icon
                icon="gravity-ui:quote-open"
                className="text-white text-3xl"
              />
            </div>
            {/* Rating with Animation */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Icon
                    icon="solar:star-bold"
                    className="text-yellow-500 text-2xl drop-shadow-sm"
                  />
                </m.div>
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {testimonial.rating}.0
              </span>
            </div>
          </div>


          {/* Testimonial Content with Better Typography */}
          <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-base font-medium relative">
            <span className="text-4xl text-gray-300 dark:text-gray-600 absolute -top-2 -left-2 font-serif">&quot;</span>
            <span className="relative z-10 pl-4">{testimonial.content}</span>
            <span className="text-4xl text-gray-300 dark:text-gray-600 absolute -bottom-6 -right-2 font-serif">&quot;</span>
          </blockquote>

          {/* Author Section with Enhanced Design */}
          <div className="mt-auto  border-t border-gray-200/50 dark:border-gray-600/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${borderGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-white text-lg">
                  {testimonial.author}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {testimonial.role}
                </div>
                <div className="text-gray-500 dark:text-gray-500 text-sm">
                  {testimonial.company}
                </div>
              </div>
            </div>

          </div>
        </div>
      </m.div>
    </m.div>
  );
};

const FeaturedTestimonial = ({ testimonial }: FeaturedTestimonialProps) => (
  <m.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative max-w-3xl mx-auto"
  >
    <div className="bg-gradient-to-br from-amber-50 to-sky-100 dark:from-amber-800/20 dark:to-sky-900/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50">
      {/* Simple Featured Badge */}

      <div className="relative mb-2 flex items-center justify-between">
        <div className={`w-12 h-12 bg-gradient-to-br from-amber-400 to-sky-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
          <Icon
            icon="gravity-ui:quote-open"
            className="text-white text-3xl"
          />
        </div>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 dark:bg-blue-900/30 text-sky-700 dark:text-blue-400 rounded-full text-sm font-medium">
            <Icon icon="solar:star-bold" width={16} height={16} />
            Featured Review
          </span>
        </div>

      </div>


      {/* Quote */}
      <blockquote className="text-center text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
        {testimonial.content}
      </blockquote>

      {/* Rating with Animation */}
      <div className="flex items-center justify-center gap-1 mb-6">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Icon
              icon="solar:star-bold"
              className="text-yellow-500 text-2xl drop-shadow-sm"
            />
          </m.div>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {testimonial.rating}.0
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl font-bold">{testimonial.avatar}</span>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-900 dark:text-white text-lg">
            {testimonial.author}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {testimonial.role} at {testimonial.company}
          </div>

        </div>
      </div>
    </div>
  </m.div>
);

interface TestimonialsSectionProps {
  /** Approved testimonials from Sanity, fetched on the server. */
  testimonials?: Omit<Testimonial, "avatar">[];
  heading?: { tagText?: string; tagIcon?: string; heading?: string; description?: string };
}

/** Initials, e.g. "Fred Amir" -> "FA". */
function initials(author: string): string {
  return author
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialsSection({ testimonials: managed, heading }: TestimonialsSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // The CMS is the source of truth once it has reviews — the bundled ones (which are also
  // seeded into Sanity) are only a backstop for an empty or unreachable CMS. Concatenating
  // the two would show every seeded quote twice.
  const testimonials: Testimonial[] = managed?.length
    ? managed.map((t) => ({ ...t, avatar: initials(t.author) }))
    : defaultTestimonials;

  const featuredTestimonial = testimonials.find(t => t.featured);
  const otherTestimonials = testimonials.filter(t => !t.featured);
  const overallRating = testimonials.length
    ? testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) / testimonials.length
    : 0;

  if (!featuredTestimonial) {
    return null;
  }

  return (
    <m.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="mb-20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <SectionHeader
          tagText={heading?.tagText ?? "Client Stories"}
          tagIcon={heading?.tagIcon ?? "solar:users-group-rounded-outline"}
          heading={heading?.heading ?? "Testimonials Wall"}
          description={heading?.description ?? "Real feedback from real clients who trusted me with their projects"}
          showUnderline={false}
          centered={true}
        />

        <div className="mx-auto mb-10 flex w-fit items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-50/80 px-5 py-2.5 shadow-sm dark:bg-yellow-950/20">
          <div className="flex text-lg text-yellow-500" aria-label={`${overallRating.toFixed(1)} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => <span key={index}>★</span>)}
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{overallRating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">from {testimonials.length} reviews</span>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <FeaturedTestimonial testimonial={featuredTestimonial} />
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Client Testimonials
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Honest feedback from clients I&apos;ve had the pleasure to work with
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {otherTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
                isHovered={hoveredCard}
                onHover={setHoveredCard}
              />
            ))}
          </div>
        </div>


      </div>
    </m.section>
  );
}
