import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useNavigate } from "react-router-dom";
import { useFetchClassesQuery } from "features/classe/classe";
import {
  useFetchAllSocietesQuery,
  useGetByNameMutation,
} from "features/societe/societeSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import {
  StageProModel,
  useCreateNewMutation,
} from "features/stagesPro/stagesProSlice";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
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

const AddNewStagePro = () => {
  document.title = "Ajouter Nouveau Stage Professionnel | ENIGA";

  const navigate = useNavigate();

  const { data: allClasses = [] } = useFetchClassesQuery();
  const { data: allSocites = [] } = useFetchAllSocietesQuery();
  const { data: allEnseignants = [] } = useFetchEnseignantsQuery();

  const [getByName, { isSuccess: societeByName }] = useGetByNameMutation();
  const [createNew] = useCreateNewMutation();

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
  const [selectedTypeStage, setSelectedTypeStage] =
    useState<string>("Stage Ouvrier");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSociete, setSelectedSociete] = useState<string>("");
  const [societe, setSociete] = useState<any>(null);

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

  const toggleTypeStage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTypeStage(
      e.target.checked ? "Stage Ouvrier" : "Stage Technicien"
    );
  };

  const handleSelectedType = (e: any) => {
    setSelectedType(e.target.value);
  };

  const handleSelectedSociete = (e: any) => {
    setSelectedSociete(e.target.value);
  };

  useEffect(() => {
    if (selectedSociete) {
      fetchSocieteByName(selectedSociete);
    }
  }, [selectedSociete]);

  const fetchSocieteByName = async (name: string) => {
    try {
      const result = await getByName({ name }).unwrap();
      setSociete(result);
    } catch (error) {
      console.error("Error fetching societe:", error);
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Stage Professionnel a été modifié avec succès",
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

  const [firstClasses, setFirstClasses] = useState<any[]>([]);
  const [secondClasses, setSecondClasses] = useState<any[]>([]);

  useEffect(() => {
    if (selectedTypeStage === "Stage Ouvrier") {
      const classesPremiere = allClasses.filter((classe) =>
        classe.nom_classe_fr.startsWith("1")
      );
      setFirstClasses(classesPremiere);
    }
    if (selectedTypeStage === "Stage Technicien") {
      const classesDeuxieme = allClasses.filter((classe) =>
        classe.nom_classe_fr.startsWith("2")
      );
      setSecondClasses(classesDeuxieme);
    }
  }, [allClasses, selectedTypeStage]);

  const initialPfe: StageProModel = {
    etudiant: "",
    type_stage: "",
    binome: null,
    encadrant_univ: null,
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

  const onSubmitNewStagePro = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedType === "Académique") {
        stage["societe"] = null;
      } else {
        stage["societe"] = selectedSociete;
      }
      stage["type_stage"] = selectedTypeStage;
      stage["etudiant"] = selectedEtudiant;
      stage["encadrant_societe"] = selectedEncadrantSociete;
      stage["date_debut"] = formatDateToDisplay(dateDebut);
      stage["date_fin"] = formatDateToDisplay(dateFin);
      createNew(stage)
        .then(() => notifySuccess())
        .then(() => setStage(initialPfe));
      navigate("/gestion-des-stages/liste-stages-professionnels");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nouveau Stage Professionnel"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Form onSubmit={onSubmitNewStagePro}>
              <Card.Body>
                <Row className="mb-3">
                  <Col className="d-flex justify-content-center">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="SwitchCheck6"
                        checked={selectedTypeStage === "Stage Ouvrier"}
                        onChange={toggleTypeStage}
                      />
                      <label
                        className="form-check-label fs-15 fw-medium"
                        htmlFor="SwitchCheck6"
                      >
                        {selectedTypeStage === "Stage Ouvrier"
                          ? "Stage Ouvrier"
                          : "Stage Technicien"}
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Classe :</Form.Label>
                    {selectedTypeStage === "Stage Technicien" && (
                      <select
                        className="form-select"
                        onChange={handleSelectedClasse}
                      >
                        <option value="">Choisir ...</option>
                        {secondClasses.map((classe) => (
                          <option value={classe?._id!} key={classe?._id!}>
                            {classe?.nom_classe_fr}
                          </option>
                        ))}
                      </select>
                    )}
                    {selectedTypeStage === "Stage Ouvrier" && (
                      <select
                        className="form-select"
                        onChange={handleSelectedClasse}
                      >
                        <option value="">Choisir ...</option>
                        {firstClasses.map((classe) => (
                          <option value={classe?._id!} key={classe?._id!}>
                            {classe?.nom_classe_fr}
                          </option>
                        ))}
                      </select>
                    )}
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
                <Row>
                  <Col lg={6}>
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
                </Row>
                <Row className="mb-2">
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
                <Row className="mb-2">
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
                <Row className="mb-2">
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
                    <Form.Label>Proposition Signé :</Form.Label>
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
                <Row className="p-4">
                  <Col>
                    <div className="text-end">
                      <Button variant="primary" className="mt-3" type="submit">
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

export default AddNewStagePro;
