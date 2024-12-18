import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import { useUpdateEtatPersonnelMutation } from "features/etatPersonnel/etatPersonnelSlice";
import Swal from "sweetalert2";
import { useUpdatePostePersonnelMutation } from "features/postePersonnel/postePersonnel";
import { useUpdatePosteEnseignantMutation } from "features/posteEnseignant/posteEnseignant";

const EditPosteEnseignant = () => {
  document.title = " Modifier Poste Enseignant | Application Smart Institute";
  const navigate = useNavigate();
  const { state: posteEnseignant } = useLocation();
  const [editPosteEnseignant] = useUpdatePosteEnseignantMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value_poste_enseignant: "",
    poste_ar: "",
    poste_fr: "",
  });

  useEffect(() => {
    if (posteEnseignant) {
      setFormData({
        _id: posteEnseignant._id,
        value_poste_enseignant: posteEnseignant.value_poste_enseignant,
        poste_ar: posteEnseignant.poste_ar,
        poste_fr: posteEnseignant.poste_fr,
      });
    }
  }, [posteEnseignant]);

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
  const onSubmitPosteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editPosteEnseignant(formData).unwrap();
      notify();
      navigate("/parametre/poste-enseignants");
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
      title: "Poste enseignant a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification poste enseignant échouée ${error}`,
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
                onSubmit={onSubmitPosteEnseignant}
              >
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />

                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="value_poste_enseignant">Valeur</Form.Label>
                      <Form.Control
                        type="text"
                        id="value_poste_enseignant"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.value_poste_enseignant}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="poste_fr">
                        Poste Enseignant
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="poste_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.poste_fr}
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
                      <Form.Label htmlFor="poste_ar">الخطة الوظيفية</Form.Label>
                      <Form.Control
                        type="text"
                        id="poste_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.poste_ar}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/parametre/poste-enseignants");
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

export default EditPosteEnseignant;