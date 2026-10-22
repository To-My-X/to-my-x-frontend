import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ActionButton } from "@/components/ui/feed-actions";
import { flowStyles as f } from "@/components/ui/flow-page";
import { Text, View } from "react-native";
import { mockAuthEnabled } from "./mock-session";

export function LoginScreen({
  onCancel,
  onMockLogin,
}: {
  onCancel: () => void;
  onMockLogin: () => void;
}) {
  return (
    <BottomSheet visible onClose={onCancel}>
      <Text accessibilityRole="header" style={f.title}>
        이 마음을 남기려면
      </Text>
      <Text style={f.muted}>로그인하고 당신의 이야기를 남겨보세요.</Text>
      {["Apple", "Google", "카카오"].map((provider) => (
        <ActionButton
          key={provider}
          label={`${provider}로 계속하기`}
          disabled
        />
      ))}
      <ActionButton label="나중에 할게요" onPress={onCancel} />
      {mockAuthEnabled && (
        <View style={f.group}>
          <Text style={f.muted}>
            개발용 화면 연결 · 실제 계정으로 로그인하지 않습니다.
          </Text>
          <ActionButton
            label="Mock 로그인으로 연결 확인"
            onPress={onMockLogin}
          />
        </View>
      )}
    </BottomSheet>
  );
}
