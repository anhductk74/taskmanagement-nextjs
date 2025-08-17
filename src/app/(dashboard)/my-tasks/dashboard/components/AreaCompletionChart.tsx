"use client";

import React, { useEffect, useRef } from "react";

// Static demo data similar to screenshot
const labels = [
  "04/08",
  "05/08",
  "06/08",
  "07/08",
  "08/08",
  "09/08",
  "10/08",
  "11/08",
  "12/08",
];

const totalSeries = [0, 2, 2, 2, 2, 2, 2, 2, 2];
const completedSeries = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const AreaCompletionChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width } = container.getBoundingClientRect();
      const height = Math.max(260, Math.min(380, width * 0.45));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw
      const padding = { top: 24, right: 20, bottom: 48, left: 40 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(padding.left, padding.top);

      // Grid
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const y = (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartW, y);
        ctx.stroke();
      }

      const maxY = 4; // y-axis ticks 0..4 to match screenshot
      const xStep = chartW / (labels.length - 1);

      // Area for total
      ctx.beginPath();
      ctx.moveTo(0, chartH);
      for (let i = 0; i < totalSeries.length; i += 1) {
        const x = i * xStep;
        const y = chartH - (totalSeries[i] / maxY) * chartH;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(chartW, chartH);
      ctx.closePath();
      ctx.fillStyle = "#a78bfa40"; // violet with alpha
      ctx.fill();
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Completed (line only)
      ctx.beginPath();
      for (let i = 0; i < completedSeries.length; i += 1) {
        const x = i * xStep;
        const y = chartH - (completedSeries[i] / maxY) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Y labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let i = 0; i <= maxY; i += 1) {
        const y = chartH - (i / maxY) * chartH;
        ctx.fillText(String(i), -8, y);
      }

      // X labels rotated
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let i = 0; i < labels.length; i += 1) {
        const x = i * xStep;
        const y = chartH + 8;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((-20 * Math.PI) / 180);
        ctx.fillText(labels[i], 0, 0);
        ctx.restore();
      }

      // point labels (numbers above)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (let i = 0; i < totalSeries.length; i += 1) {
        const x = i * xStep;
        const y = chartH - (totalSeries[i] / maxY) * chartH;
        ctx.fillText(String(totalSeries[i]), x, y - 6);
      }

      ctx.restore();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[260px]">
      <canvas ref={canvasRef} />
      <div className="mt-3 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block size-3 rounded bg-violet-200" />
          <span>Total</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block size-3 rounded bg-indigo-500" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default AreaCompletionChart;


