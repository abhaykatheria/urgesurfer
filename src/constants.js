// Seed urge catalog. The live catalog lives on app state so users can append.
export const URGE_CATALOG = [
  { id: 'cig',    label: 'Cigarette', emoji: '🚬' },
  { id: 'vape',   label: 'Vape',      emoji: '💨' },
  { id: 'booze',  label: 'Alcohol',   emoji: '🍷' },
  { id: 'coffee', label: 'Coffee',    emoji: '☕' },
  { id: 'sugar',  label: 'Sugar',     emoji: '🍩' },
  { id: 'weed',   label: 'Weed',      emoji: '🌿' },
  { id: 'phone',  label: 'Social',    emoji: '📱' },
  { id: 'shop',   label: 'Shopping',  emoji: '🛍️' },
  { id: 'porn',   label: 'Porn',      emoji: '🔞' },
  { id: 'gamble', label: 'Gambling',  emoji: '🎰' },
  { id: 'snack',  label: 'Snacking',  emoji: '🍿' },
  { id: 'bite',   label: 'Nail bite', emoji: '💅' },
];

export const CUSTOM_EMOJIS = ['✨','🎯','🔥','💪','🧘','🌱','📚','🎮','🎨','🎵','⏰','🏃','🍴','🥤','🍫','💼','💕','💊'];

export const TRIGGERS = ['Stress','Boredom','Social','After meal','Habit','Alcohol','Anger','Reward'];

export const DURATIONS = [60, 180, 300, 600, 900];

export const OVERLAY_STYLES = ['Minimal','Strava','Ticker','Polaroid','Receipt'];
