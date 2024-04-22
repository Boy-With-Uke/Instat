import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const product = await prisma.product.findMany();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/new", async (req, res) => {
  try {
    const {
      sh8_product,
      libelle_product,
      AnneeApparition,
      TrimestreApparition,
    } = req.body;
    if (
      !libelle_product ||
      !sh8_product ||
      !TrimestreApparition ||
      !AnneeApparition
    ) {
      return res.status(400).json({ error: "Missing parameter" });
    }
    const sh8_string = sh8_product.toString();
    const sh2_string = sh8_string.slice(0, 2);
    const sh2_product = parseInt(sh2_string);
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

router.put("/put/:id", async (req, res) => {
  const { sh8_product, libelle_product, AnneeApparition, TrimestreApparition } =
    req.body;
  const id_product = parseInt(req.params.id);
  if (!id_product || isNaN(id_product)) {
    return res.status(400).json({ error: "Id must be a number" });
  }
  if (
    !sh8_product ||
    !libelle_product ||
    !AnneeApparition ||
    !TrimestreApparition
  ) {
    return res.status(400).json({ error: "Missing parameter" });
  }
  const sh8_string = sh8_product.toString();
  const sh2_string = sh8_string.slice(0, 2);
  const sh2_product = parseInt(sh2_string);
  try {
    const updatedProduct = await prisma.product.update({
      where: { id_product },
      data: {
        sh8_product,
        sh2_product,
        libelle_product,
        AnneeApparition,
        TrimestreApparition,
      },
      include: { flux: true },
    });
    const message = "The product has been updated successfully";
    res.json({ message, updatedProduct });
  } catch (error) {
    res.status(500).send("Error updating product, error: " + error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id_product = parseInt(req.params.id);
  if (!id_product || isNaN(id_product)) {
    return res.status(400).json({ error: "Id must be a number" });
  }
  try {
    await prisma.product.delete({
      where: { id_product: id_product},
    });
    const message = "The product has been deleted successfully";
    res.json({ message });
  } catch (error) {
    res.status(500).send("Error deleting product, error: " + error);
  }
});

export default router;
