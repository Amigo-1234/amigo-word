export const state = {
  words: [
    {
      id: 1,
      word: "eloquent",
      meaning: "Fluent or persuasive in speaking or writing.",
      interval: 5,
      example: "Her eloquent argument changed everyone’s mind.",
      status: "learning",
    },
    {
      id: 2,
      word: "meticulous",
      meaning: "Showing great attention to detail; very careful and precise.",
      interval: 10,
      example: "He kept meticulous notes during the meeting.",
      status: "learning",
    },
    {
      id: 3,
      word: "concise",
      meaning: "Giving a lot of information clearly and in a few words.",
      interval: 3,
      example: "Keep your explanation concise and clear.",
      status: "mastered",
    },
  ],
  nextWordId: 4,
  streakDays: 5,
  dailyGoal: 10,
  dailyLearned: 6,
  xp: 120,
  xpNext: 200,
  quiz: {
    mode: "choice",
    correct: 0,
    total: 0,
    currentQuestion: null,
  },
  flashcards: {
    index: 0,
  },
  settings: {
    notifications: true,
    intensity: "light",
  },
};

// Pure helpers

export function computeLevelLabel(xp) {
  if (xp < 200) return "Beginner";
  if (xp < 600) return "Pro";
  return "Master";
}

// Simple XP mutator – DOM updates are handled in feature modules.
export function addXP(amount) {
  state.xp += amount;
  if (state.xp >= state.xpNext) {
    state.xpNext = Math.round(state.xpNext * 1.4);
  }
}