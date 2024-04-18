import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const flux = await prisma.flux.findMany();
    res.json(flux);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
