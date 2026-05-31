import { apiRequest } from "@/lib/api/client";
import type {
  NotificationLogsPage,
  NotificationPreferences,
  NotificationPreferencesUpdate,
} from "@/lib/notifications/notifications.types";

const PREFIX = "/notifications";

export function getNotificationPreferences(
  accessToken: string,
): Promise<NotificationPreferences> {
  return apiRequest<NotificationPreferences>(`${PREFIX}/preferences`, {
    accessToken,
    cache: "no-store",
  });
}

export function updateNotificationPreferences(
  accessToken: string,
  payload: NotificationPreferencesUpdate,
): Promise<NotificationPreferences> {
  return apiRequest<NotificationPreferences>(`${PREFIX}/preferences`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function getNotificationLogs(
  accessToken: string,
  skip = 0,
  take = 20,
): Promise<NotificationLogsPage> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });
  return apiRequest<NotificationLogsPage>(`${PREFIX}/logs?${params}`, {
    accessToken,
    cache: "no-store",
  });
}
