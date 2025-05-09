import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetchShortCodeQuery } from "features/shortCode/shortCodeSlice";
import { useAddNewTemplateBodyMutation, useUpdateTemplateBodyMutation } from "features/templateBody/templateBodySlice";
import "./body.css";
import { renderAsync } from "docx-preview";
import copy from "copy-to-clipboard";

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

const EditTemplateBody = () => {
  document.title = "Modifier un Modèle | ENIGA";

  const navigate = useNavigate();
  const location = useLocation();
  const templateBodyDetails = location.state

  const [updateTemplateBody, { isLoading }] = useUpdateTemplateBodyMutation();
  const { data: shortCodeList = [] } = useFetchShortCodeQuery();
  const previewContainer: any = useRef(null);

  const [withQrCode, setWithQrCode] = useState<boolean>(false);

  const [withNumber, setWithOrderNumber] = useState<boolean>(false);

  useEffect(() => {
    if (templateBodyDetails) {
      setTemplateBody({
        // _id: templateBodyDetails._id || "",
        // title: templateBodyDetails.title || "",
        // body: templateBodyDetails.body || "",
        // langue: templateBodyDetails.langue || "",
        // intended_for: templateBodyDetails.intended_for || "",
        // has_code: templateBodyDetails.has_code || "0",
        // has_number: templateBodyDetails.has_number || "0",
        _id: templateBodyDetails._id || "",
        title: templateBodyDetails.title || "",
        body: templateBodyDetails.body || "",
        langue: templateBodyDetails.langue || "",
        intended_for: templateBodyDetails.intended_for || "",
        has_code: templateBodyDetails.has_code || "0",
        has_number: templateBodyDetails.has_number || "0",
        fileBase64: "",
        fileExtension: "",
        fileName: "",
      });

      setSelectedLangue(templateBodyDetails.langue || "");
      setSelectedIntendedFor(templateBodyDetails.intended_for || "");
      setWithQrCode(templateBodyDetails.has_code === "1");
      setWithOrderNumber(templateBodyDetails.has_number === "1");

      if (templateBodyDetails.body && previewContainer.current) {
        // Render HTML content back into the editable preview
        previewContainer.current.innerHTML = JSON.parse(templateBodyDetails.body);
        previewContainer.current.contentEditable = true;

      }
    }
  }, [templateBodyDetails]);

  // const initialTemplateBody = {
  //   _id: "",
  //   title: "",
  //   body: "",
  //   langue: "",
  //   intended_for: "",
  //   has_code: "0",
  //   has_number: "0",
  // };
  const initialTemplateBody = {
    _id: "",
    title: "",
    body: "",
    langue: "",
    intended_for: "",
    has_code: "0",
    has_number: "0",
    fileBase64: "",
    fileExtension: "",
    fileName: "",
  };

  const [templateBody, setTemplateBody] = useState(initialTemplateBody);
  const [step, setStep] = useState(1);
  const [selectedLangue, setSelectedLangue] = useState("");
  const [selectedIntendedFor, setSelectedIntendedFor] = useState("");

  const { title, body, langue, intended_for, has_code, has_number } =
    templateBody;

  const globalShortCodesAr = shortCodeList.filter(
    (code) => code.intended_for === "global" && code.langue === "arabic"
  );
  const globalShortCodesFr = shortCodeList.filter(
    (code) => code.intended_for === "global" && code.langue === "french"
  );

  // Filter non-global shortcodes based on selected language and intended for
  const filteredShortCodeList = shortCodeList
    .filter((code) => code.intended_for !== "global") // Exclude global shortcodes
    .filter(
      (code) =>
        (selectedLangue ? code.langue === selectedLangue : true) &&
        (selectedIntendedFor ? code.intended_for === selectedIntendedFor : true)
    );

  // Combine global shortcodes based on the selected language
  let displayShortCodeList: any = [];
  if (selectedLangue === "arabic") {
    displayShortCodeList = [
      ...globalShortCodesAr,
      ...filteredShortCodeList.filter((code) => code.langue === "arabic"),
    ];
  } else if (selectedLangue === "french") {
    displayShortCodeList = [
      ...globalShortCodesFr,
      ...filteredShortCodeList.filter((code) => code.langue === "french"),
    ];
  } else {
    displayShortCodeList = [
      ...globalShortCodesAr,
      ...globalShortCodesFr,
      ...filteredShortCodeList,
    ];
  }
  const onChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplateBody((prevState) => ({
      ...prevState,
      langue: e.target.value,
    }));
    setSelectedLangue(e.target.value);
  };

  const onChangeIntendedFor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplateBody((prevState) => ({
      ...prevState,
      intended_for: e.target.value,
    }));
    setSelectedIntendedFor(e.target.value);
  };

  // Handlers

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setTemplateBody((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleFormSubmit =
    async () => {
      try {


        await updateTemplateBody({
          _id: templateBody._id,
          data: {
            title: templateBody.title,
            langue: templateBody.langue,
            intended_for: templateBody.intended_for,
            has_code: templateBody.has_code,
            has_number: templateBody.has_number,
            ...(templateBody.fileBase64 && {
              fileBase64: templateBody.fileBase64,
              fileExtension: templateBody.fileExtension,
              fileName: templateBody.fileName,
            }),
          }
        }).unwrap();



        Swal.fire({
          position: "center",
          icon: "success",
          title: "Le corps du modèle a été modifié avec succès.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/template/liste-template-body");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue lors de la modification du corps du modèle.",
        });
      }
    };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    if (body.trim()) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Le texte écrit dans le corps sera perdu si vous continuez !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, continuer",
        cancelButtonText: "Non, rester ici",
      }).then((result) => {
        if (result.isConfirmed) {
          setStep((prevStep) => prevStep - 1);
        }
      });
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const [originalHtml, setOriginalHtml] = useState("");

  useEffect(() => {
    if (templateBodyDetails?.body) {
      const html = JSON.parse(templateBodyDetails.body);
      setOriginalHtml(html);
    }
  }, [templateBodyDetails]);

  const handleCopyText = (titre: string) => {
    console.log(titre)
    copyToClipboard(titre);
  };
  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const [file_name, ext] = file.name.split('.');
      setTemplateBody((prevState) => ({
        ...prevState,
        fileBase64: base64Data,
        fileExtension: extension,
        fileName: file_name
      }));
      setDocumemntName(file_name)
    }
  };

  const copyToClipboard = (titre: string) => {
    if (titre === 'qr_code') {
      copy('{' + titre + '}\n{link}');
    } else {
      copy('{' + titre + '}');
    }
    alert('Code court copié!');
  };
  const [documentName, setDocumemntName] = useState<string>('')
  const paramsShortCodes = shortCodeList.filter((code) => code.intended_for === 'params');
  return (
    <Container fluid className="page-content">
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3 avatar-sm">
                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                  <i className="bi bi-person-lines-fill"></i>
                </div>
              </div>
              <h5 className="card-title mb-0">Modifier Modèle</h5>
            </Card.Header>

            <Card.Body>
              <Form /* onSubmit={handleFormSubmit} */>
                {step === 1 && (
                  <>
                    <Row>
                      <Col lg={6}>
                        <Form.Group controlId="title">
                          <Form.Label>Titre du modèle</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Entrer titre"
                            value={templateBody.title}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={3}>
                        <Form.Group controlId="langue">
                          <Form.Label>Langue du document</Form.Label>
                          <Form.Select
                            value={langue}
                            onChange={onChangeLanguage}
                            className="text-muted"
                            disabled
                          >
                            <option value="">Sélectionner Langue</option>
                            <option value="arabic">Arabe</option>
                            <option value="french">Français</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col lg={3}>
                        <Form.Group controlId="intended_for">
                          <Form.Label>Espace</Form.Label>
                          <Form.Select
                            value={intended_for}
                            onChange={onChangeIntendedFor}
                            className="text-muted"
                            disabled
                          >
                            <option value="">Sélectionner</option>
                            <option value="enseignant">
                              Demande Enseignant
                            </option>
                            <option value="etudiant">Demande Étudiant</option>
                            <option value="personnel">Demande Personnel</option>
                            <option value="examen">Gestion Examen</option>
                            <option value="stage">Gestion Stage</option>
                            <option value="mission">Gestion des tâches</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        disabled={
                          templateBody.title === "" ||
                          templateBody.langue === "" ||
                          templateBody.intended_for === ""
                        }
                        variant="primary"
                        onClick={handleNextStep}
                      >
                        Suivant
                      </Button>
                    </div>
                  </>
                )}

                {/* {step === 2 && (
                  <>
                    <Row className="mt-4">

                      <Col lg={5} style={{ textAlign: "end" }}>
                        <Button
                          variant="warning"
                          onClick={handleSaveEdited}
                          disabled={
                            canSaveTemplate === true
                          }
                          style={{ marginRight: "5px" }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i
                              className="bi bi-cloud-check fs-20"
                              style={{ marginRight: "3px" }}
                            ></i>
                            Enregistrer les modifications
                          </div>
                        </Button>
                        <Button
                          variant="success"
                       
                          disabled={isLoading || canSaveTemplate === false}
                          onClick={handleFormSubmit}
                        >
                          {isLoading ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i
                                className="bi bi-file-earmark-plus fs-20"
                                style={{ marginRight: "3px" }}
                              ></i>
                              Mettre à jour le modèle
                            </div>
                          )}
                        </Button>

                      </Col>
                    </Row>
                    <Row className="m-3">
                      <div className="d-flex align-items-center gap-2">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => document.execCommand('bold')}>
                          <i className="bi bi-type-bold"></i> Bold
                        </button>
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => document.execCommand('italic')}>
                          <i className="bi bi-type-italic"></i> Italic
                        </button>
                        <select
                          className="form-select form-select-sm w-auto"
                          onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
                        >
                          <option value="3">Normal</option>
                          <option value="4">Medium</option>
                          <option value="5">Large</option>
                          <option value="6">Very Large</option>
                        </select>
                      </div>
                    </Row>


                    <Row>
                     
                      <Col lg={4}>
                        <div
                          className="mb-3"
                          style={{
                            marginLeft: "5%",
                            marginTop: "20px",
                          }}
                        >
                          <Card>
                            <Card.Body className="d-flex">
                              {
                                withQrCode === false ? (<Button
                                  variant="info"
                                  size="sm"
                                  onClick={handleQrCodeInsertion}
                                  className="me-2 mb-2"
                                >Insérer un code QR
                                </Button>) : (<Button
                                  variant="danger"
                                  size="sm"
                                  onClick={removeQrContainer}
                                  className="me-2 mb-2"
                                >Supprimez le code QR
                                </Button>)
                              }

                              {
                                withNumber === false ? (<Button
                                  variant="info"
                                  size="sm"
                                  onClick={handleOrderNumberInsertion}
                                  className="me-2 mb-2"
                                >Insérer un numéro d'ordre
                                </Button>) : (<Button
                                  variant="danger"
                                  size="sm"
                                  onClick={removeOrderNumber}
                                  className="me-2 mb-2"
                                >Supprimez le numéro d'ordre
                                </Button>)
                              }
                            </Card.Body>
                          </Card>
                          <Card>
                            <Card.Header as="h5">
                              Informations d'établissement
                            </Card.Header>
                            <Card.Body>
                              {displayShortCodeList.map((code: any) =>
                                code.intended_for === "global" ? (
                                  <Button
                                    key={code._id}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      handleShortCodeInsertion(code.body)
                                    }
                                    className="me-2 mb-2"
                                  >
                                    {code.titre}
                                  </Button>
                                ) : (
                                  <></>
                                )
                              )}
                            </Card.Body>
                          </Card>

                          <Card>
                            {selectedIntendedFor === "etudiant" && (
                              <Card.Header as="h6">
                                Informations étudiant
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "enseignant" && (
                              <Card.Header as="h6">
                                Informations enseignant
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "personnel" && (
                              <Card.Header as="h6">
                                Informations personnel
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "examen" && (
                              <Card.Header as="h6">
                                Informations examen
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "mission" && (
                              <Card.Header as="h6">
                                Informations de tâche
                              </Card.Header>
                            )}
                            <Card.Body>
                              {displayShortCodeList.map((code: any) =>
                                code.intended_for !== "global" ? (
                                  <Button
                                    key={code._id}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      handleShortCodeInsertion(code.body)
                                    }
                                    className="me-2 mb-2"
                                  >
                                    {code.titre}
                                  </Button>
                                ) : (
                                  <></>
                                )
                              )}
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handlePreviousStep}>
                        Précédent
                      </Button>
                    </div>
                  </>
                )} */}
                {step === 2 && (
                  <>
                    <Row className="mt-4">
                      <Col lg={3}>

                        <input
                          className="d-none"
                          type="file"
                          accept=".docx"
                          name="docInput"
                          id="docInput"
                          onChange={handleFileUpload}
                        />
                        <label
                          htmlFor="docInput"
                          className="btn btn-light"
                          style={{
                            cursor: "pointer",
                            borderRadius: "5px",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i
                              className="bi bi-cloud-arrow-up fs-20"
                              style={{ marginRight: "3px" }}
                            ></i>
                            Remplacer un modèle Word
                          </div>
                          <span>{documentName}</span>
                        </label>

                      </Col>
                      <Col lg={3}>
                        <Button
                          variant="success"
                          disabled={isLoading || documentName === ''}
                          onClick={handleFormSubmit}
                        >
                          {isLoading ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i
                                className="bi bi-file-earmark-plus fs-20"
                                style={{ marginRight: "3px" }}
                              ></i>
                              Générer modèle
                            </div>
                          )}
                        </Button>
                      </Col>
                      <Col lg={5} style={{ textAlign: "start" }}>

                      </Col>
                      <Col lg={4} className="mt-2" style={{ borderRadius: '5px', border: '1px solid #e1e1e1', padding: '10px', background: '#ffe0a880', fontWeight: '400', textAlign: "start" }}>
                        Vérifier que votre document word est bien rempli avec les codes courts necessaires.
                      </Col>
                    </Row>
                    {/* {selectedLangue === 'arabic' && (
                      <Row style={{ marginTop: '10px' }}>
                        <Col lg={3}></Col>
                        <Col lg={5}></Col>
                        <Col lg={4} style={{ borderRadius: '5px', border: '1px solid #e1e1e1', padding: '10px', background: 'rgb(254 185 255 / 50%)', fontWeight: '400', textAlign: "start" }}>
                          Assurez que vous insérez les parenthèses comme des codes courts pour les documents en arabe.
                        </Col>
                      </Row>
                    )} */}

                    <Row className="mb-3"
                      style={{
                        marginLeft: "5%",
                        marginTop: "20px",
                      }}>
                      <Col lg={12}>
                        <div
                          className="mb-3"
                          style={{
                            marginLeft: "5%",
                            marginTop: "20px",
                          }}
                        >
                          <Card>
                            <Card.Body className="d-flex">
                              {paramsShortCodes.map((code: any) =>
                                <Button
                                  key={code._id}
                                  variant="info"
                                  onClick={() => handleCopyText(code.body)}
                                  size="sm"
                                  className="me-2 mb-2"
                                >
                                  {code.titre}
                                </Button>

                              )}
                              {selectedLangue === 'arabic' && (
                                <>
                                  <Button
                                    variant="info"
                                    onClick={() => handleCopyText('closed_parenthese')}
                                    size="sm"
                                    className="me-2 mb-2"
                                  >
                                    {'('}
                                  </Button>
                                  <Button
                                    variant="info"
                                    onClick={() => handleCopyText('open_parenthese')}
                                    size="sm"
                                    className="me-2 mb-2"
                                  >
                                    {')'}
                                  </Button></>
                              )}

                            </Card.Body>
                          </Card>
                          <Card>
                            <Card.Header as="h5">
                              Informations d'établissement
                            </Card.Header>
                            <Card.Body>
                              {displayShortCodeList.map((code: any) =>
                                code.intended_for === "global" ? (
                                  <Button
                                    key={code._id}
                                    variant="secondary"
                                    onClick={() => handleCopyText(code.body)}
                                    size="sm"
                                    // onClick={() =>
                                    //   handleShortCodeInsertion(code.body)
                                    // }
                                    className="me-2 mb-2"
                                  >
                                    {code.titre}
                                  </Button>
                                ) : (
                                  <></>
                                )
                              )}
                            </Card.Body>
                          </Card>

                          <Card>
                            {selectedIntendedFor === "etudiant" && (
                              <Card.Header as="h6">
                                Informations étudiant
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "enseignant" && (
                              <Card.Header as="h6">
                                Informations enseignant
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "personnel" && (
                              <Card.Header as="h6">
                                Informations personnel
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "examen" && (
                              <Card.Header as="h6">
                                Informations examen
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "mission" && (
                              <Card.Header as="h6">
                                Informations de tâche
                              </Card.Header>
                            )}
                            <Card.Body>
                              {displayShortCodeList.map((code: any) =>
                                code.intended_for !== "global" ? (
                                  <Button
                                    key={code._id}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleCopyText(code.body)}
                                    // onClick={() =>
                                    //   handleShortCodeInsertion(code.body)
                                    // }
                                    className="me-2 mb-2"
                                  >
                                    {code.titre}
                                  </Button>
                                ) : (
                                  <></>
                                )
                              )}
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handlePreviousStep}>
                        Précédent
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditTemplateBody;
