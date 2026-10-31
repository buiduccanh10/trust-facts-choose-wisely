"use client";

import { useEffect, useRef } from "react";

export function useHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero") ?? null;
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let pointer = { x: -9999, y: -9999 };
    let points: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      phase: number;
    }[] = [];

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from(
        { length: Math.min(72, Math.max(32, Math.round(width / 17))) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          radius: 1 + Math.random() * 1.3,
          phase: Math.random() * Math.PI * 2,
        })
      );
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];
        if (pointer.x > -9999) {
          const dx = pointer.x - point.x;
          const dy = pointer.y - point.y;
          const distanceToPointer = Math.hypot(dx, dy);
          if (distanceToPointer < 230 && distanceToPointer > 1) {
            const influence = 1 - distanceToPointer / 230;
            point.vx += dx * influence * 0.000035;
            point.vy += dy * influence * 0.000035;
            point.vx = Math.max(-0.55, Math.min(0.55, point.vx));
            point.vy = Math.max(-0.55, Math.min(0.55, point.vy));
          }
        }

        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        for (let j = i + 1; j < points.length; j += 1) {
          const other = points[j];
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 145) {
            context.strokeStyle = `rgba(20,83,45,${(1 - distance / 145) * 0.18})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        if (pointerDistance < 230) {
          const strength = (1 - pointerDistance / 230) * 0.28;
          context.strokeStyle = `rgba(20,83,45,${strength})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }

        const glow = 0.55 + 0.45 * Math.sin(time / 1400 + point.phase);
        context.fillStyle = `rgba(185,246,208,${0.55 * glow})`;
        context.beginPath();
        context.arc(point.x, point.y, point.radius * 3.2, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(57,217,130,${0.55 + 0.4 * glow})`;
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (pointer.x > -9999) {
        const pulse = 40 + 6 * Math.sin(time / 500);
        context.strokeStyle = "rgba(20,83,45,.34)";
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(pointer.x, pointer.y, pulse, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "rgba(185,246,208,.75)";
        context.beginPath();
        context.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "rgba(57,217,130,.96)";
        context.beginPath();
        context.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion && visible) frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (!reducedMotion && visible && !frame) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      hero.style.setProperty("--px", String((pointer.x / bounds.width) * 2 - 1));
      hero.style.setProperty("--py", String((pointer.y / bounds.height) * 2 - 1));
      if (reducedMotion) draw(0);
    };

    const onPointerLeave = () => {
      pointer = { x: -9999, y: -9999 };
      hero.style.setProperty("--px", "0");
      hero.style.setProperty("--py", "0");
      if (reducedMotion) draw(0);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        start();
      }
    });

    resize();
    draw(0);
    observer.observe(hero);
    window.addEventListener("resize", resize);
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return canvasRef;
}
