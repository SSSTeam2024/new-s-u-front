import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchAllCommissionQuery } from "features/commission/commissionSlice";
import { useFetchAllStagePfeQuery } from "features/stagesPfe/stagesPfeSlice";
import { useFetchAllTypeStageQuery } from "features/typeStage/typeStageSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  AvisCommissionModel,
  useAddAvisCommissionMutation,
} from "features/avisCommission/avisCommissionSlice";
import Swal from "sweetalert2";

const AddAvis = () => {
  document.title = "Ajouter Avis | ENIGA";

  const navigate = useNavigate();
  const { data: allCommissions = [] } = useFetchAllCommissionQuery();
  const { data: allStages = [] } = useFetchAllStagePfeQuery();
  const { data: allTypesStage = [] } = useFetchAllTypeStageQuery();
  const [ajouterAvis] = useAddAvisCommissionMutation();

  const initialAvis = {
    commission: "",
    type_stage: "",
    liste: [],
    etat: "",
  };

  const [avisCommission, setAvisCommission] = useState(initialAvis);
  const [selectedTypeStage, setSelectedTypeStage] = useState<string>("");
  const [selectedCommission, setSelectedCommission] = useState<string>("");
  const [createdAvis, setCreatedAvis] = useState<
    AvisCommissionModel | undefined
  >();
  const [avisEtRemarques, setAvisEtRemarques] = useState<{
    [stageId: string]: { avis: string; remarques: string };
  }>({});

  const filtredTypesStage = allTypesStage.filter(
    (type: any) => type.avec_commission === "Oui"
  );

  const handleSelectedTypeStage = (e: any) => {
    setSelectedTypeStage(e.target.value);
  };

  const toggleAvis = (stageId: string) => {
    setAvisEtRemarques((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        avis: prev[stageId]?.avis === "Validé" ? "Réfusé" : "Validé",
      },
    }));
  };

  const handleRemarques = (stageId: string, value: string) => {
    setAvisEtRemarques((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        remarques: value,
      },
    }));
  };

  function tog_GenererPv() {
    navigate("/gestion-des-stages/generer-avis");
  }

  const handleSelectedCommission = (e: any) => {
    setSelectedCommission(e.target.value);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Avis de commission a été enregistré avec succès",
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

  const filtredStages = allStages.filter(
    (stage: any) => stage?.type_stage?._id! === selectedTypeStage
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvisCommission((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitNouveauAvisCommission = async (e: any) => {
    e.preventDefault();

    const liste = filtredStages.map((stage: any) => {
      const entry = avisEtRemarques[stage._id] || {
        avis: "Validé",
        remarques: "",
      };

      return {
        etudiant: `${stage?.etudiant?.prenom_fr!} ${stage?.etudiant?.nom_fr!}`,
        groupe: stage?.etudiant?.Groupe,
        sujet: stage?.sujet,
        lieu: stage?.societe?.nom,
        avis: entry.avis,
        remarques: entry.remarques,
      };
    });

    const avisData: AvisCommissionModel = {
      ...avisCommission,
      commission: selectedCommission,
      type_stage: selectedTypeStage,
      liste,
    };

    try {
      const result = await ajouterAvis(avisData).unwrap();
      setCreatedAvis(result);
      notifySuccess();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Ajouter Avis" pageTitle="Gestion des stages" />

          <Card className="shadow p-4">
            <Card.Header className="border-bottom-dashed">
              <Row className="d-flex align-items-center">
                <Col className="text-end">
                  <Form.Label>Commission : </Form.Label>
                </Col>
                <Col lg={3}>
                  <select
                    className="form-select"
                    onChange={handleSelectedCommission}
                  >
                    <option value="">Choisir...</option>
                    {allCommissions.map((commission) => (
                      <option value={commission?._id!} key={commission?._id!}>
                        {commission?.titre_fr}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col className="text-end">
                  <Form.Label>Stage : </Form.Label>
                </Col>
                <Col lg={3}>
                  <select
                    className="form-select"
                    onChange={handleSelectedTypeStage}
                  >
                    <option value="">Choisir...</option>
                    {filtredTypesStage.map((type: any) => (
                      <option value={type?._id!} key={type?._id!}>
                        {type?.nom_fr}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={1}></Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive table-card">
                <table className="table align-middle table-nowrap table-striped-columns mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "160px" }}>Etudiant</th>
                      <th style={{ width: "80px" }}>Groupe</th>
                      <th style={{ width: "200px" }}>Sujet</th>
                      <th style={{ width: "160px" }}>Lieu</th>
                      <th style={{ width: "100px" }}>Avis</th>
                      <th style={{ width: "220px" }}>Remarques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtredStages.map((stage: any) => {
                      const stageData = avisEtRemarques[stage._id] || {
                        avis: "Validé",
                        remarques: "",
                      };

                      return (
                        <tr key={stage._id}>
                          <td>
                            {stage?.etudiant?.prenom_fr}{" "}
                            {stage?.etudiant?.nom_fr}
                          </td>
                          <td>{stage?.etudiant?.Groupe}</td>
                          <td>{stage?.sujet}</td>
                          <td>{stage?.societe?.nom}</td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`SwitchCheck-${stage._id}`}
                                checked={stageData.avis === "Validé"}
                                onChange={() => toggleAvis(stage._id)}
                              />
                              <label
                                className="form-check-label fs-15 fw-medium"
                                htmlFor={`SwitchCheck-${stage._id}`}
                              >
                                {stageData.avis}
                              </label>
                            </div>
                          </td>
                          <td>
                            {stageData.avis === "Réfusé" && (
                              <Form.Control
                                type="text"
                                value={stageData.remarques}
                                onChange={(e) =>
                                  handleRemarques(stage._id, e.target.value)
                                }
                                className="text-center"
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <Card.Footer>
              <Row className="d-flex justify-content-end">
                <Col lg={2}>
                  <span
                    className="d-flex align-items-center justify-content-center  badge bg-info-subtle text-primary view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => onSubmitNouveauAvisCommission(e)}
                  >
                    <i className="ph ph-floppy-disk"></i> Enregistrer
                  </span>
                </Col>
                <Col lg={2}>
                  <Link
                    to="/directeur-de-stage/generer-pv"
                    className="d-flex align-items-center justify-content-center badge bg-warning-subtle text-primary view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    state={createdAvis}
                  >
                    <i className="ph ph-file-arrow-down"></i> Générer PV
                  </Link>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddAvis;
