import React, { useEffect, useRef, useState } from 'react';

interface HeroHoloOrbProps {
  movieCount?: number;
  ratingAvg?: number;
}

export const HeroHoloOrb: React.FC<HeroHoloOrbProps> = ({ movieCount = 36, ratingAvg = 7.7 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create 3D points on a sphere (Fibonacci sphere algorithm)
    const numPoints = 85;
    const radius = Math.min(width, height) * 0.38;
    const points: { x: number; y: number; z: number; baseColor: string; size: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = (Math.PI * (3 - Math.sqrt(5))) * i; // golden angle

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Color variation between cyan, violet, and gold
      const isGold = i % 8 === 0;
      const isViolet = i % 5 === 0 && !isGold;
      const baseColor = isGold ? '245, 158, 11' : isViolet ? '168, 85, 247' : '6, 182, 212';

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseColor,
        size: isGold ? 2.8 : 1.8,
      });
    }

    let angleX = 0.2;
    let angleY = 0;
    let targetAngleX = 0.2;
    let targetAngleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      targetAngleY += 0.005;
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;

      // Center glowing core
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.7);
      coreGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      coreGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
      coreGrad.addColorStop(1, 'rgba(7, 9, 14, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Transform points with 3D rotation matrix
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projectedPoints = points.map((p) => {
        // Rotate Y
        let x1 = p.x * cosY + p.z * sinY;
        let z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 350;
        const scale = fov / (fov + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;
        const alpha = Math.max(0.15, (z2 + radius) / (2 * radius));

        return {
          x: x2d,
          y: y2d,
          z: z2,
          scale,
          alpha,
          baseColor: p.baseColor,
          size: p.size * scale,
        };
      });

      // Sort by depth for correct 3D rendering
      projectedPoints.sort((a, b) => a.z - b.z);

      // Draw faint connections between nearby points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (p1.z < -radius * 0.6) continue; // skip deep back lines

        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 45) * 0.18 * ((p1.alpha + p2.alpha) / 2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw projected nodes
      for (const p of projectedPoints) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.baseColor}, ${p.alpha})`;
        ctx.fill();

        // Glow halo on front points
        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.baseColor}, ${p.alpha * 0.25})`;
          ctx.fill();
        }
      }

      // Draw orbital holographic ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angleX * 0.5);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
      ctx.setLineDash([8, 12]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetAngleX = y * 0.4 + 0.2;
      targetAngleY += x * 0.01;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden cursor-crosshair select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
