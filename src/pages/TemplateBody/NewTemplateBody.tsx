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
import JoditEditor from "jodit-react";
import { renderAsync } from "docx-preview";
// import * as docx from "docx-preview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useFetchVirtualServicesQuery } from "features/virtualService/virtualServiceSlice";
import { useFetchAllUsersQuery } from "features/account/accountSlice";
import Select from "react-select";
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

  const { data: virtualServices = [] } = useFetchVirtualServicesQuery();

  const { data: admins = [] } = useFetchAllUsersQuery();

  //************************************************************************** */

  const customStyles = {
    multiValue: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
    }),
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
      color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "white",
      backgroundColor: "#4b93ff",
      ":hover": {
        backgroundColor: "#4b93ff",
        color: "white",
      },
    }),
  };

  const [content, setContent] = useState<any>("");

  const previewContainer: any = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");

  const rangeRef: any = useRef(null);

  const [canSaveTemplate, setCanSaveTemplate] = useState<boolean>(false);

  const [isDocumentLoaded, setIsDocumentLoaded] = useState<boolean>(false);

  const [withQrCode, setWithQrCode] = useState<boolean>(false);

  const [withNumber, setWithOrderNumber] = useState<boolean>(false);

  const [documentName, setDocumemntName] = useState<string>('')

  // const handleFileUpload = async (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e: any) => {
  //       const arrayBuffer = e.target.result;

  //       if (previewContainer.current) {
  //         previewContainer.current.innerHTML = "";

  //         await renderAsync(arrayBuffer, previewContainer.current);

  //         const updatedHTML = await convertImagesToBase64(
  //           previewContainer.current.innerHTML
  //         );
  //         previewContainer.current.innerHTML = updatedHTML;

  //         setIsDocumentLoaded(true);
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  //   previewContainer.current.contentEditable = true;
  // };

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


  const convertImagesToBase64 = async (html: string): Promise<string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const images: any = doc.querySelectorAll("img");

    for (const img of images) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("blob:")) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();

          const base64 = await convertBlobToBase64(blob);

          img.setAttribute("src", base64);
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      }
    }

    return doc.documentElement.innerHTML;
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  ////////////////////////////////////////////////

  // Capture cursor position
  const captureCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      rangeRef.current = selection.getRangeAt(0);
    }
  };

  const handleInsertWord = () => {
    if (rangeRef.current && selectedWord) {
      const span = document.createElement("span");
      span.textContent = selectedWord;
      rangeRef.current.insertNode(span);
      rangeRef.current.collapse(false); // Move cursor to the end of the inserted word
      rangeRef.current = null; // Clear the range
    }
  };

  const handleShortCodeInsertion = (code: string) => {
    setCanSaveTemplate(false);
    if (rangeRef.current && code) {
      const span = document.createElement("span");
      span.textContent = code;
      rangeRef.current.insertNode(span);
      rangeRef.current.collapse(false); // Move cursor to the end of the inserted word
      rangeRef.current = null; // Clear the range
    }
  };

  const handleQrCodeInsertion = () => {
    setCanSaveTemplate(false);

    if (rangeRef.current) {
      const img = document.createElement("img");

      img.src = "https://qrcg-free-editor.qr-code-generator.com/latest/assets/images/websiteQRCode_noFrame.png"; // Fake QR code image
      img.alt = "QR Code";
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.margin = "5px";

      const paragraph = document.createElement("p");
      paragraph.style.marginTop = "5px";
      paragraph.style.fontSize = "11px";
      paragraph.style.fontStyle = "italic";
      paragraph.style.color = "#0d87b5";

      if (selectedLangue === 'arabic') {
        paragraph.textContent = "امسح هذا الرمز للتحقق من صحة المستند عبر الإنترنت";
      } else {
        paragraph.textContent = "Scanner ce code pour vérifier l’intégrité de ce document en ligne";
      }

      const container = document.createElement("div");
      container.className = 'qr-container';
      container.appendChild(img);
      container.appendChild(paragraph);

      rangeRef.current.insertNode(container);
      rangeRef.current.collapse(false); // Move cursor to the end
      rangeRef.current = null; // Clear the range

      setTemplateBody((prevState) => ({
        ...prevState,
        has_code: '1'
      }));

      setWithQrCode(true);
    }
  };

  const removeQrContainer = () => {
    const qrContainer = document.querySelector(".qr-container");
    if (qrContainer) {
      qrContainer.remove();
    }
    setTemplateBody((prevState) => ({
      ...prevState,
      has_code: '0'
    }));
    setWithQrCode(false);
  };

  const handleOrderNumberInsertion = () => {
    setCanSaveTemplate(false);

    if (rangeRef.current) {

      const span = document.createElement("span");
      if (selectedLangue === 'arabic') {
        span.textContent = "عدد الرقم/السنة";
      } else {
        span.textContent = "N° num/annee";
      }
      span.style.fontSize = "14px";
      span.className = 'order-number';

      rangeRef.current.insertNode(span);
      rangeRef.current.collapse(false); // Move cursor to the end
      rangeRef.current = null; // Clear the range

      setTemplateBody((prevState) => ({
        ...prevState,
        has_number: '1'
      }));

      setWithOrderNumber(true);
    }
  };

  const removeOrderNumber = () => {
    const qrContainer = document.querySelector(".order-number");
    if (qrContainer) {
      qrContainer.remove();
    }
    setTemplateBody((prevState) => ({
      ...prevState,
      has_number: '0'
    }));

    setWithOrderNumber(false);
  };

  const handleSaveEdited = () => {
    if (previewContainer.current) {
      const editedContent = previewContainer.current.innerHTML;

      // setContent(JSON.stringify(editedContent));
      setTemplateBody((prevState) => ({
        ...prevState,
        body: JSON.stringify(editedContent),
      }));
      setCanSaveTemplate(true);
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


  const onChangeService = (e: React.ChangeEvent<HTMLSelectElement>) => {

    setTemplateBody((prevState) => ({
      ...prevState,
      services: e.target.value,
    }));
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

  const handleBodyChange = (newContent: any) => {
    const tableMatches = newContent.match(/<table>/gi) || [];
    const numberOfTables = tableMatches.length;

    setTemplateBody((prevState) => ({
      ...prevState,
      body: newContent,
      isArray: numberOfTables > 0 ? "1" : "0",
      arraysNumber: numberOfTables.toString(),
    }));
  };

  const handleFormSubmit =
    async () => {

      try {

        const result = await addNewTemplateBody(templateBody).unwrap();

        let extraRef = [...diversDocData.extra_data];

        if (extraRef.length > 0) {
          const reqData = {
            model_id: result._id,
            extra_data: diversDocData.extra_data
          }
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

  const handleKeyDown = (event: any, editor: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of the Enter key
      editor.model.change((writer: any) => {
        const position = editor.model.document.selection.getFirstPosition();
        writer.insertElement("softBreak", position); // Insert a line break
      });
    }
  };
  const editor = useRef(null);

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

              {step === 2 && (
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
              )}
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
                      <Col lg={8}>
                        {/* {templateBody.services.map(
                          (service: any, index: number) => ( */}
                        <Row>
                          {/* <Col lg={3}>
                            <Form.Group controlId="service">
                              <Form.Label>Espace</Form.Label>
                              <Form.Select
                                value={templateBody.services}
                                onChange={(e) => {
                                  onChangeService(e);
                                }}
                                className="text-muted"
                              >
                                <option value="">Sélectionner Espace</option>
                                <option value="Demande_Etudiant">
                                  Demande Etudiant
                                </option>
                                <option value="Demande_Enseignant">
                                  Demande Enseignant
                                </option>
                                <option value="Demande_Personnel">
                                  Demande Personnel
                                </option>
                                <option value="Gestion_Examen">
                                  Gestion Examen
                                </option>
                                <option value="Gestion_Stage">
                                  Gestion Stage
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col> */}
                          {/* <Col lg={3}>
                                <Form.Group controlId="intended_for">
                                  <Form.Label>
                                    {index === 0 ? <>Admin conserné</> : <></>}
                                  </Form.Label>
                                  <Form.Select
                                    value={service?.adminData?.id!}
                                    onChange={(e) => {
                                      onChangeAdmin(e, index);
                                    }}
                                    className="text-muted"
                                  >
                                    <option value="">Sélectionner Admin</option>
                                    {service.admins.map((admin: any) => (
                                      <option value={admin?._id!}>
                                        {admin?.login!}
                                      </option>
                                    ))}
                                    
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col lg={4}>
                                <Form.Group controlId="service">
                                  <Form.Label>
                                    {index === 0 ? <>Page conserné</> : <></>}
                                  </Form.Label>
                                  <Form.Select
                                    value={service?.pageData?.id!}
                                    onChange={(e) => {
                                      onChangePage(e, index);
                                    }}
                                    className="text-muted"
                                  >
                                    <option value="">Sélectionner Page</option>
                                    {service.pages.map((page: any) => (
                                      <option value={page?.id!}>
                                        {page?.p_name!}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col lg={2}>
                                <Button
                                  className="mt-4"
                                  variant="danger"
                                  onClick={() => removeLine(index)}
                                >
                                  <i className="bi bi-trash-fill"></i>
                                </Button>
                              </Col> */}
                        </Row>
                        {/* )
                        )} */}
                        {/* <Row className="mt-2">
                          <Col lg={12}>
                            <Button variant="info" onClick={addNewLine}>
                              <i
                                className="bi bi-plus"
                                style={{ fontSize: "15px" }}
                              ></i>
                            </Button>
                          </Col>
                        </Row> */}
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
                            Ajouter un modèle Word
                          </div>
                          <span>{documentName}</span>
                        </label>

                      </Col>
                      <Col lg={5} style={{ textAlign: "start" }}>

                      </Col>
                      <Col lg={4} style={{ borderRadius: '5px', border: '1px solid #e1e1e1', padding: '10px', background: '#ffe0a880', fontWeight: '400', textAlign: "start" }}>
                        Vérifier que votre document word est bien rempli avec les codes courts necessaires.
                      </Col>
                    </Row>
                    {selectedLangue === 'arabic' && (
                      <Row style={{ marginTop: '10px' }}>
                        <Col lg={3}></Col>
                        <Col lg={5}></Col>
                        <Col lg={4} style={{ borderRadius: '5px', border: '1px solid #e1e1e1', padding: '10px', background: 'rgb(254 185 255 / 50%)', fontWeight: '400', textAlign: "start" }}>
                          Assurez que vous insérez les parenthèses comme des codes courts pour les documents en arabe.
                        </Col>
                      </Row>
                    )}

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
                              Informations d'établissement
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
                            </Card.Header>
                            <Card.Body>
                              {filtredExtraShortCodes.map((code: any) =>

                                <Button
                                  key={code?._id!}
                                  size="sm"
                                  onClick={() => handleCopyExtraText(code)}
                                  variant={isDataSelected(code) === true ? "danger" : "primary"}
                                  // onClick={() =>
                                  //   handleShortCodeInsertion(code.body)
                                  // }
                                  className="me-2 mb-2"
                                >
                                  <div style={{ fontSize: "1.05rem" }} >
                                    {code?.titre!}
                                  </div>

                                </Button>

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
