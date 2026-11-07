import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import {
  getLegalDocument,
  type LegalDocument,
} from "@/features/auth/api/legal-api";
import { formatDate } from "@/lib/format";
import { tokens as t } from "@/theme/tokens";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// 09.02 이용약관 · 09.03 개인정보 처리방침. 서버의 현재 시행 문서를 표시합니다.
const kinds = {
  terms: { title: "이용약관", type: "TERMS" },
  privacy: { title: "개인정보 처리방침", type: "PRIVACY" },
} as const;

export default function LegalRoute() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const target = kinds[kind as keyof typeof kinds];
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(() => {
    if (!target) return;
    setError(false);
    setDocument(null);
    getLegalDocument(target.type)
      .then(setDocument)
      .catch(() => setError(true));
  }, [target]);
  useEffect(() => {
    queueMicrotask(load);
  }, [load]);
  if (!target) return <Redirect href="/settings" />;
  return (
    <FlowPage
      title={target.title}
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/settings")
      }
    >
      {error ? (
        <>
          <Text accessibilityRole="header" style={f.title}>
            문서를{"\n"}불러오지 못했어요.
          </Text>
          <Text style={f.muted}>연결을 확인하고 다시 시도해 주세요.</Text>
          <ActionButton label="다시 불러오기" onPress={load} />
        </>
      ) : !document ? (
        <View style={f.group}>
          <ActivityIndicator
            accessibilityLabel="문서 불러오는 중"
            color={t.muted}
          />
          <Text style={f.muted}>문서를 불러오고 있어요.</Text>
        </View>
      ) : (
        <>
          <Text style={f.muted}>
            v{document.version} · 시행일 {formatDate(document.effectiveAt)}
          </Text>
          <Text style={f.text}>{document.body}</Text>
        </>
      )}
    </FlowPage>
  );
}
