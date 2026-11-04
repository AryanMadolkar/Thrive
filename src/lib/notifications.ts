import { NotificationType } from "@prisma/client";
import { db } from "@/lib/db";

export async function createNotification(params: {
  recipientId: string;
  actorId?: string;
  type: NotificationType;
  message: string;
  link?: string;
}) {
  if (params.actorId && params.actorId === params.recipientId) return;

  await db.notification.create({
    data: {
      recipientId: params.recipientId,
      actorId: params.actorId,
      type: params.type,
      message: params.message,
      link: params.link,
    },
  });
}
