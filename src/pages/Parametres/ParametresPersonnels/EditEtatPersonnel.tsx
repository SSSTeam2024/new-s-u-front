import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import { useUpdateEtatPersonnelMutation } from "features/etatPersonnel/etatPersonnelSlice";
import Swal from "sweetalert2";

const EditEtatPersonnel = () => {
  document.title = " Modifier Etat Compte Personnel | Application Smart Institute";
  const navigate = useNavigate();
  const { state: etatPersonnel } = useLocation();
  const [editEtatPersonnel] = useUpdateEtatPersonnelMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value: "",
    etat_ar: "",
    etat_fr: "",
  });

  useEffect(() => {
    if (etatPersonnel) {
      setFormData({
        _id: etatPersonnel._id,
        value: etatPersonnel.value,
        etat_ar: etatPersonnel.etat_ar,
        etat_fr: etatPersonnel.etat_fr,
      });
    }
  }, [etatPersonnel]);

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
  const onSubmitEtatPersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editEtatPersonnel(formData).unwrap();
      notify();
      navigate("/parametre/etat-personnels");
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
      title: `Modification état compte personnel échouée ${error}`,
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
              <Form className="tablelist-form" onSubmit={onSubmitEtatPersonnel}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />

                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="value">Valeur</Form.Label>
                      <Form.Control
                        type="text"
                        id="value"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.value}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="etat_fr">Etat Compte Personnel</Form.Label>
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
                      <Form.Label htmlFor="etat_ar">حالة حساب الإداري</Form.Label>
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
                        navigate("/parametre/etat-personnels");
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

export default EditEtatPersonnel;