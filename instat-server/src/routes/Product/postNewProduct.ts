import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      sh8_product,
      sh2_product,
      libelle_product,
      AnneeApparition,
      TrimestreApparition,
    } = req.body;
    if (!sh2_product || !libelle_product || !AnneeApparition || !TrimestreApparition){
        return res.status(400).json({error: 'Missing parameter'})
    }
    const product = await prisma.product.create({
      data: {
        sh8_product,
        sh2_product,
        libelle_product,
        AnneeApparition,
        TrimestreApparition,
      },
    });
    const message = "The product has been created successfully";
    res.json({ message, product });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
