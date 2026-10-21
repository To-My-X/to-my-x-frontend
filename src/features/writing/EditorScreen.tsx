import { useState } from 'react';
import { Text, View } from 'react-native';
import { ActionButton } from '@/components/ui/feed-actions';
import { FlowPage, flowStyles as f } from '@/components/ui/flow-page';
import { BodyInput } from './BodyInput';
import { characters, validBody } from './body-rules';
import { useWritingSession } from './writing-session';

export function EditorScreen({ onExit, onPreview, exitRequested, onKeepEditing }: { onExit: () => void; onPreview: () => void; exitRequested: boolean; onKeepEditing: () => void }) {
  const { draft, clear } = useWritingSession();
  const [localPanel, setPanel] = useState<'editor' | 'resume' | 'reset'>(draft.body ? 'resume' : 'editor');
  const panel = exitRequested ? 'leave' : localPanel;
  const edit = () => { onKeepEditing(); setPanel('editor'); };
  const count = characters(draft.body).length;
  const close = onExit;
  if (panel !== 'editor') return <FlowPage title="이야기 쓰기" onBack={() => panel === 'resume' ? onExit() : edit()}>
    <Text style={f.title}>{panel === 'resume' ? '이어서 쓰시겠어요?' : panel === 'reset' ? '새로 시작하면 이전 초안이 삭제돼요.' : '잠시 마음을 쉬어갈까요?'}</Text>
    <Text style={f.muted}>현재 실행 중인 앱에만 내용이 남아 있어요. 새로고침하거나 앱을 종료하면 사라집니다.</Text>
    {panel === 'resume' ? <><ActionButton label="이어서 쓰기" onPress={() => setPanel('editor')} /><ActionButton label="새로 시작하기" onPress={() => setPanel('reset')} /></> : panel === 'reset' ? <><ActionButton label="이전 초안 지우기" onPress={() => { clear(); setPanel('editor'); }} /><ActionButton label="취소" onPress={() => setPanel('resume')} /></> : <><ActionButton label="계속 작성하기" onPress={edit} /><ActionButton label="나중에 쓰기" onPress={onExit} /></>}
  </FlowPage>;
  return <FlowPage title="이야기 쓰기" onBack={close}>
    <Text style={f.title}>지금 떠오른 그 사람에게,{ '\n' }남기지 못한 말을 적어보세요.</Text>
    <BodyInput />
    <View style={f.group}>
      <Text style={f.muted}>{count.toLocaleString()} / 1,000자</Text>
      {count > 1000 && <Text accessibilityRole="alert" style={f.text}>1,000자 이내로 적어주세요.</Text>}
      <Text style={f.muted}>실명이나 연락처 등 개인정보는 적지 말아 주세요.</Text>
      <ActionButton label="미리보기" disabled={!validBody(draft.body)} onPress={onPreview} />
    </View>
  </FlowPage>;
}
