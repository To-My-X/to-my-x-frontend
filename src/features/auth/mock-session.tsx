import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react';

type Session = 'guest' | 'pending-consent' | 'ready';
const Context = createContext<{ session: Session; login: () => void; agree: () => void; cancel: () => void; cancelPending: () => void } | null>(null);

// 개발용 화면 연결 상태입니다. 서버 인증 상태로 재사용하지 않습니다.
// 내부 테스트 검수를 위해 EAS preview 환경(testing 채널)에서만 플래그로 활성화하고, production 번들에는 포함하지 않습니다.
export const mockAuthEnabled = __DEV__ || process.env.EXPO_PUBLIC_MOCK_AUTH === '1';
export function MockSessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session>('guest');
  const cancelPending = useCallback(() => setSession(previous => previous === 'pending-consent' ? 'guest' : previous), []);
  return <Context.Provider value={{
    session, cancelPending,
    login: () => { if (mockAuthEnabled) setSession('pending-consent'); },
    agree: () => { if (mockAuthEnabled && session === 'pending-consent') setSession('ready'); },
    cancel: () => setSession('guest'),
  }}>{children}</Context.Provider>;
}
export function useMockSession() {
  const value = useContext(Context);
  if (!value) throw new Error('MockSessionProvider is required');
  return value;
}
