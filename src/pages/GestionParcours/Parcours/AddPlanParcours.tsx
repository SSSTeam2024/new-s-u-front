import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAddModuleParcoursMutation } from "features/moduleParcours/moduleParcours";
import "./AddPlanParcours.css";

export interface ModuleParcours {
  _id: string;
  semestre: string;
  code_Ue: string;
  libelle: string;
  credit: string;
  coef: string;
  nature: string;
  regime: string;
  parcours: any;
}

const AddPlanParcours = () => {
  document.title = "Ajouter plan de parcours | Application Smart Institute";
  const navigate = useNavigate();
  const location = useLocation();
  const parcoursetails = location.state;

  console.log("parcoursetails", parcoursetails);

  function tog_retourParametres() {
    navigate("/parcours/gestion-parcours/liste-parcours");
  }

  const [createModule] = useAddModuleParcoursMutation();

  const [formData, setFormData] = useState({
    _id: "",
    semestre: "",
    code_Ue: "",
    libelle: "",
    credit: "",
    coef: "",
    nature: "",
    regime: "",
    parcours: parcoursetails?._id || "",
  });

  const [modules, setModules] = useState<ModuleParcours[]>([
    {
      _id: "",
      semestre: "",
      code_Ue: "",
      libelle: "",
      credit: "",
      coef: "",
      nature: "",
      regime: "",
      parcours: parcoursetails?._id || "",
    },
  ]);

  const addModuleLine = () => {
    setModules([
      ...modules,
      {
        _id: "",
        semestre: "",
        code_Ue: "",
        libelle: "",
        credit: "",
        coef: "",
        nature: "",
        regime: "",
        parcours: "",
      },
    ]);
  };

  const removeModuleLine = (index: number) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  const handleModuleChange = (index: number, field: string, value: string) => {
    const updatedModules: any = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  // const onSubmitModules = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     await createModule(formData).unwrap();
  //     notify();
  //     navigate("/parcours/gestion-parcours/liste-parcours");
  //   } catch (error: any) {
  //     console.log(error);
  //   }
  // };

  const onSubmitModules = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      for (const module of modules) {
        await createModule(module).unwrap();
      }
      notify();
      navigate("/parcours/gestion-parcours/liste-parcours");
    } catch (error: any) {
      console.error(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Module Parcours a été crée avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const handleSemestreChange = (e: any) => {
    setFormData({ ...formData, semestre: e.target.value });
    setModules([]); // Reset modules when semestre changes
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitModules}>
                <Row>
                  <Col lg={3}>
                    <div className="mb-3">
                      <h5>Semestre</h5>
                      <Form.Select
                        id="semestre"
                        value={formData.semestre}
                        onChange={handleSemestreChange}
                        className="form-select-lg form-select-info"
                      >
                        <option value="">Selectionner semestre</option>
                        <option value="1">Semestre 1</option>
                        <option value="2">Semestre 2</option>
                        <option value="3">Semestre 3</option>
                        <option value="4">Semestre 4</option>
                        <option value="5">Semestre 5</option>
                        <option value="6">Semestre 6</option>
                        <option value="7">Semestre 7</option>
                        <option value="8">Semestre 8</option>
                        <option value="9">Semestre 9</option>
                        <option value="10">Semestre 10</option>
                        <option value="11">Semestre 11</option>
                        <option value="12">Semestre 12</option>
                      </Form.Select>
                    </div>
                  </Col>
                </Row>

                {/* Dynamic Modules */}
                <Row>
                  <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Modules</h5>
                      <Button variant="info" onClick={addModuleLine}>
                        + Ajouter Module
                      </Button>
                    </div>
                    {modules.map((module, index) => (
                      <div key={index} className="module-card">
                        <h6>Module {index + 1}</h6>
                        <Row className="align-items-center gy-2">
                          <Col xs={2}>
                            <Form.Control
                              type="text"
                              placeholder="Code UE"
                              value={module.code_Ue}
                              onChange={(e) =>
                                handleModuleChange(
                                  index,
                                  "code_Ue",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xs={3}>
                            <Form.Control
                              type="text"
                              placeholder="Libelle"
                              value={module.libelle}
                              onChange={(e) =>
                                handleModuleChange(
                                  index,
                                  "libelle",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xs={1}>
                            <Form.Control
                              type="number"
                              placeholder="Credit"
                              value={module.credit}
                              onChange={(e) =>
                                handleModuleChange(
                                  index,
                                  "credit",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xs={1}>
                            <Form.Control
                              type="text"
                              placeholder="Coef"
                              value={module.coef}
                              onChange={(e) =>
                                handleModuleChange(
                                  index,
                                  "coef",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xs={2}>
                            <Form.Group controlId={`nature-select-${index}`}>
                              {/* <Form.Label className="mb-1">Nature</Form.Label> */}
                              <Form.Select
                                value={module.nature}
                                placeholder="Nature"
                                onChange={(e) =>
                                  handleModuleChange(
                                    index,
                                    "nature",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Selectionner Nature</option>
                                <option value="Fundamentale">
                                  Fondamentale
                                </option>
                                <option value="Transversale">
                                  Transversale
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col xs={2}>
                            <Form.Group controlId={`regime-select-${index}`}>
                              {/* <Form.Label className="mb-1">Regime</Form.Label> */}
                              <Form.Select
                                value={module.regime}
                                placeholder="Regime"
                                onChange={(e) =>
                                  handleModuleChange(
                                    index,
                                    "regime",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Selectionner Regime</option>
                                <option value="MX">MX</option>
                                <option value="CC">CC</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col
                            xs={1}
                            className="d-flex justify-content-start align-items-center"
                          >
                            <i
                              className="ph ph-x"
                              onClick={() => removeModuleLine(index)}
                              style={{
                                fontSize: "24px",
                                color: "red",
                                cursor: "pointer",
                              }}
                            ></i>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Col>
                </Row>

                <div className="modal-footer m-12 sticky-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={tog_retourParametres}
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

export default AddPlanParcours;
