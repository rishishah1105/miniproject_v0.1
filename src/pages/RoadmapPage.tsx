import React, { useState } from 'react';
import { Lock, CheckCircle2, BookOpen, Award, Compass, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MODULES_DATA } from '../data/modulesData';
import { findShortestPathToTopic, type PathResult } from '../utils/graphAlgorithms';

export const RoadmapPage: React.FC<{ onSelectConcept: (conceptId: string) => void }> = ({ onSelectConcept }) => {
  const { masteredConceptIds, isConceptUnlocked, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [targetTopicId, setTargetTopicId] = useState<string>('portfolio-allocation');
  const [shortestPathResult, setShortestPathResult] = useState<PathResult | null>(null);

  const categories = ['All', 'Basics', 'Risk & Diversification', 'Instruments', 'Trading Mechanics', 'Portfolio Strategy'];

  const total = MODULES_DATA.length;
  const masteredCount = masteredConceptIds.length;
  const progressPercent = Math.round((masteredCount / total) * 100);

  const handleCalculateShortestPath = () => {
    const res = findShortestPathToTopic(targetTopicId);
    setShortestPathResult(res);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Persistent HP Bar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Roadmap Mastery</span>
              <h2 className="text-lg font-black text-white">{progressPercent}% Completed ({masteredCount}/{total} Nodes)</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
              Level {user.level}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              {user.xp} Total XP
            </span>
          </div>
        </div>

        {/* Animated Horizontal Game Health/HP Bar */}
        <div className="relative h-6 w-full bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 p-1 shadow-inner">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 rounded-xl transition-all duration-700 ease-out shadow-lg shadow-emerald-500/30 relative flex items-center justify-end pr-2"
          >
            {progressPercent > 10 && (
              <span className="text-[10px] font-black text-slate-950 uppercase drop-shadow">
                {progressPercent}% HP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fastest-Path-to-Topic Tool (BFS / Dijkstra Prerequisite Graph Finder) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block flex items-center gap-1">
              Graph Algorithm (BFS / Dijkstra)
            </span>
            <h3 className="text-lg font-extrabold text-white">Fastest Path to Goal Topic</h3>
            <p className="text-xs text-slate-400">Calculate the exact minimal set of prerequisites needed to reach any advanced concept.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={targetTopicId}
              onChange={e => setTargetTopicId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold flex-1 sm:flex-none"
            >
              {MODULES_DATA.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>

            <button
              onClick={handleCalculateShortestPath}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              Find Route
            </button>
          </div>
        </div>

        {shortestPathResult && (
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 animate-fade-in text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <strong className="font-bold text-indigo-400">
                Shortest Sequence ({shortestPathResult.path.length} Total Steps / {shortestPathResult.prerequisitesCount} Prerequisites):
              </strong>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {shortestPathResult.path.map((mod, idx) => (
                <React.Fragment key={mod.id}>
                  <div
                    onClick={() => onSelectConcept(mod.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-brand-500 text-white font-bold cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-[10px] flex items-center justify-center font-mono">{idx + 1}</span>
                    <span>{mod.title}</span>
                  </div>
                  {idx < shortestPathResult.path.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-500" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Node Graph List */}
      <div className="space-y-6">
        {categories.filter(c => c !== 'All' && (selectedCategory === 'All' || selectedCategory === c)).map(categoryName => {
          const categoryModules = MODULES_DATA.filter(m => m.category === categoryName);

          return (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-2">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                <h3 className="text-lg font-extrabold text-white">{categoryName}</h3>
                <span className="text-xs font-semibold text-slate-500">
                  ({categoryModules.filter(m => masteredConceptIds.includes(m.id)).length}/{categoryModules.length} Mastered)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModules.map(mod => {
                  const isMastered = masteredConceptIds.includes(mod.id);
                  const isUnlocked = isConceptUnlocked(mod.id);

                  let cardStyle = 'bg-slate-950/40 border-slate-800/60 opacity-50 grayscale cursor-not-allowed';
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs font-bold border border-slate-700">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> 🔒 Locked
                    </span>
                  );

                  if (isMastered) {
                    cardStyle = 'bg-gradient-to-br from-emerald-950/40 to-slate-900 border-2 border-emerald-500 text-white shadow-xl shadow-emerald-950/40 hover:border-emerald-400 cursor-pointer';
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ✅ Mastered
                      </span>
                    );
                  } else if (isUnlocked) {
                    cardStyle = 'bg-slate-900 border-2 border-indigo-500 text-white shadow-2xl shadow-indigo-950/50 hover:border-indigo-400 glow-indigo cursor-pointer ring-2 ring-indigo-500/20';
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/60 text-indigo-300 text-xs font-black animate-pulse">
                        <Compass className="w-3.5 h-3.5 text-indigo-400" /> 🧭 Ready to Start
                      </span>
                    );
                  }

                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        if (isUnlocked) onSelectConcept(mod.id);
                      }}
                      className={`rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300 relative group ${cardStyle}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {statusBadge}
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <BookOpen className="w-3.5 h-3.5 text-slate-500" /> {mod.estimatedMinutes}m
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-white group-hover:text-brand-400 transition-colors">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {mod.summary}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> +{mod.xpReward} XP
                        </span>

                        {isUnlocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectConcept(mod.id);
                            }}
                            className={`px-4 py-1.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 ${
                              isMastered ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-brand-600 hover:bg-brand-500'
                            }`}
                          >
                            <span>{isMastered ? 'Review' : 'Start'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Req: {mod.prerequisites.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
