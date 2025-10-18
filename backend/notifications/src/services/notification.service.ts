import { prisma } from "../helpers/prisma"
import { CreateNotificationDto } from "../validationSchemas/notification.schema"

const create = async (createNotificationInput: CreateNotificationDto) => {
  try {
    return await prisma.notification.create({
      data: {
        message: createNotificationInput.message,
        type: createNotificationInput.type,
        userId: createNotificationInput.userId,
        title: createNotificationInput.title,
        url: createNotificationInput.url,
        isRead: createNotificationInput.isRead
      }
    })
  } catch (error) {
    throw new Error("Server internal error")
  }
}
const notificationService = { create }

export default notificationService;