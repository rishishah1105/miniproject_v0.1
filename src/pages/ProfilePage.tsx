import React from 'react';
import { Award, Flame, Zap, ShieldCheck, TrendingUp, Target, RefreshCw, CheckCircle2, Lock, PieChart, DollarSign, BookOpen, Calendar, UserCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface HeatmapCell {
  dateStr: string;
  dayName: string;
  monthName: string;
  activityCount: number;
  activityText: string;
}

export const ProfilePage: React.FC = () => {
  const { user, badges, tradeLog, holdings, resetAllProgress, formatMoney } = useApp();

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-brand-500" />;
      case 'Award': return <Award className="w-6 h-6 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-emerald-400" />;
      case 'PieChart': return <PieChart className="w-6 h-6 text-indigo-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Target': return <Target className="w-6 h-6 text-teal-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6 text-emerald-400" />;
      default: return <Award className="w-6 h-6 text-brand-500" />;
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  // Generate GitHub/LeetCode Style 52-Week Heatmap Matrix (364 Days = 52 Columns x 7 Rows)
  const generateHeatmapMatrix = (): { columns: HeatmapCell[][]; monthLabels: string[] } => {
    const columns: HeatmapCell[][] = [];
    const today = new Date();
    const totalDays = 364; // 52 weeks
    const startDate = new Date(today.getTime() - (totalDays - 1) * 24 * 60 * 60 * 1000);

    const monthLabelsSet = new Set<string>();

    let currentDay = new Date(startDate);
    let currentWeek: HeatmapCell[] = [];

    for (let i = 0; i < totalDays; i++) {
      const dateStr = currentDay.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const dayName = currentDay.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = currentDay.toLocaleDateString('en-US', { month: 'short' });

      monthLabelsSet.add(monthName);

      const isoDate = currentDay.toISOString().split('T')[0];
      const activityCount = user.activityLog?.[isoDate] || 0;
      const activityText = activityCount > 0 ? `${activityCount} activit${activityCount === 1 ? 'y' : 'ies'}` : 'No activity';

      currentWeek.push({
        dateStr,
        dayName,
        monthName,
        activityCount,
        activityText
      });

      if (currentWeek.length === 7) {
        columns.push(currentWeek);
        currentWeek = [];
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      columns.push(currentWeek);
    }

    return { columns, monthLabels: Array.from(monthLabelsSet) };
  };

  const { columns, monthLabels } = generateHeatmapMatrix();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-800/80 border-2 border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
          <UserCircle className="w-12 h-12 text-indigo-400/80" strokeWidth={1.5} />
        </div>
        <div className="space-y-2 text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h1>
          <p className="text-xs text-slate-400 font-medium">Student Investor • Member since August 2026</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
              {user.xp} Total XP
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> {user.streak}-Day Streak
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              {unlockedCount} Badges Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* GitHub / LeetCode Style Contribution Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white">Study & Trading Activity Heatmap</h3>
          </div>
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> {user.streak}-Day Active Streak
          </span>
        </div>

        {/* Month Labels Header */}
        <div className="flex items-center justify-between px-8 text-[11px] font-bold text-slate-400 font-mono">
          {monthLabels.map(m => (
            <span key={m}>{m}</span>
          ))}
        </div>

        {/* 7-Row Column Matrix */}
        <div className="w-full pb-2">
          <div className="flex items-center gap-1 w-full px-2">
            {/* Days of week column label */}
            <div className="flex flex-col justify-between text-[8px] font-mono text-slate-500 h-full py-0.5 mr-1 shrink-0">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix Columns */}
            <div className="flex gap-[2px] flex-1 w-full justify-between">
              {columns.map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-[2px] flex-1 max-w-[12px]">
                  {col.map((cell, rIdx) => {
                    let cellColor = 'bg-slate-800/80 border border-slate-700/50';
                    if (cell.activityCount === 1) {
                      cellColor = 'bg-emerald-950/80 border border-emerald-900 text-emerald-300';
                    } else if (cell.activityCount === 2) {
                      cellColor = 'bg-emerald-800 border border-emerald-700 text-emerald-100';
                    } else if (cell.activityCount === 3) {
                      cellColor = 'bg-emerald-600 border border-emerald-500 text-white';
                    } else if (cell.activityCount >= 4) {
                      cellColor = 'bg-emerald-400 border border-white text-slate-950 shadow-md shadow-emerald-400/40 animate-pulse';
                    }

                    let tooltipPosClass = 'top-6 left-1/2 -translate-x-1/2'; // Default: below and centered
                    
                    if (cIdx > 35) {
                      tooltipPosClass = tooltipPosClass.replace('left-1/2 -translate-x-1/2', 'right-0');
                    } else if (cIdx < 5) {
                      tooltipPosClass = tooltipPosClass.replace('left-1/2 -translate-x-1/2', 'left-0');
                    }
                    
                    if (rIdx > 3) {
                      tooltipPosClass = tooltipPosClass.replace('top-6', 'bottom-6');
                    }

                    return (
                      <div
                        key={rIdx}
                        className={`w-full aspect-square rounded-[1px] transition-all relative group ${cellColor}`}
                      >
                        {/* Hover Tooltip */}
                        <div className={`absolute ${tooltipPosClass} hidden group-hover:flex flex-col items-center bg-slate-950 text-[10px] text-white p-2 rounded-xl border border-slate-700 whitespace-nowrap z-30 shadow-2xl pointer-events-none`}>
                          <span className="font-bold text-emerald-400">{cell.dateStr}</span>
                          <span className="text-slate-300 mt-0.5">{cell.activityText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
          <span>Less</span>
          <span className="w-3 h-3 rounded-sm bg-slate-800/80 border border-slate-700" />
          <span className="w-3 h-3 rounded-sm bg-emerald-950/80 border border-emerald-900" />
          <span className="w-3 h-3 rounded-sm bg-emerald-800 border border-emerald-700" />
          <span className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-500" />
          <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-white shadow-sm" />
          <span>More</span>
        </div>
      </div>

      {/* Badge Case Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Achievement Badge Case
            </h3>
            <p className="text-xs text-slate-400">Unlock milestone badges through learning modules and paper trades.</p>
          </div>
          <span className="text-xs font-bold text-indigo-400">{unlockedCount} / {badges.length} Mastered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                badge.unlocked
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-950/20 hover:border-amber-400 glow-indigo'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                  {getBadgeIcon(badge.iconName)}
                </div>
                {badge.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-white">{badge.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500">
                  {badge.unlocked ? `Unlocked ${badge.unlockedAt || 'Recently'}` : 'Locked Milestone'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Performance Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <TrendingUp className="w-5 h-5 text-teal-400" /> Paper Simulator Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Executed Trades</span>
            <strong className="text-xl font-black text-white">{tradeLog.length}</strong>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Active Stock Positions</span>
            <strong className="text-xl font-black text-indigo-400">{Object.keys(holdings).length}</strong>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Win Rate %</span>
            <strong className="text-xl font-black text-emerald-400">100%</strong>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Best Trade Profit</span>
            <strong className="text-xl font-black text-emerald-400">+{formatMoney(45.50)}</strong>
          </div>
        </div>
      </div>

      {/* Reset Account Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Reset Account & Portfolio Data</h4>
          <p className="text-xs text-slate-400">Restart your learning path and restore virtual cash back to starting balance.</p>
        </div>
        <button
          onClick={resetAllProgress}
          className="px-5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Progress</span>
        </button>
      </div>
    </div>
  );
};
