import { tokens as t } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const paths = {
  plus: "M12 4v16M4 12h16",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  share: "M12 15V2m-4 4 4-4 4 4M6 10H4v11h16V10h-2",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  mute: "M11 4 6 8H2v8h4l5 4ZM16 9l6 6m0-6-6 6",
  bookmark: "M6 3h12v18l-6-4-6 4Z",
  refresh: "M20 9a8 8 0 1 0 0 6M20 3v6h-6",
  arrow: "M12 3v18M7 8l5-5 5 5",
};
export type IconName = keyof typeof paths | "more";
export function Icon({
  name,
  color = t.text,
  size = 24,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      {name === "more" ? (
        [5, 12, 19].map((cx) => (
          <Circle key={cx} cx={cx} cy={12} r={1} fill={color} />
        ))
      ) : (
        <Path d={paths[name]} />
      )}
    </Svg>
  );
}
export function IconButton({
  icon,
  label,
  caption,
  bright = false,
  onPress,
}: {
  onPress?: () => void;
  icon: IconName;
  label: string;
  caption?: string;
  bright?: boolean;
}) {
  return (
    <View style={styles.action}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !onPress }}
        style={[styles.icon, bright && styles.bright]}
      >
        <Icon name={icon} color={bright ? t.background : t.text} />
      </Pressable>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}
export function ActionButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || !onPress }}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        (disabled || !onPress) && { opacity: 0.45 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  action: { alignItems: "center", gap: 5 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(48,45,39,0.45)",
  },
  bright: { backgroundColor: t.text, borderColor: t.text },
  caption: { color: t.muted, fontSize: 11, fontFamily: t.sans },
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: t.line,
    alignSelf: "flex-start",
    backgroundColor: t.surface,
  },
  buttonText: { fontFamily: t.sans, color: t.text, fontSize: 14 },
});
