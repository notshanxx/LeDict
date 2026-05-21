import { getStoredItem, setStoredItem } from "@/services/storage";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);
const STORAGE_KEY = "@ledict_theme";

const lightColors = {
  background: "#ffffff",
  text: "#11181C",
};

const darkColors = {
  background: "#151718",
  text: "#ECEDEE",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = Appearance.getColorScheme();
  const [theme, setThemeState] = useState<Theme>(
    system === "dark" ? "dark" : "light",
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Prevent the native splash screen from auto-hiding so the app
    // can read the persisted theme and apply it before the first
    // visible frame. This avoids the white -> dark flash on cold start.
    // If SplashScreen calls fail, continue without blocking the app.
    (async () => {
      try {
        // keep the splash visible until we hydrate theme
        await SplashScreen.preventAutoHideAsync();
      } catch {
        // ignore
      }

      let resolvedTheme: Theme = system === "dark" ? "dark" : "light";

      try {
        const stored = await getStoredItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          resolvedTheme = stored;
        }
      } catch {
        // ignore
      }

      setThemeState(resolvedTheme);

      // Apply system UI background to match the chosen theme before
      // hiding the splash so the native window isn't white briefly.
      try {
        const bg =
          resolvedTheme === "dark"
            ? darkColors.background
            : lightColors.background;
        // @ts-ignore
        if (SystemUI?.setBackgroundColorAsync) {
          // @ts-ignore
          await SystemUI.setBackgroundColorAsync(bg);
        }
      } catch {
        // ignore
      }

      setHydrated(true);

      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    })();
  }, [system]);

  useEffect(() => {
    // Keep system UI navigation/status colors in sync when theme changes
    const bg =
      theme === "dark" ? darkColors.background : lightColors.background;
    // expo-system-ui provides setBackgroundColorAsync on supported platforms.

    (async () => {
      try {
        // @ts-ignore
        if (SystemUI?.setBackgroundColorAsync) {
          // @ts-ignore
          await SystemUI.setBackgroundColorAsync(bg);
        }
      } catch {
        // ignore
      }
    })();
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setStoredItem(STORAGE_KEY, t).catch(() => {});
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      {/* Render children only after we hydrated theme to avoid
          an inconsistent first frame. When hydrated is false the
          native splash remains visible (we prevented auto-hide). */}
      {hydrated ? children : null}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export function useColorSchemeName(): ColorSchemeName {
  const ctx = useContext(ThemeContext);
  if (!ctx) return Appearance.getColorScheme();
  return ctx.theme;
}
