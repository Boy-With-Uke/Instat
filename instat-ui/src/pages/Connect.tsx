import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "../assets/auth.css";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/Images/instat_logo2.jpg";
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
        title: "Utilisateur non trouvés",
        text: "Reverifiez vos identifiants",
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
        <div className="outter">
          <Container>
            <Row>
              <Col md={6} className="login-image">
                <img src={img} alt="Login" />
              </Col>
              <Col md={6}>
                <div className="FormWarper" style={{ textAlign: "center" }}>
                  <Form>
                    <Form.Label className="title">Connexion</Form.Label>
                    <Row className="rows" style={{ marginTop: "40px" }}>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Control
                          type="email"
                          value={mail}
                          onChange={(event) => setMail(event.target.value)}
                          placeholder="Enter email"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="rows" style={{ marginTop: "40px" }}>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Password"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="rows" style={{ marginTop: "40px" }}>
                      <Button
                        variant="primary"
                        onClick={handleConnect}
                        style={{
                          backgroundColor: "#003529",
                          border: "#003529",
                        }}
                      >
                        Connexion
                      </Button>
                    </Row>
                    <Row style={{marginTop: '20px'}}>
                      <Link to={"/signin"} className="custom-Link">Pas encore de compte?</Link>
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}
