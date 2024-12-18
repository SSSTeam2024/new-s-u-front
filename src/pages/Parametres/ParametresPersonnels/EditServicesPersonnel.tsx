import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import { useUpdateEtatPersonnelMutation } from "features/etatPersonnel/etatPersonnelSlice";
import Swal from "sweetalert2";
import { useUpdateServicePersonnelMutation } from "features/servicePersonnel/servicePersonnel";

const EditServicesPersonnel = () => {
  document.title = " Modifier Service Personnel | Application Smart Institute";
  const navigate = useNavigate();
  const { state: servicePersonnel } = useLocation();
  const [editServicePersonnel] = useUpdateServicePersonnelMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value: "",
    service_ar: "",
    service_fr: "",
  });

  useEffect(() => {
    if (servicePersonnel) {
      setFormData({
        _id: servicePersonnel._id,
        value: servicePersonnel.value,
        service_ar: servicePersonnel.service_ar,
        service_fr: servicePersonnel.service_fr,
      });
    }
  }, [servicePersonnel]);

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
  const onSubmitServicePersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editServicePersonnel(formData).unwrap();
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
      title: "Service personnel a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification service personnel échouée ${error}`,
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
              <Form className="tablelist-form" onSubmit={onSubmitServicePersonnel}>
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
                      <Form.Label htmlFor="service_fr">Service Personnel</Form.Label>
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
                        navigate("/parametre/service-personnels");
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

export default EditServicesPersonnel;