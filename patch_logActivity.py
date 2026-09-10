with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("updateQuestProgress('quest-1', 1);\n      updateDailyQuestProgress('q-study-1');", "updateQuestProgress('quest-1', 1);\n      logActivity();\n      updateDailyQuestProgress('q-study-1');")
content = content.replace("updateQuestProgress('quest-2', 1);\n        updateDailyQuestProgress('q-trade-3');", "updateQuestProgress('quest-2', 1);\n        logActivity();\n        updateDailyQuestProgress('q-trade-3');")

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
