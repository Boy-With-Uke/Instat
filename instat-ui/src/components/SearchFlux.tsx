import { useEffect, useState } from "react";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import Checkbox from "@mui/material/Checkbox";
import { ChangeEvent } from "react";
import ReactPaginate from "react-paginate";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import exportFromJSON from "export-from-json";
import Form from "react-bootstrap/Form";

export default function SearchFlux() {
  type Flux = {
    id_flux: number;
    product_id: number;
    sh8: number;
    sh2: number;
    type: string;
    annee: number;
    trimestre: number;
    libelle: string;
    valeur: number;
    poids_net: number;
    quantite: number;
    prix_unitaire: number;
    prix_unitaire_moyenne_annuelle: number;
  };
  const fluxBase = [
    { value: "all", label: "Type" },
    { value: "E", label: "Exportation" },
    { value: "I", label: "Importation" },
  ];

  const fluxBase2 = [
    { value: "E", label: "Exportation" },
    { value: "I", label: "Importation" },
  ];
  const trimestreBase = [
    { value: "all", label: "Trimestre" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  const [fluxs, setFluxs] = useState<Flux[]>([]);

  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [trimestreOptions, setTrimestreOptions] = useState("all");

  const [querry, setQuerry] = useState("");
  const [fluxOPtion, setfluxOPtion] = useState("all");
  //  PAGINATION
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  //Modal
  const [isShow, setIsShow] = useState(false);

  //EDIT
  const [selectedFlux, setSelectedFlux] = useState<Flux | null>(null);
  const [toEditType, setToEditType] = useState("");
  const [toEditAnnee, setToEditAnnee] = useState(0);
  const [toEditTrim, setToEditTrim] = useState(0);
  const [toEditValeur, setToEditValeur] = useState(0);
  const [toEditPoids, setToEditPoids] = useState(0);
  const [toEditQuantite, setToEditQuantite] = useState(0);
  const [toEditPrix, setToEditPrix] = useState(0);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: 170,
      marginRight: 10,
      border: "none",
      outline: "none",
      backgroundColor: "#003529",
      color: "white",
      "&:hover": {
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
      width: 170,
    }),
  };
  const customStyles2 = {
    control: (provided: any) => ({
      ...provided,
      width: "100%",
      marginRight: 10,
      border: "none",
      outline: "none",
      backgroundColor: "#003529",
      color: "white",
      "&:hover": {
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
      width: 170,
    }),
  };
  const [annneeOption, setAnneeOption] = useState("all");
  const [without, setWithout] = useState(false);
  const handleFluxChange = (selectedOption: any) => {
    setfluxOPtion(selectedOption.value);
  };
  const handleYearChange = (selectedOption: any) => {
    setAnneeOption(selectedOption.value);
  };
  const handleTrimestreChange = (selectedOption: any) => {
    setTrimestreOptions(selectedOption.value);
  };

  const handleEditClick = (flux: Flux) => {
    setSelectedFlux(flux);
    setIsShow(true);
    setToEditType(flux.type);
    setToEditAnnee(flux.annee);
    setToEditTrim(flux.trimestre);
    setToEditValeur(flux.valeur);
    setToEditPoids(flux.poids_net);
    setToEditPrix(flux.prix_unitaire);
    setToEditQuantite(flux.quantite);
  };
  function onHide() {
    setIsShow(false);
  }

  const handleEditTypeChange = (selectedOption: any) => {
    setToEditType(selectedOption.value);
  };

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const reponse = await fetch("http://localhost:3000/api/instat/flux/");

        const fluxs: Flux[] = await reponse.json();
        const years = Array.from(new Set(fluxs.map((flux) => flux.annee)));

        // Utiliser les années uniques

        const yearOptions = years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }));
        const defaultAnnee = [{ value: "all", label: "Annee" }, ...yearOptions];
        setFluxs(fluxs);
        setYearOptions(defaultAnnee);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFlux();
  }, []);
  useEffect(() => {
    if (without) {
      console.log(without);
      const fetchFlux = async () => {
        try {
          const reponse = await fetch(
            `http://localhost:3000/api/instat/flux/findMany/${fluxOPtion}/${annneeOption}/${trimestreOptions}`
          );
          const fluxs: Flux[] = await reponse.json();
          setFluxs(fluxs);
        } catch (e) {
          console.log(e);
        }
      };
      fetchFlux();
    }
  }, [without, fluxOPtion, annneeOption, trimestreOptions]);

  const searching = async (
    event: React.MouseEvent,
    searchQuerry: string,
    fluxQuerry: string,
    yearQuery: string,
    trimestreQuerry: string
  ) => {
    event.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:3000/api/instat/flux/findOne/byLibelle/${searchQuerry}/${fluxQuerry}/${yearQuery}/${trimestreQuerry}`
      );
      const fluxs: Flux[] = await response.json();
      setFluxs(fluxs);
    } catch (error) {
      alert(`Error finding the product: ${error}`);
    }
  };

  const handleDelete = async (event: React.MouseEvent, fluxId: number) => {
    event.stopPropagation();

    try {
      await fetch(`http://localhost:3000/api/instat/flux/delete/${fluxId}`, {
        method: "DELETE",
      });

      const updatedFlux = fluxs.filter((flux) => flux.id_flux !== fluxId);
      setFluxs(updatedFlux);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await fetch(
        `http://localhost:3000/api/instat/flux/update/${selectedFlux?.id_flux}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: toEditType,
            annee: toEditAnnee,
            trimestre: toEditTrim,
            valeur: toEditValeur,
            poids_net: toEditPoids,
            quantite: toEditQuantite,
            prix_unitaire: toEditPrix,
          }),
        }
      );
      alert(`the product ${selectedFlux?.libelle} has been updated}`);
      setIsShow(false);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  function handleCheck(event: ChangeEvent<HTMLInputElement>) {
    setWithout(event.target.checked);
  }

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
  const exportToExcel = () => {
    const type = "flux";
    const data = fluxs;
    const date = new Date(); // Obtenez la date et l'heure actuelles
    const day = date.getDate(); // Jour du mois (1-31)
    const month = date.getMonth() + 1; // Mois (0-11, donc +1 pour l'index humain)
    const year = date.getFullYear(); // Année
    const hours = date.getHours(); // Heures (0-23)
    const minutes = date.getMinutes(); // Minutes (0-59)
    const seconds = date.getSeconds(); // Secondes (0-59)

    // Formater la date et l'heure dans le format souhaité
    const fileName = `${type}${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;

    const exportType = exportFromJSON.types.xls;
    try {
      exportFromJSON({ data, fileName, exportType });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div>
      <Modal show={isShow} onHide={onHide} className="modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedFlux?.libelle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <Form.Label>Type de Flux</Form.Label>
                <Select
                  className=".custom-select"
                  options={fluxBase2}
                  defaultValue={fluxBase2.find(
                    (option) => option.value === selectedFlux?.type
                  )}
                  value={fluxBase2.find(
                    (option) => option.value === toEditType
                  )}
                  onChange={handleEditTypeChange}
                  isSearchable={false}
                  styles={customStyles2}
                />{" "}
              </Col>
              <Col xs={6} md={6}>
                <Form.Label>Annee</Form.Label>
                <Form.Control
                  type="number"
                  value={toEditAnnee}
                  onChange={(event) =>
                    setToEditAnnee(Number(event.target.value))
                  }
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <Form.Label>Trimestre</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Trismestre d'apparition"
                  max={4}
                  min={1}
                  required
                  value={toEditTrim}
                  onChange={(event) =>
                    setToEditTrim(Number(event.target.value))
                  }
                />
              </Col>
              <Col xs={6} md={6}>
                <Form.Label>Valeur</Form.Label>
                <Form.Control
                  type="number"
                  value={toEditValeur}
                  onChange={(event) =>
                    setToEditValeur(Number(event.target.value))
                  }
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <Form.Label>Poids Net</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  required
                  value={toEditPoids}
                  onChange={(event) =>
                    setToEditPoids(Number(event.target.value))
                  }
                />
              </Col>
              <Col xs={6} md={6}>
                <Form.Label>Quantite</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={toEditQuantite}
                  onChange={(event) =>
                    setToEditQuantite(Number(event.target.value))
                  }
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: "20px", padding: "0 10% 0 10%" }}>
              <Col xs={12} md={12}>
                <Form.Label>Prix Unitaire</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  required
                  value={toEditPrix}
                  onChange={(event) =>
                    setToEditPrix(Number(event.target.value))
                  }
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleEdit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className="row searchContainer"
        style={{
          marginBottom: "20px",
        }}
      >
        <div className="col-8 filter">
          <Select
            className=".custom-select"
            defaultValue={{ value: "all", label: "Type" }}
            options={fluxBase}
            value={fluxBase.find((option) => option.value === fluxOPtion)}
            onChange={handleFluxChange}
            isSearchable={false}
            styles={customStyles}
          />{" "}
          <Select
            className=".custom-select"
            defaultValue={{ value: "All", label: "Annee" }}
            options={yearOptions}
            value={yearOptions.find((option) => option.value === annneeOption)}
            onChange={handleYearChange}
            isSearchable={false}
            styles={customStyles}
          />{" "}
          <Select
            className=".custom-select"
            defaultValue={{ value: "all", label: "Trimestre" }}
            options={trimestreBase}
            value={trimestreBase.find(
              (option) => option.value === trimestreOptions
            )}
            onChange={handleTrimestreChange}
            isSearchable={false}
            styles={customStyles}
          />{" "}
          <Checkbox
            id="w/search"
            sx={{
              color: "#003529",
              "&.Mui-checked": {
                color: "#003529",
              },
            }}
            onChange={handleCheck}
          />
          <label className="labeling" htmlFor="w/search">
            Filtrage sans recherche
          </label>
        </div>
        <div className="col-4 searchBox">
          <input
            className="searchInput"
            type="text"
            name=""
            value={querry}
            onChange={(event) => setQuerry(event.target.value)}
            disabled={without}
          />
          <button
            className="searchButton"
            onClick={(event) =>
              searching(
                event,
                querry,
                fluxOPtion,
                annneeOption,
                trimestreOptions
              )
            }
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      <div className="container tableContainer">
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th scope="col" className="bordering-left">
                Flux
              </th>
              <th scope="col">Annee</th>
              <th scope="col">Timestre</th>
              <th scope="col">SH8</th>
              <th scope="col">Libelle</th>
              <th scope="col">Valeur</th>
              <th scope="col">Poids net</th>
              <th scope="col">Quantité</th>
              <th scope="col">Prix unitaire</th>
              <th scope="col">Prix unitaire annuel moyen</th>
              <th
                scope="col"
                className="bordering-right"
                style={{ minWidth: "95px" }}
              >
                SH2
              </th>
            </tr>
          </thead>
          <br />
          <tbody className="flux-table">
            {fluxs.slice(startIndex, endIndex).map((flux) => (
              <tr key={flux.id_flux}>
                <td>{flux.type}</td>
                <td>{flux.annee}</td>
                <td>{flux.trimestre}</td>
                <td>{flux.sh8}</td>
                <td>{flux.libelle}</td>
                <td>{flux.valeur}</td>
                <td>{flux.poids_net}</td>
                <td>{flux.quantite}</td>
                <td>{flux.prix_unitaire}</td>
                <td>{flux.prix_unitaire_moyenne_annuelle}</td>
                <td>
                  {flux.sh2}
                  <FontAwesomeIcon
                    className="iconz-left"
                    icon={faEdit}
                    onClick={() => handleEditClick(flux)}
                  />
                  <FontAwesomeIcon
                    className="iconz-right"
                    icon={faTrash}
                    onClick={(event) => handleDelete(event, flux.id_flux)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row pagination">
        <Col xs={6} md={6} style={{ display: "flex" }}>
          <div style={{ marginLeft: "95%" }}>
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={Math.ceil(fluxs.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />{" "}
          </div>
        </Col>
        <Col
          xs={6}
          md={6}
          style={{ display: "flex" }}
          className="colExportation"
        >
          <Button
            className="buttonMain"
            style={{
              backgroundColor: "#003529",
              border: "#003529",
              marginLeft: "66%",
            }}
            onClick={exportToExcel}
          >
            Exporter
          </Button>
        </Col>
      </div>
    </div>
  );
}
