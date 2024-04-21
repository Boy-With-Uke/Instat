import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

const updatePrixAnnuelle = async (sh8: number, annee: number, type: string) => {
  try {
    // Recherche des occurrences avec le même sh8, année et type
    const fluxes = await prisma.flux.findMany({
      where: {
        sh8,
        annee,
        type,
      },
    });

    // Calcul de la somme des prix unitaires
    const totalPrixUnitaire = fluxes.reduce(
      (acc, flux) => acc + flux.prix_unitaire,
      0
    );

    // Calcul de la moyenne
    const nombreOccurences = fluxes.length;
    const prixMoyenneUnitaire = totalPrixUnitaire / nombreOccurences;

    // Mise à jour de la colonne prix_moyenne_unitaire pour les occurrences spécifiques
    await prisma.flux.updateMany({
      where: {
        sh8,
        annee,
        type,
      },
      data: {
        prix_unitaire_moyenne_annuelle: prixMoyenneUnitaire,
      },
    });
    console.log(`Total prix unitaire: ${totalPrixUnitaire}`);
    console.log(`Nombre d'occurences: ${nombreOccurences}`);
    console.log(`Average price updated for set to ${prixMoyenneUnitaire}`);
  } catch (error) {
    console.error(`Error updating average price: ${error}`);
  }
};

router.get("/", async (req, res) => {
  try {
    const flux = await prisma.flux.findMany();
    res.json(flux);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/new", async (req, res) => {
  try {
    const {
      sh8,
      type,
      annee,
      valeur,
      poids_net,
      quantite,
      prix_unitaire,
      trimestre,
    } = req.body;
    if (!sh8 || !valeur || !poids_net || !quantite || !prix_unitaire) {
      return res.status(400).json({ error: "Missing parameter" });
    }

    const associatedProduct = await prisma.product.findFirst({
      where: {
        sh8_product: sh8,
      },
      select: {
        id_product: true,
        sh8_product: true,
        libelle_product: true,
        sh2_product: true,
      },
    });
    const flux = await prisma.flux.create({
      data: {
        sh8: associatedProduct?.sh8_product as number,
        product_id: associatedProduct?.id_product as number,
        type: type,
        annee: annee,
        trimestre: trimestre,
        sh2: associatedProduct?.sh2_product as number,
        libelle: associatedProduct?.libelle_product as string,
        valeur: valeur,
        poids_net: poids_net,
        quantite: quantite,
        prix_unitaire: prix_unitaire,
      },
    });
    await updatePrixAnnuelle(sh8 as number, annee, type);
    const messsage = "Flux has been created successfully";
    res.json({ messsage, flux });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

router.put("/update/:id", async (req, res) => {
  const { trimestre, valeur, poids_net, quantite, prix_unitaire, type, annee } =
    req.body;
  const id_flux = parseInt(req.params.id);
  if (!id_flux || isNaN(id_flux)) {
    return res
      .status(400)
      .json({ error: "ID is required and must be a number" });
  }
  if (
    !valeur ||
    !poids_net ||
    !quantite ||
    !prix_unitaire ||
    !type ||
    !annee ||
    !trimestre
  ) {
    return res.status(400).json({ error: "Missing parameter" });
  }
  try {
    const sh8_updated = await prisma.flux.findFirst({
      where: {
        id_flux: id_flux,
      },
      select: {
        sh8: true,
      },
    });
    const sh8 = sh8_updated?.sh8;

    const updateFlux = await prisma.flux.update({
      where: { id_flux },
      data: {
        type,
        annee,
        trimestre,
        valeur,
        poids_net,
        quantite,
        prix_unitaire,
      },
    });

    await updatePrixAnnuelle(sh8 as number, annee, type);
    const messsage = "Flux has been updated successfully";
    res.json({ messsage, updateFlux });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id_flux = parseInt(req.params.id);
  if (!id_flux || isNaN(id_flux)) {
    return res
      .status(400)
      .json({ error: "ID is required and must be a number" });
  }
  try {
    const willDelete = await prisma.flux.findFirst({
      where: { id_flux },
      select: {
        sh8: true,
        type: true,
        annee: true,
      },
    });

    if (!willDelete) {
      return res.status(400).json({ error: "The flux doesn't exist" });
    }
    const sh8 = willDelete?.sh8 as number;
    const type = willDelete?.type as string;
    const annee = willDelete?.annee as number;
    await prisma.flux.delete({
      where: { id_flux },
    });
    await updatePrixAnnuelle(sh8, annee, type);
    const message = "The flux has been deleted successfully";
    res.json({ message });
  } catch (error) {
    res.status(500).send("Error deleting flux, error: " + error);
  }
});

export default router;
