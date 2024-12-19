import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAddPapierAdministratifMutation } from "features/papierAdministratif/papierAdministratif";

export interface PapierAdministratif {
  _id?: string;
  nom_ar: string;
  nom_fr: string;
  category: string[];
}

const AddPapierAdministratif: React.FC = () => {
  document.title = "Ajouter Papier Administratif | Application Smart Institute";
  const navigate = useNavigate();

  const [createPapierAdministratif, { isLoading }] = useAddPapierAdministratifMutation();

  const [formData, setFormData] = useState<PapierAdministratif>({
    nom_ar: "",
    nom_fr: "",
    category: [],
  });

  const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      const updatedCategories = checked
        ? [...prevFormData.category, value]
        : prevFormData.category.filter((category) => category !== value);

      return {
        ...prevFormData,
        category: updatedCategories,
      };
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  const onSubmitEtatEtudiant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createPapierAdministratif(formData).unwrap();
      notify();
      navigate("/listePapierAdministratif");
    } catch (error: any) {
      errorAlert(error.message || "An error occurred.");
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Papier administratif ajouté avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <div className="page-content bg-light min-vh-100 d-flex align-items-center">
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow border-0 rounded-lg">
              <Card.Header className="bg-primary text-white text-center">
                <h4 className="mb-0">Ajouter un Papier Administratif</h4>
              </Card.Header>
              <Card.Body className="p-5">
                <Form onSubmit={onSubmitEtatEtudiant}>
                  {/* Nom Fichier */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Nom Fichier (Arabe)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Entrez le nom en arabe"
                          name="nom_ar"
                          value={formData.nom_ar}
                          onChange={onChange}
                          required
                          className="shadow-sm border-light transition-all"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Nom Fichier (Français)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Entrez le nom en français"
                          name="nom_fr"
                          value={formData.nom_fr}
                          onChange={onChange}
                          required
                          className="shadow-sm border-light transition-all"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Category Selection */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Sélectionnez une ou plusieurs catégories</Form.Label>
                    <Row>
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          label="Personnel"
                          value="personnel"
                          checked={formData.category.includes("personnel")}
                          onChange={onCategoryChange}
                          className="mb-2"
                          style={{ cursor: "pointer" }}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          label="Enseignant"
                          value="enseignant"
                          checked={formData.category.includes("enseignant")}
                          onChange={onCategoryChange}
                          className="mb-2"
                          style={{ cursor: "pointer" }}
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  {/* Buttons */}
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="outline-danger"
                      className="rounded-pill px-4 py-2 transition-all"
                      onClick={() => navigate("/listePapierAdministratif")}
                    >
                      Retour
                    </Button>
                    <Button
                      variant="success"
                      className="rounded-pill px-4 py-2 transition-all"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Ajouter"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddPapierAdministratif;