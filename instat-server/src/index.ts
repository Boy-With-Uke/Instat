import express from "express";
import cors from "cors";
import FluxRouter from "./routes/Flux";
import ProductRouter from "./routes/Products";
import UserRouter from "./routes/User";
import NotificationRouter from "./routes/Notifications";
const app = express();
const port = 3000;

app.use(express.json()).use(cors());

// Monter le routeur pour l'endpoint /api/getAllFlux
app.use("/api/instat/flux", FluxRouter);
app.use("/api/instat/product", ProductRouter);
app.use("/api/instat/user", UserRouter);
app.use("/api/instat/notification", NotificationRouter);

app.listen(port, () => {
  console.log(`server is running on localhost:${port}`);
});
