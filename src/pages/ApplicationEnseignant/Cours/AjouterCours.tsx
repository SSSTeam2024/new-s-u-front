import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import {
  CoursEnseignant,
  useAddCoursEnseignantMutation,
} from "features/coursEnseignant/coursSlice";
import { useFetchClassesQuery } from "features/classe/classe";
import Select from "react-select";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useNavigate } from "react-router-dom";

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

export { convertToBase64 };

const AjouterCours = () => {
  document.title = "Ajouter Cours | ENIGA";

  const { data: AllClasse = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const optionColumnsTable = AllClasse.map((classe: any) => ({
    value: classe?._id!,
    label: classe?.nom_classe_fr!,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const handleSelectEnseignant = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);
  };

  const navigate = useNavigate();

  const [newCours] = useAddCoursEnseignantMutation();

  function tog_AllAbsences() {
    navigate("/application-enseignant/lister-cours");
  }

  const initialCours: CoursEnseignant = {
    classe: [""],
    enseignant: "",
    nom_cours: "",
    file_cours: "",
    pdfBase64String: "",
    pdfExtension: "",
    trimestre: "",
  };

  const [cours, setCours] = useState(initialCours);

  const {
    classe,
    enseignant,
    nom_cours,
    file_cours,
    pdfBase64String,
    pdfExtension,
    trimestre,
  } = cours;

  const handleFileUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_avis = base64Data + "." + extension;
      setCours({
        ...cours,
        file_cours: file_avis,
        pdfBase64String: base64Data,
        pdfExtension: extension,
      });
    }
  };

  const onChangeCours = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCours((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitCours = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const coursData = {
        ...cours,
        classe: selectedColumnValues,
        enseignant: selectedEnseignant,
        nom_cours: nom_cours,
        trimestre: selectedTrimestre,
      };
      newCours(coursData);
      // .then(() => notifySuccess())
      // .then(() => setAbsence(initialAbsence));
      tog_AllAbsences();
    } catch (error) {
      console.warn("Error", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Ajouter Cours"
            pageTitle="Application Enseignant"
          />
          <Form onSubmit={onSubmitCours}>
            <Row>
              <Col lg={12}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="classe">Classe(s)</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                      onChange={handleSelectValueColumnChange}
                      placeholder="Choisir..."
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="enseignant">Enseignant</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="enseignant"
                      id="enseignant"
                      onChange={handleSelectEnseignant}
                    >
                      <option value="">Select</option>
                      {AllEnseignants.map((enseignant) => (
                        <option value={enseignant?._id!} key={enseignant?._id!}>
                          {enseignant.prenom_fr} {enseignant.nom_fr}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row>
                  <Col lg={3}>
                    <Form.Label htmlFor="nom_cours">Nom Cours</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      name="nom_cours"
                      id="nom_cours"
                      value={cours.nom_cours}
                      onChange={onChangeCours}
                    />
                  </Col>
                </Row>
                <Row className="mt-2 mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="trimestre">Semestre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="trimestre"
                      id="trimestre"
                      onChange={handleSelectTrimestre}
                    >
                      <option value="">Choisir</option>
                      <option value="1">S1</option>
                      <option value="2">S2</option>
                    </select>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={3}>
                    <Form.Label htmlFor="nom_cours">Fichier</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <input
                      className="form-control"
                      type="file"
                      name="pdfBase64String"
                      id="pdfBase64String"
                      accept="pdf*"
                      onChange={(e) => handleFileUploadFile(e)}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <div className="hstack gap-2 justify-content-end">
                    <Button type="submit" variant="success" id="addNew">
                      Ajouter
                    </Button>
                  </div>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterCours;
