"use client"
import { useEffect, useRef } from "react"

const data = [
  { label: "Recently assigned", value: 5, color: "#8b5cf6" },
  { label: "Do today", value: 2, color: "#8b5cf6" },
  { label: "Do next", value: 0, color: "#8b5cf6" },
  { label: "Do later", value: 0, color: "#8b5cf6" },
]

const total = data.reduce((acc, item) => acc + item.value, 0)

export default function BarChart() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = wrapperRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let startTime: number | null = null
    let isCancelled = false

    const render = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = Math.max(260, Math.min(360, width * 0.5))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const padding = 60
      const chartWidth = width - 2 * padding
      const chartHeight = height - 2 * padding
      const barWidth = 35
      const maxValue = Math.max(...data.map(item => item.value))
      const adjustedMaxValue =
        maxValue <= 10 ? maxValue + 2 : maxValue + Math.ceil(maxValue * 0.1)

      const getGridLines = (max: number) => {
        if (max <= 10) return 5
        if (max <= 20) return 4
        if (max <= 50) return 5
        if (max <= 100) return 6
        return Math.min(10, Math.ceil(max / 10))
      }
      const gridLines = getGridLines(adjustedMaxValue)

      const draw = (timestamp: number) => {
        if (isCancelled) return
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const animationProgress = Math.min(elapsed / 1000, 1)

        ctx.clearRect(0, 0, width, height)

        // Grid lines
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        for (let i = 0; i <= gridLines; i++) {
          const y = padding + (chartHeight / gridLines) * i
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(padding + chartWidth, y)
          ctx.stroke()
        }

        // Bars
        data.forEach((item, index) => {
          const x = padding + index * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2
          const barHeight = (item.value / adjustedMaxValue) * chartHeight * animationProgress
          const y = padding + chartHeight - barHeight

          ctx.fillStyle = item.color
          ctx.fillRect(x, y, barWidth, barHeight)

          if (item.value > 0) {
            ctx.fillStyle = "white"
            ctx.font = "bold 12px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)
          }

          ctx.fillStyle = "white"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(item.label, x + barWidth / 2, padding + chartHeight + 20)
        })

        // Axis labels
        ctx.fillStyle = "white"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        for (let i = 0; i <= gridLines; i++) {
          const value = Math.round((adjustedMaxValue / gridLines) * (gridLines - i))
          const y = padding + (chartHeight / gridLines) * i
          ctx.fillText(value.toString(), padding - 10, y + 5)
        }

        if (animationProgress < 1) {
          animationId = requestAnimationFrame(draw)
        }
      }

      startTime = null
      animationId = requestAnimationFrame(draw)
    }

    // Initial render & resize observer
    const ro = new ResizeObserver(render)
    ro.observe(container)
    render()

    return () => {
      isCancelled = true
      cancelAnimationFrame(animationId)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <div className="relative w-full h-full">
        <canvas ref={canvasRef} />
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-white font-medium">
          Tasks (count)
        </div>
      </div>
    </div>
  )
}
