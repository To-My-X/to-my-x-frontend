import { useEffect, useState } from "react";

// 검색창에 한 글자씩 입력되는 연출. 실제 입력·검색 요청은 없습니다.
export function useTyping(text: string, delay = 500, interval = 160) {
  // 사용처는 장면마다 key로 다시 마운트되므로 효과 안에서 카운트를 되돌릴 필요가 없습니다.
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const starter = setTimeout(() => {
      timer = setInterval(() => {
        current += 1;
        setCount(current);
        if (current >= text.length && timer) clearInterval(timer);
      }, interval);
    }, delay);
    return () => {
      clearTimeout(starter);
      if (timer) clearInterval(timer);
    };
  }, [text, delay, interval]);
  return { typed: text.slice(0, count), done: count >= text.length };
}
