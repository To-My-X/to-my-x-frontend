import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { tokens as t } from "@/theme/tokens";
import { ActivityIndicator, Text, View } from "react-native";

// 06.03 내 글 상세 · 공유 링크 공개 상세 · 07.09 열람 불가 상태입니다.
export type StoryDetailModel = {
  id: string;
  title: string;
  body: string;
  postedAt: string;
  isMine: boolean;
  suspended: boolean;
};

export function StoryDetailScreen({
  story,
  loading,
  error,
  onRetry,
  onBack,
  onShare,
  onExplore,
}: {
  story: StoryDetailModel | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onBack: () => void;
  onShare: () => void;
  onExplore: () => void;
}) {
  if (loading)
    return (
      <FlowPage title="To My X" onBack={onBack}>
        <View style={f.group}>
          <ActivityIndicator
            accessibilityLabel="이야기 불러오는 중"
            color={t.muted}
          />
          <Text style={f.muted}>이야기를 불러오고 있어요.</Text>
        </View>
      </FlowPage>
    );
  // 일시적인 조회 실패는 열람 불가(07.09)와 구분해 재시도를 제공합니다.
  if (error)
    return (
      <FlowPage title="To My X" onBack={onBack}>
        <Text accessibilityRole="header" style={f.title}>
          이야기를{"\n"}불러오지 못했어요.
        </Text>
        <Text style={f.muted}>연결을 확인하고 다시 시도해 주세요.</Text>
        <ActionButton label="다시 불러오기" onPress={onRetry} />
      </FlowPage>
    );
  if (!story)
    return (
      <FlowPage title="To My X" onBack={onBack}>
        <Text accessibilityRole="header" style={f.title}>
          이 이야기를{"\n"}볼 수 없어요.
        </Text>
        <Text style={f.muted}>
          공개가 중단되었거나 접근할 수 없는 글이에요.{"\n"}다른 이야기를
          만나보세요.
        </Text>
        <ActionButton label="다른 이야기 보기" onPress={onExplore} />
      </FlowPage>
    );
  return (
    <FlowPage title="To My X" onBack={onBack}>
      <Text style={f.muted}>
        {story.isMine ? "내가 남긴 이야기" : "익명의 X가 남긴 이야기"} ·{" "}
        {story.postedAt}
      </Text>
      <Text accessibilityRole="header" style={f.title}>
        {story.title}
      </Text>
      <Text style={f.text}>{story.body}</Text>
      {story.suspended ? (
        <Text accessibilityRole="alert" style={f.muted}>
          이 글은 공개가 중단된 상태예요. 나에게만 보여요.
        </Text>
      ) : (
        <Text style={f.muted}>이 글은 익명으로 공개되어 있어요.</Text>
      )}
      {!story.suspended && (
        <View style={f.group}>
          <ActionButton label="이 이야기 공유하기" onPress={onShare} />
        </View>
      )}
    </FlowPage>
  );
}
