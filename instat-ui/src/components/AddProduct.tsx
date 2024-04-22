import { useState } from "react";

export default function AddProduct() {
  const [sh8, setSh8] = useState(0);
  const [anneeApp, setAnneeApp] = useState(new Date().getFullYear());
  const [trimestreApp, setTrimestreApp] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const [libelle, setLibelle] = useState("");

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const reponse = await fetch(
        "http://localhost:3000/api/instat/product/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sh8_product: sh8,
            libelle_product: libelle,
            AnneeApparition: anneeApp,
            TrimestreApparition: trimestreApp,
          }),
        }
      );
      console.log(reponse);
      setSh8(0);
      setAnneeApp(0);
      setTrimestreApp(0);
      setLibelle("");
      alert("Nouveau produits ajouter avec succes");
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };
  return (
    <div className="main">
      <form className="product" onSubmit={(event) => handleAddProduct(event)}>
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
            <span>Annee d'apparition</span>
            <input
              type="number"
              placeholder="Annee d'apparition"
              required
              value={anneeApp}
              onChange={(event) => setAnneeApp(Number(event.target.value))}
            />
          </div>
          <div className="row">
            <span>Trimestre d'apparition</span>
            <input
              type="number"
              placeholder="Trismestre d'apparition"
              max={4}
              required
              value={trimestreApp}
              onChange={(event) => setTrimestreApp(Number(event.target.value))}
            />
          </div>
        </div>
        <div className="col-6 right">
          <div className="row">
            <span>Libelle</span>
            <textarea
              name=""
              id="libelle"
              cols={30}
              rows={7}
              placeholder="Libelle"
              required
              value={libelle}
              onChange={(event) => setLibelle(event.target.value)}
            ></textarea>
          </div>
          <div className="row buttonRow">
            <button type="submit" className="mainButton">Valider</button>
          </div>
        </div>
      </form>
    </div>
  );
}
