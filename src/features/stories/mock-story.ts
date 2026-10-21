// 화면 연결 확인용 mock 데이터입니다. 실제 조회 API로 교체합니다.
export type StoryDetail = { id: string; title: string; body: string; postedAt: string };

export const myStories: StoryDetail[] = [
  { id: 'my-1', title: '그냥 잘 지내고\n있으면 좋겠어.', body: '별일 없이 하루를 보내다가\n문득 네 생각이 났어.\n\n그냥 잘 지내고 있으면 좋겠어.', postedAt: '오늘' },
  { id: 'my-2', title: '함께해줘서 고마웠어.', body: '어떤 순간은 시간이 지나도\n더 또렷해지더라.\n\n그때 해주지 못했던 말이야.\n함께해줘서 고마웠어.', postedAt: '어제' },
];

export const findMockStory = (id: string) => myStories.find(story => story.id === id) ?? null;
