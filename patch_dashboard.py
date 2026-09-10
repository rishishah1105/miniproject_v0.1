import re

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('quests, claimQuest, formatMoney', 'dailyQuestState, activeQuestConfig, formatMoney')

new_widget = '''
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
'''
content = re.sub(r'\{\/\* Daily Quests Widget \*\/\}.*?<\/div>\s*<\/div>', new_widget.strip(), content, flags=re.DOTALL)

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
