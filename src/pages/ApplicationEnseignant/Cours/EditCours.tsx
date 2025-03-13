import React, { useState, useEffect } from "react";
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
  useUpdateCoursEnseignantMutation,
} from "features/coursEnseignant/coursSlice";
import { useFetchClassesByTeacherMutation } from "features/classe/classe";
import Select from "react-select";
// import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useLocation, useNavigate } from "react-router-dom";
import mppt from "assets/images/Microsoft_PowerPoint_2013-2019_logo.svg.png";
import mexcel from "assets/images/excel-logo.png";
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

  // const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();

  // const [selectedEnseignant, setSelectedEnseignant] = useState<any>();
  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("1");

  const [optionColumnsTable, setOptionColumnsTable] = useState<any>(null);

  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);
  const isPowerPointFile = (url: string) => /\.(pptx|ppt|ppsx)$/i.test(url);
  const isExcelFile = (url: string) => /\.(xlsx|xls)$/i.test(url);

  const basePath = `${process.env.REACT_APP_API_URL}/files/Cours/`;

  const [files, setFiles] = useState<string[]>(
    coursDetails?.file_cours?.map((file: string) => `${basePath}${file}`) || []
  );

  const initialCours: CoursEnseignant = {
    classe: [""],
    enseignant: "",
    nom_cours: "",
    filesData: [{ fileName: "", pdfBase64String: "", pdfExtension: "" }],
    trimestre: "",
    deletedfile: "nothing",
  };

  const [cours, setCours] = useState(initialCours);

  useEffect(() => {
    if (coursDetails) {
      setCours({
        classe: coursDetails.classe || [],
        enseignant: coursDetails.enseignant || "",
        nom_cours: coursDetails.nom_cours || "",
        filesData: coursDetails.file_cours || [],
        trimestre: coursDetails.trimestre === "1" ? "1" : "2",
        deletedfile: "nothing",
      });

      // setSelectedEnseignant(coursDetails.enseignant || "");
      setSelectedTrimestre(coursDetails.trimestre === "1" ? "1" : "2");
      setSelectedColumnValues(coursDetails.classe || []);
    }
  }, [coursDetails]);

  const existingClasses = coursDetails?.classe || [];

  const defaultClassesOptions =
    coursDetails?.classe?.map((item: any) => ({
      label: item.nom_classe_fr,
      value: item?._id!,
    })) || [];

  const [selectedColumnValues, setSelectedColumnValues] = useState(
    existingClasses.map((fil: any) => fil?._id!)
  );

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  // const handleSelectEnseignant = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const value = event.target.value;
  //   setSelectedEnseignant(value);

  // };

  const navigate = useNavigate();

  const [editCours] = useUpdateCoursEnseignantMutation();

  function tog_AllAbsences() {
    navigate("/application-enseignant/lister-cours");
  }

  const toggleSemestre = async () => {
    setSelectedTrimestre((prev) => (prev === "1" ? "2" : "1"));

    const newSemestre = selectedTrimestre === "1" ? "2" : "1";

    let classesRequestData = {
      teacherId: coursDetails?.enseignant?._id!,
      semestre: newSemestre,
    };

    try {
      let classes = await getClassesByTeacherId(classesRequestData).unwrap();
      let classOptions = classes.map((classe: any) => ({
        value: classe?._id!,
        label: classe?.nom_classe_fr!,
      }));

      setOptionColumnsTable(classOptions);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // const handleFileUploadFile = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   let selectedFiles = (
  //     document.getElementById("pdfBase64String") as HTMLFormElement
  //   ).files;
  //   let files_data = [];
  //   for (const file of selectedFiles) {
  //     if (file) {
  //       const { base64Data, extension } = await convertToBase64(file);
  //       const file_name = file.name;
  //       files_data.push({
  //         fileName: file_name,
  //         pdfBase64String: base64Data,
  //         pdfExtension: extension,
  //       });
  //     }
  //   }
  //   setCours({
  //     ...cours,
  //     filesData: files_data,
  //     deletedfile: "no",
  //   });
  // };

  const handleFileUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    let newFilesData = [...coursDetails?.file_cours];

    const filesArray = Array.from(selectedFiles);

    for (const file of filesArray) {
      if (file) {
        const { base64Data, extension } = await convertToBase64(file);
        newFilesData.push({
          fileName: file.name,
          pdfBase64String: base64Data,
          pdfExtension: extension,
        });
      }
    }

    setCours((prevCours) => ({
      ...prevCours,
      filesData: newFilesData,
      deletedfile: "no",
    }));
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setCours((prevCours) => ({
      ...prevCours,
      filesData: prevCours?.filesData?.filter((_, i) => i !== index),
      deletedfile: "yes",
    }));
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
        enseignant: coursDetails?.enseignant?._id!,
        trimestre: selectedTrimestre,
        nom_cours: cours.nom_cours,
        filesData: cours.filesData,
        deletedfile: cours?.deletedfile!,
      };
      editCours({
        id: coursDetails?._id!,
        data: coursData,
      });

      tog_AllAbsences();
    } catch (error) {
      console.warn("Error", error);
    }
  };

  const [fileUrl, setFileUrl] = useState<string>("");
  const [showFileModal, setShowFileModal] = useState<boolean>(false);

  const handleShowFileModal = (file: any) => {
    setFileUrl(file);
    setShowFileModal(true);
  };

  const handleCloseFileModal = () => setShowFileModal(false);

  // const files =
  //   coursDetails?.file_cours?.map((file: string) => `${basePath}${file}`) || [];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Support"
            pageTitle="Application Enseignant"
          />

          <Form onSubmit={onSubmitCours}>
            <Card>
              <Card.Body>
                <Row className="p-2">
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
                      {/* <select
                        className="form-select text-muted"
                        name="enseignant"
                        id="enseignant"
                        onChange={handleSelectEnseignant}
                        value={selectedEnseignant}
                      >
                        <option value="">Select</option>
                        {AllEnseignants.map((enseignant) => (
                          <option
                            value={enseignant?._id!}
                            key={enseignant?._id!}
                          >
                            {enseignant.prenom_fr} {enseignant.nom_fr}
                          </option>
                        ))}
                      </select> */}
                      <h6>
                        {coursDetails.enseignant.prenom_fr}{" "}
                        {coursDetails.enseignant.nom_fr}
                      </h6>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col lg={3}>
                      <Form.Label htmlFor="classe">Classe(s)</Form.Label>
                    </Col>
                    <Col lg={8}>
                      {/* <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionColumnsTable}
                        onChange={handleSelectValueColumnChange}
                        value={selectedColumnValues}
                        placeholder="Choisir..."
                      /> */}
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionColumnsTable}
                        onChange={handleSelectValueColumnChange}
                        defaultValue={defaultClassesOptions}
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
                    <div className="hstack gap-5">
                      <div className="mt-3">
                        <Col lg={3}>
                          <Form.Label htmlFor="nom_cours">Fichier</Form.Label>
                        </Col>
                      </div>
                      <div>
                        <Row>
                          {files.some(
                            (file: any) => isImageFile(file) || isPDFFile(file)
                          ) ? (
                            <Col lg={12}>
                              <Card>
                                <Card.Body>
                                  <Row>
                                    {files
                                      .filter(
                                        (file: any) =>
                                          isImageFile(file) || isPDFFile(file)
                                      )
                                      .map((file: any, index: any) => (
                                        <Col
                                          key={index}
                                          lg={4}
                                          className="mb-4"
                                        >
                                          <Card>
                                            <Card.Body
                                              style={{ position: "relative" }}
                                            >
                                              {isImageFile(file) ? (
                                                <>
                                                  <img
                                                    src={file}
                                                    alt={`File ${index + 1}`}
                                                    style={{
                                                      width: "100%",
                                                      height: "200px",
                                                      objectFit: "cover",
                                                    }}
                                                    onClick={() =>
                                                      handleShowFileModal(file)
                                                    }
                                                  />
                                                  <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                      handleShowFileModal(file)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                      top: 0,
                                                      left: 0,
                                                      width: "100%",
                                                      height: "100%",
                                                      backgroundColor:
                                                        "rgba(0, 0, 0, 0.5)",
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
                                              ) : isPDFFile(file) ? (
                                                <>
                                                  <iframe
                                                    src={file}
                                                    style={{
                                                      border: "none",
                                                      width: "100%",
                                                      height: "200px",
                                                    }}
                                                    title={`PDF ${index + 1}`}
                                                  />
                                                  <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                      handleShowFileModal(file)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                      top: 0,
                                                      left: 0,
                                                      width: "100%",
                                                      height: "100%",
                                                      backgroundColor:
                                                        "rgba(0, 0, 0, 0.5)",
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
                                                    Afficher le PDF
                                                  </Button>
                                                </>
                                              ) : null}
                                            </Card.Body>
                                            {/* Delete Button */}

                                            <Button
                                              variant="danger"
                                              onClick={() =>
                                                handleDeleteFile(index)
                                              }
                                              className="btn mt-2 btn-sm w-xs"
                                            >
                                              {/* <i className="ph ph-x-circle fs-16"></i> */}
                                              Supprimer
                                            </Button>
                                          </Card>
                                        </Col>
                                      ))}
                                  </Row>
                                </Card.Body>
                              </Card>
                            </Col>
                          ) : (
                            <Col lg={12}>
                              <p>Pas d'image ou Fchier PDF .</p>
                            </Col>
                          )}

                          {files.some(
                            (file: any) =>
                              isPowerPointFile(file) || isExcelFile(file)
                          ) ? (
                            <Col lg={12} className="mt-4">
                              <Card>
                                <Card.Body>
                                  <Row>
                                    {files
                                      .filter(
                                        (file: any) =>
                                          isPowerPointFile(file) ||
                                          isExcelFile(file)
                                      )
                                      .map((file: any, index: any) => (
                                        <Col
                                          key={index}
                                          lg={4}
                                          className="mb-4"
                                        >
                                          <Card>
                                            <Card.Body>
                                              {isPowerPointFile(file) ? (
                                                // <div>
                                                //   <p>
                                                //     Fichier PowerPoint détecté.
                                                //     Vous pouvez le télécharger{" "}
                                                //     <a href={file} download>
                                                //       ici
                                                //     </a>
                                                //     .
                                                //   </p>
                                                //   <img
                                                //     src={student}
                                                //     alt=""
                                                //     className="img-fluid category-img object-fit-cover"
                                                //   />
                                                // </div>
                                                <Card className="categrory-widgets overflow-hidden w-100 border-0">
                                                  <h4 className="mt-2">
                                                    {
                                                      file
                                                        .split("/")
                                                        .pop()
                                                        .split("_")[0]
                                                    }
                                                  </h4>
                                                  <div className="d-flex justify-content-center hstack gap-5 mt-3 mb-2">
                                                    <a href={file} download>
                                                      <i className="ph ph-download fs-24"></i>
                                                    </a>
                                                    <i
                                                      className="ph ph-trash fs-22 text-danger"
                                                      onClick={() =>
                                                        handleDeleteFile(index)
                                                      }
                                                    ></i>
                                                  </div>
                                                  <img
                                                    src={mppt}
                                                    alt=""
                                                    className="img-fluid category-img object-fit-cover"
                                                  />
                                                </Card>
                                              ) : isExcelFile(file) ? (
                                                <Card className="categrory-widgets overflow-hidden w-100 border-0">
                                                  <h4 className="mt-2">
                                                    {
                                                      file
                                                        .split("/")
                                                        .pop()
                                                        .split("_")[0]
                                                    }
                                                  </h4>
                                                  <div className="d-flex justify-content-center hstack gap-5 mt-3 mb-2">
                                                    <a href={file} download>
                                                      <i className="ph ph-download fs-24"></i>
                                                    </a>
                                                    <i
                                                      className="ph ph-trash fs-22 text-danger"
                                                      onClick={() =>
                                                        handleDeleteFile(index)
                                                      }
                                                    ></i>
                                                  </div>
                                                  <img
                                                    src={mexcel}
                                                    alt=""
                                                    className="img-fluid category-img object-fit-cover"
                                                  />
                                                </Card>
                                              ) : null}
                                            </Card.Body>
                                          </Card>
                                        </Col>
                                      ))}
                                  </Row>
                                </Card.Body>
                              </Card>
                            </Col>
                          ) : (
                            <Col lg={12} className="mt-4">
                              <p>Pas de fichier PowerPoint ou Fichier Excel.</p>
                            </Col>
                          )}
                          <Modal
                            show={showFileModal}
                            onHide={handleCloseFileModal}
                            size="lg"
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>
                                Visionneuse de documents
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              {isImageFile(fileUrl) ? (
                                <img
                                  src={fileUrl}
                                  alt="View Image"
                                  style={{ width: "100%", height: "auto" }}
                                />
                              ) : isPDFFile(fileUrl) ? (
                                <iframe
                                  src={fileUrl}
                                  width="100%"
                                  height="700px"
                                />
                              ) : (
                                <p>Aucun document à afficher.</p>
                              )}
                            </Modal.Body>
                          </Modal>
                        </Row>
                      </div>
                    </div>
                    {/* {files.length === 0 && ( */}
                    <Row>
                      <Col lg={3}></Col>
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
                    {/* )} */}
                  </Row>
                </Row>
              </Card.Body>
              <Card.Footer className="border-0">
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button type="submit" variant="success" id="addNew">
                      Modifier
                    </Button>
                  </div>
                </Row>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditCours;
