// 02.01~02.15 장면·CTA 전이. CTA 문구와 전이는 온보딩 스펙 IA 표, 서사 문구는 2026-10-27 사용자 제공 시안 이미지와 대조한 원문입니다.
export type SceneId = "enter" | "choice" | "actionA" | "actionB" | "afterglow";
export type EpisodeId = "kakao" | "insta" | "jani";
export type Cta = { label: string; to: SceneId | "write" };
export type Scene = {
  screen: string;
  title: string;
  lines: string[];
  prompt?: boolean;
  ctas: Cta[];
};

export const episodeIds: EpisodeId[] = ["kakao", "insta", "jani"];

export const episodes: Record<EpisodeId, Record<SceneId, Scene>> = {
  kakao: {
    enter: {
      screen: "02.01",
      title: "잠들지 못한 새벽",
      lines: [
        "익숙한 이름인데,\n사진은 처음 보는 거였다.",
        "친구 목록을 내리다가\n손이 잠깐 멈췄다.",
      ],
      ctas: [{ label: "프로필을 누른다", to: "choice" }],
    },
    choice: {
      screen: "02.02",
      title: "바뀐 프로필 사진",
      lines: ["네 옆에,\n모르는 사람이 있었다."],
      ctas: [
        { label: "사진을 크게 본다", to: "actionA" },
        { label: "그냥 닫는다", to: "actionB" },
      ],
    },
    actionA: {
      screen: "02.03",
      title: "사진을 보며 든 생각",
      lines: [
        "너는 연애 중이구나.",
        "그런 생각이 들었다.\n옆 사람보다 네 표정을 오래 봤다.",
      ],
      ctas: [{ label: "프로필을 닫는다", to: "afterglow" }],
    },
    actionB: {
      screen: "02.04",
      title: "잠깐의 정지",
      lines: [
        "잘 지내는 것 같네.",
        "사진을 더 키우지는 않았다.\n그런데 쉽게 닫히지도 않았다.",
      ],
      prompt: true,
      ctas: [{ label: "이 마음 남기기", to: "write" }],
    },
    afterglow: {
      screen: "02.05",
      title: "다시 친구 목록",
      lines: [
        "아까랑 같은 이름인데,\n조금 다르게 보였다.",
        "휴대폰을 내려놓았다.\n내가 모르는 네 하루가 있었다.",
      ],
      prompt: true,
      ctas: [{ label: "이 마음 남기기", to: "write" }],
    },
  },
  insta: {
    enter: {
      screen: "02.06",
      title: "검색창 앞에서",
      lines: [
        "아이디는,\n아직 외우고 있었다.",
        "그냥 잘 지내는지.\n그것만 보고 나오려고.",
      ],
      ctas: [{ label: "계정을 검색한다", to: "choice" }],
    },
    choice: {
      screen: "02.07",
      title: "익숙한 계정",
      lines: ["새 사진이\n올라와 있었다."],
      ctas: [
        { label: "최근 게시물을 누른다", to: "actionA" },
        { label: "그냥 닫는다", to: "actionB" },
      ],
    },
    actionA: {
      screen: "02.08",
      title: "사진을 넘기다가",
      lines: [
        "테이블 위에,\n잔이 두 개였다.",
        "누구랑 갔을까.\n내가 알아서 뭐 하려고.",
      ],
      ctas: [{ label: "게시물을 닫는다", to: "afterglow" }],
    },
    actionB: {
      screen: "02.09",
      title: "검색창으로 돌아와",
      lines: [
        "누르지 않은 사진이,\n자꾸 떠올랐다.",
        "더 보지는 않았다.\n궁금한 건 그대로 남았다.",
      ],
      prompt: true,
      ctas: [{ label: "이 마음 남기기", to: "write" }],
    },
    afterglow: {
      screen: "02.10",
      title: "화면을 덮으며",
      lines: [
        "잘 지내는지 궁금했는데,\n다른 게 궁금해졌다.",
        "화면은 닫았다.\n네 근황은 잠깐 마음에 남았다.",
      ],
      prompt: true,
      ctas: [{ label: "이 마음 남기기", to: "write" }],
    },
  },
  jani: {
    enter: {
      screen: "02.11",
      title: "불 꺼진 방",
      lines: [
        "잠은 안 오고,\n연락할 이유도 없는데.\n휴대폰을 켰다.",
        "그 사람의 이름을 찾았다.",
      ],
      ctas: [{ label: "그 사람과의 대화를 연다", to: "choice" }],
    },
    choice: {
      screen: "02.12",
      title: "멈춰 있는 대화",
      lines: ["마지막 대화 아래로,\n아무 말도 늘어나지 않았다."],
      ctas: [
        { label: "두 글자를 써본다", to: "actionA" },
        { label: "그냥 닫는다", to: "actionB" },
      ],
    },
    actionA: {
      screen: "02.13",
      title: "보내기 직전",
      lines: [
        "두 글자 다음으로,\n손이 가지 않았다.",
        "답이 오면,\n그다음엔 무슨 말을 하고 싶었을까.",
      ],
      ctas: [{ label: "두 글자를 지운다", to: "afterglow" }],
    },
    actionB: {
      screen: "02.14",
      title: "꺼진 화면",
      lines: [
        "화면은 껐는데,\n하고 싶은 말은 남았다.",
        "정말 궁금했던 건,\n잠들었는지가 아니었을지도.",
      ],
      prompt: true,
      ctas: [{ label: "이 마음 남기기", to: "write" }],
    },
    afterglow: {
      screen: "02.15",
      title: "보내지 않은 새벽",
      lines: [
        "말은 보내지 않고,\n휴대폰을 내려놓았다.",
        "방은 다시 조용해졌다.\n오늘은 여기까지.",
      ],
      prompt: true,
      ctas: [{ label: "이 마음 남기기", to: "write" }],
    },
  },
};
