import React, { useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useAddMatiereMutation } from "features/matiere/matiere";
import { useAddNiveauMutation } from "features/niveau/niveau";
import { useAddSectionMutation } from "features/section/section";
import { useFetchDepartementsQuery } from "features/departement/departement";

const AddSection = () => {
  document.title = " Ajouter Section | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/departement/gestion-classes/liste-section");
  }

  const [createSection] = useAddSectionMutation();
  const { data: departements = [] } = useFetchDepartementsQuery();

  const [formData, setFormData] = useState({
    _id: "",
    name_section_ar: "",
    name_section_fr: "",
    abreviation: "",
    departements: [] as string[],
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

  const onSubmitSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createSection(formData).unwrap();
      notify();
      navigate("/departement/gestion-classes/liste-section");
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
      title: "Section a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation section échoué ${error}`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const value: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      departements: value,
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitSection}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_section_fr">
                        Nom Section (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_section_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_section_fr}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_section_ar">
                        {" "}
                        Nom Section (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_section_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_section_ar}
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
                  <Col lg={5}>
                    <div className="mb-3">
                      <Form.Label htmlFor="departements">
                        Départements
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="departements"
                        id="departements"
                        multiple
                        value={formData.departements}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Sélectionner Départements
                        </option>
                        {departements.map((departement) => (
                          <option key={departement._id} value={departement._id}>
                            {departement.name_fr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3">
                      <Form.Label>Départements Sélectionnés</Form.Label>
                      <div className="d-flex flex-wrap">
                        {formData.departements.map((departementId) => {
                          const departement = departements.find(
                            (d) => d._id === departementId
                          );
                          return departement ? (
                            <Badge
                              key={departement._id}
                              pill
                              bg="secondary"
                              className="me-2 mb-2"
                            >
                              {departement.name_fr}
                            </Badge>
                          ) : null;
                        })}
                      </div>
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

export default AddSection;