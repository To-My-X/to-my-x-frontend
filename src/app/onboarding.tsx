import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useMockSession } from '@/features/auth/mock-session';
import { episodeIds, type SceneId } from '@/features/onboarding/episodes';
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen';

// 진행 저장·복원과 첫 방문 자동 배정은 미구현입니다. 장면 전이만 연결합니다.
export default function OnboardingRoute() {
  const { session } = useMockSession();
  const [episode] = useState(() => episodeIds[Math.floor(Math.random() * episodeIds.length)]);
  const [scene, setScene] = useState<SceneId>('enter');
  const history = useRef<SceneId[]>([]);
  return <OnboardingScreen episode={episode} scene={scene}
    onAdvance={next => { history.current.push(scene); setScene(next); }}
    onWrite={() => session === 'ready' ? router.push('/write') : router.push({ pathname: '/login', params: { next: 'write' } })}
    onBack={() => {
      const previous = history.current.pop();
      if (previous) setScene(previous);
      else if (router.canGoBack()) router.back();
      else router.replace('/');
    }} />;
}
