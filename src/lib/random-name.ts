// Fun random name generator for demo users
// Generates memorable names like "Clever Fox", "Swift Panda", etc.

const adjectives = [
  "Swift",
  "Clever",
  "Bright",
  "Brave",
  "Calm",
  "Eager",
  "Fancy",
  "Gentle",
  "Happy",
  "Jolly",
  "Kind",
  "Lively",
  "Merry",
  "Noble",
  "Proud",
  "Quick",
  "Rapid",
  "Silly",
  "Witty",
  "Zesty",
  "Cosmic",
  "Daring",
  "Epic",
  "Fierce",
  "Gleeful",
  "Hyper",
  "Icy",
  "Jazzy",
  "Keen",
  "Lucky",
  "Mystic",
  "Nimble",
  "Plucky",
  "Quirky",
  "Radiant",
  "Snappy",
  "Turbo",
  "Ultra",
  "Vivid",
  "Wild",
];

const animals = [
  "Fox",
  "Panda",
  "Tiger",
  "Eagle",
  "Wolf",
  "Bear",
  "Hawk",
  "Lion",
  "Otter",
  "Raven",
  "Shark",
  "Whale",
  "Cobra",
  "Drake",
  "Falcon",
  "Gecko",
  "Heron",
  "Ibis",
  "Jaguar",
  "Koala",
  "Lynx",
  "Moose",
  "Newt",
  "Owl",
  "Parrot",
  "Quail",
  "Robin",
  "Sloth",
  "Toucan",
  "Urchin",
  "Viper",
  "Wombat",
  "Yak",
  "Zebra",
  "Badger",
  "Crane",
  "Dingo",
  "Elk",
  "Finch",
  "Gorilla",
];

const colors = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#a855f7", // Violet
];

/**
 * Generates a random fun name like "Swift Fox" or "Clever Panda"
 */
export function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective} ${animal}`;
}

/**
 * Generates a random color from our palette
 */
export function generateRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generates a complete random user with name and color
 */
export function generateRandomUser(): { name: string; color: string } {
  return {
    name: generateRandomName(),
    color: generateRandomColor(),
  };
}
