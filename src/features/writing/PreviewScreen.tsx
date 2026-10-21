import { Text } from 'react-native';
import { ActionButton } from '@/components/ui/feed-actions';
import { FlowPage, flowStyles as f } from '@/components/ui/flow-page';
import { summarize } from './body-rules';
export function PreviewScreen({ body, onBack, onConfirm }: { body: string; onBack: () => void; onConfirm: () => void }) {
  return <FlowPage title="미리보기" onBack={onBack}>
    <Text numberOfLines={1} accessibilityRole="header" style={f.title}>{summarize(body)}</Text>
    <Text style={f.text}>{body}</Text>
    <Text style={f.muted}>익명의 X가 남긴 이야기</Text>
    <ActionButton label="이 마음 남기기" onPress={onConfirm} />
  </FlowPage>;
}
