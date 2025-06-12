import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
import {
  StagePfeModel,
  useAddNewPfeMutation,
} from "features/stagesPfe/stagesPfeSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useFetchAllTypeStageQuery,
  useGetTypeStageByIdMutation,
} from "features/typeStage/typeStageSlice";

const AddNewStagePfe = () => {
  document.title = "Ajouter Nouveau Stage | ENIGA";

  const navigate = useNavigate();

  const { data: allTypesStages = [] } = useFetchAllTypeStageQuery();

  const [getTypeStageById] = useGetTypeStageByIdMutation();
  const [createNew] = useAddNewPfeMutation();

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedEtudiant, setSelectedEtudiant] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [typeStage, setTypeStage] = useState<any>(null);

  const handleSelectedClasse = (e: any) => {
    setSelectedClasse(e.target.value);
  };
  const handleSelectedEtudiant = (e: any) => {
    setSelectedEtudiant(e.target.value);
  };

  const { data: EtudiantsByClasseID = [], isSuccess: studentsLoaded } =
    useFetchEtudiantsByIdClasseQuery(selectedClasse);

  const handleSelectedType = (e: any) => {
    setSelectedType(e.target.value);
  };

  useEffect(() => {
    const fetchTypeStageById = async () => {
      if (selectedType) {
        try {
          const typeData = await getTypeStageById({
            typeId: selectedType,
          }).unwrap();

          setTypeStage(typeData);
        } catch (error) {
          console.error("Failed to fetch type stage by id:", error);
        }
      }
    };

    fetchTypeStageById();
  }, [selectedType]);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Stage a été crée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: unknown) => {
    const message =
      err instanceof Error ? err.message : "Une erreur est survenue.";
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Quelque chose s'est mal passé : ${message}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const initialPfe: StagePfeModel = {
    etudiant: "",
    type_stage: null,
    binome: null,
    encadrant_univ1: null,
    encadrant_societe1: "",
    encadrant_societe2: "",
    societe: null,
    status_stage: "",
    date_debut: "",
    date_fin: "",
    date_soutenance: "",
    sujet: "",
    description: "",
    avis: "",
    note: "",
    file_proposition_signe_base64: "",
    file_proposition_signe_extension: "",
    file_proposition_signe: "",
    file_attestation: "",
    file_attestation_base64: "",
    file_attestation_extension: "",
  };

  const [stage, setStage] = useState(initialPfe);

  const onSubmitNewPfe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      stage["status_stage"] = "En Attente";
      stage["etudiant"] = selectedEtudiant;
      stage["type_stage"] = selectedType;
      createNew(stage)
        .then(() => notifySuccess())
        .then(() => setStage(initialPfe));
      navigate("/gestion-des-stages/liste-stages");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Nouveau Stage" pageTitle="Gestion des stages" />
          <Card>
            <Form onSubmit={onSubmitNewPfe}>
              <Card.Body>
                <Row className="mb-3">
                  <Col lg={6}>
                    <Form.Label>Type Stage :</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectedType}
                    >
                      <option value="">Choisir ...</option>
                      {allTypesStages.map((type) => (
                        <option value={type?._id!} key={type?._id!}>
                          {type?.nom_fr!}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Classe :</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectedClasse}
                    >
                      <option value="">Choisir ...</option>
                      {typeStage &&
                        typeStage.classes.map((classe: any) => (
                          <option value={classe?._id!} key={classe?._id!}>
                            {classe?.nom_classe_fr}
                          </option>
                        ))}
                    </select>
                  </Col>
                  <Col>
                    <Form.Label>Etudiant :</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectedEtudiant}
                    >
                      <option value="">Choisir ...</option>
                      {studentsLoaded &&
                        EtudiantsByClasseID.map((etudiant) => (
                          <option value={etudiant?._id!} key={etudiant?._id!}>
                            {etudiant?.prenom_fr!} {etudiant?.nom_fr!}
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Row className="p-1">
                  <Col>
                    <div className="text-end">
                      <Button variant="primary" type="submit">
                        Ajouter
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
            </Form>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddNewStagePfe;
