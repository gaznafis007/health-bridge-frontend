export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  orderUpdates: boolean;
  reportNotifications: boolean;
  prescriptionReminders: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationPreferencesUpdate = Partial<
  Pick<
    NotificationPreferences,
    | "emailNotifications"
    | "smsNotifications"
    | "appointmentReminders"
    | "orderUpdates"
    | "reportNotifications"
    | "prescriptionReminders"
  >
>;

export type NotificationType = "EMAIL" | "SMS" | "PUSH";
export type NotificationCategory =
  | "APPOINTMENT"
  | "ORDER"
  | "REPORT"
  | "PRESCRIPTION"
  | "TRANSACTION";
export type DeliveryStatusLog =
  | "PENDING"
  | "SENT"
  | "FAILED"
  | "BOUNCED"
  | "UNSUBSCRIBED";

export interface NotificationLog {
  id: string;
  userId: string;
  notificationType: NotificationType;
  category: NotificationCategory;
  subject: string;
  content: string;
  deliveryStatus: DeliveryStatusLog;
  failureReason: string | null;
  recipient: string;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationLogsPage {
  items: NotificationLog[];
  total: number;
  skip: number;
  take: number;
}
