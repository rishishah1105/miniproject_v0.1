import React from 'react';
import { LayoutDashboard, Compass, CandlestickChart, Trophy, User, Flame, Award, Cpu, UserCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, claimDailyStreak } = useApp();

  const currentLevelProgress = Math.min(100, Math.round(((user.xp % 300) / 300) * 100));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'simulator', label: 'Simulator', icon: CandlestickChart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'dev-engine', label: 'Dev Engine', icon: Cpu },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Wordmark */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-brand-teal flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <CandlestickChart className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
              TradeWise
            </span>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Gamification Pills & Avatar */}
          <div className="flex items-center gap-3">
            {/* Daily Streak Flame */}
            <button
              onClick={claimDailyStreak}
              title="Click to claim daily streak bonus!"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer group"
            >
              <Flame className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform animate-pulse" />
              <span>{user.streak}d</span>
            </button>

            {/* XP Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold">
              <Award className="w-4 h-4 text-brand-500" />
              <div className="flex flex-col text-[11px] leading-tight">
                <span>{user.xp} XP</span>
                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div style={{ width: `${currentLevelProgress}%` }} className="h-full bg-brand-500" />
                </div>
              </div>
            </div>

            {/* User Avatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className="relative p-0.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-teal hover:scale-105 transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-brand-600/20 border-2 border-slate-900 flex items-center justify-center text-brand-400">
                <UserCircle className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-brand-600 text-white text-[9px] font-extrabold px-1 rounded-full border border-slate-900">
                L{user.level}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-brand-500 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
