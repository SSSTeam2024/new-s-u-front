import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useAddPosteEnseignantMutation } from "features/posteEnseignant/posteEnseignant";

const AddPosteEnseignant = () => {
  document.title = " Ajouter Poste Enseignant | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/parametre/poste-enseignants");
  }

  const [createPosteEnseignant] = useAddPosteEnseignantMutation();

  const [formData, setFormData] = useState({
    _id: "",
    // value_poste_enseignant: "",
    poste_ar: "",
    poste_fr: "",
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

  const onSubmitPosteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await createPosteEnseignant(formData).unwrap();
      notify();
      navigate("/parametre/poste-enseignants");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Poste enseignant a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation poste enseignant échoué ${error}`,
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
                onSubmit={onSubmitPosteEnseignant}
              >
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="poste_fr">
                        Poste Enseignant
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="poste_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.poste_fr}
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
                      <Form.Label htmlFor="poste_ar">الخطة الوظيفية</Form.Label>
                      <Form.Control
                        type="text"
                        id="poste_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.poste_ar}
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

export default AddPosteEnseignant;