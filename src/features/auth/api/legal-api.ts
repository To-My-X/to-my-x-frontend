// 약관 문서 조회와 필수 동의 저장(/api/v1/legal, /api/v1/me/consents).
import { api } from "../../../lib/api.ts";

export type LegalDocumentType = "TERMS" | "PRIVACY";
export type LegalDocument = {
  type: LegalDocumentType;
  version: string;
  effectiveAt: string;
  body: string;
};

// 현재 시행 중인 이용약관·개인정보 처리방침. 동의 화면(08.06)에서 버전·본문에 사용합니다.
export const getLegalDocuments = () =>
  api<LegalDocument[]>("/api/v1/legal/documents");

// 설정·동의 화면의 문서 보기(09.02/09.03)에서 사용합니다.
export const getLegalDocument = (type: LegalDocumentType) =>
  api<LegalDocument>(`/api/v1/legal/documents/${type}`);

// 필수 약관 동의. 동의 전 토큰으로 호출할 수 있고, 성공 후 토큰을 재발급해야 보호 기능 권한이 생깁니다.
export const postConsents = (termsVersion: string, privacyVersion: string) =>
  api<{ consentRequired: boolean }>("/api/v1/me/consents", {
    method: "POST",
    body: { termsVersion, privacyVersion, age14Confirmed: true },
    auth: true,
  });
