import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetchShortCodeQuery } from "features/shortCode/shortCodeSlice";
import { useAddNewTemplateBodyMutation } from "features/templateBody/templateBodySlice";
import "./body.css";
import copy from "copy-to-clipboard";
import { useFetchExtraShortCodeQuery } from "features/extraShortCode/extraShortCodeSlice";
import { useCreateDiversDocExtraMutation } from "features/diversDocExtra/diversDocSlice";

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

const NewTemplateBody = () => {
  document.title = "Ajouter un Modèle | ENIGA";

  const navigate = useNavigate();
  const [addNewTemplateBody, { isLoading }] = useAddNewTemplateBodyMutation();
  const [createDiversDocExtraElement] = useCreateDiversDocExtraMutation();
  const { data: shortCodeList = [] } = useFetchShortCodeQuery();
  const { data: extraShortCodeList = [] } = useFetchExtraShortCodeQuery();


  const [documentName, setDocumemntName] = useState<string>('')

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

  //************************************************************************** */

  const initialTemplateBody = {
    _id: "",
    title: "",
    fileBase64: "",
    fileExtension: "",
    fileName: "",
    langue: "",
    intended_for: "",
    has_code: "0",
    has_number: "0",
  };


  const [templateBody, setTemplateBody] = useState(initialTemplateBody);
  const [diversDocData, setDiversDocData] = useState<any>({
    model_id: "",
    extra_data: [],
  });
  const [step, setStep] = useState(1);
  const [selectedLangue, setSelectedLangue] = useState("");
  const [selectedIntendedFor, setSelectedIntendedFor] = useState("");

  const [selectedShortCodes, setSelectedShortCodes] = useState<any[]>([]);

  const { title, fileBase64, fileExtension, langue, intended_for, has_code, has_number } =
    templateBody;

  const globalShortCodesAr = shortCodeList.filter(
    (code) => code.intended_for === "global" && code.langue === "arabic"
  );
  const globalShortCodesFr = shortCodeList.filter(
    (code) => code.intended_for === "global" && code.langue === "french"
  );

  const paramsShortCodes = shortCodeList.filter((code) => code.intended_for === 'params');

  const filteredShortCodeList = shortCodeList
    .filter((code) => code.intended_for !== "global")
    .filter(
      (code) =>
        (selectedLangue ? code.langue === selectedLangue : true) &&
        (selectedIntendedFor ? code.intended_for === selectedIntendedFor : true)
    );


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

  const handleFormSubmit = async () => {
    try {
      const result = await addNewTemplateBody(templateBody).unwrap();

      const selectedFileData = selectedFiles.map((id) => {
        const shortCode = fileShortCodes.find((f) => f._id === id);
        return {
          _id: shortCode?._id,
          fieldName: shortCode?.titre,
          data_type: "file",
          value: "",
          FileBase64: "",
          FileExtension: ""
        };
      });

      let extraRef = [...diversDocData.extra_data, ...selectedFileData];

      if (extraRef.length > 0) {
        const reqData = {
          model_id: result._id,
          extra_data: extraRef
        };
        const resultExtra = await createDiversDocExtraElement(reqData).unwrap();

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Le corps du modèle a été créé avec succès.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/template/liste-template-body");
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Le corps du modèle a été créé avec succès.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/template/liste-template-body");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la création du corps du modèle.",
      });
    }
  };


  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {

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

  };



  const handleCopyText = (body: string) => {
    let shortCodesRef = [...selectedShortCodes];

    const existed = shortCodesRef.filter(e => e === body);
    if (existed.length === 0) {
      shortCodesRef.push(body)
      copyToClipboard(body);
    } else {
      const index = shortCodesRef.findIndex(e => e === body);

      shortCodesRef.splice(index, 1);
      alert("Code court annulé, n'oubliez pas de le supprimer du document word!");
    }

    setSelectedShortCodes(shortCodesRef);
  };

  const handleCopyExtraText = (code: any) => {

    let extraRef = [...diversDocData.extra_data];

    const existed = extraRef.filter(e => e.fieldBody === code.body);
    if (existed.length === 0) {
      extraRef.push({
        options: code.options,
        data_type: code.data_type,
        fieldName: code.titre,
        fieldBody: code.body
      })
      copyToClipboard(code.body);
    } else {
      const index = extraRef.findIndex(e => e.fieldBody === code.body);

      extraRef.splice(index, 1);
      alert("Code court annulé, n'oubliez pas de le supprimer du document word!");
    }

    setDiversDocData((prevState: any) => ({
      ...prevState,
      extra_data: extraRef
    }));
  };

  const isDataSelectedForSimpleShortCodes = (code: any) => {

    let shortCodesRef = [...selectedShortCodes];

    const existed = shortCodesRef.filter(e => e === code.body);

    return existed.length === 0 ? false : true;
  }

  const isDataSelected = (code: any) => {
    let extraRef = [...diversDocData.extra_data];
    const existed = extraRef.filter(e => e.fieldName === code.titre);
    return existed.length === 0 ? false : true;
  }

  const copyToClipboard = (titre: string) => {
    if (titre === 'qr_code') {
      copy('{' + titre + '}\n{link}');
    } else {
      copy('{' + titre + '}');
    }
    alert('Code court copié!');
  };

  let filtredExtraShortCodes = [];

  if (langue === 'arabic') {

    filtredExtraShortCodes = extraShortCodeList.filter(e => e.langue === 'arabic')
  } else {
    filtredExtraShortCodes = extraShortCodeList.filter(e => e.langue === 'french')
  }


  const fileShortCodes = extraShortCodeList.filter(
    (code) => code.data_type === "file"
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);


  const handleFileShortcodeCheck = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };


  return (
    <Container fluid className="page-content">
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3 avatar-sm">
                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                    <i className="bi bi-person-lines-fill"></i>
                  </div>
                </div>
                <h5 className="card-title mb-0">Nouveau Modèle</h5>
              </div>

            </Card.Header>

            <Card.Body className="m-0">
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

                {step === 2 && (
                  <>

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
                            <Card.Header as="h5">📝 Mode d'emploi</Card.Header>
                            <Card.Body>
                              <ul className="ps-3">
                                <li>
                                  📄<strong>Préparer</strong> votre document <strong>format Microsoft Word</strong>, selon le modèle adopté à votre établissement.
                                </li>

                                <li>
                                  📋 <strong>Copiez</strong> les codes courts dont vous avez besoins depuis les sections <strong>Divers</strong>, <strong>Informations utilisateur</strong> et <strong>Références</strong> et <strong>les collez</strong> dans votre document final.
                                </li>
                                <li>
                                  🗑️ Si vous cliquez une seconde fois sur un code court, il sera <strong>supprimé du presse-papiers</strong>.
                                </li>
                                <li>
                                  📎 Si le modèle contient des champs de type <strong>fichier</strong>, les codes courts associés seront <strong>sélectionnés automatiquement</strong>.
                                </li>
                                <hr />
                                <p className="mb-2"><strong>📌 Instructions supplémentaires :</strong></p>
                                <p>
                                  ✅ <strong>Assurez-vous</strong> d’insérer les parenthèses comme des <strong>codes courts</strong> pour les documents rédigés en arabe.
                                </p>
                                <p>
                                  ✅ <strong>Vérifiez</strong> que votre document Word est correctement rempli avec tous les <strong>codes courts nécessaires</strong>.
                                </p>
                              </ul>
                            </Card.Body>
                          </Card>

                          <Card>
                            <Card.Header as="h5">
                              Références <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                Sélectionnez un ou plusieurs codes courts selon vos besoins
                              </div>
                            </Card.Header>
                            <Card.Body className="d-flex">
                              {paramsShortCodes.map((code: any) =>
                                <Button
                                  key={code._id}
                                  variant={isDataSelectedForSimpleShortCodes(code) === true ? "danger" : "info"}
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
                                    variant={isDataSelectedForSimpleShortCodes({ body: 'closed_parenthese' }) === true ? "danger" : "info"}
                                    onClick={() => handleCopyText('closed_parenthese')}
                                    size="sm"
                                    className="me-2 mb-2"
                                  >
                                    {'('}
                                  </Button>
                                  <Button
                                    variant={isDataSelectedForSimpleShortCodes({ body: 'open_parenthese' }) === true ? "danger" : "info"}
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
                              Informations d'établissement <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                Sélectionnez un ou plusieurs codes courts selon vos besoins
                              </div>
                            </Card.Header>
                            <Card.Body>
                              {displayShortCodeList.map((code: any) =>
                                code.intended_for === "global" ? (
                                  <Button
                                    key={code._id}
                                    variant={isDataSelectedForSimpleShortCodes(code) === true ? "danger" : "info"}
                                    onClick={() => handleCopyText(code.body)}
                                    size="sm"
                                    // onClick={() =>
                                    //   handleShortCodeInsertion(code.body)
                                    // }
                                    className="me-2 mb-2"
                                  >
                                    <div style={{ fontSize: "1.05rem" }} >
                                      {code.titre}
                                    </div>
                                  </Button>
                                ) : (
                                  <></>
                                )
                              )}
                            </Card.Body>
                          </Card>

                          <Card>
                            {selectedIntendedFor === "etudiant" && (
                              <Card.Header as="h5">
                                Informations étudiant <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                  Sélectionnez un ou plusieurs codes courts selon vos besoins
                                </div>
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "enseignant" && (
                              <Card.Header as="h5">
                                Informations enseignant <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                  Sélectionnez un ou plusieurs codes courts selon vos besoins
                                </div>
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "personnel" && (
                              <Card.Header as="h5">
                                Informations personnel <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                  Sélectionnez un ou plusieurs codes courts selon vos besoins
                                </div>
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "examen" && (
                              <Card.Header as="h5">
                                Informations examen <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                  Sélectionnez un ou plusieurs codes courts selon vos besoins
                                </div>
                              </Card.Header>
                            )}
                            {selectedIntendedFor === "mission" && (
                              <Card.Header as="h6">
                                Informations de tâche <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                  Sélectionnez un ou plusieurs codes courts selon vos besoins
                                </div>
                              </Card.Header>
                            )}
                            <Card.Body>
                              {displayShortCodeList.map((code: any) =>
                                code.intended_for !== "global" ? (
                                  <Button
                                    key={code._id}
                                    variant={isDataSelectedForSimpleShortCodes(code) === true ? "danger" : "secondary"}
                                    size="sm"
                                    onClick={() => handleCopyText(code.body)}
                                    // onClick={() =>
                                    //   handleShortCodeInsertion(code.body)
                                    // }
                                    className="me-2 mb-2"
                                  >
                                    <div style={{ fontSize: "1.05rem" }} >
                                      {code.titre}
                                    </div>
                                  </Button>
                                ) : (
                                  <></>
                                )
                              )}
                            </Card.Body>
                          </Card>

                          <Card>
                            <Card.Header as="h5">
                              Divers
                              <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                Sélectionnez un ou plusieurs codes courts selon vos besoins
                              </div>
                            </Card.Header>
                            <Card.Body>
                              {filtredExtraShortCodes
                                .filter((code: any) => (code.data_type || "").trim() !== "file")
                                .map((code: any) => (
                                  <Button
                                    key={code?._id}
                                    size="sm"
                                    onClick={() => handleCopyExtraText(code)}
                                    variant={isDataSelected(code) ? "danger" : "primary"}
                                    className="me-2 mb-2"
                                  >
                                    <div style={{ fontSize: "1.05rem" }}>
                                      {code?.titre}
                                    </div>
                                  </Button>
                                ))
                              }
                            </Card.Body>
                          </Card>

                          {fileShortCodes.length > 0 && (
                            <Card>
                              <Card.Header as="h5">
                                Pièces demandées
                                <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                                  Sélectionnez un ou plusieurs codes courts selon vos besoins
                                </div>

                              </Card.Header>
                              <Card.Body>
                                {fileShortCodes.map((fileCode) => (
                                  <Form.Check
                                    type="checkbox"
                                    key={fileCode._id}
                                    label={fileCode.titre}
                                    checked={selectedFiles.includes(fileCode._id)}
                                    onChange={() => handleFileShortcodeCheck(fileCode._id)}
                                  />
                                ))}
                              </Card.Body>
                            </Card>


                          )}
                          <Card>
                            <Card.Header as="h5">Génération modèle</Card.Header>
                            <Card.Body>
                              <Row className="mt-4 align-items-center">
                                <Col lg={12} className="mb-3">
                                  <div className="text-muted">
                                    Veuillez d'abord ajouter un document Word modèle avant de procéder à la génération.
                                  </div>
                                </Col>

                                <Col lg={4}>
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
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                      <i className="bi bi-cloud-arrow-up fs-20 me-1"></i>
                                      Ajouter un modèle Word
                                    </div>
                                  </label>
                                  {documentName && (
                                    <div className="mt-2 text-success fw-semibold">{documentName}</div>
                                  )}
                                </Col>
                              </Row>

                              {documentName !== '' && (
                                <Row className="mt-4 align-items-center">
                                  <Col lg={6}>
                                    <div className="text-muted">
                                      Une fois le modèle ajouté, cliquez sur le bouton pour générer le document.
                                    </div>
                                  </Col>
                                  <Col lg={6} className="text-end">
                                    <Button
                                      variant="success"
                                      disabled={isLoading}
                                      onClick={handleFormSubmit}
                                    >
                                      {isLoading ? (
                                        <Spinner as="span" animation="border" size="sm" />
                                      ) : (
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                          <i className="bi bi-file-earmark-plus fs-20 me-1"></i>
                                          Générer modèle
                                        </div>
                                      )}
                                    </Button>
                                  </Col>
                                </Row>
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

export default NewTemplateBody;
