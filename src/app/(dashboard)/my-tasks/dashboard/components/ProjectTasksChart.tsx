"use client";

import React, { useEffect, useRef } from "react";

// Single bar like screenshot: one project with value 2
const label = "Cross-fun…"; // truncated label similar to screenshot
const value = 2;

const ProjectTasksChart: React.FC = () => {
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
      const height = Math.max(240, Math.min(320, width * 0.6));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const padding = { top: 24, right: 16, bottom: 64, left: 44 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(padding.left, padding.top);

      // grid
      ctx.strokeStyle = "#e5e7eb";
      for (let i = 0; i <= 4; i += 1) {
        const y = (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartW, y);
        ctx.stroke();
      }

      const barW = 28;
      const x = chartW / 2 - barW / 2; // center
      const maxY = 4; // scale similar to screenshot
      const barH = (value / maxY) * chartH;
      const y = chartH - barH;

      // bar
      ctx.fillStyle = "#a78bfa";
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 6);
      ctx.fill();

      // value label above dot
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(value), chartW / 2, y - 8);

      // x label rotated
      ctx.save();
      ctx.translate(chartW / 2, chartH + 28);
      ctx.rotate((-35 * Math.PI) / 180);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, 0, 0);
      ctx.restore();

      // y labels
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let i = 0; i <= maxY; i += 1) {
        const yy = chartH - (i / maxY) * chartH;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(String(i), -8, yy);
      }

      ctx.restore();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[240px]">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ProjectTasksChart;


