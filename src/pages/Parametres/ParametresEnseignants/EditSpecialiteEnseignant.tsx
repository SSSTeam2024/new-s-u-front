import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdatePosteEnseignantMutation } from "features/posteEnseignant/posteEnseignant";
import { useUpdateSpecialiteEnseignantMutation } from "features/specialiteEnseignant/specialiteEnseignant";

const EditSpecialiteEnseignant = () => {
  document.title = " Modifier Spécialité Enseignant | Application Smart Institute";
  const navigate = useNavigate();
  const { state: specialiteEnseignant } = useLocation();
  const [editSpecialiteEnseignant] = useUpdateSpecialiteEnseignantMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value_specialite_enseignant: "",
    specialite_ar: "",
    specialite_fr: "",
  });

  useEffect(() => {
    if (specialiteEnseignant) {
      setFormData({
        _id: specialiteEnseignant._id,
        value_specialite_enseignant: specialiteEnseignant.value_specialite_enseignant,
        specialite_ar: specialiteEnseignant.specialite_ar,
        specialite_fr: specialiteEnseignant.specialite_fr,
      });
    }
  }, [specialiteEnseignant]);

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
  const onSubmitSpécialitéEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editSpecialiteEnseignant(formData).unwrap();
      notify();
      navigate("/parametre/specialite-enseignants");
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
      title: "Spécialité enseignant a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification spécialité enseignant échouée ${error}`,
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
                onSubmit={onSubmitSpécialitéEnseignant}
              >
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />

                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="value_specialite_enseignant">Valeur</Form.Label>
                      <Form.Control
                        type="text"
                        id="value_specialite_enseignant"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.value_specialite_enseignant}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="specialite_fr">
                      Spécialité Enseignant
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="specialite_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.specialite_fr}
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
                      <Form.Label htmlFor="specialite_ar">الإختصاص</Form.Label>
                      <Form.Control
                        type="text"
                        id="specialite_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.specialite_ar}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/parametre/specialite-enseignants");
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

export default EditSpecialiteEnseignant;