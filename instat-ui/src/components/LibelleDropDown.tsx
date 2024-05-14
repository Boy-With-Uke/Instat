import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

interface LibelleDropdownProps {
  libelle: string;
}

const LibelleDropdown: React.FC<LibelleDropdownProps> = ({ libelle }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <>
      <Form>
        <Modal
          show={showFullText}
          onHide={toggleShowFullText}
          className="modal"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Le libelle Complet </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <Container>
              <Row
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <Form.Label>{libelle}</Form.Label>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
        <Form.Label onClick={toggleShowFullText}>
          {libelle.substring(0, 20) + "..."}
        </Form.Label>
      </Form>
    </>
  );
};

export default LibelleDropdown;
