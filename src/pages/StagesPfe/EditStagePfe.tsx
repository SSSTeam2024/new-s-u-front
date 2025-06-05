import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userImage from "assets/images/etudiant.png";
import noImage from "assets/images/no_file.png";
import {
  useFetchAllSocietesQuery,
  useGetByNameMutation,
} from "features/societe/societeSlice";
import AddNewSociete from "./AddNewSociete";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useUpdateStagePfeMutation } from "features/stagesPfe/stagesPfeSlice";
import Swal from "sweetalert2";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import PropositionStagePDF from "./PropositionStagePDF";
import { useReactToPrint } from "react-to-print";
import AffectationEtudiant from "./AffectationEtudiant";

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

function convertDateFormat(dateStr: any) {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const EditStagePfe = () => {
  document.title = "Modifier PFE | ENIGA";

  const navigate = useNavigate();
  const location = useLocation();
  const stageDetails = location.state;

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

  //! Fetch Data
  const { data: allSocites = [] } = useFetchAllSocietesQuery();
  const { data: allEnseignants = [] } = useFetchEnseignantsQuery();
  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();

  //! Mutations
  const [getByName] = useGetByNameMutation();
  const [updateStage] = useUpdateStagePfeMutation();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [societe, setSociete] = useState<any>(null);
  const [showPropositionSigneModal, setShowPropositionSigneModal] =
    useState<boolean>(false);
  const [showAttestationModal, setShowAttestationModal] =
    useState<boolean>(false);
  const [showRapportModal, setShowRapportModal] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const lastVariable =
    variableGlobales.length > 0
      ? variableGlobales[variableGlobales.length - 1]
      : null;

  const fileInputPropositionRef = useRef<HTMLInputElement>(null);
  const fileInputAttestationRef = useRef<HTMLInputElement>(null);
  const fileInputRapportRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    dateDebut: convertDateFormat(stageDetails.date_debut) || "",
    dateFin: convertDateFormat(stageDetails.date_fin) || "",
    dateSoutenance: convertDateFormat(stageDetails.date_soutenance) || "",
    status: stageDetails.status_stage || "En Attente",
    selectedSociete: stageDetails.societe?.nom || "",
    sujet: stageDetails.sujet || "",
    description: stageDetails.description || "",
    encadrantSociete: stageDetails.encadrant_societe || "",
    encadrantUniv: stageDetails.encadrant_univ?._id || "",
    avis: stageDetails.avis || "",
    rapporteur: stageDetails.rapporteur?._id || "",
    chef_jury: stageDetails.chef_jury?._id || "",
    file_proposition_signe: stageDetails?.file_proposition_signe! || "",
    file_proposition_signe_base64: "",
    file_proposition_signe_extension: "",
    file_attestation_base64: "",
    file_attestation_extension: "",
    file_attestation: stageDetails?.file_attestation! || "",
    file_rapport: stageDetails?.file_rapport! || "",
    file_rapport_base64: "",
    file_rapport_extension: "",
  });

  useEffect(() => {
    if (formData.selectedSociete) {
      fetchSocieteByName(formData.selectedSociete);
    }
  }, [formData.selectedSociete]);

  const fetchSocieteByName = async (name: string) => {
    try {
      const result = await getByName({ name }).unwrap();
      setSociete(result);
    } catch (error) {
      console.error("Error fetching societe:", error);
    }
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "En Attente" ? "En Cours" : "En Attente",
    }));
  };

  const handleChange =
    (key: keyof typeof formData) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSocieteChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, selectedSociete: name }));
    fetchSocieteByName(name);
  };

  const handlePropositionSigneFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const filePropositionSigne = base64Data + "." + extension;
      setFormData({
        ...formData,
        file_proposition_signe: filePropositionSigne,
        file_proposition_signe_base64: base64Data,
        file_proposition_signe_extension: extension,
      });
    }
  };

  const handleAttestationFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const fileAttestation = base64Data + "." + extension;
      setFormData({
        ...formData,
        file_attestation: fileAttestation,
        file_attestation_base64: base64Data,
        file_attestation_extension: extension,
      });
    }
  };

  const handleRapportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const fileRapport = base64Data + "." + extension;
      setFormData({
        ...formData,
        file_rapport: fileRapport,
        file_rapport_base64: base64Data,
        file_rapport_extension: extension,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!societe?._id) {
      console.error("Societe ID is missing. Cannot update stage.");
      return;
    }
    try {
      const updateData = {
        _id: stageDetails._id,
        sujet: formData.sujet,
        description: formData.description,
        date_debut: formData.dateDebut,
        date_fin: formData.dateFin,
        date_soutenance: formData.dateSoutenance,
        status_stage: formData.status,
        encadrant_univ: formData.encadrantUniv,
        encadrant_societe: formData.encadrantSociete,
        societe: societe._id,
        avis: formData.avis,
        file_proposition_signe: formData.file_proposition_signe,
        file_proposition_signe_base64: formData.file_proposition_signe_base64,
        file_proposition_signe_extension:
          formData.file_proposition_signe_extension,
        file_rapport: formData.file_rapport,
        file_rapport_base64: formData.file_rapport_base64,
        file_rapport_extension: formData.file_rapport_extension,
        file_attestation: formData.file_attestation,
        file_attestation_base64: formData.file_attestation_base64,
        file_attestation_extension: formData.file_attestation_extension,
      };
      await updateStage(updateData);
      notifySuccess();
      navigate("/gestion-des-stages/liste-stages-pfe");
    } catch (error) {
      notifyError(error);
    }
  };

  const handleShowPropositionSigneModal = (file: any) => {
    setFileUrl(file);
    setShowPropositionSigneModal(true);
  };

  const handleShowAttestationModal = (file: any) => {
    setFileUrl(file);
    setShowAttestationModal(true);
  };

  const handleShowRapportModal = (file: any) => {
    setFileUrl(file);
    setShowRapportModal(true);
  };

  const handleClosePropositionSigneModal = () =>
    setShowPropositionSigneModal(false);

  const handleCloseAttestationModal = () => setShowAttestationModal(false);
  const handleCloseRapportModal = () => setShowRapportModal(false);

  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);
  const basePath = `${process.env.REACT_APP_API_URL}/files/`;

  const handleButtonPropositionClick = () => {
    fileInputPropositionRef.current?.click();
  };

  const handleButtonAttestationClick = () => {
    fileInputAttestationRef.current?.click();
  };

  const handleButtonRapportClick = () => {
    fileInputRapportRef.current?.click();
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [personType, setPersonType] = useState<"etudiant" | "binome">(
    "etudiant"
  );
  const [shouldPrint, setShouldPrint] = useState(false);

  useEffect(() => {
    if (shouldPrint) {
      reactToPrintFn();
      setShouldPrint(false); // reset after printing
    }
  }, [personType, shouldPrint]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Button
            onClick={() => navigate(-1)}
            className="btn-soft-info btn-sm mb-1"
          >
            <i className="ri-arrow-go-back-line"></i>
          </Button>
          <Form onSubmit={handleSubmit}>
            <Card>
              <div className="p-2 text-center">
                <h3>
                  Stage PFE <i>{stageDetails.type_stage}</i>
                </h3>
              </div>
              <Card.Header className="bg-secondary-subtle text-dark-emphasis">
                <span className="fs-20 fw-bold">Information Etudiant(e)</span>
              </Card.Header>
              <Card.Body className="border border-end">
                <Row>
                  <Col lg={2}>
                    <img
                      className="rounded-start img-fluid h-80 object-cover"
                      src={
                        stageDetails.etudiant.photo_profil
                          ? `${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${stageDetails.etudiant.photo_profil}`
                          : userImage
                      }
                      alt="Photo Profile"
                      onError={(e) => {
                        e.currentTarget.src = userImage;
                      }}
                      width="120"
                    />
                  </Col>
                  <Col>
                    <Row className="mb-2 d-flex align-items-center">
                      <Col>
                        <span className="fs-16 fw-medium">Nom & Prénom</span>
                      </Col>
                      <Col>
                        <span>
                          {stageDetails.etudiant.prenom_fr}{" "}
                          {stageDetails.etudiant.nom_fr}
                        </span>
                      </Col>
                      <Col className="text-end">
                        <span className="fs-16 fw-medium">Groupe</span>
                      </Col>
                      <Col lg={5}>
                        <span>{stageDetails.etudiant.Groupe}</span>
                      </Col>
                    </Row>
                    <Row className="mb-2 d-flex align-items-center">
                      <Col>
                        <span className="fs-16 fw-medium">N° Tél</span>
                      </Col>
                      <Col>
                        <span>{stageDetails.etudiant.num_phone}</span>
                      </Col>
                      <Col className="text-end">
                        <span className="fs-16 fw-medium">Spécialité</span>
                      </Col>
                      <Col lg={5}>
                        <span>{stageDetails.etudiant.Spécialité}</span>
                      </Col>
                    </Row>
                    <Row className="d-flex align-items-center">
                      <Col>
                        <span className="fs-16 fw-medium">Email</span>
                      </Col>
                      <Col>
                        <span>{stageDetails.etudiant.email}</span>
                      </Col>
                      <Col className="text-end">
                        <span className="fs-16 fw-medium">Diplôme</span>
                      </Col>
                      <Col lg={5}>
                        <span>{stageDetails.etudiant.DIPLOME}</span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Body className="text-center">
                <Row>
                  <Col>
                    <PDFDownloadLink
                      document={
                        <PropositionStagePDF
                          stageDetails={stageDetails}
                          lastVariable={lastVariable}
                        />
                      }
                      fileName="proposition_stage.pdf"
                      className="badge badge-soft-info view-item-btn"
                    >
                      {/* <a
                      href={`${process.env.REACT_APP_API_URL}/files/propositionFiles/${stageDetails.file_proposition}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge badge-soft-info view-item-btn"
                    > */}
                      <i
                        className="ph ph-file-arrow-down"
                        style={{
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          fontSize: "3.5em",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.3)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      ></i>
                      <p className="mt-1">Proposition Stage</p>
                    </PDFDownloadLink>
                  </Col>
                  <Col>
                    <span
                      onClick={() => {
                        setPersonType("etudiant");
                        setShouldPrint(true);
                      }}
                      className="badge badge-soft-secondary view-item-btn pe-auto"
                    >
                      <i
                        className="ph ph-file-arrow-down"
                        style={{
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          fontSize: "3.5em",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.3)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      ></i>
                      <p className="mt-1">Affectation Stage Etudiant</p>
                    </span>
                  </Col>
                  {stageDetails.binome !== null && (
                    <Col>
                      <span
                        onClick={() => {
                          setPersonType("binome");
                          setShouldPrint(true);
                        }}
                        className="badge badge-soft-warning view-item-btn pe-auto"
                      >
                        <i
                          className="ph ph-file-arrow-down"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "3.5em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        ></i>
                        <p className="mt-1">Affectation Stage Binôme</p>
                      </span>
                    </Col>
                  )}
                </Row>
              </Card.Body>
              <Row
                className="justify-content-center"
                style={{ display: "none" }}
              >
                <div ref={contentRef}>
                  <AffectationEtudiant
                    lastVariable={lastVariable}
                    stageDetails={stageDetails}
                    contentRef={contentRef}
                    personType={personType}
                  />
                </div>
              </Row>
              {stageDetails.type_stage === "Industriel" && (
                <>
                  <Card.Header className="bg-primary opacity-50 text-white">
                    <span className="fs-20 fw-bold">Information Société</span>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-2 d-flex align-items-center">
                      <Col lg={2}>
                        <span className="fs-16 fw-medium">Nom Société</span>
                      </Col>
                      <Col>
                        <div className="hstack gap-2">
                          <select
                            className="form-select"
                            onChange={handleSocieteChange}
                            value={formData.selectedSociete}
                          >
                            {allSocites.map((societe) => (
                              <option value={societe.nom} key={societe?._id!}>
                                {societe.nom}
                              </option>
                            ))}
                          </select>
                          <Button
                            variant="primary"
                            onClick={() => setOpenModal(!openModal)}
                          >
                            <i className="ri-add-line"></i>
                          </Button>
                        </div>
                      </Col>
                      <Col className="text-end">
                        <span className="fs-16 fw-medium">
                          Encadrant Société
                        </span>
                      </Col>
                      <Col>
                        <select
                          className="form-select"
                          value={formData.encadrantSociete}
                          onChange={handleChange("encadrantSociete")}
                        >
                          {societe &&
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
                    <Row>
                      <Col lg={2}>
                        <span className="fs-16 fw-medium">Informations</span>
                      </Col>
                      <Col>{societe && societe?.infos}</Col>
                    </Row>
                  </Card.Body>
                </>
              )}
              <Card.Header className="bg-info-subtle text-dark-emphasis">
                <Row>
                  <Col>
                    <span className="fs-20 fw-bold">Information Projet</span>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="SwitchCheck6"
                        checked={formData.status === "En Attente"}
                        onChange={toggleStatus}
                      />
                      <label
                        className="form-check-label fs-15 fw-medium"
                        htmlFor="SwitchCheck6"
                      >
                        {formData.status === "En Attente"
                          ? "En Attente"
                          : "En Cours"}
                      </label>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3 d-flex align-items-center">
                  <Col lg={2}>
                    <span className="fs-16 fw-medium">Date Début</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      value={formData.dateDebut}
                      onChange={handleChange("dateDebut")}
                      className="text-center"
                    />
                  </Col>
                  <Col className="text-end">
                    <span className="fs-16 fw-medium">Date Fin</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      value={formData.dateFin}
                      onChange={handleChange("dateFin")}
                      className="text-center"
                    />
                  </Col>
                </Row>
                <Row className="mb-3 d-flex align-items-center">
                  <Col lg={2}>
                    <span className="fs-16 fw-medium">Encadrant</span>
                  </Col>
                  <Col lg={3}>
                    <select
                      className="form-select"
                      onChange={handleChange("encadrantUniv")}
                      value={formData.encadrantUniv}
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
                <Row className="mb-2 d-flex align-items-center">
                  <Col lg={2}>
                    <span className="fs-16 fw-medium">Sujet Projet</span>
                  </Col>
                  <Col>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.sujet}
                      onChange={handleChange("sujet")}
                      name="sujet"
                      id="sujet"
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col lg={2}>
                    <span className="fs-16 fw-medium">Description</span>
                  </Col>
                  <Col>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange("description")}
                      name="description"
                      id="description"
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col lg={2}>
                    <span className="fs-16 fw-medium">Rapporteur</span>
                  </Col>
                  <Col>
                    <select
                      className="form-select"
                      onChange={handleChange("rapporteur")}
                      value={formData.rapporteur}
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
                  <Col lg={2} className="text-end">
                    <span className="fs-16 fw-medium">Chef Jury</span>
                  </Col>
                  <Col>
                    <select
                      className="form-select"
                      onChange={handleChange("chef_jury")}
                      value={formData.chef_jury}
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
                  <Col className="text-end">
                    <span className="fs-16 fw-medium">Date Soutenance</span>
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      value={formData.dateSoutenance}
                      onChange={handleChange("dateSoutenance")}
                      className="text-center"
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col lg={2}>
                    <span className="fs-16 fw-medium">Décision</span>
                  </Col>
                  <Col>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.avis}
                      onChange={handleChange("avis")}
                      name="avis"
                      id="avis"
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={2}></Col>
                  <Col>{stageDetails.note}</Col>
                </Row>
              </Card.Body>
              {stageDetails.binome !== null && (
                <>
                  <Card.Header className="bg-warning-subtle text-dark">
                    <span className="fs-20 fw-bold">Information Binôme</span>
                  </Card.Header>
                  <Card.Body>
                    <Row className="d-flex align-items-center">
                      <Col>
                        <span className="fs-16 fw-medium">Nom & Prénom</span>
                      </Col>
                      <Col>
                        <span>
                          {stageDetails.binome.prenom_fr}{" "}
                          {stageDetails.binome.nom_fr}
                        </span>
                      </Col>
                      <Col lg={1}>
                        <span className="fs-16 fw-medium">N° Tél</span>
                      </Col>
                      <Col lg={2}>
                        <span>{stageDetails.binome.num_phone}</span>
                      </Col>
                      <Col lg={1}>
                        <span className="fs-16 fw-medium">Email</span>
                      </Col>
                      <Col>
                        <span>{stageDetails.binome.email}</span>
                      </Col>
                    </Row>
                  </Card.Body>
                </>
              )}
              <Card.Header className="bg-success-subtle text-dark">
                <span className="fs-20 fw-bold">Les pièces jointes</span>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="border-2 border-end">
                    <div
                      className="vstack gap-3"
                      style={{ position: "relative" }}
                    >
                      <span className="fs-15 fw-medium">
                        Proposition pfe signé
                      </span>
                      {isImageFile(
                        `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                      ) && (
                        <>
                          <img
                            src={`${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`}
                            alt="Proposition PFE Signé"
                            style={{ width: "100%", height: "auto" }}
                          />
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowPropositionSigneModal(
                                `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                              )
                            }
                            style={{
                              position: "absolute",
                              top: 36,
                              left: 10,
                              width: "94%",
                              height: "91%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              zIndex: 10,
                            }}
                          >
                            Afficher l'Image
                          </Button>
                        </>
                      )}
                      {isPDFFile(
                        `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                      ) && (
                        <>
                          <iframe
                            src={`${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`}
                            style={{
                              border: "none",
                              width: "100%",
                              height: "250px",
                            }}
                            title="Proposition PFE Signé"
                          />
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowPropositionSigneModal(
                                `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                              )
                            }
                            style={{
                              position: "absolute",
                              top: 36,
                              left: 10,
                              width: "94%",
                              height: "91%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              zIndex: 10,
                            }}
                          >
                            Afficher PDF
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <input
                        type="file"
                        ref={fileInputPropositionRef}
                        style={{ display: "none" }}
                        onChange={handlePropositionSigneFile}
                        id="file_proposition_signe_base64"
                      />
                      <Button
                        onClick={handleButtonPropositionClick}
                        variant="outline-warning"
                        className="mt-3"
                      >
                        Changer Fichier
                      </Button>
                    </div>
                  </Col>
                  <Col className="border-2 border-end">
                    <p className="fs-15 fw-medium">Attestation de stage</p>
                    {stageDetails.file_attestation.endsWith(".") && (
                      <div className="text-center">
                        <img
                          className="rounded img-fluid h-80 object-cover"
                          src={noImage}
                          alt="Aucun Image Disponible"
                          onError={(e) => {
                            e.currentTarget.src = noImage;
                          }}
                          width="120"
                        />
                      </div>
                    )}
                    <div
                      className="vstack gap-3"
                      style={{ position: "relative" }}
                    >
                      {isImageFile(
                        `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                      ) && (
                        <>
                          <img
                            src={`${basePath}/attestationFiles/${stageDetails.file_attestation}`}
                            alt="Attestation de stage"
                            style={{ width: "100%", height: "auto" }}
                          />
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowAttestationModal(
                                `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                              )
                            }
                            style={{
                              position: "absolute",
                              top: 36,
                              left: 10,
                              width: "94%",
                              height: "91%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              zIndex: 10,
                            }}
                          >
                            Afficher l'Image
                          </Button>
                        </>
                      )}
                      {isPDFFile(
                        `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                      ) && (
                        <>
                          <iframe
                            src={`${basePath}/attestationFiles/${stageDetails.file_attestation}`}
                            style={{
                              border: "none",
                              width: "100%",
                              height: "200px",
                            }}
                            title="Attestation de stage"
                          />
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowAttestationModal(
                                `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                              )
                            }
                            style={{
                              position: "absolute",
                              top: 36,
                              left: 10,
                              width: "94%",
                              height: "91%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              zIndex: 10,
                            }}
                          >
                            Afficher PDF
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <input
                        type="file"
                        ref={fileInputAttestationRef}
                        style={{ display: "none" }}
                        onChange={handleAttestationFile}
                      />
                      <Button
                        onClick={handleButtonAttestationClick}
                        variant="outline-warning"
                        className="mt-3"
                      >
                        Changer Fichier
                      </Button>
                    </div>
                  </Col>
                  <Col>
                    <p className="fs-16 fw-medium">Rapport</p>
                    {stageDetails.file_rapport &&
                      stageDetails.file_rapport.includes("undefined") && (
                        <div className="text-center">
                          <img
                            className="rounded img-fluid h-80 object-cover"
                            src={noImage}
                            alt="Aucun Image Disponible"
                            onError={(e) => {
                              e.currentTarget.src = noImage;
                            }}
                            width="120"
                          />
                        </div>
                      )}
                    <div
                      className="vstack gap-3"
                      style={{ position: "relative" }}
                    >
                      {isImageFile(
                        `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                      ) && (
                        <>
                          <img
                            src={`${basePath}/rapportFiles/${stageDetails.file_rapport}`}
                            alt="Rapport"
                            style={{ width: "100%", height: "auto" }}
                          />
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowRapportModal(
                                `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                              )
                            }
                            style={{
                              position: "absolute",
                              top: 36,
                              left: 10,
                              width: "94%",
                              height: "91%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              zIndex: 10,
                            }}
                          >
                            Afficher l'Image
                          </Button>
                        </>
                      )}
                      {isPDFFile(
                        `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                      ) && (
                        <>
                          <iframe
                            src={`${basePath}/rapportFiles/${stageDetails.file_rapport}`}
                            style={{
                              border: "none",
                              width: "500px",
                              height: "290px",
                            }}
                            title="Rapport"
                          />
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowRapportModal(
                                `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                              )
                            }
                            style={{
                              position: "absolute",
                              top: 36,
                              left: 10,
                              width: "94%",
                              height: "91%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              zIndex: 10,
                            }}
                          >
                            Afficher PDF
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <input
                        type="file"
                        ref={fileInputRapportRef}
                        style={{ display: "none" }}
                        onChange={handleRapportFile}
                      />
                      <Button
                        onClick={handleButtonRapportClick}
                        variant="outline-warning"
                        className="mt-3"
                      >
                        Changer Fichier
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="hstack gap-2 justify-content-end">
                  <Button variant="success" id="edit-btn" type="submit">
                    Modifier
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      </div>
      <Modal
        className="fade zoomIn"
        size="lg"
        show={openModal}
        onHide={() => {
          setOpenModal(!openModal);
        }}
        centered
      >
        <Modal.Header className="px-4 pt-4" closeButton>
          <h5 className="modal-title fs-18" id="exampleModalLabel">
            Ajouter Nouvelle Société
          </h5>
        </Modal.Header>
        <Modal.Body className="p-4">
          <AddNewSociete
            setmodal_AddNew={setOpenModal}
            modal_AddNew={openModal}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showPropositionSigneModal}
        onHide={handleClosePropositionSigneModal}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visionneuse Proposition PFE Signé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImageFile(fileUrl) ? (
            <img
              src={fileUrl}
              alt="Proposition PFE Signé"
              style={{ width: "100%", height: "auto" }}
            />
          ) : isPDFFile(fileUrl) ? (
            <iframe src={fileUrl} width="100%" height="700px" />
          ) : (
            <p>Aucun document à afficher.</p>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showAttestationModal}
        onHide={handleCloseAttestationModal}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visionneuse Attestation de stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImageFile(fileUrl) ? (
            <img
              src={fileUrl}
              alt="Attestation de stage"
              style={{ width: "100%", height: "auto" }}
            />
          ) : isPDFFile(fileUrl) ? (
            <iframe src={fileUrl} width="100%" height="700px" />
          ) : (
            <p>Aucun document à afficher.</p>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showRapportModal} onHide={handleCloseRapportModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Visionneuse Rapport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImageFile(fileUrl) ? (
            <img
              src={fileUrl}
              alt="View Image"
              style={{ width: "100%", height: "auto" }}
            />
          ) : isPDFFile(fileUrl) ? (
            <iframe src={fileUrl} width="100%" height="700px" />
          ) : (
            <p>Aucun document à afficher.</p>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default EditStagePfe;
