import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BreadCrumb from "Common/BreadCrumb";
import { useUpdateSocieteMutation } from "features/societe/societeSlice";

const EditSociete = () => {
  document.title = "Modifier Partenaire | ENIGA";

  const navigate = useNavigate();
  const location = useLocation();
  const societeDetails = location.state;

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Partenaire a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: unknown) => {
    const message =
      err instanceof Error ? err.message : "Une erreur est survenue.";
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Quelque chose s'est mal passé : ${message}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  //! Mutations
  const [updateSociete] = useUpdateSocieteMutation();

  const [formData, setFormData] = useState({
    nom: societeDetails.nom || "",
    matricule: societeDetails.matricule! || "",
    adresse: societeDetails.adresse || "",
    responsable: societeDetails.responsable || "",
    siteweb: societeDetails.siteweb || "",
    phone: societeDetails.phone || "",
    encadrant: societeDetails.encadrant || [],
  });

  const handleEncadrantChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.encadrant];
      updated[index] = value;
      return { ...prev, encadrant: updated };
    });
  };

  const removeEncadrant = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.encadrant];
      updated.splice(index, 1);
      return { ...prev, encadrant: updated };
    });
  };

  const handleChange =
    (key: keyof typeof formData) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updateData = {
        _id: societeDetails._id,
        nom: formData.nom,
        matricule: formData.matricule,
        adresse: formData.adresse,
        responsable: formData.responsable,
        siteweb: formData.siteweb,
        phone: formData.phone,
        encadrant: formData.encadrant,
      };
      await updateSociete(updateData);
      notifySuccess();
      navigate("/gestion-des-stages/liste-partenaires");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={1}>
              <Button
                onClick={() => navigate(-1)}
                className="btn-soft-info btn-sm mb-1"
              >
                <i className="ri-arrow-go-back-line"></i>
              </Button>
            </Col>
            <Col>
              <BreadCrumb
                title="Modifier Partenaire"
                pageTitle="Gestion des stages"
              />
            </Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Card>
              <Card.Body>
                <Row className="mb-3 d-flex align-items-center">
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Nom</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange("nom")}
                      className="text-center"
                    />
                  </Col>
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Matricule</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      id="matricule"
                      name="matricule"
                      value={formData.matricule}
                      onChange={handleChange("matricule")}
                      className="text-center"
                    />
                  </Col>
                  <Col lg={1}></Col>
                </Row>
                <Row className="mb-3 d-flex align-items-center">
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Responsable</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      id="responsable"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleChange("responsable")}
                      className="text-center"
                    />
                  </Col>
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Encadrant(s)</span>
                  </Col>
                  <Col>
                    {formData.encadrant.map((enc: any, index: number) => (
                      <div
                        key={index}
                        className="mb-2 d-flex align-items-center"
                      >
                        <input
                          type="text"
                          value={enc}
                          onChange={(e) =>
                            handleEncadrantChange(index, e.target.value)
                          }
                          className="form-control me-2"
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeEncadrant(index)}
                        >
                          <i className="ph ph-trash"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          encadrant: [...prev.encadrant, ""],
                        }))
                      }
                    >
                      Ajouter Encadrant
                    </button>
                  </Col>
                  <Col lg={1}></Col>
                </Row>
                <Row className="mb-3 d-flex align-items-center">
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">N° Tél</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      className="text-center"
                    />
                  </Col>
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Siteweb</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      id="siteweb"
                      name="siteweb"
                      value={formData.siteweb}
                      onChange={handleChange("siteweb")}
                      className="text-center"
                    />
                  </Col>
                  <Col lg={1}></Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Adresse</span>
                  </Col>
                  <Col>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.adresse}
                      onChange={handleChange("adresse")}
                      name="adresse"
                      id="adresse"
                    />
                  </Col>
                  <Col lg={1}></Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="hstack gap-2 justify-content-end">
                  <Button variant="success" id="edit-btn" type="submit">
                    Modifier
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditSociete;
