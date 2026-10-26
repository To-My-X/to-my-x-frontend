import { useEffect, useState, type PropsWithChildren } from "react";
import {
  Animated,
  Easing,
  Platform,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const native = Platform.OS !== "web";

// 장면 연출 공용 페이드 인. 가벼운 상승과 함께 서서히 나타나 감성적인 전환을 만듭니다.
export function FadeIn({
  delay = 0,
  duration = 700,
  rise = 10,
  style,
  children,
}: PropsWithChildren<{
  delay?: number;
  duration?: number;
  rise?: number;
  style?: StyleProp<ViewStyle>;
}>) {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: native,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [rise, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
