import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/theme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const { theme } = useTheme();
  const colorFromProps = props[theme as "light" | "dark"];

  if (colorFromProps) return colorFromProps;
  return Colors[theme as "light" | "dark"][colorName];
}

export default useThemeColor;
