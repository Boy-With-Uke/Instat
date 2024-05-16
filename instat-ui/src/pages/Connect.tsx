import { dividerClasses } from "@mui/material";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Connect() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleConnect = async () => {
    console.log("Connecting...");
    const isUser = await fetch(
      `http://localhost:3000/api/instat/user/findOneConnect/${mail}/${password}`
    );
    const data = await isUser.json();
    if (data.result === null) {
      Swal.fire({
        icon: "error",
        title: "Utilisateur non trouves",
        text: "Reverifier vos identifiants",
      });
    } else {
      const idUser = data.result;
      navigate("/main");
      Cookies.set("user", idUser, { expires: 1, path: "/" });
    }
  };
  return (
    <>
      <div className="container-fluid bg-dark bg-gradient authSection">
        <Container>
          <Form>
            <Row>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={mail}
                onChange={(event) => setMail(event.target.value)}
              />
            </Row>
            <Row>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Row>
            <Button onClick={handleConnect}>Connexion</Button>
          </Form>
        </Container>
      </div>
    </>
  );
}
