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
    regime_matiere: "",
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
        regime_matiere: matiere.regime_matiere,
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

  const toggleSemestre = () => {
    setFormData((prevState) => ({
      ...prevState,
      semestre: prevState.semestre === "S1" ? "S2" : "S1",
    }));
  };
  function tog_retourParametres() {
    navigate("/departement/gestion-matieres/liste-matieres");
  }
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
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="semestre">Semestre</Form.Label>
                      <div className="form-check form-switch form-switch-lg from-switch-info">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="SwitchCheck6"
                          checked={formData.semestre === "S2"}
                          onChange={toggleSemestre}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="SwitchCheck6"
                        >
                          {formData.semestre}
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
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
                      <Form.Label htmlFor="regime_matiere">
                        Régime Matière
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="regime_matiere"
                        id="regime_matiere"
                        value={formData.regime_matiere}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            regime_matiere: e.target.value,
                          })
                        }
                      >
                        <option value="">Sélectionner Régime Matière</option>
                        <option value="TP">TP</option>
                        <option value="CC">CC</option>
                        <option value="MX">MX</option>
                      </select>
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="type">Type Matière</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="">Sélectionner Type Matière</option>
                        <option value="TP">TP</option>
                        <option value="TD">TD</option>
                        <option value="C">C</option>
                        <option value="CI">CI</option>
                      </select>
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="volume">Volume</Form.Label>
                      <Form.Control
                        type="number"
                        id="volume"
                        placeholder=""
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

export default EditMatiere;
