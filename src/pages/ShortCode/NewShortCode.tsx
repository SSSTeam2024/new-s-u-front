import { useAddNewShortCodeMutation } from "features/shortCode/shortCodeSlice";
import { useAddNewTemplateBodyMutation } from "features/templateBody/templateBodySlice";
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NewShortCode = () => {
  document.title = "Ajouter Code Court | Smart Institute";
const [newShortCode] = useAddNewShortCodeMutation()

const navigate = useNavigate()
const initialShortCode = {
  _id:"",
    titre: "", 
    body: "", 
    langue:"",
    intended_for:""
}

const [shortCode, setShortCode] = useState(initialShortCode)
const {titre,
    body
} = shortCode

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShortCode((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newShortCode(shortCode).then(() => setShortCode(initialShortCode));
    notify();
    navigate("/shortCode/liste-short-code");
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Short Code has been created successfully",
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
              <Card>
                <Card.Body>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-lines-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">Nouveau Code Court</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form onSubmit={onSubmit}>
                      <Row>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="titre">
                                <h4 className="card-title mb-0">Titre</h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="titre"
                                name="titre"
                                placeholder="Entrer titre"
                               value={shortCode.titre}
                               onChange={onChange}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} className="mb-3">
                          <Form.Label
                              htmlFor="body"
                              className="form-label"
                            >
                              <h4 className="card-title mb-0">Corps</h4>
                            </Form.Label>
                            <textarea
                                id="body"
                                name="body"
                            rows={3}
                            value={shortCode.body}
                               onChange={onChange}
                               className="form-control"
                            />
                          </Col>
                        </Row>
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Ajouter Code
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewShortCode;
