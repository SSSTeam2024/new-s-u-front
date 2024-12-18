import React, {useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import {useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useAddCategoriePersonnelMutation } from "features/categoriePersonnel/categoriePersonnel";

const AddCategoriePersonnel = () => {
  document.title = " Ajouter Catégorie Personnel | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/parametre/categorie-personnels");
  }

  const [createCategoriePersonnel] = useAddCategoriePersonnelMutation();

  const [formData, setFormData] = useState({
    _id: "",
    value: "",
    categorie_ar: "",
    categorie_fr: "",
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

  const onSubmitCategoriePersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCategoriePersonnel(formData).unwrap();
      notify();
      navigate("/parametre/categorie-personnels");
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
      title: "Catégorie a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation Catégorie personnel échoué ${error}`,
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
              <Form className="tablelist-form" onSubmit={onSubmitCategoriePersonnel}>
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
                      <Form.Label htmlFor="categorie_fr">Catégorie Personnel</Form.Label>
                      <Form.Control
                        type="text"
                        id="categorie_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.categorie_fr}
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
                      <Form.Label htmlFor="categorie_ar">صنف الإداري</Form.Label>
                      <Form.Control
                        type="text"
                        id="categorie_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.categorie_ar}
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

export default AddCategoriePersonnel;