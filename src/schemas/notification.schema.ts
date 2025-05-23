import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "SYSTEM",
  "EVENT",
  "TICKET",
  "PAYMENT",
]);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

export const NotificationSchema = z
  .object({
    id: z.number().int().positive(),
    type: z.enum(["SYSTEM", "EVENT", "TICKET", "PAYMENT"]),
    content: z.string(),
    title: z.string(),
    sentAt: z.string().datetime(),
    read: z.boolean().optional(),
    isRead: z.boolean().optional(),
  })
  .transform((raw) => ({
    ...raw,
    isRead: raw.isRead ?? raw.read ?? false,
  }));

export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationPayloadSchema = z.object({
  userId: z.string(),
  type: NotificationTypeEnum,
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
});

export type CreateNotificationPayload = z.infer<
  typeof CreateNotificationPayloadSchema
>;
