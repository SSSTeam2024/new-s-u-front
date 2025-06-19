import React, { useState, ChangeEvent } from "react";
import { Card, Col, Container, Form, Button, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useFetchNiveauxQuery } from "features/niveau/niveau";

const EditTypeStage = () => {
  document.title = "Modifier Type Stage | ENIGA";

  const { data: allNiveaux = [] } = useFetchNiveauxQuery();

  const location = useLocation();
  const detailsTypeStage = location.state;

  const [typeData, setTypeData] = useState({
    dateDebut: detailsTypeStage.date_debut || "",
    dateFin: detailsTypeStage.date_fin || "",
    dureeMin: detailsTypeStage.duree_min || "",
    nomFr: detailsTypeStage.nom_fr || "",
    nomAr: detailsTypeStage.nom_ar || "",
    choix: detailsTypeStage.choix || "",
    niveau: detailsTypeStage.niveau._id || "",
    maxEtudiant: detailsTypeStage.max_etudiant || "",
    avecEncadrant: detailsTypeStage.avec_encadrement || "",
    avecSoutenance: detailsTypeStage.avec_soutenance || "",
    avecCommission: detailsTypeStage.avec_commission || "",
    avecValidation: detailsTypeStage.avec_validation_soutenance || "",
    lieu: detailsTypeStage.localite || "",
    files: detailsTypeStage.files || [],
  });

  const toggleChoix = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeData((prev) => ({
      ...prev,
      choix: prev.choix === "Optionnel" ? "Obligatoire" : "Optionnel",
    }));
  };

  const toggleAvisCommission = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeData((prev) => ({
      ...prev,
      avecCommission: prev.avecCommission === "Non" ? "Oui" : "Non",
    }));
  };

  const toggleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeData((prev) => ({
      ...prev,
      avecValidation: prev.avecValidation === "Non" ? "Oui" : "Non",
    }));
  };

  const toggleEncadrement = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeData((prev) => ({
      ...prev,
      avecEncadrant: prev.avecEncadrant === "Non" ? "Oui" : "Non",
    }));
  };

  const toggleSoutenance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeData((prev) => ({
      ...prev,
      avecSoutenance: prev.avecSoutenance === "Non" ? "Oui" : "Non",
    }));
  };

  const handleChange =
    (key: keyof typeof typeData) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setTypeData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const [defaultCounter, setdefaultCounter] = useState(1);

  function countUP(id: any, prev_data_attr: any) {
    id(prev_data_attr + 1);
  }

  function countDown(id: any, prev_data_attr: any) {
    id(prev_data_attr - 1);
  }

  const [rows, setRows] = useState([
    { id: Date.now(), nom_file_fr: "", nom_file_ar: "", type: "" },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), nom_file_fr: "", nom_file_ar: "", type: "" },
    ]);
  };

  const handleDeleteRow = (id: any) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id: number, field: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Type Stage"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Card.Body>
              <Row className="mb-3 border-bottom border-primary">
                <Col lg={1} className="text-end">
                  <span className="fs-20 text-primary">
                    <i className="ph ph-identification-card"></i>
                  </span>
                </Col>
                <Col>
                  <span className="fs-18 text-primary">Identification</span>
                </Col>
              </Row>
              <Row className="d-flex align-items-center">
                <Col lg={2}>
                  <span className="fs-16 fw-medium">Intitulé</span>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={typeData.nomFr}
                    onChange={handleChange("nomFr")}
                    className="text-center"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={typeData.nomAr}
                    onChange={handleChange("nomAr")}
                    className="text-center"
                  />
                </Col>
                <Col lg={2}>
                  <span className="fs-16 fw-medium">عنوان</span>
                </Col>
              </Row>
            </Card.Body>
            <Card.Body>
              <Row className="mb-3 border-bottom border-secondary">
                <Col lg={1} className="text-end">
                  <span className="fs-20 text-secondary">
                    <i className="ph ph-gear"></i>
                  </span>
                </Col>
                <Col>
                  <span className="fs-18 text-secondary">Configuration</span>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col lg={2}>
                  <Form.Label>Niveau</Form.Label>
                </Col>
                <Col lg={3}>
                  <select
                    className="form-select"
                    onChange={handleChange("niveau")}
                    value={typeData.niveau}
                  >
                    <option value="">Choisir ...</option>
                    {allNiveaux.map((niveau) => (
                      <option value={niveau?._id!} key={niveau?._id!}>
                        {niveau?.name_niveau_fr}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={2} className="text-end">
                  <Form.Label>Groupes</Form.Label>
                </Col>
                <Col lg={3}>
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    // options={optionColumnsTable}
                    // onChange={handleSelectValueColumnChange}
                    placeholder="Choisir..."
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Col lg={2}>
                  <Form.Label>Max Candidat</Form.Label>
                </Col>
                <Col lg={3}>
                  <div>
                    <div className="input-step">
                      <Button
                        className="minus"
                        onClick={() => {
                          countDown(setdefaultCounter, defaultCounter);
                        }}
                      >
                        –
                      </Button>
                      <Form.Control
                        type="number"
                        className="product-quantity"
                        value={defaultCounter}
                        min="0"
                        max="100"
                        readOnly
                      />
                      <Button
                        type="button"
                        className="plus"
                        onClick={() => {
                          countUP(setdefaultCounter, defaultCounter);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4 d-flex align-items-center">
                <Col lg={2}>
                  <Form.Label>Localité</Form.Label>
                </Col>
                <Col lg={3}>
                  <select
                    className="form-select"
                    onChange={handleChange("lieu")}
                    value={typeData.lieu}
                  >
                    <option value="">Choisir ...</option>
                    <option value="Externe">Externe</option>
                    <option value="Interne">Interne</option>
                    <option value="Externe/Interne">Externe/Interne</option>
                  </select>
                </Col>
                <Col lg={1} className="text-end">
                  <Form.Label>Durée</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="dureeMin"
                    id="dureeMin"
                    onChange={handleChange("dureeMin")}
                    value={typeData.dureeMin}
                    // isInvalid={!!errors.duree_min}
                  />
                  {/* {errors.duree_min && (
                    <Form.Control.Feedback type="invalid">
                      {errors.duree_min}
                    </Form.Control.Feedback>
                  )} */}
                </Col>
                <Col className="text-end">
                  <Form.Label>Date Début</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="dateDebut"
                    id="dateDebut"
                    onChange={handleChange("dateDebut")}
                    value={typeData.dateDebut}
                    // isInvalid={!!errors.date_debut}
                  />
                  {/* {errors.date_debut && (
                    <Form.Control.Feedback type="invalid">
                      {errors.date_debut}
                    </Form.Control.Feedback>
                  )} */}
                </Col>
                <Col lg={1} className="text-end">
                  <Form.Label>Date Fin</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="dateFin"
                    id="dateFin"
                    onChange={handleChange("dateFin")}
                    value={typeData.dateFin}
                    // isInvalid={!!errors.date_fin}
                  />
                  {/* {errors.date_fin && (
                    <Form.Control.Feedback type="invalid">
                      {errors.date_fin}
                    </Form.Control.Feedback>
                  )} */}
                </Col>
              </Row>
              <Row className="mb-4 d-flex align-items-center">
                <Col lg={2}>
                  <Form.Label>Type</Form.Label>
                </Col>
                <Col>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="choix"
                      checked={typeData.choix === "Obligatoire"}
                      onChange={toggleChoix}
                    />
                    <label
                      className="form-check-label fs-15 fw-medium"
                      htmlFor="choix"
                    >
                      {typeData.choix === "Obligatoire"
                        ? "Obligatoire"
                        : "Optionnel"}
                    </label>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4 d-flex align-items-center">
                <Col lg={2}>
                  <Form.Label>Avis de Commission de validation</Form.Label>
                </Col>
                <Col lg={2}>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="avecCommission"
                      checked={typeData.avecCommission === "Oui"}
                      onChange={toggleAvisCommission}
                    />
                    <label
                      className="form-check-label fs-15 fw-medium"
                      htmlFor="avecCommission"
                    >
                      {typeData.avecCommission === "Oui" ? "Oui" : "Non"}
                    </label>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4 d-flex align-items-center">
                <Col lg={2}>
                  <Form.Label>Autorisation de Soutenance</Form.Label>
                </Col>
                <Col lg={2}>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="avecValidation"
                      checked={typeData.avecValidation === "Oui"}
                      onChange={toggleValidation}
                    />
                    <label
                      className="form-check-label fs-15 fw-medium"
                      htmlFor="avecValidation"
                    >
                      {typeData.avecValidation === "Oui" ? "Oui" : "Non"}
                    </label>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4 d-flex align-items-center">
                <Col lg={2}>
                  <Form.Label>Encadrement</Form.Label>
                </Col>
                <Col lg={2}>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="avecEncadrant"
                      checked={typeData.avecEncadrant === "Oui"}
                      onChange={toggleEncadrement}
                    />
                    <label
                      className="form-check-label fs-15 fw-medium"
                      htmlFor="avecEncadrant"
                    >
                      {typeData.avecEncadrant === "Non" ? "Non" : "Oui"}
                    </label>
                  </div>
                </Col>
                {typeData.avecEncadrant === "Oui" && (
                  <>
                    <Col className="text-end" lg={1}>
                      <Form.Label>Encadrants</Form.Label>
                    </Col>
                    <Col lg={3}>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        // options={encadrantOptions}
                        // onChange={handleSelectEncadrementChange}
                        placeholder="Choisir..."
                      />
                    </Col>
                  </>
                )}
              </Row>
              <Row className="mb-4 d-flex align-items-center">
                <Col lg={2}>
                  <Form.Label>Soutenance</Form.Label>
                </Col>
                <Col lg={2}>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="avecSoutenance"
                      checked={typeData.avecSoutenance === "Oui"}
                      onChange={toggleSoutenance}
                    />
                    <label
                      className="form-check-label fs-15 fw-medium"
                      htmlFor="avecSoutenance"
                    >
                      {typeData.avecSoutenance === "Non" ? "Non" : "Oui"}
                    </label>
                  </div>
                </Col>
                {typeData.avecSoutenance === "Oui" && (
                  <>
                    <Col className="text-end" lg={1}>
                      Jury
                    </Col>
                    <Col lg={3}>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        // options={soutenanceOptions}
                        // onChange={handleSelectSoutenanceChange}
                        placeholder="Choisir..."
                      />
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
            <Card.Body>
              <Row className="mb-3 border-bottom border-info">
                <Col lg={1} className="text-end">
                  <span className="fs-20 text-info">
                    <i className="ph ph-package"></i>
                  </span>
                </Col>
                <Col>
                  <span className="fs-18 text-info">Livrable</span>
                </Col>
              </Row>
              {typeData.files.map((row: any, index: any) => (
                <Row className="mb-3" key={row.id}>
                  <Col>
                    <Form.Control
                      type="text"
                      name={`nom_file_fr_${row.id}`}
                      className="w-75 grey-placeholder"
                      placeholder="Attestation de stage"
                      value={row.nom_file_fr}
                      onChange={(e) =>
                        handleRowChange(row.id, "nom_file_fr", e.target.value)
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name={`nom_file_ar_${row.id}`}
                      className="w-75 grey-placeholder"
                      placeholder="شهادة تدريب"
                      value={row.nom_file_ar}
                      onChange={(e) =>
                        handleRowChange(row.id, "nom_file_ar", e.target.value)
                      }
                    />
                  </Col>
                  <Col>
                    <select
                      className="form-select"
                      value={row.type}
                      onChange={(e) =>
                        handleRowChange(row.id, "type", e.target.value)
                      }
                    >
                      <option value="">Type</option>
                      <option value="Documents">
                        Documents (Word, Pdf, etc)
                      </option>
                      <option value="Présentations">
                        Présentations (Powerpoint)
                      </option>
                      <option value="Archives">Archives</option>
                      <option value="Attestations">Attestations</option>
                    </select>
                  </Col>
                  <Col>
                    {/* Trash Button: visible if more than one row */}
                    {rows.length > 1 && (
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteRow(row.id)}
                        className="me-2"
                      >
                        <i className="ph ph-trash"></i>
                      </Button>
                    )}
                    {/* Add Button: visible only in the last row */}
                    {index === rows.length - 1 && (
                      <Button
                        type="button"
                        variant="success"
                        onClick={handleAddRow}
                      >
                        <i className="ph ph-plus"></i>
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
            </Card.Body>
            <Card.Footer className="border-0">
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button type="submit" variant="success" id="addNew">
                    Modifier
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditTypeStage;
