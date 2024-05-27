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

export default function Notifications() {
  type Notification = {
    id_notification: number;
    utilisateurAjout: string;
    dateCreated: Date;
    typeDajout: string;
    typeAction: string;
  };
  const userCoockies = Cookies.get("user");
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const fetchNotifs = async () => {
    try {
      const reponse = await fetch(
        "http://localhost:3000/api/instat/notification/"
      );

      const data = await reponse.json();

      console.log(data);
      const notifs: Notification[] = data.map((notif: any) => ({
        id_notification: notif.id_notification,
        utilisateurAjout: notif.user.email,
        dateCreated: notif.dateCreated, // Assurez-vous de définir la date correctement
        typeDajout: notif.typeDajout,
        typeAction: notif.typeAction,
      }));

      setNotifications(notifs);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchNotifs();
  }, []);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
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
            <div>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="bordering-left">
                      Email de l'utilisateur
                    </th>
                    <th scope="col">Date</th>
                    <th scope="col">Type d'action</th>
                    <th scope="col">Type d'entite</th>
                  </tr>
                </thead>
                <br />
                <tbody className="flux-table">
                  {notifications.slice(startIndex, endIndex).map((notif) => (
                    <tr key={notif.id_notification}>
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
                    />{" "}
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
