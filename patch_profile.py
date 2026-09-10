with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix UserProfile
content = content.replace('  streakFreezeAvailable: boolean;\n}', '  streakFreezeAvailable: boolean;\n  activityLog: Record<string, number>;\n}')

# Fix INITIAL_USER
content = content.replace("name: 'Alex Morgan'", "name: 'Rishi'")
content = content.replace("  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',\n", "")
content = content.replace("  streakFreezeAvailable: true\n};", "  streakFreezeAvailable: true,\n  activityLog: {}\n};")

# Fix AppContextType
content = content.replace('  completeModuleQuiz: (moduleId: string, scorePercent: number) => void;', '  completeModuleQuiz: (moduleId: string, scorePercent: number) => void;\n  addMockStock: (symbol: string, name: string) => Promise<void>;')

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
