"use client"

import { Eye, Radio } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

/**
 * Decorative “live viewers” strip for marketing demos — not real analytics.
 * Screen readers get an explicit disclaimer; sighted users see a subtle label.
 */
export function LiveViewersBadge({ className = "" }: { className?: string }) {
  const base = useMemo(() => 180 + Math.floor(Math.random() * 80), [])
  const [count, setCount] = useState(base)

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.max(120, Math.min(420, c + delta))
      })
    }, 3200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-3 rounded-full border border-[var(--accent-cyan)]/35 bg-[#0a1014]/90 px-4 py-2 text-sm text-zinc-200 shadow-[0_0_24px_rgba(51,204,221,0.08)] backdrop-blur-sm ${className}`}
      aria-label="Demo only: illustrative viewer count, not live analytics data."
    >
      <span className="flex items-center gap-2 text-[var(--accent-cyan)]">
        <Radio className="size-4 shrink-0 motion-safe:animate-pulse" aria-hidden />
        <span className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase">
          Live preview
        </span>
      </span>
      <span className="hidden h-4 w-px bg-zinc-700 sm:block" aria-hidden />
      <span className="flex items-center gap-2 tabular-nums" aria-hidden>
        <Eye className="size-4 text-[var(--accent-cyan)]" />
        <span className="font-medium text-white">{count}</span>
        <span className="text-zinc-500">viewing</span>
      </span>
      <span className="sr-only">
        This number is simulated for demonstration and does not reflect real
        visitors.
      </span>
    </div>
  )
}
