import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   ZoonerCityAnimation - Ultra 3D City Engine
   Features:
   - 3D Isometric Buildings with extruded height, rooftop details & glowing neon signs
   - Night City Atmosphere with Streetlights & Vehicle Headlight Cones
   - Interactive Radar Beam & Energy Signal Streams
   - Animated Walkers, Cars with Tail Lights, Particles & Floating Badges
───────────────────────────────────────────────────────────────────────────── */

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; r: number; color: string;
}

interface Walker {
  x: number; y: number;
  tx: number; ty: number;
  speed: number; color: string;
  step: number; stepDir: 1 | -1;
}

interface Car {
  x: number; y: number;
  speed: number; dir: 'H' | 'V';
  color: string; length: number;
}

interface Shop {
  x: number; y: number; w: number; h: number; height3D: number;
  name: string; category: string; color: string;
  lit: boolean; windows: { x: number; y: number }[];
}

const COLORS = {
  bg: '#050914',
  road: '#0B1324',
  roadLine: '#1B2C4B',
  block: '#08101E',
  blockBorder: '#122038',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  pink: '#ec4899',
  person: '#fbbf24',
  personBody: '#6366f1',
};

export const ZoonerCityAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    frame: 0,
    scene: 0, // 0=idle 1=search 2=ping 3=reply 4=walkin
    particles: [] as Particle[],
    walkers: [] as Walker[],
    cars: [] as Car[],
    shops: [] as Shop[],
    radarR: 0,
    personX: 0,
    personY: 0,
    personTX: 0,
    personTY: 0,
    width: 0,
    height: 0,
    dpr: 1,
  });

  const [overlayScene, setOverlayScene] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    stateRef.current.dpr = dpr;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      stateRef.current.width = w;
      stateRef.current.height = h;

      const s = stateRef.current;
      s.personX = w * 0.5;
      s.personY = h * 0.52;
      s.personTX = w * 0.5;
      s.personTY = h * 0.52;

      // Build 3D shops with varied heights
      s.shops = [
        buildShop(w * 0.16, h * 0.12, 90, 85, 24, 'Apex Footwear', 'Sports', COLORS.indigo),
        buildShop(w * 0.70, h * 0.08, 95, 80, 28, 'Sprint Sports', 'Apparel', COLORS.violet),
        buildShop(w * 0.76, h * 0.60, 85, 95, 22, 'Lifestyle', 'Fashion', COLORS.cyan),
        buildShop(w * 0.08, h * 0.62, 80, 85, 20, 'FreshMart', 'Grocery', COLORS.emerald),
        buildShop(w * 0.52, h * 0.76, 85, 75, 26, 'TechZone', 'Gadgets', COLORS.amber),
      ];

      // Spawn walkers
      s.walkers = Array.from({ length: 18 }, () => spawnWalker(w, h));

      // Spawn cars
      s.cars = [
        { x: 0, y: h * 0.455, speed: 2.2, dir: 'H', color: '#38bdf8', length: 14 },
        { x: w * 0.3, y: h * 0.455, speed: 1.8, dir: 'H', color: '#fbbf24', length: 14 },
        { x: w, y: h * 0.515, speed: -2.0, dir: 'H', color: '#f43f5e', length: 14 },
        { x: w * 0.7, y: h * 0.515, speed: -1.6, dir: 'H', color: '#a78bfa', length: 14 },
        { x: w * 0.455, y: 0, speed: 1.9, dir: 'V', color: '#34d399', length: 14 },
        { x: w * 0.475, y: h, speed: -2.1, dir: 'V', color: '#ec4899', length: 14 },
      ];
    };

    resize();
    window.addEventListener('resize', resize);

    // Scene scheduler
    const SCENE_DUR = [2800, 3200, 3200, 3800, 3000];
    let sceneLoop: ReturnType<typeof setTimeout>;

    const nextScene = () => {
      const s = stateRef.current;
      s.scene = (s.scene + 1) % 5;
      setOverlayScene(s.scene);

      if (s.scene === 2) {
        s.radarR = 0;
        s.shops.forEach(sh => { sh.lit = false; });
      }
      if (s.scene === 3) {
        s.shops.forEach((sh, i) => {
          setTimeout(() => {
            sh.lit = true;
          }, i * 350);
        });
      }
      if (s.scene === 4) {
        s.personTX = s.shops[0].x + s.shops[0].w / 2;
        s.personTY = s.shops[0].y + s.shops[0].h + 10;
      }
      if (s.scene === 0) {
        s.personTX = s.width * 0.5;
        s.personTY = s.height * 0.52;
        s.shops.forEach(sh => { sh.lit = false; });
        s.radarR = 0;
      }

      sceneLoop = setTimeout(nextScene, SCENE_DUR[s.scene]);
    };

    sceneLoop = setTimeout(nextScene, SCENE_DUR[0]);

    // Render loop
    let raf: number;
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const s = stateRef.current;
      const { width: W, height: H, dpr } = s;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.frame++;

      // Background
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle Map Grid
      ctx.fillStyle = 'rgba(99,102,241,0.06)';
      for (let gx = 0; gx < W; gx += 30)
        for (let gy = 0; gy < H; gy += 30) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

      // Roads
      drawRoads(ctx, W, H);

      // Streetlights
      drawStreetlights(ctx, W, H, s.frame);

      // Vehicle Traffic with Headlight Beams
      s.cars.forEach(car => updateAndDrawCar(ctx, car, W, H));

      // Blocks
      drawBlocks(ctx, W, H);

      // Walkers
      s.walkers.forEach(wk => updateAndDrawWalker(ctx, wk, W, H));

      // 3D Shops
      s.shops.forEach(sh => draw3DShop(ctx, sh, s.frame));

      // Radar & Signal Energy Beams
      if (s.scene === 2) {
        s.radarR += 4.0;
        const maxR = Math.max(W, H) * 0.65;
        if (s.radarR > maxR) s.radarR = 0;
        const alpha = Math.max(0, 0.7 * (1 - s.radarR / maxR));

        ctx.beginPath();
        ctx.arc(s.personX, s.personY, s.radarR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Energy Signal Rays to Shops
        s.shops.forEach(sh => {
          const tx = sh.x + sh.w / 2;
          const ty = sh.y + sh.h / 2;
          const dist = Math.hypot(tx - s.personX, ty - s.personY);
          if (s.radarR >= dist * 0.7) {
            ctx.beginPath();
            ctx.moveTo(s.personX, s.personY);
            ctx.lineTo(tx, ty);
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = `rgba(${hexToRgb(sh.color)}, 0.45)`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.setLineDash([]);

            // Floating Signal Particle
            const prog = ((s.frame * 4) % 100) / 100;
            ctx.beginPath();
            ctx.arc(s.personX + (tx - s.personX) * prog, s.personY + (ty - s.personY) * prog, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = sh.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = sh.color;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // Walking Path Line in Scene 4
      if (s.scene === 4) {
        ctx.beginPath();
        ctx.moveTo(s.personX, s.personY);
        ctx.lineTo(s.personTX, s.personTY);
        ctx.setLineDash([8, 5]);
        ctx.strokeStyle = 'rgba(99,102,241,0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Move Person
      const moveSpeed = s.scene === 4 ? 2.5 : 0.6;
      const dx = s.personTX - s.personX;
      const dy = s.personTY - s.personY;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        s.personX += (dx / dist) * Math.min(dist, moveSpeed);
        s.personY += (dy / dist) * Math.min(dist, moveSpeed);
      }

      const walking = s.scene === 4 && dist > 5;
      drawPerson(ctx, s.personX, s.personY, s.frame, walking);

      // Particle Emitters for Active Shops
      if (s.scene >= 3) {
        s.shops.filter(sh => sh.lit).forEach(sh => {
          if (Math.random() < 0.4) {
            s.particles.push({
              x: sh.x + Math.random() * sh.w,
              y: sh.y - sh.height3D,
              vx: (Math.random() - 0.5) * 1.8,
              vy: -Math.random() * 2.2 - 0.6,
              life: 50 + Math.random() * 30,
              maxLife: 80,
              r: 2 + Math.random() * 2,
              color: sh.color,
            });
          }
        });
      }

      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        const alpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(sceneLoop);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
      {/* 3D Isometric Tilt Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          transform: 'rotateX(36deg) rotateZ(-7deg) scale(1.3)',
          transformOrigin: '50% 50%',
        }}
      />

      {/* Atmospheric Depth Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 85% 65% at 50% 40%, transparent 25%, rgba(5,9,20,0.7) 100%),
            linear-gradient(to top, rgba(5,9,20,0.95) 0%, transparent 35%)
          `,
        }}
      />

      {/* Authentic Human Chat Story Bubble */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-20 space-y-2.5 transition-all">
        {/* Customer Message */}
        <div className="flex items-start gap-2.5 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md">
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
            S
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Surya · Local Shopper</span>
              <span className="text-[10px] text-indigo-400 font-semibold">RS Puram</span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5 font-normal">
              "Does any store nearby have <span className="text-indigo-300 font-semibold">Nike Air Max 270 (Size 9)</span> in stock right now?"
            </p>
          </div>
        </div>

        {/* Store Response Message (shows when scene >= 3) */}
        {(overlayScene >= 3 || overlayScene === 0) && (
          <div className="flex items-start gap-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
              🏪
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Apex Footwear & Sports</span>
                <span className="text-[10px] text-emerald-400 font-semibold">400m away · 5 min walk</span>
              </div>
              <p className="text-xs text-slate-100 mt-0.5">
                "Yes! We have 2 pairs in Size 9 for <strong className="text-white font-bold">₹6,499</strong>. We've reserved 1 pair for 30 mins — walk in & try it on!"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Drawing Helpers ──────────────────────────────────────────────────────────

function buildShop(x: number, y: number, w: number, h: number, height3D: number, name: string, category: string, color: string): Shop {
  const windows: { x: number; y: number }[] = [];
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 3; col++)
      windows.push({ x: x + 8 + col * (w / 3 - 2), y: y + 8 + row * 18 });
  return { x, y, w, h, height3D, name, category, color, lit: false, windows };
}

function spawnWalker(W: number, H: number): Walker {
  const edge = Math.floor(Math.random() * 2);
  return {
    x: edge === 0 ? Math.random() * W : (Math.random() < 0.5 ? W * 0.44 : W * 0.48),
    y: edge === 1 ? Math.random() * H : (Math.random() < 0.5 ? H * 0.46 : H * 0.5),
    tx: Math.random() * W,
    ty: Math.random() * H,
    speed: 0.5 + Math.random() * 0.6,
    color: ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#c084fc'][Math.floor(Math.random() * 5)],
    step: 0,
    stepDir: 1,
  };
}

function updateAndDrawCar(ctx: CanvasRenderingContext2D, car: Car, W: number, H: number) {
  if (car.dir === 'H') {
    car.x += car.speed;
    if (car.speed > 0 && car.x > W + 20) car.x = -20;
    if (car.speed < 0 && car.x < -20) car.x = W + 20;
  } else {
    car.y += car.speed;
    if (car.speed > 0 && car.y > H + 20) car.y = -20;
    if (car.speed < 0 && car.y < -20) car.y = H + 20;
  }

  // Car Body
  ctx.fillStyle = car.color;
  ctx.beginPath();
  ctx.roundRect(car.x, car.y, car.dir === 'H' ? car.length : 6, car.dir === 'H' ? 6 : car.length, 3);
  ctx.fill();

  // Headlight Beams (Glowing light cone on road)
  ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.beginPath();
  if (car.dir === 'H' && car.speed > 0) {
    ctx.moveTo(car.x + car.length, car.y + 1);
    ctx.lineTo(car.x + car.length + 22, car.y - 4);
    ctx.lineTo(car.x + car.length + 22, car.y + 10);
  } else if (car.dir === 'H' && car.speed < 0) {
    ctx.moveTo(car.x, car.y + 1);
    ctx.lineTo(car.x - 22, car.y - 4);
    ctx.lineTo(car.x - 22, car.y + 10);
  }
  ctx.fill();
}

function drawRoads(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(0, H * 0.44, W, H * 0.1);
  ctx.fillRect(W * 0.44, 0, W * 0.09, H);

  // Dashed Lane Lines
  ctx.setLineDash([16, 12]);
  ctx.strokeStyle = COLORS.roadLine;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.49); ctx.lineTo(W, H * 0.49);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.485, 0); ctx.lineTo(W * 0.485, H);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawStreetlights(ctx: CanvasRenderingContext2D, W: number, H: number, frame: number) {
  const poles = [
    { x: W * 0.2, y: H * 0.42 },
    { x: W * 0.7, y: H * 0.42 },
    { x: W * 0.42, y: H * 0.2 },
    { x: W * 0.42, y: H * 0.7 },
  ];

  poles.forEach(p => {
    // Light Glow
    const pulse = 1 + 0.1 * Math.sin(frame * 0.08 + p.x);
    ctx.fillStyle = 'rgba(253, 230, 138, 0.12)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 22 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Pole Head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBlocks(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const blocks = [
    [0, 0, W * 0.42, H * 0.42],
    [W * 0.55, 0, W * 0.45, H * 0.42],
    [0, H * 0.56, W * 0.42, H * 0.44],
    [W * 0.55, H * 0.56, W * 0.45, H * 0.44],
  ] as [number, number, number, number][];

  blocks.forEach(([bx, by, bw, bh]) => {
    ctx.fillStyle = COLORS.block;
    ctx.strokeStyle = COLORS.blockBorder;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(bx + 4, by + 4, bw - 8, bh - 8, 12);
    ctx.fill();
    ctx.stroke();
  });
}

function updateAndDrawWalker(ctx: CanvasRenderingContext2D, wk: Walker, W: number, H: number) {
  const dx = wk.tx - wk.x;
  const dy = wk.ty - wk.y;
  const d = Math.hypot(dx, dy);
  if (d < 3) {
    wk.tx = Math.random() * W;
    wk.ty = Math.random() * H;
  } else {
    wk.x += (dx / d) * wk.speed;
    wk.y += (dy / d) * wk.speed;
  }
  wk.step += 0.15 * wk.stepDir;
  if (Math.abs(wk.step) > 1) wk.stepDir *= -1;

  ctx.beginPath();
  ctx.arc(wk.x, wk.y - 8, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = wk.color;
  ctx.fill();
}

function draw3DShop(ctx: CanvasRenderingContext2D, sh: Shop, _frame: number) {
  const { x, y, w, h, height3D, color, lit, windows } = sh;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2 + 8, y + h + 6, w / 2 + 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Side Face (Right)
  ctx.fillStyle = lit ? darkenHex(color, 0.55) : '#090f1d';
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + height3D * 0.7, y - height3D * 0.5);
  ctx.lineTo(x + w + height3D * 0.7, y + h - height3D * 0.5);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  // 3D Top Face (Rooftop)
  ctx.fillStyle = lit ? darkenHex(color, 0.75) : '#101a2b';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + height3D * 0.7, y - height3D * 0.5);
  ctx.lineTo(x + w + height3D * 0.7, y - height3D * 0.5);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  // Front Building Body
  ctx.fillStyle = lit ? color + '1a' : '#0e1726';
  ctx.strokeStyle = lit ? color : '#1a2d47';
  ctx.lineWidth = lit ? 2.5 : 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  if (lit) {
    ctx.shadowBlur = 24;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Windows
  windows.forEach(win => {
    ctx.fillStyle = lit ? color + 'bb' : '#1a2d47';
    ctx.beginPath();
    ctx.roundRect(win.x, win.y, w / 3 - 6, 10, 2);
    ctx.fill();
  });

  // Store Sign
  ctx.fillStyle = lit ? color : '#142038';
  ctx.beginPath();
  ctx.roundRect(x + 4, y + h - 18, w - 8, 14, 4);
  ctx.fill();

  if (lit) {
    ctx.font = `bold 8.5px "Outfit", sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(sh.name.split(' ')[0], x + w / 2, y + h - 7);
  }
}

function drawPerson(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _walking: boolean) {
  // Ground Shadow
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 12, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fill();

  // Live Location Halo Pulse
  const r1 = 18 + 4 * Math.sin(frame * 0.08);
  ctx.beginPath();
  ctx.arc(x, y, r1, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(99,102,241,0.3)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Body
  ctx.fillStyle = COLORS.personBody;
  ctx.beginPath();
  ctx.roundRect(x - 6, y - 17, 12, 17, 4);
  ctx.fill();

  // Head
  ctx.fillStyle = COLORS.person;
  ctx.beginPath();
  ctx.arc(x, y - 25, 7.5, 0, Math.PI * 2);
  ctx.fill();
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function darkenHex(hex: string, factor: number): string {
  const r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
  return `rgb(${r},${g},${b})`;
}
