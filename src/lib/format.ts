// 서버 ISO(UTC) 시각을 사용자 기기 시간대의 표시 문자열로 바꿉니다.
// Hermes의 Intl 지원 차이를 피하려고 Date 게터로 직접 조립합니다.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${formatDate(iso)} ${date.getHours()}:${minutes}`;
}
