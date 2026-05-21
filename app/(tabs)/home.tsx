import { useSearchModal } from "@/context/searchModalContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [text, setText] = useState("");
  const { openModal } = useSearchModal();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: useThemeColor({}, "background") },
      ]}
    >
      <Text style={[styles.title, { color: useThemeColor({}, "text") }]}>
        LeDict
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: useThemeColor({ light: "gray", dark: "#9BA1A6" }, "icon") },
        ]}
      >
        Search any word instantly
      </Text>

      {/* SEARCH BAR */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: useThemeColor(
              { light: "#f2f2f2", dark: "#1a1a1b" },
              "background",
            ),
          },
        ]}
      >
        <TextInput
          placeholder="Search word..."
          placeholderTextColor={useThemeColor(
            { light: "#888", dark: "#9BA1A6" },
            "icon",
          )}
          style={[styles.input, { color: useThemeColor({}, "text") }]}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          onPress={() => openModal(text)}
          activeOpacity={0.8}
          style={[
            styles.searchButton,
            { backgroundColor: useThemeColor({}, "tabIconSelected") },
            !text ? { opacity: 0.5 } : null,
          ]}
          disabled={!text}
        >
          <Text
            style={[
              styles.searchButtonText,
              { color: useThemeColor({}, "background") },
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  subtitle: {
    color: "gray",
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    // subtle depth (optional but nice)
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
