import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdateGradePersonnelMutation } from "features/gradePersonnel/gradePersonnel";

const EditGradePersonnel = () => {
  document.title = " Modifier Grade Personnel | Application Smart Institute";
  const navigate = useNavigate();
  const { state: gradePersonnel } = useLocation();
  const [editGradePersonnel] = useUpdateGradePersonnelMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value_grade_personnel: "",
    grade_ar: "",
    grade_fr: "",
  });

  useEffect(() => {
    if (gradePersonnel) {
      setFormData({
        _id: gradePersonnel._id,
        value_grade_personnel: gradePersonnel.value_grade_personnel,
        grade_ar: gradePersonnel.grade_ar,
        grade_fr: gradePersonnel.grade_fr,
      });
    }
  }, [gradePersonnel]);

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
  const onSubmitGradePersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editGradePersonnel(formData).unwrap();
      notify();
      navigate("/parametre/grade-personnels");
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
      title: "Grade a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const errorNotification = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Modification grade personnel échouée ${error}`,
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
              <Form className="tablelist-form" onSubmit={onSubmitGradePersonnel}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />

                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="value_grade_personnel">Valeur</Form.Label>
                      <Form.Control
                        type="text"
                        id="value_grade_personnel"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.value_grade_personnel}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="grade_fr">Grade Personnel</Form.Label>
                      <Form.Control
                        type="text"
                        id="grade_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.grade_fr}
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
                      <Form.Label htmlFor="grade_ar">رتبة الإداري</Form.Label>
                      <Form.Control
                        type="text"
                        id="grade_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.grade_ar}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/parametre/grade-personnels");
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

export default EditGradePersonnel;