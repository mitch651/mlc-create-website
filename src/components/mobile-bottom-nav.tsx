"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarClock, Home, Layers, Mail, Package } from "lucide-react"

import { cn } from "@/lib/utils"

const ITEMS = [
  { href: "#main", label: "Home", Icon: Home },
  { href: "#packages", label: "Packages", Icon: Package },
  { href: "#monthly", label: "Monthly", Icon: CalendarClock },
  { href: "#process", label: "Process", Icon: Layers },
  { href: "#contact", label: "Contact", Icon: Mail },
] as const

function normalizeHash() {
  if (typeof window === "undefined") return ""
  return window.location.hash || (window.location.pathname === "/" ? "#main" : "")
}

export function MobileBottomNav() {
  const [hash, setHash] = useState("")

  useEffect(() => {
    setHash(normalizeHash())
    const onHash = () => setHash(normalizeHash())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  useEffect(() => {
    const sectionIds = ITEMS.map((item) => item.href.replace("#", ""))
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length === 0) return

        const id = visible[0].target.id
        setHash(`#${id}`)
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800/90 bg-zinc-950/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
      aria-label="Section navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5 px-1">
        {ITEMS.map(({ href, label, Icon }) => {
          const active =
            href === "#main"
              ? !hash || hash === "#main"
              : hash === href
          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                scroll
                className={cn(
                  "flex min-h-[48px] min-w-[44px] touch-manipulation flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium tracking-wide transition-colors duration-200 active:scale-[0.97] motion-safe:transition-transform",
                  active
                    ? "text-primary"
                    : "text-zinc-500 active:text-zinc-300",
                )}
              >
                <Icon
                  className={cn(
                    "size-[22px] shrink-0 stroke-[1.75]",
                    active && "text-primary",
                  )}
                  aria-hidden
                />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
