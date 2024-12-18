import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdatePostePersonnelMutation } from "features/postePersonnel/postePersonnel";

const EditPostePersonnel = () => {
  document.title = " Modifier Poste Personnel | Application Smart Institute";
  const navigate = useNavigate();
  const { state: postePersonnel } = useLocation();
  const [editPostePersonnel] = useUpdatePostePersonnelMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value: "",
    poste_ar: "",
    poste_fr: "",
  });

  useEffect(() => {
    if (postePersonnel) {
      setFormData({
        _id: postePersonnel._id,
        value: postePersonnel.value,
        poste_ar: postePersonnel.poste_ar,
        poste_fr: postePersonnel.poste_fr,
      });
    }
  }, [postePersonnel]);

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
  const onSubmitPostePersonnel = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editPostePersonnel(formData).unwrap();
      notify();
      navigate("/parametre/poste-personnels");
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
      title: "Poste personnel a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification poste personnel échouée ${error}`,
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
                onSubmit={onSubmitPostePersonnel}
              >
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
                      <Form.Label htmlFor="poste_fr">
                        Poste Personnel
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
                        navigate("/parametre/poste-personnels");
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

export default EditPostePersonnel;