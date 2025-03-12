import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  useUpdateCoursEnseignantMutation,
} from "features/coursEnseignant/coursSlice";
import {
  useFetchClassesByTeacherMutation,
  useFetchClassesQuery,
} from "features/classe/classe";
import Select, { OptionsOrGroups } from "react-select";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useLocation, useNavigate } from "react-router-dom";

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

const EditCours = () => {
  document.title = "Modifier Support | ENIGA";
  const location = useLocation();
  const coursDetails = location?.state?.coursDetails;
  console.log("coursDetails edit page", coursDetails);
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("1");

  const [optionColumnsTable, setOptionColumnsTable] = useState<any>(null);
  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  useEffect(() => {
    if (coursDetails) {
      console.log("Cours Details:", coursDetails); // Debugging

      setCours({
        classe: coursDetails.classe || [],
        enseignant: coursDetails.enseignant || "",
        nom_cours: coursDetails.nom_cours || "",
        filesData: coursDetails.filesData || [],
        trimestre: coursDetails.trimestre || "1",
      });

      setSelectedEnseignant(coursDetails.enseignant || "");
      setSelectedTrimestre(coursDetails.trimestre || "1");
      setSelectedColumnValues(coursDetails.classe || []);
    }
  }, [coursDetails]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const handleSelectEnseignant = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);

    // Ensure that selectedTrimestre is updated before making the request
    let classesRequestData = {
      teacherId: value,
      semestre: selectedTrimestre, // Ensure selectedTrimestre has the correct value
    };

    try {
      let classes = await getClassesByTeacherId(classesRequestData).unwrap();
      console.log("Fetched Classes:", classes);

      let classOptions = classes.map((classe: any) => ({
        value: classe?._id!,
        label: classe?.nom_classe_fr!,
      }));

      setOptionColumnsTable(classOptions);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const navigate = useNavigate();

  const [editCours] = useUpdateCoursEnseignantMutation();

  function tog_AllAbsences() {
    navigate("/application-enseignant/lister-cours");
  }

  const toggleSemestre = () => {
    setSelectedTrimestre((prev) => (prev === "1" ? "2" : "1"));
  };

  const initialCours: CoursEnseignant = {
    classe: [""],
    enseignant: "",
    nom_cours: "",
    filesData: [{ fileName: "", pdfBase64String: "", pdfExtension: "" }],
    trimestre: "",
  };

  const [cours, setCours] = useState(initialCours);

  const handleFileUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectedFiles = (
      document.getElementById("pdfBase64String") as HTMLFormElement
    ).files;
    let files_data = [];
    for (const file of selectedFiles) {
      if (file) {
        const { base64Data, extension } = await convertToBase64(file);
        const file_name = file.name;
        files_data.push({
          fileName: file_name,
          pdfBase64String: base64Data,
          pdfExtension: extension,
        });
      }
    }
    setCours({
      ...cours,
      filesData: files_data,
    });
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
        classe: selectedColumnValues,
        enseignant: selectedEnseignant,
        trimestre: selectedTrimestre,
        nom_cours: cours.nom_cours,
        filesData: cours.filesData,
      };

      editCours({
        id: coursDetails?._id, // Ensure coursDetails is coming from useLocation()
        data: coursData,
      });

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
            title="Ajouter Support"
            pageTitle="Application Enseignant"
          />
          <Form onSubmit={onSubmitCours}>
            <Row>
              <Col lg={12}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="trimestre">Semestre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="SwitchCheck6"
                        checked={selectedTrimestre === "2"}
                        onChange={toggleSemestre}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="SwitchCheck6"
                      >
                        {selectedTrimestre === "1" ? "S1" : "S2"}
                      </label>
                    </div>
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
                      value={selectedEnseignant} // Pre-select the selected enseignant
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
                      value={selectedColumnValues} // Pre-select the selected classes
                      placeholder="Choisir..."
                    />
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
                      multiple={true}
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

export default EditCours;
