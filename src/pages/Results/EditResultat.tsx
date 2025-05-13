import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateResultatMutation } from "features/resultats/resultatsSlice";

const EditResultat = () => {
  document.title = "Modifier Résultat | ENIGA";

  const location = useLocation();
  const resultDetails = location.state;
  const navigate = useNavigate();
  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Resultat a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [updateResultat] = useUpdateResultatMutation();
  const { _id, etudiants } = resultDetails;

  const [etudiantsData, setEtudiantsData] = useState(etudiants);
  const [selectedAvis, setSelectedAvis] = useState<string>("");

  const handleSelectAvis = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAvis(value);
  };

  const handleEtudiantChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...etudiantsData];
    updated[index][field] = value;
    setEtudiantsData(updated);
  };

  const handleSubmit = async () => {
    try {
      const updatedEtudiants = etudiantsData.map(
        (etudiant: any, index: number) => ({
          etudiant:
            typeof etudiant.etudiant === "object"
              ? etudiant.etudiant._id
              : etudiant.etudiant,
          moyenne_sem1: etudiant.moyenne_sem1,
          moyenne_sem2: etudiant.moyenne_sem2,
          moyenne_rattrapage: etudiant.moyenne_rattrapage,
          moyenne_generale: etudiant.moyenne_generale,
        })
      );

      await updateResultat({
        _id,
        etudiants: updatedEtudiants,
      });
      notifySuccess();
      navigate("/gestion-des-resultats/liste");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Résultat"
            pageTitle="Gestion des résultats"
          />
          <Card>
            <Card.Body>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                  <Form.Label>Moyenne S1</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Moyenne S2</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Moyenne Controle</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Moyenne Générale</Form.Label>
                </Col>
              </Row>
              {resultDetails.etudiants.map((item: any, index: number) => (
                <Row className="mb-2 d-flex align-items-center">
                  <Col>
                    <Form.Label>{item.etudiant.num_CIN}</Form.Label>
                  </Col>
                  <Col>
                    <Form.Label>
                      {item.etudiant.nom_fr} {item.etudiant.prenom_fr}
                    </Form.Label>
                  </Col>
                  <Col>
                    <input
                      type="text"
                      value={etudiantsData[index].moyenne_sem1}
                      onChange={(e) =>
                        handleEtudiantChange(
                          index,
                          "moyenne_sem1",
                          e.target.value
                        )
                      }
                      className="form-control"
                    />
                  </Col>
                  <Col>
                    <input
                      type="text"
                      value={etudiantsData[index].moyenne_sem2}
                      onChange={(e) =>
                        handleEtudiantChange(
                          index,
                          "moyenne_sem2",
                          e.target.value
                        )
                      }
                      className="form-control"
                    />
                  </Col>
                  <Col>
                    <input
                      type="text"
                      value={etudiantsData[index].moyenne_rattrapage}
                      onChange={(e) =>
                        handleEtudiantChange(
                          index,
                          "moyenne_rattrapage",
                          e.target.value
                        )
                      }
                      className="form-control"
                    />
                  </Col>
                  <Col>
                    <input
                      type="text"
                      value={etudiantsData[index].moyenne_generale}
                      onChange={(e) =>
                        handleEtudiantChange(
                          index,
                          "moyenne_generale",
                          e.target.value
                        )
                      }
                      className="form-control"
                    />
                  </Col>
                </Row>
              ))}
            </Card.Body>
            <Card.Footer className="text-end">
              <Button
                variant="success"
                className="edit-btn"
                onClick={handleSubmit}
              >
                Modifier
              </Button>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditResultat;
