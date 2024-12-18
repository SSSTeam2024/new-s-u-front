import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useAddSpecialiteEnseignantMutation } from "features/specialiteEnseignant/specialiteEnseignant";

const AddSpecialiteEnseignant = () => {
  document.title =
    " Ajouter Spécialité Enseignant | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/parametre/specialite-enseignants");
  }

  const [createSpecialiteEnseignant] = useAddSpecialiteEnseignantMutation();

  const [formData, setFormData] = useState({
    _id: "",
    //value_specialite_enseignant: "",
    specialite_ar: "",
    specialite_fr: "",
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

  const onSubmitSpecialiteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await createSpecialiteEnseignant(formData).unwrap();
      notify();
      navigate("/parametre/specialite-enseignants");
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
      title: "Spécialité enseignant a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation spécialité enseignant échoué ${error}`,
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
              <Form
                className="tablelist-form"
                onSubmit={onSubmitSpecialiteEnseignant}
              >
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  {/* <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="value_specialite_enseignant">Valeur</Form.Label>
                      <Form.Control
                        type="text"
                        id="value_specialite_enseignant"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.value_specialite_enseignant}
                      />
                    </div>
                  </Col> */}

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="specialite_fr">
                        Spécialité Enseignant
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="specialite_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.specialite_fr}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div
                      className="mb-3"
                      style={{
                        direction: "rtl",
                        textAlign: "right",
                      }}
                    >
                      <Form.Label htmlFor="specialite_ar">الإختصاص</Form.Label>
                      <Form.Control
                        type="text"
                        id="specialite_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.specialite_ar}
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

export default AddSpecialiteEnseignant;