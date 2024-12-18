import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useAddMatiereMutation } from "features/matiere/matiere";
import { useAddTypeSeanceMutation } from "features/typeSeance/typeSeance";

const AddTypeSeance = () => {
  document.title = " Ajouter Type Séance | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/departement/gestion-types-seances/liste-types-seances");
  }

  const [createTypeSeance] = useAddTypeSeanceMutation();

  const [formData, setFormData] = useState({
    _id: "",
    seance_ar: "",
    seance_fr: "",
    abreviation: "",
    charge: "",
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const onSubmitTypeSeance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTypeSeance(formData).unwrap();
      notify();
      navigate("/departement/gestion-types-seances/liste-types-seances");
    } catch (error: any) {
      if (error.status === 400) {
        errorAlert("La valeur doit être unique.");
      } else {
        errorAlert("La valeur doit être unique. Veuillez réessayer.");
      }
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Matière a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation matière échoué ${error}`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitTypeSeance}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="seance_fr">
                        Type Séance (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="seance_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.seance_fr}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="seance_ar">
                        {" "}
                        Type Séance (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="seance_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.seance_ar}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="abreviation">Abréviation</Form.Label>
                      <Form.Control
                        type="text"
                        id="abreviation"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.abreviation}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="charge">Charge Horaire</Form.Label>
                      <Form.Control
                        type="number"
                        id="charge"
                        placeholder=""
                        onChange={onChange}
                        value={formData.charge}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        tog_retourParametres();
                      }}
                    >
                      Retour
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddTypeSeance;