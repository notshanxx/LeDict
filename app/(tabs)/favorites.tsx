import { useSearchModal } from "@/context/searchModalContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Favorites() {
  const { favorites, openModal } = useSearchModal();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({ light: "#666", dark: "#9BA1A6" }, "icon");
  const itemBg = useThemeColor(
    { light: "#f5f5f5", dark: "#181818" },
    "background",
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: background }]}>
        <Text style={[styles.emptyTitle, { color: text }]}>
          No favorite words yet
        </Text>
        <Text style={[styles.emptyText, { color: muted }]}>
          Save words from the modal and they will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Favorites</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.word.toLowerCase()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.wordRow, { backgroundColor: itemBg }]}
            onPress={() => openModal(item.word, item)}
          >
            <Text style={[styles.word, { color: text }]}>{item.word}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  wordRow: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  word: {
    fontSize: 17,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
});
