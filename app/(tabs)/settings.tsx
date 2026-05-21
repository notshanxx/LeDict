import { useTheme } from "@/context/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const muted = useThemeColor({ light: "#5f6b73", dark: "#9BA1A6" }, "icon");
  const cardBg = useThemeColor(
    { light: "#F4F7F9", dark: "#1C1F22" },
    "background",
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Theme</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: text }]}>Dark mode</Text>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ true: tint, false: undefined }}
          thumbColor={theme === "dark" ? tint : undefined}
        />
      </View>

      <View style={[styles.featuresCard, { backgroundColor: cardBg }]}>
        <Text style={[styles.featuresTitle, { color: text }]}>Tips</Text>
        <Text style={[styles.featureItem, { color: muted }]}>
          You can save word card and share it instantly.
        </Text>
        <Text style={[styles.featureItem, { color: muted }]}>
          Change meaning by tapping Other Definitions.
        </Text>
      </View>
      <View style={styles.footerWrap}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Open LeDict on GitHub"
          android_ripple={{ color: tint, borderless: false }}
          style={({ pressed }) => [
            styles.footer,
            {
              backgroundColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.03)",
              borderColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)",
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={async () => {
            try {
              const url = "https://github.com/notshanxx/LeDict";
              const can = await Linking.canOpenURL(url);
              if (can) await Linking.openURL(url);
            } catch {
              // ignore
            }
          }}
        >
          <Ionicons
            name="logo-github"
            size={28}
            color={tint}
            style={styles.icon}
          />
          <Text numberOfLines={2} style={[styles.footerText, { color: text }]}>
            Like this app? Help improve it on GitHub
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  title: { fontSize: 20, marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 16 },
  footerWrap: {
    marginTop: "auto",
    marginBottom: 10,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: "90%",
    maxWidth: 520,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 12 },
  footerText: { flexShrink: 1, fontSize: 14, textAlign: "center" },
});

// Reuse small features card styles used elsewhere
Object.assign(styles, {
  featuresCard: {
    width: "100%",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
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
});
