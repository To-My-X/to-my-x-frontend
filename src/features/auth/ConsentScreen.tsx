import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { tokens as t } from "@/theme/tokens";
import { getLegalDocuments, type LegalDocument } from "./api/legal-api";

// 08.06 필수 동의. 현재 시행 중인 약관 버전을 조회해 그 버전으로 동의를 저장합니다.
export function ConsentScreen({
  onCancel,
  onViewDocument,
  onAgree,
}: {
  onCancel: () => void;
  onViewDocument: (kind: "terms" | "privacy") => void;
  // 서버 저장 실패 시 reject합니다. 체크 상태는 화면이 보존합니다.
  onAgree: (termsVersion: string, privacyVersion: string) => Promise<void>;
}) {
  const [documents, setDocuments] = useState<LegalDocument[] | null>(null);
  const [documentsError, setDocumentsError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [checked, setChecked] = useState([false, false, false]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setDocumentsError(false);
      getLegalDocuments()
        .then((list) => {
          if (active) setDocuments(list);
        })
        .catch(() => {
          if (active) setDocumentsError(true);
        });
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);
  const terms = documents?.find((document) => document.type === "TERMS");
  const privacy = documents?.find((document) => document.type === "PRIVACY");
  const all = checked.every(Boolean);
  const option = (
    label: string,
    selected: boolean,
    onPress: () => void,
    onView?: () => void,
  ) => (
    <Pressable
      key={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={{
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={f.text}>
        {selected ? "☑" : "☐"} {label}
      </Text>
      {onView && (
        <Text accessibilityRole="link" onPress={onView} style={f.muted}>
          보기
        </Text>
      )}
    </Pressable>
  );
  const agree = () => {
    if (!terms || !privacy) return;
    setSaving(true);
    setSaveError(false);
    onAgree(terms.version, privacy.version).catch(() => {
      // 저장 실패는 체크를 유지하고 재시도를 안내합니다(08.06 규칙).
      setSaveError(true);
      setSaving(false);
    });
  };
  if (!documents && !documentsError)
    return (
      <FlowPage title="시작하기 전에" onBack={onCancel}>
        <ActivityIndicator accessibilityLabel="약관 불러오는 중" color={t.muted} />
        <Text style={f.muted}>약관을 불러오고 있어요.</Text>
      </FlowPage>
    );
  if (documentsError || !terms || !privacy)
    return (
      <FlowPage title="시작하기 전에" onBack={onCancel}>
        <Text accessibilityRole="header" style={f.title}>
          약관을{"\n"}불러오지 못했어요.
        </Text>
        <Text style={f.muted}>연결을 확인하고 다시 시도해 주세요.</Text>
        <ActionButton
          label="다시 불러오기"
          onPress={() => setReloadKey((value) => value + 1)}
        />
      </FlowPage>
    );
  return (
    <FlowPage title="시작하기 전에" onBack={onCancel}>
      {option("모두 동의하기", all, () => setChecked([!all, !all, !all]))}
      {option(
        `이용약관 동의 (필수) · v${terms.version}`,
        checked[0],
        () =>
          setChecked((previous) => [!previous[0], previous[1], previous[2]]),
        () => onViewDocument("terms"),
      )}
      {option(
        `개인정보 처리방침 동의 (필수) · v${privacy.version}`,
        checked[1],
        () =>
          setChecked((previous) => [previous[0], !previous[1], previous[2]]),
        () => onViewDocument("privacy"),
      )}
      {option("만 14세 이상입니다 (필수)", checked[2], () =>
        setChecked((previous) => [previous[0], previous[1], !previous[2]]),
      )}
      {saveError && (
        <Text accessibilityRole="alert" style={f.text}>
          동의를 저장하지 못했어요. 다시 시도해 주세요.
        </Text>
      )}
      <ActionButton
        label={saving ? "저장하는 중…" : "동의하고 시작하기"}
        disabled={!all || saving}
        onPress={agree}
      />
    </FlowPage>
  );
}
