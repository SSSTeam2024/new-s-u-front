import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
import {
  useFetchAllSocietesQuery,
  useGetByIdMutation,
  useGetByNameMutation,
} from "features/societe/societeSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import {
  StagePfeModel,
  useAddNewPfeMutation,
} from "features/stagesPfe/stagesPfeSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;

      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const formatDateToDisplay = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const AddNewStagePfe = () => {
  document.title = "Ajouter Nouveau Stage PFE | ENIGA";

  const navigate = useNavigate();

  const { data: allClasses = [] } = useFetchClassesQuery();
  const { data: allSocites = [] } = useFetchAllSocietesQuery();
  const { data: allEnseignants = [] } = useFetchEnseignantsQuery();

  const [getById, { isSuccess: societeById }] = useGetByIdMutation();
  const [createNew] = useAddNewPfeMutation();

  const today = new Date().toISOString().split("T")[0];
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState("");

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedEncadrantUniv, setSelectedEncadrantUniv] =
    useState<string>("");
  const [selectedBinome, setSelectedBinome] = useState<string>("");
  const [selectedEncadrantSociete, setSelectedEncadrantSociete] =
    useState<string>("");
  const [selectedEtudiant, setSelectedEtudiant] = useState<string>("");
  const [selectedAvec, setSelectedAve] = useState<string>("Seul");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSociete, setSelectedSociete] = useState<string>("");
  const [societe, setSociete] = useState<any>(null);

  const filtredClasses = allClasses.filter((classe) =>
    classe.nom_classe_fr.startsWith("3")
  );
  const handleSelectedClasse = (e: any) => {
    setSelectedClasse(e.target.value);
  };
  const handleSelectedEtudiant = (e: any) => {
    setSelectedEtudiant(e.target.value);
  };
  const handleSelectedBinome = (e: any) => {
    setSelectedBinome(e.target.value);
  };
  const handleSelectedEncadrantUniv = (e: any) => {
    setSelectedEncadrantUniv(e.target.value);
  };
  const handleSelectedEncadrantSociete = (e: any) => {
    setSelectedEncadrantSociete(e.target.value);
  };
  const { data: EtudiantsByClasseID = [], isSuccess: studentsLoaded } =
    useFetchEtudiantsByIdClasseQuery(selectedClasse);

  const toggleStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAve(e.target.checked ? "Seul" : "En binôme");
  };

  const handleSelectedType = (e: any) => {
    setSelectedType(e.target.value);
  };

  const handleSelectedSociete = (e: any) => {
    setSelectedSociete(e.target.value);
  };

  useEffect(() => {
    if (selectedSociete) {
      fetchSocieteById(selectedSociete);
    }
  }, [selectedSociete]);

  const fetchSocieteById = async (id: string) => {
    try {
      const result = await getById({ id }).unwrap();
      setSociete(result);
    } catch (error) {
      console.error("Error fetching societe:", error);
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Stage Pfe a été modifié avec succès",
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
    type_stage: "",
    binome: null,
    encadrant_univ: "",
    encadrant_societe: "",
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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStage((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById(
        "file_proposition_signe_base64"
      ) as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const propositionfile = base64Data + "." + extension;
      setStage({
        ...stage,
        file_proposition_signe: propositionfile,
        file_proposition_signe_base64: base64Data,
        file_proposition_signe_extension: extension,
      });
    }
  };

  const handleFileAttestation = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("file_attestation_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const attestationfile = base64Data + "." + extension;
      setStage({
        ...stage,
        file_attestation: attestationfile,
        file_attestation_base64: base64Data,
        file_attestation_extension: extension,
      });
    }
  };

  const onSubmitNewPfe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedAvec === "Seul") {
        stage["binome"] = null;
      } else {
        stage["binome"] = selectedBinome;
      }
      if (selectedType === "Académique") {
        stage["societe"] = null;
      } else {
        stage["societe"] = selectedSociete;
      }
      stage["etudiant"] = selectedEtudiant;
      stage["type_stage"] = selectedType;
      stage["encadrant_societe"] = selectedEncadrantSociete;
      stage["date_debut"] = formatDateToDisplay(dateDebut);
      stage["date_fin"] = formatDateToDisplay(dateFin);
      stage["encadrant_univ"] = selectedEncadrantUniv;
      createNew(stage)
        .then(() => notifySuccess())
        .then(() => setStage(initialPfe));
      navigate("/gestion-des-stages/liste-stages-pfe");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nouveau Stage PFE"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Form onSubmit={onSubmitNewPfe}>
              <Card.Body>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Classe :</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectedClasse}
                    >
                      <option value="">Choisir ...</option>
                      {filtredClasses.map((classe) => (
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
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Type Stage :</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectedType}
                    >
                      <option value="">Choisir ...</option>
                      <option value="Industriel">Industriel</option>
                      <option value="Académique">Académique</option>
                    </select>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="SwitchCheck6"
                        checked={selectedAvec === "Seul"}
                        onChange={toggleStatus}
                      />
                      <label
                        className="form-check-label fs-15 fw-medium"
                        htmlFor="SwitchCheck6"
                      >
                        {selectedAvec === "Seul" ? "Seul" : "En binôme"}
                      </label>
                    </div>
                  </Col>
                  {selectedAvec === "En binôme" && (
                    <Col>
                      <Form.Label>Binôme :</Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectedBinome}
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
                  )}
                </Row>
                {selectedType === "Industriel" && (
                  <Row className="mb-3">
                    <Col>
                      <Form.Label>Sociéte :</Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectedSociete}
                      >
                        <option value="">Choisir ...</option>
                        {allSocites.map((societe) => (
                          <option value={societe?._id!} key={societe?._id!}>
                            {societe.nom}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col>
                      <Form.Label>Encadrant Sociéte :</Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectedEncadrantSociete}
                      >
                        <option value="">Choisir ...</option>
                        {societeById &&
                          societe &&
                          societe?.encadrant?.map(
                            (encadrant: any, index: number) => (
                              <option key={index} value={encadrant}>
                                {encadrant}
                              </option>
                            )
                          )}
                      </select>
                    </Col>
                  </Row>
                )}
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Date Début</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      className="text-center"
                    />
                  </Col>
                  <Col>
                    <Form.Label>Date Fin</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      className="text-center"
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg={6}>
                    <Form.Label>Encadrant</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectedEncadrantUniv}
                    >
                      {[...allEnseignants]
                        .sort((a, b) => {
                          if (a.prenom_fr < b.prenom_fr) {
                            return -1;
                          }
                          if (a.prenom_fr > b.prenom_fr) {
                            return 1;
                          }
                          return 0;
                        })
                        .map((enseignant) => (
                          <option
                            key={enseignant?._id!}
                            value={enseignant?._id!}
                          >
                            {enseignant.prenom_fr} {enseignant.nom_fr}
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Sujet :</Form.Label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={stage.sujet}
                      onChange={onChange}
                      name="sujet"
                      id="sujet"
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Description :</Form.Label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={stage.description}
                      onChange={onChange}
                      name="description"
                      id="description"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Proposition pfe signé :</Form.Label>
                    <input
                      className="form-control"
                      type="file"
                      id="file_proposition_signe_base64"
                      onChange={(e) => handleFile(e)}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Attestation de stage :</Form.Label>
                    <input
                      className="form-control"
                      type="file"
                      id="file_attestation_base64"
                      onChange={(e) => handleFileAttestation(e)}
                    />
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
