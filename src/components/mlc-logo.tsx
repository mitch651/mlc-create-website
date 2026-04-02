import Image from "next/image"

import { cn } from "@/lib/utils"

type MlcLogoProps = {
  className?: string
  /** LCP / above-the-fold */
  priority?: boolean
}

/** White transparent gothic “m” mark (see `public/mlc-m-logo.png`). */
export function MlcLogo({ className, priority }: MlcLogoProps) {
  return (
    <Image
      src="/mlc-m-logo.png"
      alt="MLC Create"
      width={720}
      height={720}
      priority={priority}
      className={cn("object-contain", className)}
    />
  )
}
