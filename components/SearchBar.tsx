import { useThemeColor } from "@/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function Search() {
  const background = useThemeColor(
    { light: "#f4f4f5", dark: "#1a1a1b" },
    "background",
  );
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({ light: "#71717a", dark: "#9BA1A6" }, "icon");

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor={muted}
        style={[styles.input, { color: text }]}
      />

      <Feather name="search" size={20} color={muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
});
