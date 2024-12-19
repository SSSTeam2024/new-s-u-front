import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import {
  useAddMatiereMutation,
  useUpdateMatiereMutation,
} from "features/matiere/matiere";

const EditMatiere = () => {
  document.title = " Modifier Matière | Application Smart Institute";
  const navigate = useNavigate();
  const { state: matiere } = useLocation();
  const [editMatiere] = useUpdateMatiereMutation();

  const [formData, setFormData] = useState({
    _id: "",
    nbr_elimination: "",
    volume: "",
    semestre: "",
    type: "",
    matiere: "",
    code_matiere: "",
  });

  useEffect(() => {
    if (matiere) {
      setFormData({
        _id: matiere._id,
        nbr_elimination: matiere.nbr_elimination,
        semestre: matiere.semestre,
        volume: matiere.volume,
        type: matiere.type,
        matiere: matiere.matiere,
        code_matiere: matiere.code_matiere,
      });
    }
  }, [matiere]);

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
  const onSubmitMatiere = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editMatiere(formData).unwrap();
      notify();
      navigate("/departement/gestion-matieres/liste-matieres");
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
      title: "Matière a été modifié avec succès",
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
              <Form className="tablelist-form" onSubmit={onSubmitMatiere}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="code_matiere">
                        Code Matière
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="code_matiere"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.code_matiere}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="matiere">Matières</Form.Label>
                      <Form.Control
                        type="text"
                        id="matiere"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.matiere}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="type">Type</Form.Label>
                      <Form.Control
                        type="text"
                        id="type"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.type}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="semestre">Semestre</Form.Label>
                      <Form.Control
                        type="text"
                        id="semestre"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.semestre}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="volume">Volume</Form.Label>
                      <Form.Control
                        type="number"
                        id="volume"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.volume}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="nbr_elimination">
                        Nombre Elimination
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="nbr_elimination"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.nbr_elimination}
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
                          "/departement/gestion-matieres/liste-matieres"
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

export default EditMatiere;