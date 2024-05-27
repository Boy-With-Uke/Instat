import express from "express";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      select: {
        id_notification: true,
        user: {
          select: {
            email: true,
          },
        },
        typeAction: true,
        typeDajout: true,
        dateCreated: true,
        message: true,
      },
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  const notifId = parseInt(req.params.id);

  try {
    const notifications = await prisma.notification.delete({
      where: {
        id_notification: notifId,
      },
    });
    let message = "Notification deleted successfully";
    res.status(200).json({ message, notifications });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
