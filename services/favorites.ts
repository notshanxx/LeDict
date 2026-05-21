import { WordEntry } from "@/services/dictionary";
import { getStoredItem, setStoredItem } from "@/services/storage";

const FAVORITES_KEY = "@ledict/favorites";

export async function getFavoriteWords(): Promise<WordEntry[]> {
  const raw = await getStoredItem(FAVORITES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as WordEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteWords(favorites: WordEntry[]): Promise<void> {
  await setStoredItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function hasFavoriteWord(favorites: WordEntry[], word: string): boolean {
  return favorites.some(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase(),
  );
}

export function toggleFavoriteWord(
  favorites: WordEntry[],
  entry: WordEntry,
): WordEntry[] {
  const normalizedWord = entry.word.trim().toLowerCase();
  const exists = favorites.some(
    (item) => item.word.trim().toLowerCase() === normalizedWord,
  );

  if (exists) {
    return favorites.filter(
      (item) => item.word.trim().toLowerCase() !== normalizedWord,
    );
  }

  return [entry, ...favorites];
}
