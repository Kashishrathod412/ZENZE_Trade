import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fuzzyMatch(text: string, query: string): boolean {
  if (!text || !query) return false;
  const t = text.toLowerCase();
  const q = query.toLowerCase();

  // 1. Exact or partial inclusion
  if (t.includes(q)) return true;

  // 2. Levenshtein Distance for spelling mistakes
  // Only for words longer than 3 chars to avoid false positives
  if (q.length > 3) {
    const words = t.split(/\s+/);
    for (const word of words) {
      if (getLevenshteinDistance(q, word) <= 2) return true;
    }
  }

  return false;
}

function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}
