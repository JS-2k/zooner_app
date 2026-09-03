import React, { useEffect, useState } from 'react';

// Scene durations
const SCENE_DURATIONS = [3000, 3000, 3000, 3500];
const TOTAL = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

export const ProductDemo: React.FC = () => {
  const [scene, setScene] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers = SCENE_DURATIONS.map((dur, i) => {
      const t = setTimeout(() => setScene(i), elapsed);
      elapsed += dur;
      return t;
    });

    const loop = setInterval(() => {
      setScene(0);
      setTick(n => n + 1);
    }, TOTAL);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [tick]);

  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      {/* Outer glow */}
      <div className="absolute -inset-8 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0D1321] border border-white/8 shadow-2xl" style={{ aspectRatio: '4/3' }}>

        {/* SVG Scene */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid pattern for map feel */}
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" strokeWidth="0.8"/>
            </pattern>

            {/* Road gradient */}
            <linearGradient id="roadH" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e2d4a" />
              <stop offset="50%" stopColor="#243352" />
              <stop offset="100%" stopColor="#1e2d4a" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="softglow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* === MAP BACKGROUND === */}
          <rect width="400" height="300" fill="#0D1321"/>
          <rect width="400" height="300" fill="url(#grid)" opacity="0.8"/>

          {/* Roads */}
          <rect x="0" y="130" width="400" height="28" fill="url(#roadH)" rx="0"/>
          <rect x="0" y="133" width="400" height="22" fill="#16213e" rx="0"/>
          {/* Road dashes */}
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <rect key={i} x={i * 48 - 4} y="143" width="28" height="3" fill="#2d3f5a" rx="1.5"/>
          ))}

          <rect x="170" y="0" width="26" height="300" fill="#16213e" rx="0"/>
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <rect key={i} x="181" y={i * 40 - 4} width="3" height="22" fill="#2d3f5a" rx="1.5"/>
          ))}

          {/* City blocks */}
          <rect x="10" y="10" width="140" height="100" fill="#111827" rx="10" stroke="#1e293b" strokeWidth="1"/>
          <rect x="200" y="10" width="185" height="100" fill="#111827" rx="10" stroke="#1e293b" strokeWidth="1"/>
          <rect x="10" y="175" width="140" height="110" fill="#111827" rx="10" stroke="#1e293b" strokeWidth="1"/>
          <rect x="200" y="175" width="185" height="110" fill="#111827" rx="10" stroke="#1e293b" strokeWidth="1"/>

          {/* === SHOPS (Buildings) === */}
          {/* Shop A — top left block */}
          <ShopBuilding x={50} y={30} w={60} h={70} label="Apex Footwear" active={scene >= 1} color="#6366f1" />

          {/* Shop B — top right block */}
          <ShopBuilding x={225} y={22} w={55} h={65} label="Sprint Sports" active={scene >= 1} color="#8b5cf6" delay={0.3} />

          {/* Shop C — bottom right block */}
          <ShopBuilding x={270} y={190} w={65} h={70} label="Lifestyle Store" active={scene >= 1} color="#06b6d4" delay={0.6} />

          {/* === PERSON (at center) === */}
          <Person
            x={183}
            y={144}
            scene={scene}
            targetX={scene >= 3 ? 78 : 183}
            targetY={scene >= 3 ? 95 : 144}
          />

          {/* === SCENE 0: Phone search bubble === */}
          {scene === 0 && (
            <g style={{ animation: 'fadeIn 0.5s ease forwards' }}>
              {/* Phone */}
              <rect x="202" y="108" width="44" height="68" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1.5" filter="url(#glow)"/>
              <rect x="206" y="114" width="36" height="56" rx="4" fill="#0f172a"/>
              {/* Screen content */}
              <rect x="209" y="118" width="30" height="6" rx="3" fill="#334155"/>
              {/* Search bar */}
              <rect x="209" y="127" width="30" height="7" rx="3.5" fill="#1d2d44" stroke="#4f46e5" strokeWidth="0.8"/>
              <circle cx="213" cy="130.5" r="2" fill="#4f46e5" opacity="0.7"/>
              {/* Typing text */}
              <rect x="217" y="128.5" width="0" height="4" rx="1" fill="#818cf8">
                <animate attributeName="width" values="0;18;18" dur="2.5s" repeatCount="indefinite"/>
              </rect>
              {/* Cursor */}
              <rect x="217" y="128.5" width="1.5" height="4" rx="0.5" fill="#818cf8" opacity="0.9">
                <animate attributeName="x" values="217;235;235" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;1;0;1" dur="0.8s" repeatCount="indefinite"/>
              </rect>
              {/* Search label */}
              <text x="224" y="147" textAnchor="middle" fontSize="4.5" fill="#64748b">Nike Air Max...</text>
              <text x="224" y="154" textAnchor="middle" fontSize="4" fill="#64748b">Searching nearby...</text>

              {/* Floating label */}
              <rect x="202" y="98" width="44" height="8" rx="4" fill="#4f46e5" opacity="0.9"/>
              <text x="224" y="103.5" textAnchor="middle" fontSize="4.5" fill="white" fontWeight="bold">Searching...</text>
            </g>
          )}

          {/* === SCENE 1: Pulse radar expanding === */}
          {scene === 1 && (
            <g>
              {/* Radar pulses from person */}
              <circle cx="183" cy="144" r="20" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0">
                <animate attributeName="r" values="10;80" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="183" cy="144" r="20" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0">
                <animate attributeName="r" values="10;80" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
              </circle>
              <circle cx="183" cy="144" r="20" fill="none" stroke="#6366f1" strokeWidth="0.8" opacity="0">
                <animate attributeName="r" values="10;80" dur="1.8s" begin="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0" dur="1.8s" begin="1.2s" repeatCount="indefinite"/>
              </circle>

              {/* Ping dots to each shop */}
              <PingLine x1={183} y1={144} x2={80} y2={65} color="#6366f1"/>
              <PingLine x1={183} y1={144} x2={252} y2={55} color="#8b5cf6" delay="0.3s"/>
              <PingLine x1={183} y1={144} x2={302} y2={225} color="#06b6d4" delay="0.6s"/>

              {/* Label */}
              <rect x="130" y="260" width="140" height="14" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
              <text x="200" y="270" textAnchor="middle" fontSize="6" fill="#94a3b8" fontWeight="500">📡 Broadcasting to 3 nearby shops...</text>
            </g>
          )}

          {/* === SCENE 2: Shop reply bubble === */}
          {scene === 2 && (
            <g>
              {/* Active shop highlight */}
              <rect x="20" y="22" width="118" height="88" rx="10" fill="#4f46e5" opacity="0.08" stroke="#6366f1" strokeWidth="1.5"/>

              {/* Reply chat bubble from Apex Footwear */}
              <g style={{ animation: 'slideUp 0.4s ease forwards' }}>
                <rect x="14" y="118" width="138" height="52" rx="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1" filter="url(#glow)"/>
                {/* Bubble tail */}
                <polygon points="50,118 60,118 55,108" fill="#1e293b" stroke="#6366f1" strokeWidth="1"/>

                <text x="25" y="131" fontSize="5.5" fill="#6366f1" fontWeight="bold">✓ Apex Footwear</text>
                <text x="25" y="141" fontSize="5" fill="#94a3b8">Nike Air Max — UK 8, 9, 10</text>
                <rect x="25" y="146" width="60" height="8" rx="4" fill="#16a34a" opacity="0.2"/>
                <text x="55" y="151.5" textAnchor="middle" fontSize="5" fill="#4ade80" fontWeight="bold">● In Stock · 0.4 km</text>
                <text x="120" y="131" fontSize="5.5" fill="white" fontWeight="bold">₹6,499</text>
                <text x="25" y="163" fontSize="5" fill="#64748b">⭐ 4.9  · Walk in now!</text>
              </g>
            </g>
          )}

          {/* === SCENE 3: Walking path to shop === */}
          {scene >= 3 && (
            <g>
              {/* Dotted walking path */}
              <path
                d="M 183 144 L 183 100 L 80 100 L 80 65"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                opacity="0.7"
              >
                <animate attributeName="stroke-dashoffset" values="200;0" dur="1.5s" fill="freeze"/>
              </path>

              {/* Shop destination glow */}
              <circle cx="80" cy="65" r="16" fill="#4f46e5" opacity="0.15">
                <animate attributeName="r" values="14;18;14" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="65" r="10" fill="#4f46e5" opacity="0.3"/>

              {/* Distance pill */}
              <rect x="90" y="85" width="50" height="12" rx="6" fill="#4f46e5"/>
              <text x="115" y="93" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">5 min walk 🚶</text>

              {/* Success banner */}
              <rect x="30" y="255" width="340" height="30" rx="10" fill="#166534" stroke="#16a34a" strokeWidth="1"/>
              <text x="200" y="267" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="bold">🎉 Reserved! Walk in within 30 mins</text>
              <text x="200" y="278" textAnchor="middle" fontSize="5" fill="#86efac">No payment now · Try it first · Buy only if you like it</text>
            </g>
          )}

          {/* === SCENE LABEL === */}
          <g>
            <rect x="8" y="8" width="92" height="14" rx="7" fill="#0f172a" stroke="#1e293b" strokeWidth="1"/>
            <text x="54" y="17.5" textAnchor="middle" fontSize="5.5" fill="#64748b" fontWeight="500">
              {scene === 0 ? '1 / 4 — Searching' : scene === 1 ? '2 / 4 — Shops pinged' : scene === 2 ? '3 / 4 — Shop replied!' : '4 / 4 — Walk in!'}
            </text>
          </g>

          {/* Progress bar */}
          <rect x="0" y="295" width="400" height="5" fill="#1e293b"/>
          <rect x="0" y="295" width={(scene + 1) * 100} height="5" fill="url(#progressGrad)" rx="0">
            <animate attributeName="width" values={`${scene * 100};${(scene + 1) * 100}`} dur="0.5s" fill="freeze"/>
          </rect>
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Overlay gradient at top for polish */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#0D1321] to-transparent pointer-events-none" />
      </div>

      {/* Scene dots below */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {['Search', 'Broadcast', 'Reply', 'Walk in'].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${i === scene ? 'w-8 bg-indigo-500' : i < scene ? 'w-3 bg-indigo-800' : 'w-3 bg-slate-700'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ShopBuildingProps {
  x: number; y: number; w: number; h: number;
  label: string; active: boolean; color: string; delay?: number;
}
const ShopBuilding: React.FC<ShopBuildingProps> = ({ x, y, w, h, label, active, color, delay = 0 }) => (
  <g style={{ transition: 'all 0.5s ease', transitionDelay: `${delay}s` }}>
    {/* Building body */}
    <rect x={x} y={y} width={w} height={h} rx="5" fill={active ? `${color}18` : '#161f2e'} stroke={active ? color : '#1e293b'} strokeWidth={active ? 1.5 : 1}/>
    {/* Windows grid */}
    {[0,1,2].map(row => [0,1,2].map(col => (
      <rect
        key={`${row}-${col}`}
        x={x + 6 + col * 16}
        y={y + 6 + row * 16}
        width="8" height="9" rx="1.5"
        fill={active ? `${color}40` : '#1e293b'}
      />
    )))}
    {/* Store sign */}
    <rect x={x + 4} y={y + h - 14} width={w - 8} height="10" rx="3" fill={active ? color : '#1e293b'} opacity={active ? 0.9 : 0.4}/>
    {active && (
      <text x={x + w/2} y={y + h - 7} textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">
        {label.split(' ')[0]}
      </text>
    )}
    {/* Active ping dot */}
    {active && (
      <>
        <circle cx={x + w - 6} cy={y + 6} r="4" fill={color} opacity="0.25">
          <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx={x + w - 6} cy={y + 6} r="2.5" fill={color}/>
      </>
    )}
  </g>
);

interface PersonProps { x: number; y: number; scene: number; targetX: number; targetY: number; }
const Person: React.FC<PersonProps> = ({ x, y, scene, targetX, targetY }) => {
  const walking = scene >= 3;
  const cx = walking ? targetX : x;
  const cy = walking ? targetY - 12 : y - 12;

  return (
    <g style={{ transition: 'all 1.8s cubic-bezier(0.4,0,0.2,1)' }} transform={`translate(${cx - x}, ${cy - (y - 12)})`}>
      {/* Location dot */}
      <circle cx={x} cy={y} r={walking ? 5 : 7} fill="#4f46e5" opacity="0.2">
        {!walking && <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite"/>}
      </circle>
      <circle cx={x} cy={y} r="4" fill="#4f46e5" opacity={walking ? 0.4 : 0.6}/>

      {/* Person: body */}
      {/* Head */}
      <circle cx={x} cy={y - 22} r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
      {/* Eyes */}
      <circle cx={x - 2.5} cy={y - 23} r="1.2" fill="#1e293b"/>
      <circle cx={x + 2.5} cy={y - 23} r="1.2" fill="#1e293b"/>
      {/* Smile */}
      <path d={`M ${x-3} ${y-20} Q ${x} ${y-17} ${x+3} ${y-20}`} fill="none" stroke="#1e293b" strokeWidth="1" strokeLinecap="round"/>
      {/* Hair */}
      <path d={`M ${x-7} ${y-23} Q ${x} ${y-33} ${x+7} ${y-23}`} fill="#1e293b"/>
      {/* Body */}
      <rect x={x - 6} y={y - 14} width="12" height="14" rx="4" fill="#6366f1"/>
      {/* Arms */}
      <line x1={x - 6} y1={y - 12} x2={x - 10} y2={y - 5} stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      {/* Phone in right hand */}
      <rect x={x + 7} y={y - 14} width="5" height="8" rx="1.5" fill="#1e293b" stroke="#6366f1" strokeWidth="1"/>
      <line x1={x + 6} y1={y - 11} x2={x + 9} y2={y - 5} stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      {/* Legs */}
      <line x1={x - 3} y1={y} x2={x - 4} y2={y + 10} stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
      <line x1={x + 3} y1={y} x2={x + 4} y2={y + 10} stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

      {/* Walking legs when moving */}
      {walking && (
        <>
          <line x1={x - 3} y1={y} x2={x - 6} y2={y + 10} stroke="#4f46e5" strokeWidth="4" strokeLinecap="round">
            <animate attributeName="x2" values={`${x-6};${x+1};${x-6}`} dur="0.6s" repeatCount="indefinite"/>
            <animate attributeName="y2" values={`${y+10};${y+8};${y+10}`} dur="0.6s" repeatCount="indefinite"/>
          </line>
          <line x1={x + 3} y1={y} x2={x + 6} y2={y + 10} stroke="#4f46e5" strokeWidth="4" strokeLinecap="round">
            <animate attributeName="x2" values={`${x+6};${x-1};${x+6}`} dur="0.6s" begin="0.3s" repeatCount="indefinite"/>
            <animate attributeName="y2" values={`${y+10};${y+8};${y+10}`} dur="0.6s" begin="0.3s" repeatCount="indefinite"/>
          </line>
        </>
      )}
    </g>
  );
};

interface PingLineProps { x1: number; y1: number; x2: number; y2: number; color: string; delay?: string; }
const PingLine: React.FC<PingLineProps> = ({ x1, y1, x2, y2, color, delay = '0s' }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.5">
      <animate attributeName="stroke-dashoffset" values="100;0" dur="0.8s" begin={delay} fill="freeze"/>
      <animate attributeName="opacity" values="0;0.6;0.5" dur="0.8s" begin={delay} fill="freeze"/>
    </line>
    {/* Moving dot along path */}
    <circle r="3" fill={color} opacity="0.8" filter="url(#glow)">
      <animateMotion dur="0.8s" begin={delay} fill="freeze">
        <mpath>
          <path d={`M ${x1} ${y1} L ${x2} ${y2}`}/>
        </mpath>
      </animateMotion>
      <animate attributeName="r" values="0;3;2" dur="0.8s" begin={delay} fill="freeze"/>
    </circle>
  </g>
);
