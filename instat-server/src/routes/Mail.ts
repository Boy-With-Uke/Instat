import express from "express";
import { google } from "googleapis";

const router = express.Router();

// Configurer les clés d'authentification OAuth2
const oauth2Client = new google.auth.OAuth2({
  clientId: "377686311814-alt4mgsv043m53666dbeh4gnhqj54bmv.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "YOUR_REDIRECT_URI", // Remplacer par votre URL de redirection
});

// Gérer la route pour récupérer les e-mails
router.get("/", async (req, res) => {
  try {
    // Obtenir le jeton d'accès autorisé
    const accessToken = req.query.access_token;

    // Vérifier si le jeton d'accès est présent
    if (!accessToken) {
      return res.status(401).json({ error: "Access token missing" });
    }

    // Configuration de l'authentification avec le jeton d'accès
    oauth2Client.setCredentials({ access_token: accessToken });

    // Créer une instance de l'API Gmail
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Utiliser l'API Gmail pour récupérer les e-mails
    // Vous pouvez utiliser les méthodes de l'API Gmail pour effectuer des opérations sur les e-mails
    // Par exemple, gmail.users.messages.list() pour lister les messages
    // Veuillez consulter la documentation de l'API Gmail pour plus de détails : https://developers.google.com/gmail/api/reference/rest
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
