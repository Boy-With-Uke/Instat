import express from "express";
import cors from "cors";
import getAllFluxRouter from "./routes/Flux/getAllFlux";
import getAllProductRouter from "./routes/Product/getAllProduct";
import postProductRouter from "./routes/Product/postNewProduct";
const app = express();

app.use(express.json()).use(cors());

// Monter le routeur pour l'endpoint /api/getAllFlux
app.use("/api/getAllFlux", getAllFluxRouter);
app.use("/api/getAllProduct", getAllProductRouter);
app.use("/api/postNewProduct", postProductRouter);

app.listen(5000, () => {
  console.log("server is running on localhost:5000");
});
