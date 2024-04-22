import { useState } from "react";

export default function AddFlux() {
  const [sh8, setSh8] = useState(0);
  const [type, setType] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const [valeur, setValeur] = useState(0);

  const [poids, setPoids] = useState(0);
  const [quantite, setQuantite] = useState(0);
  const [prix, setPrix] = useState(0);

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const reponse = await fetch(
        "http://localhost:3000/api/instat/flux/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sh8: sh8,
            type: type,
            annee: annee,
            trimestre: trimestre,
            valeur: valeur,
            poids_net: poids,
            quantite: quantite,
            prix_unitaire: prix,
          }),
        }
      );
      console.log(reponse);
      alert("Nouveau produits ajouter avec succes");
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };
  return (
    <div className="main">
      <form className="flux" onSubmit={(event) => handleAddProduct(event)}>
        <div className="col-6 left">
          <div className="row">
            <span>Sh8</span>
            <input
              type="number"
              placeholder="sh8"
              required
              onChange={(event) => setSh8(Number(event.target.value))}
            />
          </div>
          <div className="row">
            <span>Type</span>
            <input
              type="text"
              required
              value={type}
              onChange={(event) => setType(event.target.value)}
            />
          </div>
          <div className="row">
            <span>Annee</span>
            <input
              type="number"
              required
              value={annee}
              onChange={(event) => setAnnee(Number(event.target.value))}
            />
          </div>
          <div className="row">
            <span>Trimestre</span>
            <input
              type="number"
              placeholder="Trismestre d'apparition"
              max={4}
              required
              value={trimestre}
              onChange={(event) => setTrimestre(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="col-6 right">
          <div className="row">
            <span>Valeur</span>
            <input
              type="number"
              required
              onChange={(event) => setValeur(Number(event.target.value))}
            />
          </div>
          <div className="row">
            <span>Poids</span>
            <input
              type="number"
              required
              onChange={(event) => setPoids(Number(event.target.value))}
            />
          </div>
          <div className="row">
            <span>Quantite</span>
            <input
              type="number"
              required
              onChange={(event) => setQuantite(Number(event.target.value))}
            />
          </div>
          <div className="row">
            <span>Prix</span>
            <input
              type="number"
              onChange={(event) => setPrix(Number(event.target.value))}
            />
          </div>
          <div className="button-row">
            <button type="submit" className="mainButton">
              Valider
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
