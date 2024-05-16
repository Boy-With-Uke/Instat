import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";

export default function AddProduct() {
  const userCoockies = Cookies.get("user");
  const userId = userCoockies;
  const [sh8, setSh8] = useState(0);
  const [anneeApp, setAnneeApp] = useState(new Date().getFullYear());
  const [isShowModalFile, setIsShowModalFile] = useState(false);
  const [trimestreApp, setTrimestreApp] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const [libelle, setLibelle] = useState("");
  const [jsonData, setJsonData] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  type Product = {
    sh8_product: string;
    libelle_product: string;
    AnneeApparition: number;
    TrimestreApparition: number;
  };

  const handleAddProduct = async (productData: Product) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/instat/product/new/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  function handleExportClick() {
    setIsShowModalFile(true);
  }

  function onHide() {
    setIsShowModalFile(false);
  }

  // useEffect(() => {
  //   console.log(jsonData);
  // }, [jsonData]);

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
            const numberOfLines = json.length;
            
            if (numberOfLines > 1200) {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Le nombre de lignes dépasse 1200. Veuillez sélectionner un fichier avec moins de 1200 lignes.",
              });
              return;
            }

            const invalidData: { row: number; columns: string[] }[] = [];
            const isValidData = json.every((product: any, index: number) => {
              const missingProperties: string[] = [];
              const isValid =
                product.sh8_product &&
                product.libelle_product &&
                product.AnneeApparition &&
                product.TrimestreApparition;

              if (!isValid) {
                const requiredProperties = [
                  "sh8_product",
                  "libelle_product",
                  "AnneeApparition",
                  "TrimestreApparition",
                ];
                requiredProperties.forEach((key) => {
                  if (
                    product[key] === undefined ||
                    product[key] === null ||
                    product[key] === ""
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

              json.forEach((product: any) => {
                handleAddProduct(product);
              });

              Swal.fire({
                icon: "success",
                title: "Succès",
                text: "Insertion des données du fichier réussie",
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
    return letter;
  }

  const toJson = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Vérifier que toutes les données nécessaires sont remplies
    if (!sh8 || !libelle || !anneeApp || !trimestreApp) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs du formulaire",
      });
      return;
    }

    // Créer un objet Product à partir des données du formulaire
    const productData: Product = {
      sh8_product: sh8.toString(),
      libelle_product: libelle,
      AnneeApparition: anneeApp,
      TrimestreApparition: trimestreApp,
    };

    // Appeler handleAddProduct avec les données du produit
    handleAddProduct(productData);
    Swal.fire({
      icon: "success",
      title: "Succès",
      text: "Succes de l'nsertion du nouveau produit",
    });
    setSh8(0);
    setAnneeApp(new Date().getFullYear());
    setTrimestreApp(Math.ceil((new Date().getMonth() + 1) / 3));
    setLibelle("");
  };
  return (
    <>
      <Modal show={isShowModalFile} onHide={onHide} className="modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Sélectionner le fichier contenant la listede produits a inserer
          </Modal.Title>
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

        <form className="product" onSubmit={(event) => toJson(event)}>
          <div className="col-6 left">
            <div className="row">
              <span>Sh8</span>
              <input
                min={1}
                type="number"
                placeholder="sh8"
                required
                value={sh8 === 0 ? "" : sh8}
                onChange={(event) => setSh8(Number(event.target.value))}
              />
            </div>
            <div className="row">
              <span>Annee d'apparition</span>
              <input
                min={2007}
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
                min={1}
                max={4}
                required
                value={trimestreApp}
                onChange={(event) =>
                  setTrimestreApp(Number(event.target.value))
                }
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
