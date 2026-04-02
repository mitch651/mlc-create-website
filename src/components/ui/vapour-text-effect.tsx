"use client"

import React, {
  createElement,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}

export type VaporizeTextCycleProps = {
  texts: string[]
  font?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: number
  }
  color?: string
  spread?: number
  density?: number
  animation?: {
    vaporizeDuration?: number
    fadeInDuration?: number
    waitDuration?: number
  }
  direction?: "left-to-right" | "right-to-left"
  alignment?: "left" | "center" | "right"
  tag?: Tag
  className?: string
}

type Particle = {
  x: number
  y: number
  originalX: number
  originalY: number
  color: string
  opacity: number
  originalAlpha: number
  velocityX: number
  velocityY: number
  angle: number
  speed: number
  shouldFadeQuickly?: boolean
}

type TextBoundaries = {
  left: number
  right: number
  width: number
}

type CanvasWithMeta = HTMLCanvasElement & { textBoundaries?: TextBoundaries }

function useInViewOnce(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.08, rootMargin: "80px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return inView
}

export default function VaporizeTextCycle({
  texts = ["Next.js", "React"],
  font = {
    fontFamily: "var(--font-sans), system-ui, sans-serif",
    fontSize: "48px",
    fontWeight: 600,
  },
  color = "rgb(51, 204, 221)",
  spread = 5,
  density = 5,
  animation = {
    vaporizeDuration: 2,
    fadeInDuration: 1,
    waitDuration: 0.5,
  },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.H1,
  className,
}: VaporizeTextCycleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInViewOnce(wrapperRef)
  const lastFontRef = useRef<string | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [animationState, setAnimationState] = useState<
    "static" | "vaporizing" | "fadingIn" | "waiting"
  >("static")
  const vaporizeProgressRef = useRef(0)
  const fadeOpacityRef = useRef(0)
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 })
  const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true)

  const globalDpr = useMemo(() => {
    if (typeof window !== "undefined") {
      return Math.min((window.devicePixelRatio || 1) * 1.5, 2.5)
    }
    return 1
  }, [])

  const wrapperStyle = useMemo(
    () =>
      ({
        width: "100%",
        height: "100%",
        minHeight: "4.5rem",
        pointerEvents: "none" as const,
      }) satisfies React.CSSProperties,
    [],
  )

  const canvasStyle = useMemo(
    () =>
      ({
        minWidth: "30px",
        minHeight: "20px",
        pointerEvents: "none" as const,
      }) satisfies React.CSSProperties,
    [],
  )

  const animationDurations = useMemo(
    () => ({
      VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2) * 1000,
      FADE_IN_DURATION: (animation.fadeInDuration ?? 1) * 1000,
      WAIT_DURATION: (animation.waitDuration ?? 0.5) * 1000,
    }),
    [
      animation.vaporizeDuration,
      animation.fadeInDuration,
      animation.waitDuration,
    ],
  )

  const fontConfig = useMemo(() => {
    const raw = font.fontSize ?? "50px"
    const pxMatch = raw.match(/(\d+(?:\.\d+)?)\s*px/)
    const fontSize = pxMatch
      ? Math.round(parseFloat(pxMatch[1]))
      : Math.min(96, Math.max(32, Math.round(wrapperSize.width / 14) || 48))
    const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize)
    const MULTIPLIED_VAPORIZE_SPREAD = VAPORIZE_SPREAD * spread
    return {
      fontSize,
      VAPORIZE_SPREAD,
      MULTIPLIED_VAPORIZE_SPREAD,
      fontStr: `${font.fontWeight ?? 600} ${fontSize * globalDpr}px ${font.fontFamily ?? "sans-serif"}`,
    }
  }, [font.fontSize, font.fontWeight, font.fontFamily, spread, globalDpr, wrapperSize.width])

  const memoizedUpdateParticles = useCallback(
    (particles: Particle[], vaporizeX: number, deltaTime: number) => {
      return updateParticles(
        particles,
        vaporizeX,
        deltaTime,
        fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
        animationDurations.VAPORIZE_DURATION,
        direction,
        transformedDensity,
      )
    },
    [
      fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
      animationDurations.VAPORIZE_DURATION,
      direction,
      transformedDensity,
    ],
  )

  const memoizedRenderParticles = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      renderParticles(ctx, particles, globalDpr)
    },
    [globalDpr],
  )

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setAnimationState("vaporizing"), 0)
      return () => clearTimeout(t)
    }
    setAnimationState("static")
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    return undefined
  }, [isInView])

  useEffect(() => {
    if (!isInView) return

    let lastTime = performance.now()
    let frameId: number

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")

      if (!canvas || !ctx || !particlesRef.current.length) {
        frameId = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      switch (animationState) {
        case "static": {
          memoizedRenderParticles(ctx, particlesRef.current)
          break
        }
        case "vaporizing": {
          vaporizeProgressRef.current +=
            deltaTime * 100 / (animationDurations.VAPORIZE_DURATION / 1000)
          const c = canvas as CanvasWithMeta
          const textBoundaries = c.textBoundaries
          if (!textBoundaries) break

          const progress = Math.min(100, vaporizeProgressRef.current)
          const vaporizeX =
            direction === "left-to-right"
              ? textBoundaries.left + (textBoundaries.width * progress) / 100
              : textBoundaries.right - (textBoundaries.width * progress) / 100

          const allVaporized = memoizedUpdateParticles(
            particlesRef.current,
            vaporizeX,
            deltaTime,
          )
          memoizedRenderParticles(ctx, particlesRef.current)

          if (vaporizeProgressRef.current >= 100 && allVaporized) {
            setCurrentTextIndex((i) => (i + 1) % texts.length)
            setAnimationState("fadingIn")
            fadeOpacityRef.current = 0
          }
          break
        }
        case "fadingIn": {
          fadeOpacityRef.current +=
            deltaTime * 1000 / animationDurations.FADE_IN_DURATION
          ctx.save()
          ctx.scale(globalDpr, globalDpr)
          particlesRef.current.forEach((particle) => {
            particle.x = particle.originalX
            particle.y = particle.originalY
            const opacity =
              Math.min(fadeOpacityRef.current, 1) * particle.originalAlpha
            const col = particle.color.replace(/[\d.]+\)$/, `${opacity})`)
            ctx.fillStyle = col
            ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1)
          })
          ctx.restore()

          if (fadeOpacityRef.current >= 1) {
            setAnimationState("waiting")
            if (waitTimerRef.current) clearTimeout(waitTimerRef.current)
            waitTimerRef.current = setTimeout(() => {
              setAnimationState("vaporizing")
              vaporizeProgressRef.current = 0
              resetParticles(particlesRef.current)
              waitTimerRef.current = null
            }, animationDurations.WAIT_DURATION)
          }
          break
        }
        case "waiting": {
          memoizedRenderParticles(ctx, particlesRef.current)
          break
        }
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frameId)
      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current)
        waitTimerRef.current = null
      }
    }
  }, [
    animationState,
    isInView,
    texts.length,
    direction,
    globalDpr,
    memoizedUpdateParticles,
    memoizedRenderParticles,
    animationDurations.FADE_IN_DURATION,
    animationDurations.WAIT_DURATION,
    animationDurations.VAPORIZE_DURATION,
  ])

  const framerProps = useMemo(
    () => ({ texts, font, color, alignment }),
    [texts, font, color, alignment],
  )

  useEffect(() => {
    renderCanvas({
      framerProps: { ...framerProps, texts, font, color, alignment },
      canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
      transformedDensity,
    })

    const currentFont = font.fontFamily || "sans-serif"
    if (currentFont !== lastFontRef.current) {
      lastFontRef.current = currentFont
      const timeoutId = setTimeout(() => {
        cleanup({ canvasRef, particlesRef })
        renderCanvas({
          framerProps: { ...framerProps, texts, font, color, alignment },
          canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
          wrapperSize,
          particlesRef,
          globalDpr,
          currentTextIndex,
          transformedDensity,
        })
      }, 800)
      return () => {
        clearTimeout(timeoutId)
        cleanup({ canvasRef, particlesRef })
      }
    }
    return undefined
  }, [
    texts,
    font,
    color,
    alignment,
    wrapperSize,
    currentTextIndex,
    globalDpr,
    transformedDensity,
    framerProps,
  ])

  useEffect(() => {
    const container = wrapperRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setWrapperSize({ width, height })
      }
      const w = container.clientWidth
      const h = container.clientHeight
      renderCanvas({
        framerProps: { ...framerProps, texts, font, color, alignment },
        canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
        wrapperSize: { width: w, height: h },
        particlesRef,
        globalDpr,
        currentTextIndex,
        transformedDensity,
      })
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [
    texts,
    font,
    color,
    alignment,
    currentTextIndex,
    globalDpr,
    transformedDensity,
    framerProps,
  ])

  useLayoutEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setWrapperSize({ width: rect.width, height: rect.height })
  }, [])

  return (
    <div ref={wrapperRef} style={wrapperStyle} className={className}>
      <canvas ref={canvasRef} style={canvasStyle} aria-hidden />
      <SeoElement tag={tag} texts={texts} />
    </div>
  )
}

const SeoElement = memo(
  ({ tag = Tag.P, texts }: { tag: Tag; texts: string[] }) => {
    const style = useMemo(
      () =>
        ({
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }) satisfies React.CSSProperties,
      [],
    )
    const safeTag = Object.values(Tag).includes(tag) ? tag : Tag.P
    return createElement(safeTag, { style }, texts?.join(" · ") ?? "")
  },
)
SeoElement.displayName = "SeoElement"

function cleanup({
  canvasRef,
  particlesRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  particlesRef: React.MutableRefObject<Particle[]>
}) {
  const canvas = canvasRef.current
  const ctx = canvas?.getContext("2d")
  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  particlesRef.current = []
}

function renderCanvas({
  framerProps,
  canvasRef,
  wrapperSize,
  particlesRef,
  globalDpr,
  currentTextIndex,
  transformedDensity,
}: {
  framerProps: VaporizeTextCycleProps
  canvasRef: React.RefObject<HTMLCanvasElement>
  wrapperSize: { width: number; height: number }
  particlesRef: React.MutableRefObject<Particle[]>
  globalDpr: number
  currentTextIndex: number
  transformedDensity: number
}) {
  const canvas = canvasRef.current
  if (!canvas || !wrapperSize.width || !wrapperSize.height) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const { width, height } = wrapperSize
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = Math.floor(width * globalDpr)
  canvas.height = Math.floor(height * globalDpr)

  const rawFs = framerProps.font?.fontSize ?? "50px"
  const m = rawFs.match(/(\d+(?:\.\d+)?)\s*px/)
  const fontSize = m ? Math.round(parseFloat(m[1])) : 50
  const fontStr = `${framerProps.font?.fontWeight ?? 600} ${fontSize * globalDpr}px ${framerProps.font?.fontFamily ?? "sans-serif"}`
  const colorParsed = parseColor(framerProps.color ?? "rgb(153, 153, 153)")

  let textX: number
  const textY = canvas.height / 2
  const currentText = framerProps.texts[currentTextIndex] || "Next.js"

  if (framerProps.alignment === "center") textX = canvas.width / 2
  else if (framerProps.alignment === "left") textX = 0
  else textX = canvas.width

  const { particles, textBoundaries } = createParticles(
    ctx,
    canvas,
    currentText,
    textX,
    textY,
    fontStr,
    colorParsed,
    framerProps.alignment || "left",
  )

  particlesRef.current = particles
  ;(canvas as CanvasWithMeta).textBoundaries = textBoundaries
}

function createParticles(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  textX: number,
  textY: number,
  font: string,
  color: string,
  alignment: "left" | "center" | "right",
) {
  const particles: Particle[] = []
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = alignment
  ctx.textBaseline = "middle"
  ctx.imageSmoothingQuality = "high"
  ctx.imageSmoothingEnabled = true

  const c2d = ctx as CanvasRenderingContext2D & {
    fontKerning?: string
    textRendering?: string
  }
  if ("fontKerning" in c2d) c2d.fontKerning = "normal"
  if ("textRendering" in c2d) c2d.textRendering = "geometricPrecision"

  const metrics = ctx.measureText(text)
  const textWidth = metrics.width
  let textLeft: number
  if (alignment === "center") textLeft = textX - textWidth / 2
  else if (alignment === "left") textLeft = textX
  else textLeft = textX - textWidth

  const textBoundaries: TextBoundaries = {
    left: textLeft,
    right: textLeft + textWidth,
    width: textWidth,
  }

  ctx.fillText(text, textX, textY)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const currentDPR = canvas.width / parseFloat(canvas.style.width || "1")
  const baseSampleRate = Math.max(1, Math.round(currentDPR / 3))
  const sampleRate = baseSampleRate

  for (let y = 0; y < canvas.height; y += sampleRate) {
    for (let x = 0; x < canvas.width; x += sampleRate) {
      const index = (y * canvas.width + x) * 4
      const alpha = data[index + 3]
      if (alpha > 0) {
        const originalAlpha = (alpha / 255) * (sampleRate / currentDPR)
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
          opacity: originalAlpha,
          originalAlpha,
          velocityX: 0,
          velocityY: 0,
          angle: 0,
          speed: 0,
        })
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return { particles, textBoundaries }
}

function updateParticles(
  particles: Particle[],
  vaporizeX: number,
  deltaTime: number,
  MULTIPLIED_VAPORIZE_SPREAD: number,
  VAPORIZE_DURATION: number,
  direction: string,
  density: number,
) {
  let allParticlesVaporized = true
  particles.forEach((particle) => {
    const shouldVaporize =
      direction === "left-to-right"
        ? particle.originalX <= vaporizeX
        : particle.originalX >= vaporizeX

    if (shouldVaporize) {
      if (particle.speed === 0) {
        particle.angle = Math.random() * Math.PI * 2
        particle.speed = (Math.random() * 1 + 0.5) * MULTIPLIED_VAPORIZE_SPREAD
        particle.velocityX = Math.cos(particle.angle) * particle.speed
        particle.velocityY = Math.sin(particle.angle) * particle.speed
        particle.shouldFadeQuickly = Math.random() > density
      }

      if (particle.shouldFadeQuickly) {
        particle.opacity = Math.max(0, particle.opacity - deltaTime)
      } else {
        const dx = particle.originalX - particle.x
        const dy = particle.originalY - particle.y
        const distanceFromOrigin = Math.sqrt(dx * dx + dy * dy)
        const dampingFactor = Math.max(
          0.95,
          1 - distanceFromOrigin / (100 * MULTIPLIED_VAPORIZE_SPREAD),
        )
        const randomSpread = MULTIPLIED_VAPORIZE_SPREAD * 3
        const spreadX = (Math.random() - 0.5) * randomSpread
        const spreadY = (Math.random() - 0.5) * randomSpread
        particle.velocityX =
          (particle.velocityX + spreadX + dx * 0.002) * dampingFactor
        particle.velocityY =
          (particle.velocityY + spreadY + dy * 0.002) * dampingFactor
        const maxVelocity = MULTIPLIED_VAPORIZE_SPREAD * 2
        const currentVelocity = Math.sqrt(
          particle.velocityX * particle.velocityX +
            particle.velocityY * particle.velocityY,
        )
        if (currentVelocity > maxVelocity) {
          const scale = maxVelocity / currentVelocity
          particle.velocityX *= scale
          particle.velocityY *= scale
        }
        particle.x += particle.velocityX * deltaTime * 20
        particle.y += particle.velocityY * deltaTime * 10
        const baseFadeRate = 0.25
        const durationBasedFadeRate = baseFadeRate * (2000 / VAPORIZE_DURATION)
        particle.opacity = Math.max(
          0,
          particle.opacity - deltaTime * durationBasedFadeRate,
        )
      }
      if (particle.opacity > 0.01) allParticlesVaporized = false
    } else {
      allParticlesVaporized = false
    }
  })
  return allParticlesVaporized
}

function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  globalDpr: number,
) {
  ctx.save()
  ctx.scale(globalDpr, globalDpr)
  particles.forEach((particle) => {
    if (particle.opacity > 0) {
      const col = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`)
      ctx.fillStyle = col
      ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1)
    }
  })
  ctx.restore()
}

function resetParticles(particles: Particle[]) {
  particles.forEach((particle) => {
    particle.x = particle.originalX
    particle.y = particle.originalY
    particle.opacity = particle.originalAlpha
    particle.speed = 0
    particle.velocityX = 0
    particle.velocityY = 0
  })
}

function calculateVaporizeSpread(fontSize: number) {
  const size = Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 48
  const points = [
    { size: 20, spread: 0.2 },
    { size: 50, spread: 0.5 },
    { size: 100, spread: 1.5 },
  ]
  if (size <= points[0].size) return points[0].spread
  if (size >= points[points.length - 1].size)
    return points[points.length - 1].spread
  let i = 0
  while (i < points.length - 1 && points[i + 1].size < size) i++
  const p1 = points[i]
  const p2 = points[i + 1]
  return (
    p1.spread +
    ((size - p1.size) * (p2.spread - p1.spread)) / (p2.size - p1.size)
  )
}

function parseColor(color: string) {
  const rgbaMatch = color.match(
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/,
  )
  const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch
    return `rgba(${r}, ${g}, ${b}, 1)`
  }
  const hex = color.match(/^#([0-9a-fA-F]{6})$/)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 1)`
  }
  return "rgba(51, 204, 221, 1)"
}

function transformValue(
  input: number,
  inputRange: number[],
  outputRange: number[],
  clamp = false,
) {
  const [inputMin, inputMax] = inputRange
  const [outputMin, outputMax] = outputRange
  const progress = (input - inputMin) / (inputMax - inputMin)
  let result = outputMin + progress * (outputMax - outputMin)
  if (clamp) {
    if (outputMax > outputMin) {
      result = Math.min(Math.max(result, outputMin), outputMax)
    } else {
      result = Math.min(Math.max(result, outputMax), outputMin)
    }
  }
  return result
}

/** Demo wrapper matching the original “Component” export */
export function Component() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <VaporizeTextCycle
        texts={["21st.dev", "Is", "Cool"]}
        font={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "70px",
          fontWeight: 600,
        }}
        color="rgb(255,255,255)"
        spread={5}
        density={5}
        animation={{
          vaporizeDuration: 2,
          fadeInDuration: 1,
          waitDuration: 0.5,
        }}
        direction="left-to-right"
        alignment="center"
        tag={Tag.H1}
      />
    </div>
  )
}
