import React from 'react';
import { Compass, CandlestickChart, Award, Flame, ArrowRight, CheckCircle2, TrendingUp, BookOpen, Target, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';

export const Dashboard: React.FC<{
  onSelectConcept: (conceptId: string) => void;
  onNavigate: (tab: string) => void;
}> = ({ onSelectConcept, onNavigate }) => {
  const { user, masteredConceptIds, cashBalance, holdings, stocks, dailyQuestState, activeQuestConfig, formatMoney, claimDailyStreak } = useApp();

  const totalConcepts = MODULES_DATA.length;
  const masteryPercent = (masteredConceptIds.length / totalConcepts) * 100;
  const circumference = 2 * Math.PI * 58;

  const today = new Date().toISOString().split('T')[0];
  const isStreakClaimed = user.lastCheckInDate === today;

  const nextRecommended = MODULES_DATA.find(m => !masteredConceptIds.includes(m.id)) || MODULES_DATA[0];

  let holdingsValue = 0;
  let totalCost = 0;

  Object.values(holdings).forEach(h => {
    const currentStock = stocks.find(s => s.symbol === h.symbol);
    const price = currentStock ? currentStock.price : h.avgCost;
    holdingsValue += h.shares * price;
    totalCost += h.shares * h.avgCost;
  });

  const totalEquity = cashBalance + holdingsValue;
  const totalPnL = holdingsValue - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
                Welcome
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> 1 Streak Freeze Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to grow your financial IQ today?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              You are on Level {user.level} with {user.xp} XP. Master Indian market modules or trade NSE stocks to climb the leaderboard!
            </p>
          </div>

          {/* Daily Streak Card */}
          <div className="w-full lg:w-auto bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Daily Streak</span>
                <span className="text-xl font-black text-white">{user.streak} Consecutive Days</span>
              </div>
            </div>
            <button
              onClick={claimDailyStreak}
              disabled={isStreakClaimed}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isStreakClaimed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300'
              }`}
            >
              {isStreakClaimed ? 'Claimed Today ✓' : 'Claim +50 XP'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Concept + Dynamic Mastery Ring + Daily Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Concept Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-brand-500/40 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/30">
                Continue Where You Left Off
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-slate-500" /> ~{nextRecommended.estimatedMinutes} min read
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-brand-400 transition-colors">
                {nextRecommended.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {nextRecommended.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {nextRecommended.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" /> Reward: +{nextRecommended.xpReward} XP
            </span>
            <button
              onClick={() => onSelectConcept(nextRecommended.id)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Start Module</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Animated Mastery Progress Ring */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Concept Mastery Map</h3>

          {/* SVG Proportional Progress Ring with CSS Arc Transition */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 144 144" className="w-full h-full">
              {/* Background track — always full circle */}
              <circle
                cx="72"
                cy="72"
                r="58"
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="10"
              />
              {/* Progress arc — fills proportionally */}
              <circle
                cx="72"
                cy="72"
                r="58"
                fill="transparent"
                stroke="#4f46e5"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - masteryPercent / 100)}
                transform="rotate(-90 72 72)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{Math.round(masteryPercent)}%</span>
              <span className="text-[10px] text-brand-400 uppercase font-bold tracking-wider">Mastered</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p><strong>{masteredConceptIds.length}</strong> of <strong>{totalConcepts}</strong> concepts completed</p>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-brand-400 hover:underline font-semibold text-xs flex items-center gap-1 justify-center pt-1"
            >
              <Compass className="w-3.5 h-3.5" /> View Interactive Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Compact Daily Quest Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Daily Quest</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">+{activeQuestConfig.reward} XP</span>
            </div>
            <p className="text-xs text-slate-400">{activeQuestConfig.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {activeQuestConfig.target > 1 && (
            <div className="text-xs font-mono text-slate-500">
              {dailyQuestState.progress} / {activeQuestConfig.target}
            </div>
          )}
          {dailyQuestState.completed ? (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-400/20">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700">
              In Progress
            </div>
          )}
        </div>
      </div>



      {/* Indian Paper Trading Terminal Snapshot */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">NSE Paper Trading Snapshot</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CandlestickChart className="w-5 h-5 text-brand-teal" /> Portfolio Net Worth: {formatMoney(totalEquity)}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('simulator')}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
          >
            <span>Open NSE Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Virtual Cash Balance</span>
            <strong className="text-lg font-extrabold text-slate-100">{formatMoney(cashBalance)}</strong>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Holdings Market Value</span>
            <strong className="text-lg font-extrabold text-indigo-400">{formatMoney(holdingsValue)}</strong>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Total Unrealized P&L</span>
            <strong className={`text-lg font-extrabold flex items-center gap-1 ${
              totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <TrendingUp className="w-4 h-4" />
              {totalPnL >= 0 ? '+' : ''}{formatMoney(totalPnL)} ({pnlPercent.toFixed(2)}%)
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
