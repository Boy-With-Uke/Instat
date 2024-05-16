import express from "express";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/findOneConnect/:email/:password", async (req, res) => {
  const userMail = req.params.email;
  const userPass = req.params.password;

  const Users = await prisma.user.findUnique({
    where: {
      email: userMail,
      password: userPass,
    },
    select: {
      id_user: true,
    },
  });
  let result;
  let message;
  if (Users !== null) {
    result = Users.id_user;
    message = "User found";
  } else {
    result = null;
    message = "User not found";
  }
  res.json({ message, result });
});

router.post("/new", async (req, res) => {
  const userMail = req.body.email;
  const userPass = req.body.password;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: userMail,
    },
  });
  let message;
  let User;
  if (existingUser !== null) {
    message = "L'utilisateur avec le mail \"" + userMail + '" existe déjà';

    User = null;
  } else {
    const newUser = await prisma.user.create({
      data: {
        email: userMail,
        password: userPass,
      },
    });
    User = newUser;
  }

  res.json({ message, User });
});

export default router;
