import { Text } from 'react-native';
import { ActionButton } from '@/components/ui/feed-actions';
import { FlowPage, flowStyles as f } from '@/components/ui/flow-page';
export function ConfirmScreen({ onEdit, onSubmit }: { onEdit: () => void; onSubmit: () => void }) {
  return <FlowPage title="공개하기 전에" onBack={onEdit}>
    <Text style={f.title}>이 마음을 익명으로 남길까요?</Text>
    <Text style={f.text}>이야기는 익명으로 공개됩니다.{ '\n\n' }공개한 뒤에는 개별 글을 수정하거나 삭제할 수 없습니다.{ '\n\n' }실명이나 연락처 등 개인정보가 들어 있지 않은지 확인해 주세요.</Text>
    <ActionButton label="익명으로 남기기" onPress={onSubmit} />
    <ActionButton label="돌아가서 수정하기" onPress={onEdit} />
    <Text style={f.muted}>지금은 화면 연결을 확인하는 단계입니다. 실제 이야기는 게시되지 않습니다.</Text>
  </FlowPage>;
}
