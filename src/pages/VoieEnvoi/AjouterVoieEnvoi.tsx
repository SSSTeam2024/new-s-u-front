import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useAddVoieEnvoiMutation,
  VoieEnvoiModel,
} from "features/voieEnvoi/voieEnvoiSlice";

const AjouterVoieEnvoi = () => {
  const [createNewVoie] = useAddVoieEnvoiMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Voie d'envoi a été créée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const initialVoieEnvoi: VoieEnvoiModel = {
    titre: "",
  };

  const [voieEnvoi, setVoieEnvoi] = useState(initialVoieEnvoi);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoieEnvoi((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitVoieEnvoi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      createNewVoie(voieEnvoi)
        .then(() => notifySuccess())
        .then(() => setVoieEnvoi(initialVoieEnvoi));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={onSubmitVoieEnvoi}>
                <Row className="mb-3">
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>Title</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="titre"
                      id="titre"
                      onChange={onChange}
                      value={voieEnvoi.titre}
                      className="w-75"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-end">
                    <Button type="submit" variant="success" id="addNew">
                      Ajouter
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AjouterVoieEnvoi;
