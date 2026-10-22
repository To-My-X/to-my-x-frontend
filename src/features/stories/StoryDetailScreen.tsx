import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { Text, View } from "react-native";
import type { StoryDetail } from "./mock-story";

// 06.03 내 글 상세와 07.09 열람 불가 상태입니다.
export function StoryDetailScreen({
  story,
  onBack,
  onShare,
  onExplore,
}: {
  story: StoryDetail | null;
  onBack: () => void;
  onShare: () => void;
  onExplore: () => void;
}) {
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
      <Text style={f.muted}>내가 남긴 이야기 · {story.postedAt}</Text>
      <Text accessibilityRole="header" style={f.title}>
        {story.title}
      </Text>
      <Text style={f.text}>{story.body}</Text>
      <Text style={f.muted}>이 글은 익명으로 공개되어 있어요.</Text>
      <View style={f.group}>
        <ActionButton label="이 이야기 공유하기" onPress={onShare} />
      </View>
    </FlowPage>
  );
}
