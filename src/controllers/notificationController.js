import prisma from "../config/prisma.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Something went wrong fetching notifications." });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ message: "You cannot modify another user's notification." });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json({ message: "Notification marked as read.", notification: updated });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ message: "Something went wrong updating the notification." });
  }
};
