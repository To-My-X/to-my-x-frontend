import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ActionButton } from "@/components/ui/feed-actions";
import { flowStyles as f } from "@/components/ui/flow-page";
import { ActivityIndicator, Text, View } from "react-native";
import { tokens as t } from "@/theme/tokens";
import { mockAuthEnabled } from "./auth-session";

export type LoginPhase = "idle" | "busy" | "failed";

// 08.01~08.05 로그인 시트. 카카오(웹)만 실제 연동이고 Apple·Google은 공급자 설정 전 비활성입니다.
export function LoginScreen({
  phase,
  failDetail,
  kakaoEnabled,
  onKakao,
  onCancel,
  onMockLogin,
}: {
  phase: LoginPhase;
  failDetail?: string;
  kakaoEnabled: boolean;
  onKakao: () => void;
  onCancel: () => void;
  onMockLogin: () => void;
}) {
  if (phase === "busy")
    return (
      <BottomSheet visible onClose={onCancel}>
        <ActivityIndicator accessibilityLabel="로그인하는 중" color={t.muted} />
        <Text accessibilityRole="header" style={f.title}>
          로그인하는 중이에요.
        </Text>
        <Text style={f.muted}>잠시만 기다려 주세요.</Text>
        <ActionButton label="취소" onPress={onCancel} />
      </BottomSheet>
    );
  if (phase === "failed")
    return (
      <BottomSheet visible onClose={onCancel}>
        <Text accessibilityRole="header" style={f.title}>
          로그인하지{"\n"}못했어요.
        </Text>
        <Text style={f.muted}>연결을 확인하고 다시 시도해 주세요.</Text>
        {mockAuthEnabled && failDetail ? (
          // 테스트 배포에서 실패 원인을 현장에서 읽기 위한 표시. production 번들에는 포함되지 않습니다.
          <Text style={f.muted}>{failDetail}</Text>
        ) : null}
        <ActionButton label="다시 시도하기" disabled={!kakaoEnabled} onPress={onKakao} />
        <ActionButton label="먼저 둘러볼게요" onPress={onCancel} />
      </BottomSheet>
    );
  return (
    <BottomSheet visible onClose={onCancel}>
      <Text accessibilityRole="header" style={f.title}>
        이 마음을 남기려면
      </Text>
      <Text style={f.muted}>로그인하고 당신의 이야기를 남겨보세요.</Text>
      {["Apple", "Google"].map((provider) => (
        <ActionButton key={provider} label={`${provider}로 계속하기`} disabled />
      ))}
      <ActionButton
        label="카카오로 계속하기"
        disabled={!kakaoEnabled}
        onPress={kakaoEnabled ? onKakao : undefined}
      />
      <ActionButton label="나중에 할게요" onPress={onCancel} />
      {mockAuthEnabled && (
        <View style={f.group}>
          <Text style={f.muted}>
            개발용 화면 연결 · 실제 계정으로 로그인하지 않습니다.
          </Text>
          <ActionButton label="Mock 로그인으로 연결 확인" onPress={onMockLogin} />
        </View>
      )}
    </BottomSheet>
  );
}
