import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "SYSTEM",
  "EVENT",
  "TICKET",
  "PAYMENT",
]);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

export const NotificationSchema = z.object({
  id: z.number().int().positive(),
  type: NotificationTypeEnum,
  content: z.string(),
  sentAt: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  isRead: z.boolean(),
});
export type Notification = z.infer<typeof NotificationSchema>;
