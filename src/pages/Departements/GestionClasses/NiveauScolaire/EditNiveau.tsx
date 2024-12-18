import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";

import { useUpdateNiveauMutation } from "features/niveau/niveau";

const EditNiveau = () => {
  document.title = " Modifier Niveau | Application Smart Institute";
  const navigate = useNavigate();
  const { state: niveau } = useLocation();
  const [editNiveau] = useUpdateNiveauMutation();

  const [formData, setFormData] = useState({
    _id: "",
    name_niveau_ar: "",
    name_niveau_fr: "",
    abreviation: "",
    sections:[]
  });

  useEffect(() => {
    if (niveau) {
      setFormData({
        _id: niveau._id,
        name_niveau_ar: niveau.name_niveau_ar,
        name_niveau_fr: niveau.name_niveau_fr,
        abreviation: niveau.abreviation,
         sections: niveau.sections
      });
    }
  }, [niveau]);

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
  const onSubmitNiveau = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editNiveau(formData).unwrap();
      notify();
      navigate("/departement/gestion-classes/liste-niveau");
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
      title: "Niveau a été modifié avec succès",
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
              <Form className="tablelist-form" onSubmit={onSubmitNiveau}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_niveau_fr">
                        Niveau Classe
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_niveau_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_niveau_fr}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_niveau_ar">
                        المستوى التعليمي
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_niveau_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_niveau_ar}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
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
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate(
                          "/departement/gestion-classes/liste-niveau"
                        );
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

export default EditNiveau;