import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdateEtatEnseignantMutation } from "features/etatEnseignant/etatEnseignant";
import { useUpdateEtatEtudiantMutation } from "features/etatEtudiants/etatEtudiants";

const EditEtatEtudiant = () => {
  document.title = " Modifier Etat Compte Etudiant | Application Smart Institute";
  const navigate = useNavigate();
  const { state: etatEtudiant } = useLocation();
  const [editEtatEtudiant] = useUpdateEtatEtudiantMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value_etat_etudiant: "",
    etat_ar: "",
    etat_fr: "",
  });

  useEffect(() => {
    if (etatEtudiant) {
      setFormData({
        _id: etatEtudiant._id,
        value_etat_etudiant: etatEtudiant.value_etat_etudiant,
        etat_ar: etatEtudiant.etat_ar,
        etat_fr: etatEtudiant.etat_fr,
      });
    }
  }, [etatEtudiant]);

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
  const onSubmitEtatEnseignant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editEtatEtudiant(formData).unwrap();
      notify();
      navigate("/parametre/etat-etudiants");
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
      title: "Etat compte a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification état compte enseignant échouée ${error}`,
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
              <Form className="tablelist-form" onSubmit={onSubmitEtatEnseignant}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />

                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="value_etat_etudiant">Valeur</Form.Label>
                      <Form.Control
                        type="text"
                        id="value_etat_etudiant"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.value_etat_etudiant}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="etat_fr">Etat Compte Enseignant</Form.Label>
                      <Form.Control
                        type="text"
                        id="etat_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.etat_fr}
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
                      <Form.Label htmlFor="etat_ar">حالة حساب الأستاذ</Form.Label>
                      <Form.Control
                        type="text"
                        id="etat_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.etat_ar}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/parametre/etat-enseignants");
                      }}
                    >
                      Retour
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Modifier
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

export default EditEtatEtudiant;