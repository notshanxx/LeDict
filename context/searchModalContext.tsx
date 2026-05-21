import WordModal from "@/components/WordModal";
import { useThemeColor } from "@/hooks/use-theme-color";
import { WordEntry } from "@/services/dictionary";
import {
  getFavoriteWords,
  hasFavoriteWord,
  saveFavoriteWords,
  toggleFavoriteWord,
} from "@/services/favorites";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

type SearchContextType = {
  openModal: (word: string, initialEntry?: WordEntry) => void;
  closeModal: () => void;
  favorites: WordEntry[];
  isFavorite: (word: string) => boolean;
  toggleFavorite: (entry: WordEntry) => Promise<void>;
  word: string;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const modalRef = useRef<BottomSheetModal>(null);
  const [word, setWord] = useState("");
  const [initialEntry, setInitialEntry] = useState<WordEntry | undefined>(
    undefined,
  );
  const [favorites, setFavorites] = useState<WordEntry[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await getFavoriteWords();
      setFavorites(storedFavorites);
    };

    loadFavorites();
  }, []);

  const openModal = (w: string, entry?: WordEntry) => {
    const trimmedWord = w.trim();
    if (!trimmedWord) return;

    setWord(trimmedWord);
    setInitialEntry(entry);
    Keyboard.dismiss();
    modalRef.current?.present();
  };

  const closeModal = () => {
    modalRef.current?.dismiss();
    setInitialEntry(undefined);
  };

  const isFavorite = (wordToFind: string) => {
    return hasFavoriteWord(favorites, wordToFind);
  };

  const toggleFavorite = async (entry: WordEntry) => {
    setFavorites((prev) => {
      const next = toggleFavoriteWord(prev, entry);
      saveFavoriteWords(next);
      return next;
    });
  };

  return (
    <SearchContext.Provider
      value={{
        openModal,
        closeModal,
        favorites,
        isFavorite,
        toggleFavorite,
        word,
      }}
    >
      {children}

      {/* GLOBAL MODAL */}
      <BottomSheetModal
        ref={modalRef}
        snapPoints={["50%", "90%"]}
        enablePanDownToClose
        enableDynamicSizing={false} // IMPORTANT FIX
        backgroundStyle={{ backgroundColor: useThemeColor({}, "background") }}
        handleIndicatorStyle={{
          backgroundColor: useThemeColor(
            { light: "#bbb", dark: "#444" },
            "icon",
          ),
        }}
      >
        <WordModal
          word={word}
          initialEntry={initialEntry}
          isFavorite={isFavorite(word)}
          onToggleFavorite={toggleFavorite}
          onClose={closeModal}
        />
      </BottomSheetModal>
    </SearchContext.Provider>
  );
}

export function useSearchModal() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchModal must be used inside provider");
  return ctx;
}
