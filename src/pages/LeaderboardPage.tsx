import React, { useState } from 'react';
import { Trophy, Flame, Crown, CandlestickChart, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  university: string;
  xp: number;
  streak: number;
  portfolioReturn: number;
  level: number;
  isCurrentUser?: boolean;
}

export const LeaderboardPage: React.FC = () => {
  const { user } = useApp();
  const [activeLeaderboard, setActiveLeaderboard] = useState<'learning' | 'trading'>('learning');

  const baseEntries: LeaderboardEntry[] = [
    { rank: 1, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', university: 'IIT Bombay FinTech', xp: 2450, streak: 14, portfolioReturn: 18.4, level: 8 },
    { rank: 2, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', university: 'IIM Ahmedabad', xp: 1980, streak: 11, portfolioReturn: 14.2, level: 7 },
    { rank: 3, name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', university: 'Delhi School of Economics', xp: 1720, streak: 9, portfolioReturn: 12.8, level: 6 },
    { rank: 4, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', university: 'BITS Pilani Finance', xp: 1410, streak: 7, portfolioReturn: 9.5, level: 5 },
    { rank: 5, name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250', university: 'SRCC Delhi', xp: 1150, streak: 6, portfolioReturn: 7.1, level: 4 },
  ];

  const currentUserEntry: LeaderboardEntry = {
    rank: 4,
    name: `${user.name} (You)`,
    avatar: '',
    university: 'TradeWise Learner',
    xp: user.xp,
    streak: user.streak,
    portfolioReturn: 6.2,
    level: user.level,
    isCurrentUser: true
  };

  const allEntries = [...baseEntries, currentUserEntry];

  // Learning Leaderboard (Sorted by XP)
  const learningRanked = [...allEntries]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // Trading Leaderboard (Sorted by Portfolio Return %)
  const tradingRanked = [...allEntries]
    .sort((a, b) => b.portfolioReturn - a.portfolioReturn)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const currentRankedList = activeLeaderboard === 'learning' ? learningRanked : tradingRanked;

  const top1 = currentRankedList[0];
  const top2 = currentRankedList[1];
  const top3 = currentRankedList[2];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Student & Investor Ranks
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            TradeWise Leaderboards
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Two distinct leaderboards: track your concept mastery XP or compete for the highest NSE paper trading returns!
          </p>
        </div>

        {/* Distinct Leaderboard Selector Switch */}
        <div className="w-full grid grid-cols-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold shrink-0 md:max-w-md">
          <button
            onClick={() => setActiveLeaderboard('learning')}
            className={`px-2 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeLeaderboard === 'learning' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">Learning (by XP)</span>
          </button>
          <button
            onClick={() => setActiveLeaderboard('trading')}
            className={`px-2 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeLeaderboard === 'trading' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CandlestickChart className="w-4 h-4 text-teal-300" />
            <span>Trading (by Return %)</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Showcase for Active Leaderboard */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider px-2">
          {activeLeaderboard === 'learning' ? '🎓 Learning Mastery Top 3 Podium' : '📈 NSE Paper Trading Return % Top 3 Podium'}
        </h2>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-2">
          {/* 2nd Place Silver */}
          {top2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-center space-y-3 shadow-xl order-1 flex flex-col items-center">
              <div className="relative">
                <img src={top2.avatar} alt={top2.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-slate-400" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                  #2
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm truncate max-w-[120px]">{top2.name}</h4>
                <span className="text-[10px] text-slate-400 block">{top2.university}</span>
              </div>
              <div className="text-xs font-bold text-slate-300 font-mono">
                {activeLeaderboard === 'learning' ? `${top2.xp} XP` : `+${top2.portfolioReturn}% ROI`}
              </div>
            </div>
          )}

          {/* 1st Place Gold */}
          {top1 && (
            <div className="bg-gradient-to-b from-amber-500/10 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 text-center space-y-3 shadow-2xl order-2 flex flex-col items-center scale-105 relative z-10 glow-indigo">
              <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
              <div className="relative">
                <img src={top1.avatar} alt={top1.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-amber-400 shadow-xl" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg">
                  #1
                </span>
              </div>
              <div>
                <h4 className="font-black text-white text-sm sm:text-base truncate max-w-[140px]">{top1.name}</h4>
                <span className="text-[10px] text-amber-300 font-semibold block">{top1.university}</span>
              </div>
              <div className="text-sm font-extrabold text-amber-400 font-mono">
                {activeLeaderboard === 'learning' ? `${top1.xp} XP` : `+${top1.portfolioReturn}% ROI`}
              </div>
            </div>
          )}

          {/* 3rd Place Bronze */}
          {top3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-center space-y-3 shadow-xl order-3 flex flex-col items-center">
              <div className="relative">
                <img src={top3.avatar} alt={top3.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-amber-700" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-xs px-2 py-0.5 rounded-full">
                  #3
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm truncate max-w-[120px]">{top3.name}</h4>
                <span className="text-[10px] text-slate-400 block">{top3.university}</span>
              </div>
              <div className="text-xs font-bold text-slate-300 font-mono">
                {activeLeaderboard === 'learning' ? `${top3.xp} XP` : `+${top3.portfolioReturn}% ROI`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          {activeLeaderboard === 'learning' ? 'XP Mastery Rankings' : 'NSE Paper Portfolio Return Rankings'} ({currentRankedList.length})
        </h3>

        <div className="divide-y divide-slate-800/80">
          {currentRankedList.map(entry => (
            <div
              key={entry.name}
              className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                entry.isCurrentUser
                  ? 'bg-brand-600/20 border border-brand-500/50 text-white shadow-lg'
                  : 'hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 text-center font-black text-sm font-mono ${
                  entry.rank === 1 ? 'text-amber-400' : (entry.rank === 2 ? 'text-slate-300' : (entry.rank === 3 ? 'text-amber-700' : 'text-slate-500'))
                }`}>
                  #{entry.rank}
                </span>

                <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />

                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>{entry.name}</span>
                    {entry.isCurrentUser && (
                      <span className="text-[9px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">You</span>
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">{entry.university}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right font-mono text-xs">
                <div className="hidden sm:block">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" /> {entry.streak}d streak
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-white block text-sm">
                    {activeLeaderboard === 'learning' ? `${entry.xp} XP` : `+${entry.portfolioReturn}% ROI`}
                  </span>
                  <span className="text-[10px] text-slate-400">Lvl {entry.level} Investor</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
