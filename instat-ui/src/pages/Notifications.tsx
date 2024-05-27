import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
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
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import "../assets/main.css";
import moment from "moment";
import LibelleDropdown from "../components/LibelleDropDown";
import { Toast } from "react-bootstrap";

export default function Notifications() {
  type Notification = {
    id_notification: number;
    utilisateurAjout: string;
    dateCreated: Date;
    typeDajout: string;
    typeAction: string;
    message: string;
  };
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
  type Product = {
    id_product: number;
    sh8_product: string;
    sh2_product: number;
    libelle_product: string;
    AnneeApparition: number;
    TrimestreApparition: number;
    dateAjout: Date;
    dateModif: Date;
  };
  const userCoockies = Cookies.get("user");
  const [fluxs, setFluxs] = useState<Flux[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotifications] =
    useState<Notification | null>(null);
  const [filteredFluxs, setFilteredFluxs] = useState<Flux[]>([]);
  const [filteredProduct2, setFilteredProduct2] = useState<Product[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<Product[]>([]);

  const [isShow, setIsShow] = useState(false);
  const [showFilteredFluxs, setShowFilteredFluxs] = useState(false);
  const [showFilteredProduct, setShowFilteredProduct] = useState(false);
  const [showFilteredProduct2, setShowFilteredProduct2] = useState(false);

  function onHide() {
    setIsShow(false);
    setShowFilteredFluxs(false);
    setShowFilteredProduct(false);
    setShowFilteredProduct2(false);
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (!userCoockies) {
      navigate("/");
    }
  });

  //  PAGINATION
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  //Flux
  const [currentPageFlux, setCurrentPageFlux] = useState(0);
  const [currentPageProduct, setCurrentPageProduct] = useState(0);
  const startIndexFlux = currentPageFlux * itemsPerPage;
  const endIndexFlux = startIndexFlux + itemsPerPage;
  const startIndexProduct = currentPageProduct * itemsPerPage;
  const endIndexProduct = startIndexProduct + itemsPerPage;

  const fetchNotifs = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/instat/notification/"
      );
      const data = await response.json();

      const notifs: Notification[] = data.map((notif: any) => ({
        id_notification: notif.id_notification,
        utilisateurAjout: notif.user.email,
        dateCreated: moment(notif.dateCreated).startOf("second").toDate(), // Arrondir à la seconde près
        typeDajout: notif.typeDajout,
        typeAction: notif.typeAction,
        message: notif.message,
      }));

      // Grouper les notifications par dateCreated
      const groupedNotifs = notifs.reduce<
        Record<string, Notification & { count: number }>
      >((acc, notif) => {
        const key = moment(notif.dateCreated).format("YYYY-MM-DD HH:mm:ss");
        if (!acc[key]) {
          acc[key] = { ...notif, count: 1 };
        } else {
          acc[key].count += 1;
        }
        return acc;
      }, {});

      // Convertir l'objet en tableau et trier par date décroissante
      const sortedNotifs = Object.values(groupedNotifs).sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );

      setNotifications(sortedNotifs);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/instat/product/");
      const products: Product[] = await response.json();
      setProducts(products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFlux = async () => {
    try {
      const reponse = await fetch("http://localhost:3000/api/instat/flux/");

      const fluxs: Flux[] = await reponse.json();
      setFluxs(fluxs);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchFlux();
    fetchProduct();
    fetchNotifs();
  }, []);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
  const handlePageChangeModal1 = (selectedPage: { selected: number }) => {
    setCurrentPageFlux(selectedPage.selected);
  };

  const handlePageChangeModal2 = (selectedPage: { selected: number }) => {
    setCurrentPageProduct(selectedPage.selected);
  };

  const handleNotifClick = (notif: Notification) => {
    if (notif.typeAction === "Supression") {
      setIsShow(true);
      setSelectedNotifications(notif);
    } else if (notif.typeAction === "Ajout" && notif.typeDajout === "flux") {
      // Filtrer les flux par dateAjout à la seconde près
      const filtered = fluxs.filter((flux) =>
        moment(flux.dateAjout).isSame(
          moment(notif.dateCreated).startOf("second"),
          "second"
        )
      );

      setFilteredFluxs(filtered);
      setShowFilteredFluxs(true);
    } else if (notif.typeAction === "Ajout" && notif.typeDajout === "product") {
      // Filtrer les produits par dateAjout à la seconde près
      const filtered = products.filter((product) =>
        moment(product.dateAjout).isSame(
          moment(notif.dateCreated).startOf("second"),
          "second"
        )
      );

      setFilteredProduct(filtered);
      setShowFilteredProduct(true);
    } else if (notif.typeAction === "Modification") {
      if (notif.typeDajout === "product") {
        const filtered = products.filter((product) =>
          moment(product.dateModif).isSame(
            moment(notif.dateCreated).startOf("second"),
            "second"
          )
        );
        setFilteredProduct2(filtered);
        setShowFilteredProduct2(true);
      }
    }
  };

  function reloadPage() {
    window.location.reload();
  }

  const clearNotifs = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    try {
      const response = await fetch(
        "http://localhost:3000/api/instat/notification/delete/all",
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Suppresion de tous les notifications",
      });
      console.log(data);
      fetchNotifs();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteAllFlux = async (data: any) => {
    if (data.length <= 0) {
      Swal.fire({
        icon: "warning",
        title: "",
        text: `Aucun produits a supprimer`,
      });
      return;
    }

    try {
      // Itérer sur chaque ID de produit dans data
      for (const fluxList of data) {
        await fetch(
          `http://localhost:3000/api/instat/flux/delete/fromNotif/${fluxList.id_flux}`,
          {
            method: "DELETE",
          }
        );
      }
      setShowFilteredFluxs(false);
      // Une fois que toutes les suppressions sont effectuées, mettre à jour l'état pour vider listProduct
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "L'annulation d'ajouts de tous les flux est un succes",
      });

      fetchFlux();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteAllproduct = async (data: any) => {
    console.log("Data à supprimer:", data);
    if (data.length <= 0) {
      Swal.fire({
        icon: "warning",
        title: "",
        text: `Aucun produit à supprimer`,
      });
      return;
    }

    try {
      // Itérer sur chaque ID de produit dans data
      for (const productList of data) {
        console.log(`Suppression du produit ID: ${productList.id_product}`);
        const response = await fetch(
          `http://localhost:3000/api/instat/product/fromNotif/${productList.id_product}`,
          {
            method: "DELETE",
          }
        );
        console.log(
          `Réponse de la suppression du produit ID: ${productList.id_product}`,
          response
        );
        if (!response.ok) {
          throw new Error(
            `Erreur lors de la suppression du produit ID: ${productList.id_product}`
          );
        }
      }
      console.log("Tous les produits ont été supprimés.");
      // Une fois que toutes les suppressions sont effectuées, mettre à jour l'état pour vider listProduct
      fetchProduct();
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "La suppression de ces produits est un succès",
      });
      setShowFilteredProduct(false);
    } catch (error) {
      console.error("Erreur lors de la suppression des produits:", error);
    }
  };

  return (
    <>
      <div className="container-fluid bg-dark bg-gradient" id="mainContainer">
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div
            className="col-11 main"
            style={{
              margin: "0px;",
            }}
          >
            <Modal show={isShow} onHide={onHide} className="modal" size="lg">
              <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid-example">
                <Container>
                  <p>{selectedNotification?.message}</p>
                </Container>
              </Modal.Body>
            </Modal>

            <Modal
              show={showFilteredFluxs}
              onHide={onHide}
              className="modal"
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Flux ajoutés le{" "}
                  {moment(selectedNotification?.dateCreated).format(
                    "MMMM Do YYYY"
                  )}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid-example">
                <Container>
                  {filteredFluxs.length > 0 ? (
                    <>
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
                            <th scope="col">Prix u/ann</th>
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
                          {filteredFluxs
                            .slice(startIndexFlux, endIndexFlux)
                            .map((flux) => (
                              <tr key={flux.id_flux}>
                                <td>{flux.type}</td>
                                <td>{flux.annee}</td>
                                <td>{flux.trimestre}</td>
                                <td>{flux.sh8}</td>
                                <td
                                  style={{
                                    maxHeight: "50px",
                                    overflow: "hidden",
                                  }}
                                >
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
                                <td>{flux.sh2}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="row pagination">
                        <Col xs={6} md={6} style={{ display: "flex" }}>
                          <div style={{ marginLeft: "75%" }}>
                            <ReactPaginate
                              previousLabel={"<"}
                              nextLabel={">"}
                              breakLabel={"..."}
                              pageCount={Math.ceil(
                                filteredFluxs.length / itemsPerPage
                              )}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageChangeModal1}
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
                              marginLeft: "46%",
                              height: "40px",
                            }}
                            variant="danger"
                            onClick={() => deleteAllFlux(filteredFluxs)}
                          >
                            Annuler l'ajout de ces flux
                          </Button>
                        </Col>
                      </div>
                    </>
                  ) : (
                    <>
                      <Row>
                        <p>L'action a deja ete annuler.</p>
                      </Row>
                    </>
                  )}
                </Container>
              </Modal.Body>
            </Modal>
            <Modal
              show={showFilteredProduct}
              onHide={onHide}
              className="modal"
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Produit ajoutés le{" "}
                  {moment(selectedNotification?.dateCreated).format(
                    "MMMM Do YYYY"
                  )}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid-example">
                <Container>
                  {filteredProduct.length > 0 ? (
                    <>
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
                        <tbody className="flux-table">
                          {filteredProduct
                            .slice(startIndexProduct, endIndexProduct)
                            .map((product) => (
                              <tr key={product.id_product}>
                                <td>{product.sh8_product}</td>
                                <td>{product.sh2_product}</td>
                                <td
                                  style={{
                                    maxHeight: "50px",
                                    overflow: "hidden",
                                  }}
                                >
                                  {product.libelle_product.length > 20 ? (
                                    <LibelleDropdown
                                      libelle={product.libelle_product}
                                    />
                                  ) : (
                                    product.libelle_product
                                  )}
                                </td>
                                <td>{product.AnneeApparition}</td>
                                <td>{product.TrimestreApparition} </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>

                      <div className="row pagination">
                        <Col xs={6} md={6} style={{ display: "flex" }}>
                          <div style={{ marginLeft: "75%" }}>
                            <ReactPaginate
                              previousLabel={"<"}
                              nextLabel={">"}
                              breakLabel={"..."}
                              pageCount={Math.ceil(
                                filteredProduct.length / itemsPerPage
                              )}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageChangeModal2}
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
                              height: "40px",
                            }}
                            variant="danger"
                            onClick={() => deleteAllproduct(filteredProduct)}
                          >
                            Annuler l'ajout de ces produit
                          </Button>
                        </Col>
                      </div>
                    </>
                  ) : (
                    <p>Aucun produit trouvé pour cette date.</p>
                  )}
                </Container>
              </Modal.Body>
            </Modal>

            <Modal
              show={showFilteredProduct2}
              onHide={onHide}
              className="modal"
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Produit ajoutés le{" "}
                  {moment(selectedNotification?.dateCreated).format(
                    "MMMM Do YYYY"
                  )}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid-example">
                <Container>
                  {filteredProduct2.length > 0 ? (
                    <>
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
                        <tbody className="flux-table">
                          {filteredProduct2
                            .slice(startIndexProduct, endIndexProduct)
                            .map((product) => (
                              <tr key={product.id_product}>
                                <td>{product.sh8_product}</td>
                                <td>{product.sh2_product}</td>
                                <td
                                  style={{
                                    maxHeight: "50px",
                                    overflow: "hidden",
                                  }}
                                >
                                  {product.libelle_product.length > 20 ? (
                                    <LibelleDropdown
                                      libelle={product.libelle_product}
                                    />
                                  ) : (
                                    product.libelle_product
                                  )}
                                </td>
                                <td>{product.AnneeApparition}</td>
                                <td>{product.TrimestreApparition} </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>

                      <div className="row pagination">
                        <Col xs={6} md={6} style={{ display: "flex" }}>
                          <div style={{ marginLeft: "75%" }}>
                            <ReactPaginate
                              previousLabel={"<"}
                              nextLabel={">"}
                              breakLabel={"..."}
                              pageCount={Math.ceil(
                                filteredProduct2.length / itemsPerPage
                              )}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageChangeModal2}
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
                      </div>
                    </>
                  ) : (
                    <p>Aucun produit trouvé pour cette date.</p>
                  )}
                </Container>
              </Modal.Body>
            </Modal>
            <div>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="bordering-left">
                      Email de l'utilisateur
                    </th>
                    <th scope="col">Date</th>
                    <th scope="col">Type d'action</th>
                    <th scope="col">Type d'entité</th>
                  </tr>
                </thead>
                <br />
                <tbody className="flux-table">
                  {notifications.slice(startIndex, endIndex).map((notif) => (
                    <tr
                      key={notif.id_notification}
                      onClick={() => handleNotifClick(notif)}
                    >
                      <td>{notif.utilisateurAjout}</td>
                      <td>
                        {moment(notif.dateCreated).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td>{notif.typeAction}</td>
                      <td>{notif.typeDajout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row pagination">
                <Col xs={6} md={6} style={{ display: "flex" }}>
                  <div style={{ marginLeft: "75%" }}>
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      pageCount={Math.ceil(notifications.length / itemsPerPage)}
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
                    />
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
                    onClick={(event) => clearNotifs(event)}
                  >
                    Effacer les notifications
                  </Button>
                </Col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
