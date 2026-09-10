import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update fetch for 3M and 1Y
content = content.replace(
'''      const res1M = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=1mo`);''',
'''      const res1M = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=1mo`);
      const res3M = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=3mo`);
      const res1Y = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=1y`);'''
)

content = content.replace(
'''if (res1D.ok && res1W.ok && res1M.ok) {''',
'''if (res1D.ok && res1W.ok && res1M.ok && res3M.ok && res1Y.ok) {'''
)

content = content.replace(
'''const data1M = await res1M.json();''',
'''const data1M = await res1M.json();
        const data3M = await res3M.json();
        const data1Y = await res1Y.json();'''
)

content = content.replace(
'''const history1M = parseChartData(data1M);''',
'''const history1M = parseChartData(data1M);
        const history3M = parseChartData(data3M);
        const history1Y = parseChartData(data1Y);'''
)

content = content.replace(
'''history1W: history1W.length > 0 ? history1W : history1D,
                history1M: history1M.length > 0 ? history1M : history1D,''',
'''history1W: history1W.length > 0 ? history1W : history1D,
                history1M: history1M.length > 0 ? history1M : history1D,
                history3M: history3M.length > 0 ? history3M : history1D,
                history1Y: history1Y.length > 0 ? history1Y : history1D,'''
)

content = content.replace(
'''isSimulated: true''',
'''isSimulated: false'''
)

# 2. Add DAILY_QUEST_POOL and State Interface
insert_idx = content.find('export interface DailyQuest {')
new_interfaces = '''
export const DAILY_QUEST_POOL = [
  { id: 'q-study-1', title: 'Study any concept today', reward: 30, target: 1 },
  { id: 'q-limit-order', title: 'Place a limit order in the simulator', reward: 30, target: 1 },
  { id: 'q-quiz-perfect', title: 'Pass a quiz with a perfect score', reward: 40, target: 1 },
  { id: 'q-study-2', title: 'Study 2 concepts today', reward: 50, target: 2 },
  { id: 'q-trade-3', title: 'Place 3 trades today', reward: 40, target: 3 },
  { id: 'q-streak', title: 'Claim your daily streak bonus', reward: 20, target: 1 },
  { id: 'q-leaderboard', title: 'Visit the leaderboard today', reward: 15, target: 1 },
];

export interface DailyQuestState {
  date: string;
  id: string;
  progress: number;
  completed: boolean;
}
'''
if 'export const DAILY_QUEST_POOL' not in content:
    content = content[:insert_idx] + new_interfaces + content[insert_idx:]

context_type_idx = content.find('quests: DailyQuest[];')
if 'dailyQuestState: DailyQuestState;' not in content:
    content = content[:context_type_idx] + 'dailyQuestState: DailyQuestState;\n  activeQuestConfig: typeof DAILY_QUEST_POOL[0];\n  updateDailyQuestProgress: (actionId: string, amount?: number) => void;\n  ' + content[context_type_idx:]

# 3. Initialize state in AppContext
state_idx = content.find('const [user, setUser] = useState<UserProfile>')
new_state = '''
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / 86400000);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeQuestConfig = DAILY_QUEST_POOL[getDayOfYear() % DAILY_QUEST_POOL.length];

  const [dailyQuestState, setDailyQuestState] = useState<DailyQuestState>(() => {
    const stored = localStorage.getItem('dailyQuest');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === todayStr) {
        return parsed;
      }
    }
    return { date: todayStr, id: activeQuestConfig.id, progress: 0, completed: false };
  });

  useEffect(() => {
    localStorage.setItem('dailyQuest', JSON.stringify(dailyQuestState));
  }, [dailyQuestState]);

  const updateDailyQuestProgress = (actionId: string, amount: number = 1) => {
    if (dailyQuestState.date !== todayStr) return;
    if (dailyQuestState.completed) return;
    if (activeQuestConfig.id !== actionId) return;

    setDailyQuestState(prev => {
      const newProgress = Math.min(activeQuestConfig.target, prev.progress + amount);
      if (newProgress >= activeQuestConfig.target && !prev.completed) {
        setUser(u => ({ ...u, xp: u.xp + activeQuestConfig.reward }));
        addToast('Daily Quest Completed! 🎁', `+${activeQuestConfig.reward} XP for: ${activeQuestConfig.title}`, 'xp');
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        return { ...prev, progress: newProgress, completed: true };
      }
      return { ...prev, progress: newProgress };
    });
  };

'''
if 'const getDayOfYear' not in content:
    content = content[:state_idx] + new_state + content[state_idx:]

# Add state to AppContext.Provider value
value_idx = content.find('quests,\n')
if 'dailyQuestState,\n' not in content:
    content = content.replace('quests,\n', 'quests,\n        dailyQuestState,\n        activeQuestConfig,\n        updateDailyQuestProgress,\n')

# 4. Add action triggers
content = content.replace("updateQuestProgress('quest-1', 1);", "updateQuestProgress('quest-1', 1);\n      updateDailyQuestProgress('q-study-1');\n      updateDailyQuestProgress('q-study-2');")
content = content.replace("unlockBadge('quiz-perfectionist');", "unlockBadge('quiz-perfectionist');\n        updateDailyQuestProgress('q-quiz-perfect');")

content = content.replace("updateQuestProgress('quest-2', 1);\n        logActivity();", "updateQuestProgress('quest-2', 1);\n        logActivity();\n        updateDailyQuestProgress('q-trade-3');\n        if (type === 'LIMIT') updateDailyQuestProgress('q-limit-order');")

content = content.replace("unlockBadge('streak-starter');", "unlockBadge('streak-starter');\n      updateDailyQuestProgress('q-streak');")

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
