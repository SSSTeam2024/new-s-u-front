import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  TypeStageModel,
  useAddTypeStageMutation,
} from "features/typeStage/typeStageSlice";
import BreadCrumb from "Common/BreadCrumb";
import { useFetchNiveauxQuery } from "features/niveau/niveau";
import { useNavigate } from "react-router-dom";
import { useFetchClassesByNiveauIdMutation } from "features/classe/classe";
import Select from "react-select";
import "./placeholder.css";

const AjouterTypeStage = () => {
  const { data: allNiveaux = [] } = useFetchNiveauxQuery();

  const [createNewType] = useAddTypeStageMutation();
  const [getClassesByNiveauId] = useFetchClassesByNiveauIdMutation();

  const navigate = useNavigate();

  const [selectedChoix, setSelectedChoix] = useState<string>("Optionnel");
  const [selectedEncadrement, setSelectedEncadrement] = useState<string>("Non");
  const [selectedSoutenance, setSelectedSoutenance] = useState<string>("Non");
  const [selectedCommission, setSelectedCommission] = useState<string>("Non");
  const [selectedValidation, setSelectedValidation] = useState<string>("Non");
  const [selectedLocalite, setSelectedLocalite] = useState<string>("");
  const [selectedNiveau, setSelectedNiveau] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);
  const [optionColumnsTable, setOptionColumnsTable] = useState<any>(null);
  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);
  const [selectedColumnEncadrement, setSelectedColumnEncadrement] = useState<
    any[]
  >([]);
  const [selectedColumnSoutenance, setSelectedColumnSoutenance] = useState<
    any[]
  >([]);
  const [selectedMaxEtudiant, setSelectedMaxEtudiant] = useState<string>("");
  const [errors, setErrors] = useState<{
    duree_min?: string;
    date_debut?: string;
    date_fin?: string;
  }>({});

  const toggleChoix = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChoix(e.target.checked ? "Obligatoire" : "Optionnel");
  };

  const handleSelectedLocalite = (e: any) => {
    setSelectedLocalite(e.target.value);
  };

  const toggleEncadrement = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEncadrement(e.target.checked ? "Oui" : "Non");
  };

  const toggleSoutenance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSoutenance(e.target.checked ? "Oui" : "Non");
  };

  const toggleCommision = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCommission(e.target.checked ? "Oui" : "Non");
  };

  const toggleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValidation(e.target.checked ? "Oui" : "Non");
  };

  const handleSelectedNiveau = (e: any) => {
    setSelectedNiveau(e.target.value);
  };

  const handleSelectedMaxEtudiant = (e: any) => {
    setSelectedMaxEtudiant(e.target.value);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedNiveau) {
        try {
          const classesData = await getClassesByNiveauId({
            niveauId: selectedNiveau,
          }).unwrap();

          let classOptions = classesData.map((classe: any) => ({
            value: classe?._id!,
            label: classe?.nom_classe_fr!,
          }));

          setOptionColumnsTable(classOptions);
        } catch (error) {
          console.error("Failed to fetch classes:", error);
        }
      }
    };

    fetchClasses();
  }, [selectedNiveau]);

  let encadrantOptions = [
    {
      value: "Encadrant Universitaire 1",
      label: "Encadrant Universitaire 1",
    },
    {
      value: "Encadrant Universitaire 2",
      label: "Encadrant Universitaire 2",
    },
    {
      value: "Encadrant Industriel 1",
      label: "Encadrant Industriel 1",
    },
    {
      value: "Encadrant Industriel 2",
      label: "Encadrant Industriel 2",
    },
  ];

  let soutenanceOptions = [
    {
      value: "Présentant de Jury",
      label: "Présentant de Jury",
    },
    {
      value: "Rapporteur 1",
      label: "Rapporteur 1",
    },
    {
      value: "Rapporteur 2",
      label: "Rapporteur 2",
    },
    {
      value: "Eximinateur 1",
      label: "Eximinateur 1",
    },
    {
      value: "Eximinateur 2",
      label: "Eximinateur 2",
    },
    {
      value: "Invité 1",
      label: "Invité 1",
    },
    {
      value: "Invité 2",
      label: "Invité 2",
    },
  ];

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

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const handleSelectEncadrementChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnEncadrement(values);
  };

  const handleSelectSoutenanceChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnSoutenance(values);
  };

  const isValidDateFormat = (value: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})$/;
    const match = value.match(regex);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);

    return day >= 1 && day <= 31 && month >= 1 && month <= 12;
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Type Stage a été créée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const initialTypeStage: TypeStageModel = {
    nom_fr: "",
    nom_ar: "",
    choix: "",
    niveau: "",
    max_etudiant: "1",
    duree_min: "",
    date_debut: "",
    date_fin: "",
    avec_encadrement: "",
    avec_soutenance: "",
    avec_commission: "",
    avec_validation_soutenance: "",
    localite: "",
    classes: [""],
    encadrement: [""],
    soutenance: [""],
    files: [],
  };

  const [typeStage, setTypeStage] = useState(initialTypeStage);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTypeStage((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    if (id === "duree_min" && value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        duree_min: undefined,
      }));
    }
    if (id === "date_debut" && value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date_debut: isValidDateFormat(value)
          ? undefined
          : prevErrors.date_debut,
      }));
    }

    if (id === "date_fin" && value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date_fin: isValidDateFormat(value) ? undefined : prevErrors.date_fin,
      }));
    }
  };

  const onSubmitTypeStage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typeStageData: TypeStageModel = {
      ...typeStage,
      niveau: selectedNiveau,
      classes: selectedColumnValues,
      max_etudiant: selectedMaxEtudiant,
      localite: selectedLocalite,
      choix: selectedChoix,
      avec_encadrement: selectedEncadrement,
      avec_soutenance: selectedSoutenance,
      encadrement: selectedColumnEncadrement,
      soutenance: selectedColumnSoutenance,
      avec_commission: selectedCommission,
      avec_validation_soutenance: selectedValidation,
      files: rows.map((row) => ({
        nomFr: row.nom_file_fr,
        nomAr: row.nom_file_ar,
        type: row.type,
      })),
    };
    const newErrors: {
      duree_min?: string;
      date_debut?: string;
      date_fin?: string;
    } = {};

    if (!typeStage.duree_min.trim()) {
      newErrors.duree_min = "Ce champ est requis.";
    }
    if (!typeStage.date_debut.trim()) {
      newErrors.date_debut = "Ce champ est requis.";
    } else if (!isValidDateFormat(typeStage.date_debut.trim())) {
      newErrors.date_debut = "Format invalide (jj/mm).";
    }
    if (!typeStage.date_fin.trim()) {
      newErrors.date_fin = "Ce champ est requis.";
    } else if (!isValidDateFormat(typeStage.date_fin.trim())) {
      newErrors.date_fin = "Format invalide (jj/mm).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      createNewType(typeStageData)
        .then(() => notifySuccess())
        .then(() => setTypeStage(initialTypeStage));
      navigate("/gestion-des-stages/liste-types-stage");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Nouveau Type Stage"
            pageTitle="Gestion des stages"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Form onSubmit={onSubmitTypeStage}>
                    <Card.Body className="border">
                      <Row className="mb-3">
                        <Col className="d-flex align-items-center">
                          <span className="fs-18 text-primary">
                            <i className="ph ph-identification-card"></i>{" "}
                            Identification
                          </span>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={2} className="d-flex">
                          <Form.Label>Intitulé</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <Form.Control
                            type="text"
                            name="nom_fr"
                            id="nom_fr"
                            onChange={onChange}
                            value={typeStage.nom_fr}
                          />
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <Form.Control
                            type="text"
                            name="nom_ar"
                            id="nom_ar"
                            onChange={onChange}
                            value={typeStage.nom_ar}
                            className="w-75"
                          />
                        </Col>
                        <Col lg={2}>
                          <Form.Label>عنوان</Form.Label>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Body className="border">
                      <Row className="mb-3">
                        <Col className="d-flex align-items-center">
                          <span className="fs-18 text-secondary">
                            <i className="ph ph-gear"></i> Configuration
                          </span>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={2}>
                          <Form.Label>Niveau</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <select
                            className="form-select"
                            onChange={handleSelectedNiveau}
                          >
                            <option value="">Choisir ...</option>
                            {allNiveaux.map((niveau) => (
                              <option value={niveau?._id!} key={niveau?._id!}>
                                {niveau?.name_niveau_fr}
                              </option>
                            ))}
                          </select>
                        </Col>
                        {selectedNiveau && (
                          <>
                            <Col lg={2} className="text-end">
                              <Form.Label>Groupes</Form.Label>
                            </Col>
                            <Col lg={3}>
                              <Select
                                closeMenuOnSelect={false}
                                isMulti
                                options={optionColumnsTable}
                                onChange={handleSelectValueColumnChange}
                                placeholder="Choisir..."
                              />
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row className="mb-4">
                        <Col lg={2}>
                          <Form.Label>Max Candidat</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <select
                            className="form-select"
                            onChange={handleSelectedMaxEtudiant}
                          >
                            <option value="">Choisir ...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4 d-flex align-items-center">
                        <Col lg={2}>
                          <Form.Label>Localité</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <select
                            className="form-select"
                            onChange={handleSelectedLocalite}
                          >
                            <option value="">Choisir ...</option>
                            <option value="Externe">Externe</option>
                            <option value="Interne">Interne</option>
                            <option value="Externe/Interne">
                              Externe/Interne
                            </option>
                          </select>
                        </Col>
                        <Col lg={1} className="text-end">
                          <Form.Label>Durée</Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            name="duree_min"
                            id="duree_min"
                            onChange={onChange}
                            value={typeStage.duree_min}
                            isInvalid={!!errors.duree_min}
                          />
                          {errors.duree_min && (
                            <Form.Control.Feedback type="invalid">
                              {errors.duree_min}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                        <Col className="text-end">
                          <Form.Label>Date Début</Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            type="text"
                            name="date_debut"
                            id="date_debut"
                            onChange={onChange}
                            value={typeStage.date_debut}
                            placeholder="02/06"
                            className="grey-placeholder"
                            isInvalid={!!errors.date_debut}
                          />
                          {errors.date_debut && (
                            <Form.Control.Feedback type="invalid">
                              {errors.date_debut}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                        <Col lg={1} className="text-end">
                          <Form.Label>Date Fin</Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            type="text"
                            name="date_fin"
                            id="date_fin"
                            onChange={onChange}
                            value={typeStage.date_fin}
                            placeholder="01/09"
                            className="grey-placeholder"
                            isInvalid={!!errors.date_fin}
                          />
                          {errors.date_fin && (
                            <Form.Control.Feedback type="invalid">
                              {errors.date_fin}
                            </Form.Control.Feedback>
                          )}
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
                              id="SwitchCheck6"
                              checked={selectedChoix === "Obligatoire"}
                              onChange={toggleChoix}
                            />
                            <label
                              className="form-check-label fs-15 fw-medium"
                              htmlFor="SwitchCheck6"
                            >
                              {selectedChoix === "Optionnel"
                                ? "Optionnel"
                                : "Obligatoire"}
                            </label>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-4 d-flex align-items-center">
                        <Col lg={2}>
                          <Form.Label>
                            Avis de Commission de validation
                          </Form.Label>
                        </Col>
                        <Col lg={2}>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="SwitchCheck6"
                              checked={selectedCommission === "Oui"}
                              onChange={toggleCommision}
                            />
                            <label
                              className="form-check-label fs-15 fw-medium"
                              htmlFor="SwitchCheck6"
                            >
                              {selectedCommission === "Non" ? "Non" : "Oui"}
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
                              id="SwitchCheck6"
                              checked={selectedValidation === "Oui"}
                              onChange={toggleValidation}
                            />
                            <label
                              className="form-check-label fs-15 fw-medium"
                              htmlFor="SwitchCheck6"
                            >
                              {selectedValidation === "Non" ? "Non" : "Oui"}
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
                              id="SwitchCheck6"
                              checked={selectedEncadrement === "Oui"}
                              onChange={toggleEncadrement}
                            />
                            <label
                              className="form-check-label fs-15 fw-medium"
                              htmlFor="SwitchCheck6"
                            >
                              {selectedEncadrement === "Non" ? "Non" : "Oui"}
                            </label>
                          </div>
                        </Col>
                        {selectedEncadrement === "Oui" && (
                          <>
                            <Col className="text-end" lg={1}>
                              <Form.Label>Encadrants</Form.Label>
                            </Col>
                            <Col lg={3}>
                              <Select
                                closeMenuOnSelect={false}
                                isMulti
                                options={encadrantOptions}
                                onChange={handleSelectEncadrementChange}
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
                              id="SwitchCheck6"
                              checked={selectedSoutenance === "Oui"}
                              onChange={toggleSoutenance}
                            />
                            <label
                              className="form-check-label fs-15 fw-medium"
                              htmlFor="SwitchCheck6"
                            >
                              {selectedSoutenance === "Non" ? "Non" : "Oui"}
                            </label>
                          </div>
                        </Col>
                        {selectedSoutenance === "Oui" && (
                          <>
                            <Col className="text-end" lg={1}>
                              Jury
                            </Col>
                            <Col lg={3}>
                              <Select
                                closeMenuOnSelect={false}
                                isMulti
                                options={soutenanceOptions}
                                onChange={handleSelectSoutenanceChange}
                                placeholder="Choisir..."
                              />
                            </Col>
                          </>
                        )}
                      </Row>
                    </Card.Body>
                    <Card.Body className="border">
                      <Row className="mb-3">
                        <Col className="d-flex align-items-center">
                          <span className="fs-18 text-info">
                            <i className="ph ph-package"></i> Livrable
                          </span>
                        </Col>
                      </Row>
                      {rows.map((row, index) => (
                        <Row className="mb-3" key={row.id}>
                          <Col>
                            <Form.Control
                              type="text"
                              name={`nom_file_fr_${row.id}`}
                              className="w-75 grey-placeholder"
                              placeholder="Attestation de stage"
                              value={row.nom_file_fr}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "nom_file_fr",
                                  e.target.value
                                )
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
                                handleRowChange(
                                  row.id,
                                  "nom_file_ar",
                                  e.target.value
                                )
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
                    <Row>
                      <Card.Footer className="border-0">
                        <Row>
                          <Col className="d-flex justify-content-end">
                            <Button type="submit" variant="success" id="addNew">
                              Ajouter
                            </Button>
                          </Col>
                        </Row>
                      </Card.Footer>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterTypeStage;
