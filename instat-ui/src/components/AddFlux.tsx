import { useEffect, useState } from "react";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function AddFlux() {
  type Flux = {
    sh8: number;
    type: string;
    annee: number;
    trimestre: number;
    valeur: number;
    poids_net: number;
    quantite: number;
    prix_unitaire: number;
  };

  const [sh8, setSh8] = useState(0);
  const [type, setType] = useState("E");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const [valeur, setValeur] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [poids, setPoids] = useState(0);
  const [quantite, setQuantite] = useState(0);
  const [prix, setPrix] = useState(0);
  const [isShowModalFile, setIsShowModalFile] = useState(false);
  const [jsonData, setJsonData] = useState<string>("");

  const fluxBase = [
    { value: "E", label: "Exportation" },
    { value: "I", label: "Importation" },
  ];
  const handleFluxChange = (selectedOption: any) => {
    setType(selectedOption.value);
  };

  function handleExportClick() {
    setIsShowModalFile(true);
  }

  function onHide() {
    setIsShowModalFile(false);
  }

  const handleConvert = () => {
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const data = e.target.result as ArrayBuffer;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            // Valider les données du fichier
            const invalidData: { row: number; columns: string[] }[] = [];
            const isValidData = json.every((flux: any, index: number) => {
              const missingProperties: string[] = [];
              const isValid =
                flux.sh8 &&
                flux.type &&
                flux.annee &&
                flux.trimestre &&
                flux.valeur &&
                flux.poids_net &&
                flux.prix_unitaire;

              if (!isValid) {
                const requiredProperties = [
                  "sh8",
                  "type",
                  "annee",
                  "trimestre",
                  "valeur",
                  "poids_net",
                  "quantite",
                  "prix_unitaire",
                ];
                requiredProperties.forEach((key) => {
                  if (
                    flux[key] === undefined ||
                    flux[key] === null ||
                    flux[key] === ""
                  ) {
                    missingProperties.push(key);
                  }
                });
                invalidData.push({
                  row: index + 2,
                  columns: missingProperties,
                });
              }
              return isValid;
            });

            if (!isValidData) {
              const errorMessage =
                "Les données suivantes du fichier ne sont pas valides : \n" +
                invalidData
                  .map(
                    (data) =>
                      `Ligne ${data.row}, Colonnes ${data.columns
                        .map(
                          (key, index) =>
                            ` ${key.padEnd(10, " ")}${getColumnLetter(index)}`
                        )
                        .join("")}`
                  )
                  .join("\n");

              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: errorMessage,
              });
              return;
            } else {
              setJsonData(JSON.stringify(json, null, 2));

              json.forEach((flux: any) => {
                handleAddFlux(flux);
              });

              Swal.fire({
                icon: "success",
                title: "Succès",
                text: "Insertion des donnes du fichier reussi",
              });
              setIsShowModalFile(false);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de l'importation du fichier",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le fichier est nécessaire",
      });
    }
  };
  function getColumnLetter(columnIndex: number): string {
    let temp;
    let letter = "";
    while (columnIndex > 0) {
      temp = (columnIndex - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      columnIndex = (columnIndex - temp - 1) / 26;
    }
    console.log(columnIndex + "" + letter);
    return letter;
  }

  const handleAddFlux = async (fluxData: Flux) => {
    try {
      const reponse = await fetch("http://localhost:3000/api/instat/flux/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fluxData),
      });
      console.log(reponse);
    } catch (e) {
      console.log(e);
    }
  };

  const toJson = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Vérifier que toutes les données nécessaires sont remplies
    if (!sh8 || !valeur || !poids || !quantite || !prix) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs du formulaire",
      });
      return;
    }

    // Créer un objet Product à partir des données du formulaire
    const fluxData: Flux = {
      sh8: sh8,
      type: type,
      annee: annee,
      trimestre: trimestre,
      valeur: valeur,
      poids_net: poids,
      quantite: quantite,
      prix_unitaire: prix,
    };

    // Appeler handleAddProduct avec les données du produit
    handleAddFlux(fluxData);
    Swal.fire({
      icon: "success",
      title: "Succès",
      text: "Succes de l'nsertion du nouveau Flux",
    });
    setSh8(0);
    setAnnee(new Date().getFullYear());
    setTrimestre(Math.ceil((new Date().getMonth() + 1) / 3));
    setValeur(0);
    setPoids(0);
    setQuantite(0);
    setPrix(0);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: "103%",
      height: "60px",
      marginLeft: -10,
      borderRadius: "20px",
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
    <>
      <Modal show={isShowModalFile} onHide={onHide} className="modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sélectionner le fichier</Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  placeholder="Trismestre d'apparition"
                  max={4}
                  min={1}
                  required
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </Col>
              <Col xs={12} md={6}>
                <Button
                  style={{
                    backgroundColor: "#003529",
                    border: "#003529",
                    marginLeft: "66%",
                  }}
                  onClick={handleConvert}
                >
                  Valider
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <div className="main">
        <Row>
          <Col>
            <Button
              style={{
                backgroundColor: "#003529",
                border: "#003529",
                marginLeft: "66%",
              }}
              onClick={handleExportClick}
            >
              Importer les données
            </Button>
          </Col>
        </Row>
        <form className="flux" onSubmit={(event) => toJson(event)}>
          <div className="col-6 left">
            <div className="row">
              <span>Sh8</span>
              <input
                type="number"
                placeholder="sh8"
                required
                value={sh8 === 0 ? "" : sh8}
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
                value={valeur === 0 ? "" : valeur}
                onChange={(event) => setValeur(Number(event.target.value))}
              />
            </div>
            <div className="row">
              <span>Poids</span>
              <input
                value={poids === 0 ? "" : poids}
                type="number"
                required
                onChange={(event) => setPoids(Number(event.target.value))}
              />
            </div>
            <div className="row">
              <span>Quantite</span>
              <input
                value={quantite === 0 ? "" : quantite}
                type="number"
                required
                onChange={(event) => setQuantite(Number(event.target.value))}
              />
            </div>
            <div className="row">
              <span>Prix</span>
              <input
                value={prix === 0 ? "" : prix}
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
    </>
  );
}
