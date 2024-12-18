import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useAddPostePersonnelMutation } from "features/postePersonnel/postePersonnel";
import { useAddServicePersonnelMutation } from "features/servicePersonnel/servicePersonnel";

const AddServicesPersonnel = () => {
  document.title = " Ajouter Service Personnel | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/parametre/service-personnels");
  }

  const [createServicePersonnel] = useAddServicePersonnelMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value: "",
    service_ar: "",
    service_fr: "",
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

  const onSubmitServicePersonnel = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await createServicePersonnel(formData).unwrap();
      notify();
      navigate("/parametre/service-personnels");
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
      title: "Service personnel a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation service personnel échoué ${error}`,
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
                onSubmit={onSubmitServicePersonnel}
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
                      <Form.Label htmlFor="service_fr">
                        Service Personnel
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="service_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.service_fr}
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
                      <Form.Label htmlFor="service_ar">إدارة شؤون الموظفين</Form.Label>
                      <Form.Control
                        type="text"
                        id="service_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.service_ar}
                      />
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

export default AddServicesPersonnel;