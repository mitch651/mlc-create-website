"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  CalendarClock,
  Check,
  Code2,
  Layers,
  MapPin,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react"

import { MlcLogo } from "@/components/mlc-logo"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { buttonVariants } from "@/components/ui/button"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { cn } from "@/lib/utils"

function AvailabilityBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2.5", className)}
      role="status"
      aria-live="polite"
    >
      <span
        className="relative flex h-3.5 w-3.5 items-center justify-center"
        aria-hidden
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_2px_rgba(34,211,238,0.85)]" />
      </span>
      <p className="animate-availability-beep text-xs font-semibold tracking-wide text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.45)] sm:text-sm">
        Available for new projects
      </p>
    </div>
  )
}

const CONTACT_EMAIL = "hello@mlccreate.com"

const PACKAGES = [
  {
    name: "Starter",
    tagline: "Clean, professional presence.",
    oneTime: "$1,500",
    monthly: "$30/mo",
    commitment: "6-month minimum",
    highlights: [
      "Up to 3 pages",
      "Mobile responsive design",
      "Contact form & CMS",
      "Basic SEO & SSL",
      "1 revision round",
    ],
    featured: false,
  },
  {
    name: "Professional",
    tagline: "Lead capture and content.",
    oneTime: "$2,500",
    monthly: "$50/mo",
    commitment: "6-month minimum",
    highlights: [
      "Up to 7 pages",
      "Photo integration & blog",
      "Advanced forms & Analytics",
      "Social integration",
      "2 revision rounds",
    ],
    featured: true,
  },
  {
    name: "Premium",
    tagline: "Full digital experience.",
    oneTime: "$3,500",
    monthly: "$75/mo",
    commitment: "6-month minimum",
    highlights: [
      "Up to 12 pages",
      "Video & custom motion",
      "Advanced SEO & speed",
      "E-commerce ready (20 products)",
      "3 revision rounds",
    ],
    featured: false,
  },
  {
    name: "Enterprise",
    tagline: "Automated digital ecosystem.",
    oneTime: "$5,000",
    monthly: "$100/mo",
    commitment: "6-month minimum",
    highlights: [
      "Unlimited pages",
      "AI automations (up to $5K value)",
      "API integrations & full commerce",
      "Priority support & analytics",
      "Unlimited revisions",
    ],
    featured: false,
  },
] as const

const MONTHLY_ROWS = [
  {
    tier: "Starter — $30/mo",
    items: [
      "Hosting & domain management",
      "SSL renewal & security updates",
      "Uptime monitoring",
      "Email support (48hr)",
      "1 minor content update / mo",
    ],
  },
  {
    tier: "Professional — $50/mo",
    items: [
      "Everything in Starter",
      "Performance monitoring",
      "2 content updates / mo",
      "Monthly analytics report",
      "CMS & plugin updates",
    ],
  },
  {
    tier: "Premium — $75/mo",
    items: [
      "Everything in Professional",
      "4 content updates / mo",
      "SEO monitoring",
      "Same-day phone & email",
      "Monthly strategy call",
    ],
  },
  {
    tier: "Enterprise — $100/mo",
    items: [
      "Everything in Premium",
      "Unlimited content updates",
      "AI automation tuning",
      "4hr priority response",
      "Quarterly strategy review",
    ],
  },
] as const

const PROCESS = [
  {
    title: "Scope & deposit",
    body: "Your package defines the build. A 50% deposit starts the project; the balance is due before launch.",
    Icon: Layers,
  },
  {
    title: "Build in 2–6 weeks",
    body: "Typical timelines depend on package complexity and how quickly content and feedback arrive.",
    Icon: CalendarClock,
  },
  {
    title: "You own it",
    body: "After full payment, you own the site content and design. We may showcase the work in our portfolio unless agreed otherwise.",
    Icon: Shield,
  },
  {
    title: "Ship with confidence",
    body: "Monthly care begins at launch (6-month minimum). Upgrade tiers anytime; cancel with 30 days notice after the minimum.",
    Icon: Zap,
  },
] as const

const IMG_WORKSPACE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
const IMG_ANALYTICS =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
const IMG_TEAM =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"

const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Edge-ready",
  "Perf-first",
] as const

const PACKAGE_OPTIONS = [
  "Starter ($1,500)",
  "Professional ($2,500)",
  "Premium ($3,500)",
  "Enterprise ($5,000)",
] as const

const FEATURE_OPTIONS = [
  "Contact form",
  "Photo gallery",
  "Video content",
  "Blog / news",
  "E-commerce / online store",
  "Booking / scheduling",
  "Client portal",
  "Social media feeds",
  "Email marketing integration",
  "AI chatbot",
  "Customer reviews / testimonials",
  "Maps / location page",
  "FAQ section",
  "Team / about page",
  "Portfolio / work samples",
  "Payment processing",
  "Newsletter signup",
  "Custom animations",
] as const

const CONTENT_SUPPLY_OPTIONS = [
  "I have all content ready (text, photos, videos)",
  "I need help creating content (additional cost may apply)",
  "I have some content but need assistance with the rest",
] as const

export function SiteLanding() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    titleRole: "",
    phone: "",
    email: "",
    businessAddress: "",
    currentWebsite: "",
    industry: "",
    selectedPackage: PACKAGE_OPTIONS[1],
    desiredLaunchDate: "",
    mainGoals: "",
    branding: "",
    contentSupply: CONTENT_SUPPLY_OPTIONS[0],
    inspiration1: "",
    inspiration2: "",
    inspiration3: "",
    additionalNotes: "",
  })
  const [features, setFeatures] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const onFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature],
    )
  }

  const handleLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const lines = [
      `Business Name: ${formData.businessName}`,
      `Contact Name: ${formData.contactName}`,
      `Title / Role: ${formData.titleRole}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `Business Address: ${formData.businessAddress}`,
      `Current Website: ${formData.currentWebsite}`,
      `Industry / Type: ${formData.industry}`,
      "",
      `Selected Package: ${formData.selectedPackage}`,
      `Desired Launch Date: ${formData.desiredLaunchDate}`,
      `Main Goals: ${formData.mainGoals}`,
      `Existing Branding: ${formData.branding}`,
      "",
      `Features Needed: ${features.length > 0 ? features.join(", ") : "Not specified"}`,
      `Content Supply: ${formData.contentSupply}`,
      "",
      "Inspiration Sites:",
      `1) ${formData.inspiration1}`,
      `2) ${formData.inspiration2}`,
      `3) ${formData.inspiration3}`,
      "",
      `Additional Notes: ${formData.additionalNotes}`,
    ].join("\n")

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `New Website Inquiry - ${formData.businessName || "MLC Lead"}`,
    )}&body=${encodeURIComponent(lines)}`

    setSubmitted(true)
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black pb-[calc(5.25rem+env(safe-area-inset-bottom))] text-zinc-100 md:pb-0">
      <WebGLShader />
      <div
        className="pointer-events-none fixed inset-0 z-[1] tech-grid-bg opacity-[0.14]"
        aria-hidden
      />

      <div className="relative z-10">
        <a
          href="#main"
          className="bg-background focus:not-sr-only sr-only absolute top-3 left-3 z-[200] rounded-md border border-primary px-3 py-2 text-sm text-foreground"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/55 backdrop-blur-md supports-[backdrop-filter]:bg-black/40">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <Link
              href="/"
              className="group flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <MlcLogo className="h-9 w-9 shrink-0 transition-opacity group-hover:opacity-90 sm:h-10 sm:w-10" />
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold tracking-[0.28em] text-zinc-500 uppercase">
                  Create
                </p>
                <p className="text-xs font-medium tracking-wide text-zinc-200 sm:text-sm">
                  <span className="hidden sm:inline">Web Design &amp; Development</span>
                  <span className="font-mono text-[11px] text-zinc-400 sm:hidden">
                    Web · Dev · AI
                  </span>
                </p>
              </div>
            </Link>
            <nav
              className="hidden items-center gap-8 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase sm:flex"
              aria-label="Primary"
            >
              {["Packages", "Monthly", "Process", "Contact"].map((label) => (
                <Link
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Link
              href="#contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden border-zinc-600 text-zinc-200 hover:bg-zinc-900 sm:inline-flex",
              )}
            >
              Start a project
            </Link>
          </div>
        </header>

        <main id="main">
          <section className="relative flex w-full flex-col items-center justify-center px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
            <div className="relative w-full max-w-4xl border border-zinc-800 p-2 sm:p-3">
              <div className="relative border border-zinc-800 bg-black/50 px-4 py-12 backdrop-blur-sm sm:px-10 sm:py-16">
                <div className="mb-6 flex justify-center">
                  <MlcLogo
                    className="h-24 w-24 sm:h-32 sm:w-32"
                    priority
                  />
                </div>
                <p className="mb-4 text-center text-xs font-semibold tracking-[0.3em] text-zinc-500 uppercase">
                  MLC Create · Cerritos, CA
                </p>
                <h1 className="mb-4 text-balance text-center text-[1.65rem] font-extrabold leading-[1.12] tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-[clamp(2.25rem,7vw,4.5rem)]">
                  Custom websites that sell your story
                </h1>
                <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-zinc-400 sm:text-lg">
                  Web design, development, automation, and digital solutions — from a polished starter
                  site to a full e-commerce and AI-powered stack. Pick a package, upgrade anytime.
                </p>
                <div
                  className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-2 px-1"
                  aria-label="Tech stack"
                >
                  {TECH_STACK.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-zinc-800/90 bg-zinc-950/70 px-2.5 py-1 font-mono text-[11px] text-zinc-500 sm:text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <AvailabilityBadge className="my-8" />
                <div className="flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mx-auto sm:flex-row sm:items-center sm:gap-4">
                  <LiquidButton
                    href="#packages"
                    className="min-h-12 w-full rounded-full border border-zinc-600 text-white sm:min-h-0 sm:w-auto"
                    size="xl"
                  >
                    View packages
                  </LiquidButton>
                  <Link
                    href="#contact"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "min-h-12 justify-center text-zinc-300 hover:bg-white/5 hover:text-white sm:min-h-0",
                    )}
                  >
                    Book a consultation
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section
            id="packages"
            className="mx-auto max-w-6xl scroll-mt-[5.5rem] px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-24 md:scroll-mt-28"
          >
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
                Service packages
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Choose the fit. Upgrade when you grow.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-500">
                All packages include a 6-month minimum on monthly services. One-time build fees are
                separate from hosting &amp; care.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {PACKAGES.map((pkg) => (
                <article
                  key={pkg.name}
                  className={cn(
                    "flex touch-manipulation flex-col rounded-xl border bg-zinc-950/60 p-6 backdrop-blur-sm transition-[transform,box-shadow] duration-200 will-change-transform motion-safe:active:scale-[0.995]",
                    pkg.featured
                      ? "border-primary/50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                      : "border-zinc-800",
                  )}
                >
                  {pkg.featured && (
                    <p className="mb-3 inline-flex w-fit rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-primary uppercase">
                      Most popular
                    </p>
                  )}
                  <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{pkg.tagline}</p>
                  <div className="mt-6 flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold tabular-nums tracking-tight text-white">
                      {pkg.oneTime}
                    </span>
                    <span className="text-sm text-zinc-500">one-time</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    {pkg.monthly} · {pkg.commitment}
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-zinc-300">
                    {pkg.highlights.map((line) => (
                      <li key={line} className="flex gap-2">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <LiquidButton
                    href="#contact"
                    className="mt-8 w-fit self-center rounded-full border border-zinc-600 text-white"
                    size="lg"
                  >
                    Get started with {pkg.name}
                  </LiquidButton>
                </article>
              ))}
            </div>
          </section>

          <section className="border-y border-zinc-800 bg-zinc-950/40 py-16 sm:py-24">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-zinc-800">
                <Image
                  src={IMG_WORKSPACE}
                  alt="Laptop on a desk with code on screen"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
                  Built for clarity
                </p>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Performance, SEO, and a CMS you can actually use
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-500 sm:text-base">
                  Every tier includes responsive layouts, SSL, business email setup, and backend CMS
                  access. Professional adds analytics and richer forms; Premium and Enterprise layer
                  in video, advanced SEO, automation, and commerce.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-zinc-400">
                  <li className="flex gap-2">
                    <Code2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>Composable, modern stack — easy to extend as you scale.</span>
                  </li>
                  <li className="flex gap-2">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>Optional motion and glass-style UI moments that stay on-brand.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section
            id="monthly"
            className="mx-auto max-w-6xl scroll-mt-[5.5rem] px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-24 md:scroll-mt-28"
          >
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
                What your monthly covers
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Hosting, updates, and peace of mind
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-500">
                Monthly fees begin after launch. Add-ons like extra content updates, email accounts,
                and rush support are available — see your onboarding packet for details.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {MONTHLY_ROWS.map((block) => (
                <div
                  key={block.tier}
                  className="rounded-xl border border-zinc-800 bg-black/40 p-6 backdrop-blur-sm"
                >
                  <h3 className="text-sm font-semibold text-white">{block.tier}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-zinc-600" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-lg border border-zinc-800">
              <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
                <Image
                  src={IMG_ANALYTICS}
                  alt="Analytics dashboard on a laptop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            </div>
          </section>

          <section
            id="process"
            className="scroll-mt-[5.5rem] border-t border-zinc-800 bg-zinc-950/30 py-16 sm:scroll-mt-24 sm:py-24 md:scroll-mt-28"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  How we work together
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
                  Aligned with the MLC Create service agreement: clear scope, fair payments, and
                  predictable care after launch.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {PROCESS.map(({ title, body, Icon }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-xl border border-zinc-800 bg-black/30 p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-zinc-700 text-primary">
                      <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mx-auto mt-16 aspect-[16/9] max-w-3xl overflow-hidden rounded-lg border border-zinc-800">
                <Image
                  src={IMG_TEAM}
                  alt="Team collaborating in an open office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="mx-auto max-w-5xl scroll-mt-[5.5rem] px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-28 md:scroll-mt-28"
          >
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-6 backdrop-blur-sm sm:p-10">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Client Information Form
                </h2>
                <AvailabilityBadge className="mt-5" />
                <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-500 sm:text-base">
                  Fill this out and we will open an email draft with everything prefilled for your
                  consultation request.
                </p>
              </div>

              <form className="mt-8 space-y-8" onSubmit={handleLeadSubmit}>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
                    Business Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Business Name</span>
                      <input
                        required
                        value={formData.businessName}
                        onChange={onFieldChange("businessName")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="Your business name"
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Contact Name</span>
                      <input
                        required
                        value={formData.contactName}
                        onChange={onFieldChange("contactName")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="Full name"
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Title / Role</span>
                      <input
                        value={formData.titleRole}
                        onChange={onFieldChange("titleRole")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="Owner, Marketing Lead, etc."
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Phone</span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={onFieldChange("phone")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="(000) 000-0000"
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Email</span>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={onFieldChange("email")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="name@business.com"
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Current Website</span>
                      <input
                        type="url"
                        value={formData.currentWebsite}
                        onChange={onFieldChange("currentWebsite")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="https://"
                      />
                    </label>
                  </div>
                  <label className="space-y-1.5 text-sm text-zinc-400">
                    <span>Business Address</span>
                    <input
                      value={formData.businessAddress}
                      onChange={onFieldChange("businessAddress")}
                      className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      placeholder="Street, City, State"
                    />
                  </label>
                  <label className="space-y-1.5 text-sm text-zinc-400">
                    <span>Industry / Type of Business</span>
                    <input
                      value={formData.industry}
                      onChange={onFieldChange("industry")}
                      className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      placeholder="Construction, Legal, Beauty, etc."
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
                    Project Details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Selected Package</span>
                      <select
                        value={formData.selectedPackage}
                        onChange={onFieldChange("selectedPackage")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      >
                        {PACKAGE_OPTIONS.map((pkg) => (
                          <option key={pkg} value={pkg}>
                            {pkg}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Desired Launch Date</span>
                      <input
                        type="date"
                        value={formData.desiredLaunchDate}
                        onChange={onFieldChange("desiredLaunchDate")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      />
                    </label>
                  </div>
                  <label className="space-y-1.5 text-sm text-zinc-400">
                    <span>Main goals for your website</span>
                    <textarea
                      required
                      value={formData.mainGoals}
                      onChange={onFieldChange("mainGoals")}
                      rows={4}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      placeholder="Lead generation, trust, bookings, sales, etc."
                    />
                  </label>
                  <label className="space-y-1.5 text-sm text-zinc-400">
                    <span>Existing branding (logo, colors, fonts)</span>
                    <textarea
                      value={formData.branding}
                      onChange={onFieldChange("branding")}
                      rows={3}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      placeholder="Share what you already have."
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
                    Content & Features Needed
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {FEATURE_OPTIONS.map((feature) => {
                      const checked = features.includes(feature)
                      return (
                        <label
                          key={feature}
                          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFeature(feature)}
                            className="size-4 rounded border-zinc-600 bg-zinc-900 text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
                          />
                          <span>{feature}</span>
                        </label>
                      )
                    })}
                  </div>
                  <label className="space-y-1.5 text-sm text-zinc-400">
                    <span>Who will provide the content?</span>
                    <select
                      value={formData.contentSupply}
                      onChange={onFieldChange("contentSupply")}
                      className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                    >
                      {CONTENT_SUPPLY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Inspiration site 1</span>
                      <input
                        type="url"
                        value={formData.inspiration1}
                        onChange={onFieldChange("inspiration1")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="https://"
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Inspiration site 2</span>
                      <input
                        type="url"
                        value={formData.inspiration2}
                        onChange={onFieldChange("inspiration2")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="https://"
                      />
                    </label>
                    <label className="space-y-1.5 text-sm text-zinc-400">
                      <span>Inspiration site 3</span>
                      <input
                        type="url"
                        value={formData.inspiration3}
                        onChange={onFieldChange("inspiration3")}
                        className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                        placeholder="https://"
                      />
                    </label>
                  </div>
                  <label className="space-y-1.5 text-sm text-zinc-400">
                    <span>Additional notes / special requirements</span>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={onFieldChange("additionalNotes")}
                      rows={4}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                      placeholder="Anything unique we should plan for?"
                    />
                  </label>
                </div>

                <div className="flex flex-col items-center gap-3 border-t border-zinc-800 pt-6">
                  <LiquidButton
                    type="submit"
                    className="rounded-full border border-zinc-600 px-8 text-white"
                    size="xl"
                  >
                    Send Consultation Request
                  </LiquidButton>
                  <p className="text-xs text-zinc-500">
                    50% deposit starts the project • 6-month minimum on monthly services
                  </p>
                  {submitted && (
                    <p className="text-xs font-medium text-cyan-300">
                      Email draft opened with your completed form details.
                    </p>
                  )}
                </div>
              </form>

              <p className="mt-7 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                Cerritos, CA · Custom websites, automation, digital solutions
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t border-zinc-800 py-10 text-center text-xs text-zinc-600">
          <p>
            © {new Date().getFullYear()} MLC Create · Cerritos, CA · Custom Websites · Automation ·
            Digital Solutions
          </p>
          <p className="mt-2 max-w-xl mx-auto text-zinc-600">
            Additional revisions beyond your package: billed at $75/hr unless otherwise agreed.
          </p>
        </footer>

        <MobileBottomNav />
      </div>
    </div>
  )
}
