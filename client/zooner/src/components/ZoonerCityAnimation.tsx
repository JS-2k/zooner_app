import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   ZoonerCityAnimation
   A full-screen canvas-driven city animation: isometric-style map, animated
   people, pulsing shops, radar sweeps, floating notification badges.
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

interface Badge {
  x: number; y: number;
  text: string; sub: string;
  life: number; maxLife: number;
  color: string;
}

interface Shop {
  x: number; y: number; w: number; h: number;
  name: string; color: string;
  lit: boolean; litAt: number;
  windows: { x: number; y: number }[];
}

const COLORS = {
  bg: '#080E1C',
  road: '#0F1A2E',
  roadLine: '#1A2D47',
  block: '#0C1628',
  blockBorder: '#142038',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  person: '#fbbf24',
  personBody: '#6366f1',
};

export const ZoonerCityAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    frame: 0,
    scene: 0,       // 0=idle 1=search 2=ping 3=reply 4=walkin
    sceneTimer: 0,
    particles: [] as Particle[],
    walkers: [] as Walker[],
    badges: [] as Badge[],
    shops: [] as Shop[],
    radarR: 0,
    radarAlpha: 0,
    personX: 0,
    personY: 0,
    personTX: 0,
    personTY: 0,
    personStep: 0,
    personStepDir: 1 as 1 | -1,
    typedLen: 0,
    searchText: 'Nike Air Max 270...',
    nextScene: 0,
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

      // Build shops
      s.shops = [
        buildShop(w * 0.18, h * 0.12, 80, 90, 'Apex Footwear', COLORS.indigo),
        buildShop(w * 0.72, h * 0.08, 90, 80, 'Sprint Sports', COLORS.violet),
        buildShop(w * 0.78, h * 0.62, 85, 95, 'Lifestyle', COLORS.cyan),
        buildShop(w * 0.08, h * 0.65, 75, 80, 'FreshMart', COLORS.emerald),
        buildShop(w * 0.55, h * 0.78, 80, 70, 'TechZone', COLORS.amber),
      ];

      // Spawn walkers
      s.walkers = Array.from({ length: 14 }, () => spawnWalker(w, h));
    };

    resize();
    window.addEventListener('resize', resize);

    // Scene scheduler
    const SCENE_DUR = [2500, 3000, 3000, 3500, 2500];
    let sceneLoop: ReturnType<typeof setTimeout>;

    const nextScene = () => {
      const s = stateRef.current;
      s.scene = (s.scene + 1) % 5;
      setOverlayScene(s.scene);

      if (s.scene === 1) {
        // start typing
        s.typedLen = 0;
      }
      if (s.scene === 2) {
        // radar ping
        s.radarR = 0;
        s.radarAlpha = 1;
        s.shops.forEach(sh => { sh.lit = false; });
      }
      if (s.scene === 3) {
        // light up shops + spawn badges
        s.shops.forEach((sh, i) => {
          setTimeout(() => {
            sh.lit = true;
            sh.litAt = s.frame;
            s.badges.push({
              x: sh.x + sh.w / 2,
              y: sh.y - 10,
              text: sh.name,
              sub: '✓ In Stock',
              life: 220,
              maxLife: 220,
              color: sh.color,
            });
          }, i * 400);
        });
      }
      if (s.scene === 4) {
        // person walks toward first shop
        s.personTX = s.shops[0].x + s.shops[0].w / 2;
        s.personTY = s.shops[0].y + s.shops[0].h;
      }
      if (s.scene === 0) {
        // reset
        s.personTX = s.width * 0.5;
        s.personTY = s.height * 0.52;
        s.shops.forEach(sh => { sh.lit = false; });
        s.badges = [];
        s.radarR = 0;
        s.radarAlpha = 0;
        s.typedLen = 0;
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

      // ── Background ──────────────────────────────────────────────────────
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      ctx.fillStyle = 'rgba(99,102,241,0.07)';
      const gsp = 28;
      for (let gx = 0; gx < W; gx += gsp)
        for (let gy = 0; gy < H; gy += gsp) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

      // ── Roads ────────────────────────────────────────────────────────────
      drawRoads(ctx, W, H, s.frame);

      // ── Blocks ───────────────────────────────────────────────────────────
      drawBlocks(ctx, W, H);

      // ── Walkers ──────────────────────────────────────────────────────────
      s.walkers.forEach(wk => updateAndDrawWalker(ctx, wk, W, H, s.frame));

      // ── Shops ────────────────────────────────────────────────────────────
      s.shops.forEach(sh => drawShop(ctx, sh, s.frame));

      // ── Radar ────────────────────────────────────────────────────────────
      if (s.scene === 2) {
        s.radarR += 3.5;
        if (s.radarR > Math.max(W, H) * 0.7) {
          s.radarR = 0;
        }
        const maxR = Math.max(W, H) * 0.7;
        const alpha = Math.max(0, 0.6 * (1 - s.radarR / maxR));

        ctx.beginPath();
        ctx.arc(s.personX, s.personY, s.radarR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Second ring offset
        if (s.radarR > 60) {
          ctx.beginPath();
          ctx.arc(s.personX, s.personY, s.radarR - 60, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139,92,246,${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Ping lines to shops
        s.shops.forEach(sh => {
          const tx = sh.x + sh.w / 2;
          const ty = sh.y + sh.h / 2;
          const dist = Math.hypot(tx - s.personX, ty - s.personY);
          if (s.radarR >= dist * 0.8) {
            ctx.beginPath();
            ctx.moveTo(s.personX, s.personY);
            ctx.lineTo(tx, ty);
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = `rgba(${hexToRgb(sh.color)}, 0.35)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            // Moving dot
            const prog = Math.min(1, (s.radarR - dist * 0.8) / (dist * 0.4));
            if (prog > 0) {
              const dx = tx - s.personX;
              const dy = ty - s.personY;
              ctx.beginPath();
              ctx.arc(s.personX + dx * prog, s.personY + dy * prog, 4, 0, Math.PI * 2);
              ctx.fillStyle = sh.color;
              ctx.shadowBlur = 10;
              ctx.shadowColor = sh.color;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      }

      // ── Walking path ─────────────────────────────────────────────────────
      if (s.scene === 4) {
        ctx.beginPath();
        ctx.moveTo(s.personX, s.personY);
        ctx.lineTo(s.personTX, s.personTY);
        ctx.setLineDash([8, 5]);
        ctx.strokeStyle = 'rgba(99,102,241,0.5)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Destination circle
        ctx.beginPath();
        const pulse = 1 + 0.15 * Math.sin(s.frame * 0.1);
        ctx.arc(s.personTX, s.personTY - 20, 18 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.15)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.personTX, s.personTY - 20, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.4)';
        ctx.fill();
      }

      // ── Person ───────────────────────────────────────────────────────────
      // Smooth movement
      const moveSpeed = s.scene === 4 ? 2.2 : 0.5;
      const dx = s.personTX - s.personX;
      const dy = s.personTY - s.personY;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        s.personX += (dx / dist) * Math.min(dist, moveSpeed);
        s.personY += (dy / dist) * Math.min(dist, moveSpeed);
      }

      const walking = s.scene === 4 && dist > 5;
      drawPerson(ctx, s.personX, s.personY, s.frame, walking, s.scene);

      // ── Search bubble ────────────────────────────────────────────────────
      if (s.scene === 1) {
        if (s.frame % 3 === 0 && s.typedLen < s.searchText.length) s.typedLen++;
        drawSearchBubble(ctx, s.personX + 20, s.personY - 55, s.searchText.slice(0, s.typedLen), s.frame);
      }

      // ── Badges ───────────────────────────────────────────────────────────
      s.badges = s.badges.filter(b => b.life > 0);
      s.badges.forEach(b => {
        b.life--;
        b.y -= 0.15;
        drawBadge(ctx, b);
      });

      // ── Particles ────────────────────────────────────────────────────────
      // Spawn particles around lit shops
      if (s.scene >= 3) {
        s.shops.filter(sh => sh.lit).forEach(sh => {
          if (Math.random() < 0.3) {
            s.particles.push({
              x: sh.x + Math.random() * sh.w,
              y: sh.y + Math.random() * sh.h,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -Math.random() * 2 - 0.5,
              life: 40 + Math.random() * 40,
              maxLife: 80,
              r: 1.5 + Math.random() * 2.5,
              color: sh.color,
            });
          }
        });
      }

      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.life--;
        const alpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // ── GPS coordinates text ─────────────────────────────────────────────
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(99,102,241,0.25)';
      ctx.fillText(`${(11.016 + Math.sin(s.frame * 0.008) * 0.001).toFixed(5)}°N`, 12, H - 22);
      ctx.fillText(`${(76.955 + Math.cos(s.frame * 0.007) * 0.001).toFixed(5)}°E`, 12, H - 12);

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
      {/* 3D isometric tilt on canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          transform: 'rotateX(35deg) rotateZ(-8deg) scale(1.35)',
          transformOrigin: '50% 50%',
        }}
      />

      {/* Depth fog overlay — adds atmospheric depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(6,11,22,0.6) 100%),
            linear-gradient(to top, rgba(6,11,22,0.9) 0%, transparent 30%)
          `,
        }}
      />

      {/* Scene indicator pill — repositioned above text */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 z-10">
        {['Idle', 'Searching', 'Broadcasting', 'Shops Reply', 'Walk In!'].map((label, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${i === overlayScene ? 'w-10 bg-indigo-400' : 'w-2 bg-slate-700'}`} />
            {i === overlayScene && (
              <span className="text-[10px] font-bold text-indigo-300 whitespace-nowrap">{label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function buildShop(x: number, y: number, w: number, h: number, name: string, color: string): Shop {
  const windows: { x: number; y: number }[] = [];
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 3; col++)
      windows.push({ x: x + 8 + col * (w / 3 - 2), y: y + 8 + row * 18 });
  return { x, y, w, h, name, color, lit: false, litAt: 0, windows };
}

function spawnWalker(W: number, H: number): Walker {
  const edge = Math.floor(Math.random() * 2);
  return {
    x: edge === 0 ? Math.random() * W : (Math.random() < 0.5 ? W * 0.44 : W * 0.48),
    y: edge === 1 ? Math.random() * H : (Math.random() < 0.5 ? H * 0.46 : H * 0.5),
    tx: Math.random() * W,
    ty: Math.random() * H,
    speed: 0.4 + Math.random() * 0.6,
    color: ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#c084fc'][Math.floor(Math.random() * 5)],
    step: 0,
    stepDir: 1,
  };
}

function updateAndDrawWalker(ctx: CanvasRenderingContext2D, wk: Walker, W: number, H: number, _frame: number) {
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
  wk.step += 0.12 * wk.stepDir;
  if (Math.abs(wk.step) > 1) wk.stepDir *= -1;

  const cx = wk.x, cy = wk.y;
  // Head
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = wk.color;
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.lineTo(cx - wk.step * 3, cy + 6);
  ctx.lineTo(cx + wk.step * 3, cy + 6);
  ctx.closePath();
  ctx.fillStyle = wk.color + '99';
  ctx.fill();
}

function drawRoads(ctx: CanvasRenderingContext2D, W: number, H: number, frame: number) {
  // Horizontal main road
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(0, H * 0.44, W, H * 0.1);
  // Vertical main road
  ctx.fillRect(W * 0.44, 0, W * 0.09, H);

  // Road lane dashes
  ctx.setLineDash([18, 14]);
  ctx.strokeStyle = COLORS.roadLine;
  ctx.lineWidth = 1.5;
  // Horizontal
  ctx.beginPath();
  ctx.moveTo(0, H * 0.49);
  ctx.lineTo(W, H * 0.49);
  ctx.stroke();
  // Vertical
  ctx.beginPath();
  ctx.moveTo(W * 0.485, 0);
  ctx.lineTo(W * 0.485, H);
  ctx.stroke();
  ctx.setLineDash([]);

  // Moving traffic dots on roads
  const trafficH = [0.2, 0.65, 0.8, 0.45];
  trafficH.forEach((spd, i) => {
    const tx = ((frame * spd * 0.8) % (W + 20)) - 10;
    ctx.beginPath();
    ctx.arc(tx, H * 0.455, 4, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#fbbf24';
    ctx.fill();

    const tx2 = W - (((frame * spd * 0.6) % (W + 20)) - 10);
    ctx.beginPath();
    ctx.arc(tx2, H * 0.515, 4, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#60a5fa' : '#34d399';
    ctx.fill();
  });

  // Vertical road traffic
  const ty = ((frame * 0.6) % (H + 20)) - 10;
  ctx.beginPath();
  ctx.arc(W * 0.455, ty, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#a78bfa';
  ctx.fill();
  const ty2 = H - (((frame * 0.5) % (H + 20)) - 10);
  ctx.beginPath();
  ctx.arc(W * 0.475, ty2, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#fb923c';
  ctx.fill();
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
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx + 4, by + 4, bw - 8, bh - 8, 10);
    ctx.fill();
    ctx.stroke();
  });
}

function drawShop(ctx: CanvasRenderingContext2D, sh: Shop, frame: number) {
  const { x, y, w, h, color, lit, windows } = sh;
  const depth = 16; // 3D extrusion depth

  // Cast shadow on ground
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.moveTo(x + 6, y + h + 4);
  ctx.lineTo(x + w + 6, y + h + 4);
  ctx.lineTo(x + w + 6 + depth, y + h + 4 - depth * 0.5);
  ctx.lineTo(x + 6 + depth, y + h + 4 - depth * 0.5);
  ctx.closePath();
  ctx.fill();

  // Right side face (3D extrusion)
  const sideColor = lit ? darkenHex(color, 0.6) : '#0a1020';
  ctx.fillStyle = sideColor;
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + depth, y - depth * 0.6);
  ctx.lineTo(x + w + depth, y + h - depth * 0.6);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = lit ? color + '44' : '#1a2d47';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Top face (3D extrusion — rooftop)
  const topColor = lit ? darkenHex(color, 0.8) : '#111a2e';
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depth, y - depth * 0.6);
  ctx.lineTo(x + w + depth, y - depth * 0.6);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = lit ? color + '33' : '#1a2d47';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Rooftop detail (small rectangle / AC unit)
  if (w > 60) {
    ctx.fillStyle = lit ? color + '22' : '#0d1628';
    ctx.beginPath();
    ctx.rect(x + depth + 8, y - depth * 0.6 + 4, 16, 8);
    ctx.fill();
    ctx.strokeStyle = lit ? color + '44' : '#1a2d47';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Front face (main building body)
  ctx.fillStyle = lit ? color + '18' : '#0e1726';
  ctx.strokeStyle = lit ? color : '#1a2d47';
  ctx.lineWidth = lit ? 2 : 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Glow when lit
  if (lit) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Windows
  windows.forEach(win => {
    const flicker = lit && Math.sin(frame * 0.05 + win.x) > 0.9;
    ctx.fillStyle = lit
      ? flicker ? color + 'ff' : color + 'aa'
      : '#1a2d47';
    ctx.beginPath();
    ctx.roundRect(win.x, win.y, w / 3 - 6, 10, 2);
    ctx.fill();
  });

  // Sign bar
  ctx.fillStyle = lit ? color : '#142038';
  ctx.beginPath();
  ctx.roundRect(x + 4, y + h - 18, w - 8, 14, 4);
  ctx.fill();

  if (lit) {
    ctx.font = `bold 8px "Outfit", sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(sh.name.split(' ')[0], x + w / 2, y + h - 7);
  }

  // Lit ping dot
  if (lit) {
    const pulse = 1 + 0.3 * Math.sin(frame * 0.1);
    ctx.beginPath();
    ctx.arc(x + w - 8, y + 8, 5 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = color + '44';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 8, y + 8, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawPerson(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, walking: boolean, scene: number) {
  // Location shadow
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 14, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fill();

  // GPS ring
  const r1 = 18 + 4 * Math.sin(frame * 0.06);
  ctx.beginPath();
  ctx.arc(x, y, r1, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(99,102,241,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const r2 = 10;
  ctx.beginPath();
  ctx.arc(x, y, r2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(99,102,241,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Legs
  const legSwing = walking ? Math.sin(frame * 0.22) * 6 : 0;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 3, y);
  ctx.lineTo(x - 4 - legSwing, y + 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 3, y);
  ctx.lineTo(x + 4 + legSwing, y + 12);
  ctx.stroke();

  // Body
  ctx.fillStyle = COLORS.personBody;
  ctx.beginPath();
  ctx.roundRect(x - 7, y - 18, 14, 18, 4);
  ctx.fill();

  // Arms
  ctx.strokeStyle = COLORS.person;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(x - 7, y - 14);
  ctx.lineTo(x - 12, y - 7 + (walking ? legSwing * 0.5 : 0));
  ctx.stroke();
  // Phone arm
  ctx.beginPath();
  ctx.moveTo(x + 7, y - 14);
  ctx.lineTo(x + 11, y - 8);
  ctx.stroke();

  // Head
  ctx.fillStyle = COLORS.person;
  ctx.beginPath();
  ctx.arc(x, y - 26, 8, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(x, y - 28, 8, Math.PI, 0);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(x - 3, y - 27, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 3, y - 27, 1.5, 0, Math.PI * 2); ctx.fill();

  // Phone in hand
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = scene === 1 ? COLORS.indigo : '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 10, y - 16, 7, 11, 2);
  ctx.fill();
  ctx.stroke();

  if (scene === 1) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = COLORS.indigo;
    ctx.strokeStyle = COLORS.indigo;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawSearchBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, frame: number) {
  const bw = 130, bh = 34;
  const bx = x - 10, by = y - bh;

  // Bubble
  ctx.fillStyle = '#1a2d47';
  ctx.strokeStyle = COLORS.indigo;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 8);
  ctx.fill();
  ctx.stroke();

  // Bubble tail
  ctx.beginPath();
  ctx.moveTo(bx + 20, by + bh);
  ctx.lineTo(bx + 12, by + bh + 8);
  ctx.lineTo(bx + 30, by + bh);
  ctx.fillStyle = '#1a2d47';
  ctx.fill();
  ctx.strokeStyle = COLORS.indigo;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Search icon
  ctx.strokeStyle = COLORS.indigo;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(bx + 14, by + 13, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx + 18, by + 17);
  ctx.lineTo(bx + 21, by + 20);
  ctx.stroke();

  // Typed text
  ctx.font = '9px "Inter", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'left';
  ctx.fillText(text, bx + 27, by + 17);

  // Cursor
  const cursor = Math.sin(frame * 0.12) > 0;
  if (cursor) {
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = COLORS.indigo;
    ctx.fillRect(bx + 27 + tw + 1, by + 8, 1.5, 10);
  }

  // Label
  ctx.font = 'bold 7px "Inter", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Searching nearby shops...', bx + 8, by + bh - 6);
}

function drawBadge(ctx: CanvasRenderingContext2D, b: Badge) {
  const alpha = Math.min(1, b.life / 30, (b.maxLife - b.life) / 30 + 0.1);
  const bw = 90, bh = 28;
  const bx = b.x - bw / 2, by = b.y - bh;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#0f1e32';
  ctx.strokeStyle = b.color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 8);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 7.5px "Outfit", sans-serif';
  ctx.fillStyle = b.color;
  ctx.textAlign = 'center';
  ctx.fillText(b.text, b.x, by + 11);

  ctx.font = '6.5px "Inter", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText(b.sub, b.x, by + 21);

  ctx.globalAlpha = 1;
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
