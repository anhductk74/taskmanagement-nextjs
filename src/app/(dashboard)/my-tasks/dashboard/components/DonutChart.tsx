"use client"
import { useEffect, useRef } from "react"

type Slice = { label: string; value: number; color: string };
const data: Slice[] = [
  { label: "Completed", value: 1, color: "#8b5cf6" },
  { label: "Incomplete", value: 1, color: "#E7E2FA" },
];

const total = data.reduce((acc, item) => acc + item.value, 0)

export default function DonutChart() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const render = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = Math.max(260, Math.min(360, width * 0.7))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 10
      const innerRadius = radius * 0.6

      let animationProgress = 0
      let startTime: number | null = null

      const draw = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        animationProgress = Math.min(elapsed / 1000, 1)

        ctx.clearRect(0, 0, width, height)

        let startAngle = -Math.PI / 2
        data.forEach((item: Slice) => {
          const angle = (item.value / total) * Math.PI * 2 * animationProgress
          const endAngle = startAngle + angle

          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
          ctx.fillStyle = item.color
          ctx.fill()
          ctx.closePath()

          const midAngle = startAngle + angle / 2
          const textX = centerX + Math.cos(midAngle) * ((radius + innerRadius) / 2)
          const textY = centerY + Math.sin(midAngle) * ((radius + innerRadius) / 2)

          if (angle > 0.2) {
            ctx.fillStyle = "white"
            ctx.font = "bold 14px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(`${item.value}`, textX, textY)
          }

          startAngle = endAngle
        })

        ctx.fillStyle = "white"
        ctx.font = "bold 20px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${total}`, centerX, centerY)

        if (animationProgress < 1) requestAnimationFrame(draw)
      }

      requestAnimationFrame(draw)
    }

    render()

    const ro = new ResizeObserver(() => render())
    ro.observe(container)
    return () => ro.disconnect()
  }, [data])

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mr-10">
        <div ref={containerRef} className="w-full flex justify-center mt-10">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-white mb-1">Task Status</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full" style={{ background: data[0].color }} />
              <span className="text-sm text-white">{data[0].label}</span>
            </div>
            <span className="text-sm font-bold text-white">{data[0].value}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full" style={{ background: data[1].color }} />
              <span className="text-sm text-white">{data[1].label}</span>
            </div>
            <span className="text-sm font-bold text-white">{data[1].value}</span>
          </div>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-purple-200">
            <div className="text-sm text-white mb-1">Total Tasks</div>
            <div className="text-xl font-bold text-white">{total}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
