"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

type MotionMode = "pending" | "gl" | "static"

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [motionMode, setMotionMode] = useState<MotionMode>("pending")
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Record<string, THREE.IUniform> | null
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setMotionMode(reduced ? "static" : "gl")
  }, [])

  useEffect(() => {
    if (motionMode !== "gl" || !canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `

    const getMaxDpr = () => {
      const w = window.innerWidth
      const dpr = window.devicePixelRatio || 1
      if (w < 640) return Math.min(dpr, 1.35)
      return Math.min(dpr, 2)
    }

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: false, powerPreference: "high-performance" })
      refs.renderer.setPixelRatio(getMaxDpr())
      refs.renderer.setClearColor(new THREE.Color(0x000000))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)

      refs.uniforms = {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
      }

      const position = [
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0,
        1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setPixelRatio(getMaxDpr())
      refs.renderer.setSize(width, height, false)
      const res = refs.uniforms.resolution.value as THREE.Vector2
      res.set(width, height)
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [motionMode])

  if (motionMode !== "gl") {
    return (
      <div
        className="fixed top-0 left-0 z-0 block h-full w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
        aria-hidden
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 z-0 block h-full w-full"
      aria-hidden
    />
  )
}
