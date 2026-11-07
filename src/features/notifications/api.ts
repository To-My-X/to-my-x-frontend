// 알림 API(/api/v1/me/notifications). 조회만으로 읽음 처리하지 않습니다.
import { api } from "@/lib/api";

export type NotificationView = {
  id: string;
  type: "WELCOME" | "POST_CREATED";
  message: string;
  createdAt: string;
  readAt: string | null;
  postId: string | null;
};

export type NotificationPage = {
  items: NotificationView[];
  nextCursor: string | null;
  hasMore: boolean;
  unreadCount: number;
};

export const listNotifications = (cursor?: string | null) =>
  api<NotificationPage>(
    `/api/v1/me/notifications${cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=20` : "?limit=20"}`,
    { auth: true },
  );

export const getUnreadCount = () =>
  api<{ unreadCount: number }>("/api/v1/me/notifications/unread-count", {
    auth: true,
  }).then((result) => result.unreadCount);

// 항목별 읽음(멱등). 응답의 안 읽은 수로 벨을 갱신합니다.
export const markNotificationRead = (notificationId: string) =>
  api<{ unreadCount: number }>(
    `/api/v1/me/notifications/${notificationId}/read`,
    { method: "PUT", auth: true },
  );
