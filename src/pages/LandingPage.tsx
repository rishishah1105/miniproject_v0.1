import React from 'react';
import { ArrowRight, BookOpen, CandlestickChart, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { formatMoney } = useApp();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brand-400" /> Designed for College Students & Early Professionals
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Master the stock market with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-400 to-brand-teal">
              Zero Risk & Maximum Confidence
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            TradeWise blends bite-sized interactive visual lessons with a live paper-trading simulator and a quiz-based mastery loop. Learn, practice, and compete.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <CandlestickChart className="w-5 h-5 text-brand-teal" />
              <span>Explore Paper Terminal</span>
            </button>
          </div>

          {/* Key Metrics Pill */}
          <div className="pt-10 flex flex-wrap justify-center gap-8 text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>13 Visual Concept Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{formatMoney(10000)} Virtual Cash Trading</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Adaptive Quiz Mastery Loop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Loop Grid: Learn -> Practice -> Compete */}
      <section className="py-16 px-4 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">The 3-Step Mastery Loop</h2>
            <p className="text-slate-400 text-sm">How TradeWise turns complete beginners into confident investors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-brand-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">Step 1: Learn</span>
              <h3 className="text-xl font-bold text-white">Interactive Visual Modules</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Short, digestible explanations paired with dynamic compounding calculators, SIP simulators, and candlestick diagrams. No walls of jargon text.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-brand-teal/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                <CandlestickChart className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-brand-teal uppercase tracking-wider block">Step 2: Practice</span>
              <h3 className="text-xl font-bold text-white">Paper-Trading Terminal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Execute market & limit orders in real-time on sample stocks like Apple, Nvidia, Tesla, and S&P 500 ETFs with virtual funds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Step 3: Compete</span>
              <h3 className="text-xl font-bold text-white">Gamified Mastery & Ranks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn XP, maintain daily study streaks, unlock milestone badges, and climb global student leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 TradeWise Financial Literacy Platform. Educational Paper-Trading Simulation.</p>
      </footer>
    </div>
  );
};
