with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# completeModuleQuiz
# Note: completeModuleQuiz does not have logActivity(). Let's use `updateQuestProgress('quest-1', 1);` as the anchor.
content = content.replace("updateQuestProgress('quest-1', 1);", "updateQuestProgress('quest-1', 1);\n      updateDailyQuestProgress('q-study-1');\n      updateDailyQuestProgress('q-study-2');")
content = content.replace("unlockBadge('quiz-perfectionist');", "unlockBadge('quiz-perfectionist');\n        updateDailyQuestProgress('q-quiz-perfect');")

# placeOrder has logActivity();
content = content.replace("logActivity();", "logActivity();\n        updateDailyQuestProgress('q-trade-3');\n        if (type === 'LIMIT') updateDailyQuestProgress('q-limit-order');")

# claimDailyStreak
content = content.replace("unlockBadge('streak-starter');", "unlockBadge('streak-starter');\n      updateDailyQuestProgress('q-streak');")

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
