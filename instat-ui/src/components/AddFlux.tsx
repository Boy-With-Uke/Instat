import { useState } from "react";
import Select from "react-select";
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

  const fluxBase = [
    { value: "E", label: "Exportation" },
    { value: "I", label: "Importation" },
  ];
  const handleFluxChange = (selectedOption: any) => {
    setType(selectedOption.value);
  };

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const reponse = await fetch("http://localhost:3000/api/instat/flux/new", {
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
      });
      console.log(reponse);
      alert("Nouveau produits ajouter avec succes");
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: '103%',
      height: "60px",
      marginLeft: -10,
      borderRadius: '20px',
      border: "none",
      outline: "none",
      backgroundColor: "#003529",
      color: "white",
      "&:hover": {
        border: "none",
        outline: "none",
      },
      "&:select": {
        backgroundColor: "red",
        border: "none",
        outline: "none",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#003529" : "#fff",
      color: state.isSelected ? "#fff" : "#003529",
      "&:hover": {
        backgroundColor: "#003529",
        color: "#fff",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      width: 770,
    }),
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
          <div className="row selectRow">
            <span>Type</span>
            <Select
              className="custom-select"
              defaultValue={{ value: "E", label: "Exportation" }}
              options={fluxBase}
              value={fluxBase.find((option) => option.value === type)}
              onChange={handleFluxChange}
              isSearchable={false}
              styles={customStyles}
            />{" "}
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
              min={1}
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
