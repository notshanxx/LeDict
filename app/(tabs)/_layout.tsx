import { useThemeColor } from "@/hooks/use-theme-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({}, "icon");
  const active = useThemeColor({}, "tabIconSelected");
  const inactive = useThemeColor({}, "tabIconDefault");
  const tabBg = useThemeColor({}, "background");
  const availableWidth = Math.max(width - insets.left - insets.right, 0);
  const tabBarWidth = Math.min(Math.max(availableWidth - 32, 280), 380);
  const tabBarLeft = Math.max(
    insets.left + (availableWidth - tabBarWidth) / 2,
    0,
  );

  return (
    <View style={{ flex: 1, backgroundColor: tabBg }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: active,
          tabBarInactiveTintColor: inactive,
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            position: "absolute",
            backgroundColor: tabBg,
            width: tabBarWidth,
            left: tabBarLeft,
            bottom: 16 + insets.bottom,
            borderRadius: 18,
          },
          sceneStyle: { backgroundColor: tabBg },
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: 6,
          },
        }}
      >
        {/* for settings */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color ?? iconColor}
              />
            ),
          }}
        />

        {/* For home */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color ?? iconColor}
              />
            ),
          }}
        />

        {/* for favorites */}
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={24}
                color={color ?? iconColor}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
