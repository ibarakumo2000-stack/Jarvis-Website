"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Power, RotateCcw } from "lucide-react";

type Point3D = { x: number; y: number; z: number };
type ProjectedPoint = Point3D & { sx: number; sy: number; depth: number; scale: number };

const PARTICLE_COUNT = 144;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const spherePoints: Point3D[] = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const y = 1 - (index / (PARTICLE_COUNT - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = GOLDEN_ANGLE * index;
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
});

const links: [number, number][] = [];
for (let index = 0; index < PARTICLE_COUNT; index += 1) {
  if (index + 1 < PARTICLE_COUNT && index % 2 === 0) links.push([index, index + 1]);
  if (index + 7 < PARTICLE_COUNT && index % 3 === 0) links.push([index, index + 7]);
  if (index + 19 < PARTICLE_COUNT && index % 5 === 0) links.push([index, index + 19]);
}

function rotatePoint(point: Point3D, xAngle: number, yAngle: number, zAngle: number): Point3D {
  const cosX = Math.cos(xAngle);
  const sinX = Math.sin(xAngle);
  const cosY = Math.cos(yAngle);
  const sinY = Math.sin(yAngle);
  const cosZ = Math.cos(zAngle);
  const sinZ = Math.sin(zAngle);

  const y1 = point.y * cosX - point.z * sinX;
  const z1 = point.y * sinX + point.z * cosX;
  const x2 = point.x * cosY + z1 * sinY;
  const z2 = -point.x * sinY + z1 * cosY;

  return {
    x: x2 * cosZ - y1 * sinZ,
    y: x2 * sinZ + y1 * cosZ,
    z: z2,
  };
}

function traceOrbit(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  angles: { x: number; y: number; z: number },
  tilt: number,
  opacity: number,
) {
  context.beginPath();
  const steps = 96;
  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2;
    const point = rotatePoint(
      {
        x: Math.cos(angle) * 1.18,
        y: Math.sin(angle) * 0.48,
        z: Math.sin(angle) * 0.12,
      },
      tilt,
      angles.y,
      angles.z,
    );
    const perspective = 3.2 / (3.2 - point.z);
    const px = width / 2 + point.x * scale * perspective;
    const py = height / 2 + point.y * scale * perspective;
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.strokeStyle = `rgba(128, 228, 244, ${opacity})`;
  context.lineWidth = 0.8;
  context.stroke();
}

export default function InteractiveCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: -0.2, y: 0.55, z: -0.12 });
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const drawRef = useRef<(() => void) | null>(null);
  const reducedMotionRef = useRef(false);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activeSpherePoints = window.matchMedia("(max-width: 600px)").matches
      ? spherePoints.slice(0, 104)
      : spherePoints;
    const activeLinks = links.filter(([from, to]) =>
      from < activeSpherePoints.length && to < activeSpherePoints.length
    );
    reducedMotionRef.current = reducedMotion;
    const host = canvas.parentElement;
    if (!host) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let lastDrawTime = 0;
    let visible = true;
    let destroyed = false;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      // Cap canvas backing-store resolution to reduce GPU memory on high-DPI displays.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const project = (point: Point3D, scale: number): ProjectedPoint => {
      const rotated = rotatePoint(
        point,
        rotationRef.current.x + pointerRef.current.y * 0.24,
        rotationRef.current.y + pointerRef.current.x * 0.28,
        rotationRef.current.z,
      );
      const perspective = 3.15 / (3.15 - rotated.z);
      return {
        ...rotated,
        sx: width / 2 + rotated.x * scale * perspective,
        sy: height / 2 + rotated.y * scale * perspective,
        depth: (rotated.z + 1) / 2,
        scale: perspective,
      };
    };

    const drawWireArc = (latitude: number, scale: number) => {
      context.beginPath();
      const steps = 40;
      for (let index = 0; index <= steps; index += 1) {
        const longitude = (index / steps) * Math.PI * 2;
        const radius = Math.cos(latitude);
        const point = project({
          x: radius * Math.cos(longitude),
          y: Math.sin(latitude),
          z: radius * Math.sin(longitude),
        }, scale);
        if (index === 0) context.moveTo(point.sx, point.sy);
        else context.lineTo(point.sx, point.sy);
      }
      context.strokeStyle = `rgba(103, 207, 237, ${0.085 + Math.cos(latitude) * 0.045})`;
      context.lineWidth = 0.65;
      context.stroke();
    };

    const draw = () => {
      if (destroyed) return;
      context.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.315;
      const pulse = engaged ? 1 : 0.65;
      const glow = context.createRadialGradient(width / 2, height / 2, 2, width / 2, height / 2, radius * 1.9);
      glow.addColorStop(0, engaged ? "rgba(53, 191, 217, 0.24)" : "rgba(53, 191, 217, 0.14)");
      glow.addColorStop(0.55, "rgba(28, 118, 149, 0.065)");
      glow.addColorStop(1, "rgba(5, 16, 24, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const spin = elapsed * (engaged ? 0.00042 : 0.00018);
      const angles = { x: rotationRef.current.x, y: rotationRef.current.y + spin, z: rotationRef.current.z };
      traceOrbit(context, width, height, radius, angles, 0.8, engaged ? 0.72 : 0.4);
      traceOrbit(context, width, height, radius * 1.02, angles, -0.76, engaged ? 0.4 : 0.23);
      traceOrbit(context, width, height, radius * 0.92, angles, 1.3, engaged ? 0.36 : 0.2);

      for (let latitudeIndex = -4; latitudeIndex <= 4; latitudeIndex += 1) {
        drawWireArc((latitudeIndex / 5) * (Math.PI / 2), radius);
      }

      for (let longitudeIndex = 0; longitudeIndex < 8; longitudeIndex += 1) {
        context.beginPath();
        const longitude = (longitudeIndex / 12) * Math.PI;
        for (let step = 0; step <= 28; step += 1) {
          const latitude = -Math.PI / 2 + (step / 28) * Math.PI;
          const point = project({
            x: Math.cos(latitude) * Math.cos(longitude),
            y: Math.sin(latitude),
            z: Math.cos(latitude) * Math.sin(longitude),
          }, radius);
          if (step === 0) context.moveTo(point.sx, point.sy);
          else context.lineTo(point.sx, point.sy);
        }
        context.strokeStyle = "rgba(103, 207, 237, 0.12)";
        context.lineWidth = 0.6;
        context.stroke();
      }

      const projected = activeSpherePoints.map((point) => project(point, radius));
      context.lineWidth = engaged ? 0.8 : 0.55;
      for (const [from, to] of activeLinks) {
        const a = projected[from];
        const b = projected[to];
        if (a.depth < 0.42 && b.depth < 0.42) continue;
        context.beginPath();
        context.moveTo(a.sx, a.sy);
        context.lineTo(b.sx, b.sy);
        context.strokeStyle = `rgba(104, 223, 242, ${(0.04 + Math.min(a.depth, b.depth) * 0.16) * pulse})`;
        context.stroke();
      }

      projected
        .sort((a, b) => a.depth - b.depth)
        .forEach((point, index) => {
          const size = 0.7 + point.depth * (engaged ? 1.65 : 1.25);
          context.beginPath();
          context.arc(point.sx, point.sy, size, 0, Math.PI * 2);
          context.fillStyle = point.depth > 0.76
            ? `rgba(191, 249, 255, ${0.48 + point.depth * 0.5})`
            : `rgba(87, 205, 231, ${0.13 + point.depth * 0.62})`;
          context.fill();

          if (index % 53 === 0 && point.depth > 0.58) {
            context.beginPath();
            context.arc(point.sx, point.sy, size * 3.3, 0, Math.PI * 2);
            context.strokeStyle = "rgba(128, 228, 244, 0.3)";
            context.lineWidth = 0.7;
            context.stroke();
          }
        });

      const centre = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, radius * 0.64);
      centre.addColorStop(0, engaged ? "rgba(92, 227, 244, 0.18)" : "rgba(92, 227, 244, 0.08)");
      centre.addColorStop(0.58, "rgba(8, 35, 48, 0.1)");
      centre.addColorStop(1, "rgba(5, 12, 20, 0)");
      context.fillStyle = centre;
      context.beginPath();
      context.arc(width / 2, height / 2, radius * 0.68, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.arc(width / 2, height / 2, radius * 0.79, 0, Math.PI * 2);
      context.strokeStyle = engaged ? "rgba(128, 228, 244, 0.58)" : "rgba(128, 228, 244, 0.28)";
      context.lineWidth = 0.8;
      context.stroke();
    };

    drawRef.current = draw;

    const tick = (time: number) => {
      if (destroyed || reducedMotion || !visible || document.hidden) {
        frame = 0;
        return;
      }

      // Keep the core smooth while avoiding a full canvas redraw on every
      // display refresh. 30 FPS is enough for this ambient visualization.
      if (time - lastDrawTime < FRAME_INTERVAL) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      if (lastTime) elapsed += Math.min(time - lastTime, 40);
      lastTime = time;
      lastDrawTime = time;
      rotationRef.current.y += dragRef.current.active ? 0 : 0.0016 * (engaged ? 1.5 : 0.65);
      draw();
      frame = window.requestAnimationFrame(tick);
    };

    const syncAnimation = () => {
      if (destroyed) return;

      if (reducedMotion || document.hidden || !visible) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        lastDrawTime = 0;
        return;
      }

      if (!frame) {
        lastTime = 0;
        lastDrawTime = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0.05 });
    observer.observe(host);

    const onVisibilityChange = () => syncAnimation();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    syncAnimation();

    return () => {
      destroyed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      drawRef.current = null;
    };
  }, [engaged]);

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    pointerRef.current = {
      x: Math.max(-1, Math.min(1, (event.clientX - window.innerWidth / 2) / window.innerWidth)),
      y: Math.max(-1, Math.min(1, (event.clientY - window.innerHeight / 2) / window.innerHeight)),
    };
    if (!dragRef.current.active) {
      if (reducedMotionRef.current) drawRef.current?.();
      return;
    }
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    rotationRef.current.y += dx * 0.008;
    rotationRef.current.x = Math.max(-1.3, Math.min(1.3, rotationRef.current.x + dy * 0.008));
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    if (reducedMotionRef.current) drawRef.current?.();
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const step = event.shiftKey ? 0.24 : 0.12;
    if (event.key === "ArrowLeft") rotationRef.current.y -= step;
    else if (event.key === "ArrowRight") rotationRef.current.y += step;
    else if (event.key === "ArrowUp") rotationRef.current.x = Math.max(-1.3, rotationRef.current.x - step);
    else if (event.key === "ArrowDown") rotationRef.current.x = Math.min(1.3, rotationRef.current.x + step);
    else return;
    event.preventDefault();
    if (reducedMotionRef.current) drawRef.current?.();
  };

  const resetView = () => {
    rotationRef.current = { x: -0.2, y: 0.55, z: -0.12 };
    pointerRef.current = { x: 0, y: 0 };
    if (reducedMotionRef.current) drawRef.current?.();
  };

  return (
    <div className={`interactive-core${engaged ? " core-active" : ""}`}>
      <div className="core-stage core-stage-interactive">
        <div className="core-grid" aria-hidden="true" />
        <div className="core-halo core-halo-interactive" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          className="core-canvas"
          role="img"
          aria-label="Interactive three-dimensional JARVIS system core. Drag to rotate; use the arrow keys when focused."
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        />
        <div className="core-hud core-hud-top" aria-hidden="true">
          <span><i className="signal-dot" /> INTERACTIVE CORE <b>3D / 56</b></span>
          <span>DRAG TO ORBIT</span>
        </div>
        <div className="core-hud core-hud-left" aria-hidden="true">
          <span>NEURAL ENGINE</span>
          <strong>{engaged ? "ENGAGED" : "STANDBY"}</strong>
          <small>{engaged ? "LIVE SIMULATION" : "AWAITING INPUT"}</small>
        </div>
        <div className="core-hud core-hud-right" aria-hidden="true">
          <span>ROTATION</span>
          <strong>360°</strong>
          <small>SPATIAL VIEW</small>
        </div>
        <div className="core-core-label" aria-hidden="true">J.A.R.V.I.S. <span>◆</span> SYSTEM CORE</div>
        <div className="core-control-row">
          <span className="core-live-status"><i className="signal-dot" /> {engaged ? "CORE ACTIVE" : "SYSTEM READY"}</span>
          <div className="core-control-actions">
            <button className="core-control-button" type="button" onClick={resetView} aria-label="Reset core rotation" title="Reset view">
              <RotateCcw size={13} /> <span>RESET</span>
            </button>
            <button className="core-control-button core-power-button" type="button" onClick={() => setEngaged((current) => !current)} aria-pressed={engaged}>
              <Power size={13} /> <span>{engaged ? "STANDBY" : "ENGAGE CORE"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
