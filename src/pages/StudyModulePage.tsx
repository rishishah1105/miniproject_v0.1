import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Award, CheckCircle2, ArrowRight, Sparkles, Lightbulb, PieChart } from 'lucide-react';
import { MODULES_DATA } from '../data/modulesData';
import { VisualAidRenderer } from '../components/VisualAids';
import { useApp } from '../context/AppContext';

export const StudyModulePage: React.FC<{
  conceptId: string;
  onBackToRoadmap: () => void;
  onStartQuiz: (conceptId: string) => void;
}> = ({ conceptId, onBackToRoadmap, onStartQuiz }) => {
  const { masteredConceptIds, holdings, stocks, formatMoney } = useApp();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const module = MODULES_DATA.find(m => m.id === conceptId) || MODULES_DATA[0];
  const isMastered = masteredConceptIds.includes(module.id);
  const activeChapter = module.chapters[activeChapterIndex] || module.chapters[0];

  // Calculate user's live portfolio sector distribution for "Apply Lesson to Portfolio" feature
  const holdingsList = Object.values(holdings);
  const sectorMap: Record<string, number> = {};
  let totalPortfolioValue = 0;

  holdingsList.forEach(h => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    const price = stock ? stock.price : h.avgCost;
    const value = h.shares * price;
    const cat = stock ? stock.category : 'Other';

    sectorMap[cat] = (sectorMap[cat] || 0) + value;
    totalPortfolioValue += value;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToRoadmap}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            {module.category}
          </span>
          {isMastered && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mastered
            </span>
          )}
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {module.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
          {module.summary}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-2">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-500" /> {module.chapters.length} Chapters (~{module.estimatedMinutes}m read)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Award className="w-4 h-4 text-amber-400" /> Earn +{module.xpReward} XP
          </span>
        </div>
      </div>

      {/* Multi-Chapter Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {module.chapters.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => setActiveChapterIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeChapterIndex === idx
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{idx + 1}. {ch.title.split(':')[1] || ch.title}</span>
          </button>
        ))}
      </div>

      {/* Active Chapter Deep-Dive Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            {activeChapter.title}
          </h3>
          <span className="text-xs text-slate-500 font-mono">Chapter {activeChapterIndex + 1} of {module.chapters.length}</span>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {activeChapter.content}
        </div>

        {activeChapter.example && (
          <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl space-y-1 text-xs">
            <strong className="text-indigo-400 font-bold flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <Lightbulb className="w-4 h-4 text-indigo-400" /> Real-World Example
            </strong>
            <p className="text-slate-200 leading-relaxed">{activeChapter.example}</p>
          </div>
        )}

        {activeChapter.keyPoint && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Key Takeaway:</strong> {activeChapter.keyPoint}</span>
          </div>
        )}
      </div>

      {/* Apply Lesson to Your Live Paper Portfolio (Specific to Diversification module) */}
      {module.id === 'diversification' && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" /> Apply Lesson: Your Live Portfolio Sector Concentration
            </h3>
            <span className="text-xs text-slate-400 font-mono">Total Value: {formatMoney(totalPortfolioValue)}</span>
          </div>

          {holdingsList.length === 0 ? (
            <p className="text-xs text-slate-400">You currently hold 0 stock positions in the simulator.</p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {Object.entries(sectorMap).map(([cat, val]) => {
                  const pct = Math.round((val / totalPortfolioValue) * 100);
                  return (
                    <div key={cat} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">{cat}</span>
                      <strong className="text-sm font-extrabold text-white">{pct}%</strong>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{formatMoney(val)}</span>
                    </div>
                  );
                })}
              </div>

              {Object.keys(sectorMap).length < 3 ? (
                <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-300 font-medium">
                  💡 <strong>Diversification Tip:</strong> Your portfolio is currently concentrated in only {Object.keys(sectorMap).length} sector(s). Consider adding stocks from other industries to reduce unsystematic risk!
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 font-medium">
                  ✅ <strong>Great Job:</strong> Your paper portfolio is well diversified across {Object.keys(sectorMap).length} distinct sectors!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Interactive Visual Aid */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Interactive Visual Aid</h3>
        <VisualAidRenderer type={module.visualAidType} />
      </div>

      {/* Module Key Takeaways Summary */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Module Key Takeaways
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {module.keyTakeaways.map((takeaway, tIdx) => (
            <div key={tIdx} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">Rule #{tIdx + 1}</span>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Start Quiz Action Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold text-white">Ready to test your understanding?</h4>
          <p className="text-xs text-slate-400">Take the chapter-mapped quiz to master this concept and earn XP.</p>
        </div>
        <button
          onClick={() => onStartQuiz(module.id)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Take Quiz (+{module.xpReward} XP)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
