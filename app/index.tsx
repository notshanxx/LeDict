import DictionaryCard from "@/components/Card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function Index() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({ light: "#5f6b73", dark: "#9BA1A6" }, "icon");

  return (
    <Pressable
      style={[styles.container, { backgroundColor: background }]}
      onPress={() => router.push("/(tabs)/home")}
      accessibilityRole="button"
      accessibilityLabel="Open LeDict"
    >
      <Text style={[styles.title, { color: text }]}>LeDict</Text>
      <Text style={[styles.subtitle, { color: text }]}>
        LeDictionaryfor instant word search and word cards
      </Text>
      <DictionaryCard
        style={[
          {
            marginTop: 16,
            borderWidth: 1,
            borderColor: muted,
            borderRadius: 12,
          },
        ]}
        word="hello"
        pronunciation="həˈloʊ"
        partOfSpeech="interjection"
        definitions={[
          "Used as a greeting or to begin a telephone conversation.",
        ]}
        examples={["Hello! How are you? Welcome to LeDict."]}
      />
      <Text style={[styles.tipText, { color: muted }]}>
        Click anywhere to open
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  featuresCard: {
    width: "100%",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 22,
    maxWidth: 420,
    alignItems: "center",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  featureItem: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  tipText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
