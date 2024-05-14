import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import "../assets/select.css";
import exportFromJSON from "export-from-json";
import ReactPaginate from "react-paginate";
import Checkbox from "@mui/material/Checkbox";
import { ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import LibelleDropdown from "./LibelleDropDown";
import Form from "react-bootstrap/Form";

export default function SearchProduct() {
  type Product = {
    id_product: number;
    sh8_product: string;
    sh2_product: number;
    libelle_product: string;
    AnneeApparition: number;
    TrimestreApparition: number;
  };
  const trimestreBase = [
    { value: "all", label: "Trimestre" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  const [trimestreOptions, setTrimestreOptions] = useState("all");

  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [querry, setQuerry] = useState("");

  const [without, setWithout] = useState(false);

  const [annneeOption, setAnneeOption] = useState("all");

  //  PAGINATION
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  //EDIT
  const [isShow, setIsShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [toEditSh8, setToEditSh8] = useState("");
  const [toEditLibelle, setToEditLibelle] = useState("");
  const [toEditAnnee, setToEditAnnee] = useState(0);
  const [toEditTrim, setToEditTrim] = useState(0);
  const [ask, setAsk] = useState(false);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsShow(true);
    setToEditLibelle(product.libelle_product);
    setToEditSh8(product.sh8_product);
    setToEditTrim(product.TrimestreApparition);
    setToEditAnnee(product.AnneeApparition);
  };
  function onHide() {
    setIsShow(false);
    setAsk(false);
  }

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

  function handleCheck(event: ChangeEvent<HTMLInputElement>) {
    setWithout(event.target.checked);
  }
  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instat/product/"
        );
        const products: Product[] = await response.json();

        const years = Array.from(
          new Set(products.map((product) => product.AnneeApparition))
        );
        const yearOptions = years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }));
        const defaultAnnee = [{ value: "all", label: "Annee" }, ...yearOptions];
        setProducts(products);

        setYearOptions(defaultAnnee);
      } catch (error) {
        console.error(error);
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
            `http://localhost:3000/api/instat/product/findMany/${annneeOption}/${trimestreOptions}`
          );
          const products: Product[] = await reponse.json();
          setProducts(products);
        } catch (e) {
          console.log(e);
        }
      };
      fetchFlux();
    }
  }, [without, annneeOption, trimestreOptions]);

  const handleYearChange = (selectedOption: any) => {
    setAnneeOption(selectedOption.value);
  };

  const searching = async (
    event: React.MouseEvent,
    searchQuerry: string,
    yearQuery: string,
    trimestreQuerry: string
  ) => {
    event.stopPropagation();
    try {
      alert(`${searchQuerry} ${yearQuery} ${trimestreQuerry} `);
      const response = await fetch(
        `http://localhost:3000/api/instat/product/findOne/byLibelle/${searchQuerry}/${yearQuery}/${trimestreQuerry}`
      );

      const products: Product[] = await response.json();
      setProducts(products);
    } catch (error) {
      alert(`Error finding the product: ${error}`);
    }
  };
  const handleDelete = async (event: React.MouseEvent, productId: number) => {
    event.stopPropagation();

    try {
      await fetch(
        `http://localhost:3000/api/instat/product/delete/${productId}`,
        {
          method: "DELETE",
        }
      );

      const updatedProduct = products.filter(
        (product) => product.id_product !== productId
      );
      setProducts(updatedProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await fetch(
        `http://localhost:3000/api/instat/product/update/${selectedProduct?.id_product}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sh8_product: toEditSh8,
            libelle_product: toEditLibelle,
            AnneeApparition: toEditAnnee,
            TrimestreApparition: toEditTrim,
          }),
        }
      );
      alert(`the product ${selectedProduct?.libelle_product} has been updated`);
      setIsShow(false);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  const handleTrimestreChange = (selectedOption: any) => {
    setTrimestreOptions(selectedOption.value);
  };
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
  const exportToExcel = (donnee: any) => {
    const type = "product-";
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
    const productToAdd = products.find((product) => product.id_product === id);

    if (checked && productToAdd) {
      setListProduct((prevListProduct) => [...prevListProduct, productToAdd]);
    } else {
      setListProduct((prevListProduct) =>
        prevListProduct.filter((product) => product.id_product !== id)
      );
    }
  };
  useEffect(() => {
    console.log(listProduct);
  }, [listProduct]);

  const askAll = () => {
    if (listProduct.length >= 1) {
      console.log("tokony tsy misy");
      exportToExcel(listProduct);
    } else {
      setAsk(true);
    }
  };
  return (
    <div className="product-page">
      <Modal show={isShow} onHide={onHide} className="modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.libelle_product}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row style={{ marginBottom: "20px" }}>
              <Col xs={12} md={6}>
                <Form.Label>Sh8</Form.Label>
                <Form.Control
                  type="number"
                  value={toEditSh8}
                  onChange={(event) => setToEditSh8(event.target.value)}
                />
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
                <Form.Label>Libele</Form.Label>
                <Form.Control
                  type="text"
                  value={toEditLibelle}
                  onChange={(event) => setToEditLibelle(event.target.value)}
                />
              </Col>
              <Col xs={6} md={6}>
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
            Aucun produits selectionnees voulez vous tout enregistrer?
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
                  onClick={() => exportToExcel(products)}
                >
                  Enregistrer
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
              searching(event, querry, annneeOption, trimestreOptions)
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
                SH8
              </th>
              <th scope="col">SH2</th>
              <th scope="col" style={{ maxHeight: "50px" }}>
                Libelle
              </th>
              <th scope="col">Anne d'apparition</th>
              <th
                scope="col"
                className="bordering-right"
                style={{ minWidth: "95px" }}
              >
                Trimestre d'apparition
              </th>
            </tr>
          </thead>
          <br />
          <tbody className="product-table">
            {products.slice(startIndex, endIndex).map((product) => (
              <tr key={product.id_product}>
                <td>{product.sh8_product}</td>
                <td>{product.sh2_product}</td>
                <td style={{ maxHeight: "50px", overflow: "hidden" }}>
                  {product.libelle_product.length > 20 ? (
                    <LibelleDropdown libelle={product.libelle_product} />
                  ) : (
                    product.libelle_product
                  )}
                </td>
                <td>{product.AnneeApparition}</td>
                <td>
                  {product.TrimestreApparition}{" "}
                  <FontAwesomeIcon
                    className="iconz-left"
                    icon={faEdit}
                    onClick={() => handleEditClick(product)}
                  />{" "}
                  <FontAwesomeIcon
                    className="iconz-right"
                    icon={faTrash}
                    onClick={(event) => handleDelete(event, product.id_product)}
                  />{" "}
                </td>
                <Checkbox
                  id="addToList"
                  onChange={(event) =>
                    handleCheckboxChange(
                      product.id_product,
                      event.target.checked
                    )
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
              pageCount={Math.ceil(products.length / itemsPerPage)}
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
            onClick={askAll}
          >
            Exporter
          </Button>
        </Col>
      </div>
    </div>
  );
}
