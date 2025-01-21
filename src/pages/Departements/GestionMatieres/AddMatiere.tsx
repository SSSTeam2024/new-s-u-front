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

const AddMatiere = () => {
  document.title = " Ajouter Matière | Application Smart Institute";
  const navigate = useNavigate();

  const [createMatiere] = useAddMatiereMutation();

  const [formData, setFormData] = useState({
    _id: "",
    code_matiere: "",
    matiere: "",
    semestre: "S1",
    regime_matiere: "",
    credit_matiere: "",
    coefficient_matiere: "",
    types: [
      { type: "TP", volume: "", nbr_elimination: "" },
      { type: "TD", volume: "", nbr_elimination: "" },
      { type: "C", volume: "", nbr_elimination: "" },
      { type: "CI", volume: "", nbr_elimination: "" },
    ],
  });

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

    // Filter out types that have empty fields for 'volume' and 'nbr_elimination'
    const filteredTypes = formData.types.filter(
      (type) => type.volume !== "" && type.nbr_elimination !== ""
    );

    // Update formData to only include non-empty types
    const updatedFormData = {
      ...formData,
      types: filteredTypes,
    };

    try {
      await createMatiere(updatedFormData).unwrap();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Matière a été crée avec succés",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/departement/gestion-matieres/liste-matieres");
    } catch (error: any) {
      errorAlert(error.message || "Erreur lors de la création de la matière.");
    }
  };

  const toggleSemestre = () => {
    setFormData((prevState) => ({
      ...prevState,
      semestre: prevState.semestre === "S1" ? "S2" : "S1",
    }));
  };

  const onChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onTypeChange = (index: any, field: any, value: any) => {
    setFormData((prevState) => {
      const updatedTypes = [...prevState.types];
      updatedTypes[index] = {
        ...updatedTypes[index],
        [field]: value,
      };
      return {
        ...prevState,
        types: updatedTypes,
      };
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitMatiere}>
                <Row>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="semestre">Semestre</Form.Label>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
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
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="code_matiere">
                        Code Matière
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="code_matiere"
                        required
                        onChange={onChange}
                        value={formData.code_matiere}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="matiere">Titre Matière</Form.Label>
                      <Form.Control
                        type="text"
                        id="matiere"
                        required
                        onChange={onChange}
                        value={formData.matiere}
                      />
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="regime_matiere">
                        Régime Matière
                      </Form.Label>
                      <select
                        className="form-select"
                        id="regime_matiere"
                        value={formData.regime_matiere}
                        onChange={onChange}
                      >
                        <option value="">Sélectionner Régime</option>
                        <option value="TP">TP</option>
                        <option value="CC">CC</option>
                        <option value="MX">MX</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="coefficient_matiere">
                        Coefficient
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="coefficient_matiere"
                        required
                        onChange={onChange}
                        value={formData.coefficient_matiere}
                      />
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="credit_matiere">
                        Crédit Matière
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="credit_matiere"
                        required
                        onChange={onChange}
                        value={formData.credit_matiere}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Type Matière</th>
                            <th>Volume Horaire</th>
                            <th>Nombre Elimination</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.types.map((typeData, index) => (
                            <tr key={index}>
                              <td>
                                <Form.Control
                                  type="text"
                                  readOnly
                                  value={typeData.type}
                                  className="bg-light"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={typeData.volume}
                                  onChange={(e) =>
                                    onTypeChange(
                                      index,
                                      "volume",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={typeData.nbr_elimination}
                                  onChange={(e) =>
                                    onTypeChange(
                                      index,
                                      "nbr_elimination",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                <Button
                  type="submit"
                  variant="success"
                  className="btn-sm float-end"
                >
                  Créer Matière
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddMatiere;
