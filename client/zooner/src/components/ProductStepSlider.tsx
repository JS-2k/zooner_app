import React, { useState } from 'react';
import { 
  MessageSquare, 
  Zap, 
  ShoppingBag
} from 'lucide-react';

interface Step {
  num: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  tag: string;
  tagBg: string;
}

export const ProductStepSlider: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: Step[] = [
    {
      num: '01',
      icon: <MessageSquare className="h-4 w-4 text-indigo-400" />,
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      title: '1. Ask for any product',
      desc: 'Type what you need. We ping verified local stores in your 2 km radius.',
      tag: 'Surya: "Nike Air Max (UK 9)?"',
      tagBg: 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300',
    },
    {
      num: '02',
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      title: '2. Stores reply in < 60s',
      desc: 'Store managers check shelf stock & reply with direct in-store price.',
      tag: '🟢 Nike Store: "In Stock · ₹6,499"',
      tagBg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300',
    },
    {
      num: '03',
      icon: <ShoppingBag className="h-4 w-4 text-amber-400" />,
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      title: '3. Walk in & take it home',
      desc: 'Store holds your item for 30 mins. Walk in, try it on, and buy with zero shipping wait.',
      tag: '🚶 350m · 4 min walk · RS Puram',
      tagBg: 'bg-amber-950/60 border-amber-500/30 text-amber-300',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 3 Compact Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-left">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            onClick={() => setActiveStep(idx)}
            className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
              activeStep === idx
                ? 'bg-slate-900/95 border-indigo-500/50 shadow-xl shadow-indigo-950/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            {/* Step Top Row */}
            <div className="flex items-center justify-between mb-2.5">
              <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${step.iconBg}`}>
                {step.icon}
              </div>
              <span className="font-mono text-xs font-bold text-slate-500">
                STEP {step.num}
              </span>
            </div>

            {/* Title & Short Desc */}
            <h3 className="font-['Outfit'] font-bold text-sm text-white mb-1">
              {step.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {step.desc}
            </p>

            {/* Minimal Example Chip */}
            <div className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium truncate ${step.tagBg}`}>
              {step.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
