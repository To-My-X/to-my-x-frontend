import { TextInput } from 'react-native';
import { tokens as t } from '@/theme/tokens';
import { useWritingSession } from './writing-session';
import { limitBody } from './body-rules';
export function BodyInput() {
  const { draft, update } = useWritingSession();
  return <TextInput accessibilityLabel="이야기 본문" multiline scrollEnabled value={draft.body}
    onChangeText={body => update({ body: limitBody(body) })} selection={draft.selection}
    onSelectionChange={event => update({ selection: event.nativeEvent.selection })}
    placeholder="그 사람에게 전하고 싶은 말이 있나요?" placeholderTextColor={t.muted}
    style={{ height: 300, padding: 16, borderWidth: 1, borderColor: t.line, borderRadius: 12, color: t.text, fontFamily: t.serif, fontSize: 17, lineHeight: 29 }} textAlignVertical="top" />;
}
