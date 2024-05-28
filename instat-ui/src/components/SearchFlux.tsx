import { useEffect, useState } from "react";
import {
  faEdit,
  faRotateRight,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
import LibelleDropdown from "./LibelleDropDown";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
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
    dateAjout: Date;
    dateModif: Date;
  };
  const userCoockies = Cookies.get("user");
  const userId = userCoockies;
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
  const [ask, setAsk] = useState(false);
  //Modal
  const [isShow, setIsShow] = useState(false);

  //EDIT
  const [selectedFlux, setSelectedFlux] = useState<Flux | null>(null);
  const [listFlux, setListFlux] = useState<Flux[]>([]);
  const [toEditType, setToEditType] = useState("");
  const [toEditAnnee, setToEditAnnee] = useState(0);
  const [toEditTrim, setToEditTrim] = useState(0);
  const [toEditValeur, setToEditValeur] = useState(0);
  const [toEditPoids, setToEditPoids] = useState(0);
  const [toEditQuantite, setToEditQuantite] = useState(0);
  const [toEditPrix, setToEditPrix] = useState(0);
  const [askDelete, setAskDelete] = useState(false);

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
    setAsk(false);
    setAskDelete(false);
  }

  const handleEditTypeChange = (selectedOption: any) => {
    setToEditType(selectedOption.value);
  };

  const fetchFlux = async () => {
    try {
      const reponse = await fetch("http://localhost:3000/api/instat/flux/");
      const fluxs: Flux[] = await reponse.json();
      const years = Array.from(new Set(fluxs.map((flux) => flux.annee))).sort(
        (a, b) => a - b
      );
  
      // Utiliser les années uniques
      const yearOptions = years.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      }));
      const defaultAnnee = [{ value: "all", label: "Annee" }, ...yearOptions];
  
      // Trier les flux par date d'ajout (du plus récent au plus ancien)
      const sortedFluxs = fluxs.sort(
        (a, b) => new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime()
      );
  
      setFluxs(sortedFluxs);
      setYearOptions(defaultAnnee);
    } catch (e) {
      console.log(e);
    }
  };
  
  useEffect(() => {
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
      await fetch(`http://localhost:3000/api/instat/flux/delete/${fluxId}/${userId}`, {
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
        `http://localhost:3000/api/instat/flux/update/${selectedFlux?.id_flux}/${userId}`,
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
      fetchFlux();
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: `Le produit ${selectedFlux?.sh8} a ete mis a jour`,
      });
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
  const exportToExcel = (donnee: any) => {
    const type = "flux-";
    const data = donnee;
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

  const handleCheckboxChange = (id: number, checked: boolean) => {
    const fluxToAdd = fluxs.find((flux) => flux.id_flux === id);

    if (checked && fluxToAdd) {
      setListFlux((prevListFlux) => [...prevListFlux, fluxToAdd]);
    } else {
      setListFlux((prevListFlux) =>
        prevListFlux.filter((flux) => flux.id_flux !== id)
      );
    }
  };
  useEffect(() => {
    console.log(listFlux);
  }, [listFlux]);

  const askAll = () => {
    if (listFlux.length >= 1) {
      exportToExcel(listFlux);
    } else {
      setAsk(true);
    }
  };

  const askAllDelete = () => {
    if (listFlux.length >= 1) {
      deleteThem(listFlux);
    } else {
      setAskDelete(true);
    }
  };

  const deleteAll = async (data: any) => {
    if (data.length <= 0) {
      Swal.fire({
        icon: "warning",
        title: "",
        text: `Aucun produits a supprimer`,
      });
      setAskDelete(false);
      return;
    }
    try {
      // Itérer sur chaque ID de produit dans data
      for (const fluxList of data) {
        await fetch(
          `http://localhost:3000/api/instat/flux/delete/${fluxList.id_flux}/${userId}`,
          {
            method: "DELETE",
          }
        );
      }
      setAskDelete(false);
      // Une fois que toutes les suppressions sont effectuées, mettre à jour l'état pour vider listProduct
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "La suppression de tous les flux est un succes",
      });

      fetchFlux();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteThem = async (data: any) => {
    try {
      // Itérer sur chaque ID de produit dans data
      for (const fluxList of data) {
        await fetch(
          `http://localhost:3000/api/instat/flux/delete/${fluxList.id_flux}/${userId}`,
          {
            method: "DELETE",
          }
        );
      }
      // Une fois que toutes les suppressions sont effectuées, mettre à jour l'état pour vider listProduct
      fetchFlux();
      setListFlux([]);
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "La suppression de ces fluxs est un succes",
      });
    } catch (error) {
      console.error(error);
    }
  };
  function reloadPage() {
    window.location.reload();
  }
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
      <Modal show={ask} onHide={onHide} className="modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Aucun flux selectionnees voulez vous tout enregistrer?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <Button
                  variant="danger"
                  style={{ width: "300px" }}
                  onClick={onHide}
                >
                  Annuler
                </Button>
              </Col>
              <Col xs={6} md={6}>
                <Button
                  variant="success"
                  style={{ width: "300px" }}
                  onClick={() => exportToExcel(fluxs)}
                >
                  Enregistrer
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      {/* MODAL ASK DELETE */}
      <Modal show={askDelete} onHide={onHide} className="modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Aucun produits selectionnees voulez vous tout supprimer?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <Button
                  variant="warning"
                  style={{ width: "300px" }}
                  onClick={onHide}
                >
                  Annuler
                </Button>
              </Col>
              <Col xs={6} md={6}>
                <Button
                  variant="danger"
                  style={{ width: "300px" }}
                  onClick={() => deleteAll(fluxs)}
                >
                  Supprimer
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <div
        className="row searchContainer"
        style={{
          marginBottom: "20px",
        }}
      >
        <div className="col-8 filter">
          {/* <Button
            className="buttonMain"
            variant="warning"
            style={{
              maxHeight: "40px",
              marginRight: "10px",
            }}
            onClick={reloadPage}
          >
            Actualiser {"         "}
            <FontAwesomeIcon icon={faRotateRight} />
          </Button> */}
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
              <th scope="col" style={{ maxHeight: "50px" }}>
                Libelle
              </th>
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
                <td style={{ maxHeight: "50px", overflow: "hidden" }}>
                  {flux.libelle.length > 20 ? (
                    <LibelleDropdown libelle={flux.libelle} />
                  ) : (
                    flux.libelle
                  )}
                </td>
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
                <Checkbox
                  id="addToList"
                  onChange={(event) =>
                    handleCheckboxChange(flux.id_flux, event.target.checked)
                  }
                  sx={{
                    color: "#003529",
                    "&.Mui-checked": {
                      color: "#003529",
                    },
                  }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row pagination">
        <Col xs={6} md={6} style={{ display: "flex" }}>
          <div style={{ marginLeft: "75%" }}>
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
              marginLeft: "36%",
            }}
            variant="danger"
            onClick={askAllDelete}
          >
            Suprimmer
          </Button>
          <Button
            className="buttonMain"
            style={{
              backgroundColor: "#003529",
              border: "#003529",
              marginLeft: "5%",
            }}
            onClick={askAll}
          >
            Exporter
          </Button>
        </Col>
      </div>
    </div>
  );
}
