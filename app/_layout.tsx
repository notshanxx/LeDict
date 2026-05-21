import { SearchProvider } from "@/context/searchModalContext";
import { ThemeProvider } from "@/context/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function RootLayout() {
  function InnerApp() {
    // use theme to set background for the root view to avoid white flash
    const bg = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");

    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: bg }}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: bg }}
          edges={["top", "left", "right"]}
        >
          <BottomSheetModalProvider>
            <SearchProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: bg },
                }}
              />
            </SearchProvider>
          </BottomSheetModalProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <InnerApp />
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
