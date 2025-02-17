import React, { useState, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useFetchVirtualServicesQuery } from "features/virtualService/virtualServiceSlice";
import { useFetchAllUsersQuery } from "features/account/accountSlice";
import Select from "react-select";

const NewTemplateBody = () => {
  document.title = "Ajouter un Modèle | ENIGA";

  const navigate = useNavigate();
  const [addNewTemplateBody, { isLoading }] = useAddNewTemplateBodyMutation();
  const { data: shortCodeList = [] } = useFetchShortCodeQuery();

  const { data: virtualServices = [] } = useFetchVirtualServicesQuery();

  const { data: admins = [] } = useFetchAllUsersQuery();

  console.log(admins);

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

  // const handleFileUpload = async (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e: any) => {
  //       const arrayBuffer = e.target.result;
  //       if (previewContainer.current) {
  //         previewContainer.current.innerHTML = ""; // Clear existing content
  //         await renderAsync(arrayBuffer, previewContainer.current);
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  //   previewContainer.current.contentEditable = true;
  //   setIsDocumentLoaded(true);
  // };

  /////////////////////////////////////////////////

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;

        if (previewContainer.current) {
          previewContainer.current.innerHTML = "";

          await renderAsync(arrayBuffer, previewContainer.current);

          const updatedHTML = await convertImagesToBase64(
            previewContainer.current.innerHTML
          );
          previewContainer.current.innerHTML = updatedHTML;

          setIsDocumentLoaded(true);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    previewContainer.current.contentEditable = true;
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
      const paragraph2 = document.createElement("p");
      if(selectedLangue === 'arabic'){
        paragraph.textContent = "امسح هذا الرمز للتحقق من صحة المستند عبر الإنترنت";
         paragraph.style.marginTop = "5px";
      paragraph.style.fontSize = "11px";
      paragraph.style.fontStyle = "italic";

      paragraph2.textContent = "https://verify.eniga.tn/id=*******";
      paragraph2.style.marginTop = "5px";
   paragraph2.style.fontSize = "11px";
   paragraph2.style.fontStyle = "italic";

      const container = document.createElement("div");
      container.className = 'qr-container';
      container.appendChild(img);
      container.appendChild(paragraph);
      container.appendChild(paragraph2);
      rangeRef.current.insertNode(container);
      }else{
        paragraph.style.marginTop = "5px";
      paragraph.style.fontSize = "11px";
      paragraph.style.fontStyle = "italic";

      const container = document.createElement("div");
      container.className = 'qr-container';
      container.appendChild(img);
      container.appendChild(paragraph);
        paragraph.textContent = "Scanner ce code pour vérifier l’intégrité de ce document en ligne https://verify.eniga.tn/id=******";
        rangeRef.current.insertNode(container);
      }
     

      
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
      if(selectedLangue === 'arabic'){
        span.textContent = "عدد الرقم/السنة";
      }else{
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
      console.log("Edited Content:", editedContent);

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
    body: "",
    langue: "",
    intended_for: "",
    has_code: "0",
    has_number: "0",
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

  // const onChangePage = (
  //   e: React.ChangeEvent<HTMLSelectElement>,
  //   index: number
  // ) => {
  //   console.log(e.target.value);
  //   console.log(index);

  //   let servicesRef = [...templateBody.services];
  //   let page: any = servicesRef[index].pages.filter(
  //     (p: any) => p.id === e.target.value
  //   );

  //   console.log(page);

  //   servicesRef[index].pageData.id = page[0]?.id!;
  //   servicesRef[index].pageData.pageName = page[0]?.name!;

  //   console.log(servicesRef[index]);

  //   setTemplateBody((prevState) => ({
  //     ...prevState,
  //     services: servicesRef,
  //   }));
  // };

  // const onChangeAdmin = (
  //   e: React.ChangeEvent<HTMLSelectElement>,
  //   index: number
  // ) => {
  //   console.log(e.target.value);
  //   console.log(index);

  //   let servicesRef = [...templateBody.services];
  //   let admin = admins.filter((a) => a._id === e.target.value);

  //   servicesRef[index].adminData.id = e.target.value;
  //   servicesRef[index].adminData.login = admin[0].login;

  //   let permissions = admin[0].permissions.filter(
  //     (p: any) => p.documentEdition !== "no"
  //   );

  //   servicesRef[index].pages = permissions.map((p: any) => {
  //     return { id: p._id, p_name: p.name };
  //   });

  //   console.log(servicesRef[index].pages);

  //   setTemplateBody((prevState) => ({
  //     ...prevState,
  //     services: servicesRef,
  //   }));
  // };

  const onChangeService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);

    // let servicesRef = [...templateBody.services];
    // let service = virtualServices.filter((s) => s._id === e.target.value);

    // servicesRef[index].serviceData.id = e.target.value;
    // servicesRef[index].serviceData.title = service[0].title;

    // let adminsPerService: any = admins.filter(
    //   (a) => a.service._id === e.target.value
    // );
    // servicesRef[index].admins = adminsPerService;
    // servicesRef[index].pages = [];

    setTemplateBody((prevState) => ({
      ...prevState,
      services: e.target.value,
    }));
  };

  // const addNewLine = () => {
  //   let servicesRef = [...templateBody.services];
  //   servicesRef.push({
  //     serviceData: { id: "", title: "" },
  //     adminData: { id: "", login: "" },
  //     pageData: { id: "", pageName: "" },
  //     admins: [],
  //     pages: [],
  //   });
  //   setTemplateBody((prevState) => ({
  //     ...prevState,
  //     services: servicesRef,
  //   }));
  // };

  // const removeLine = (index: number) => {
  //   let servicesRef = [...templateBody.services];

  //   servicesRef.splice(index, 1);

  //   setTemplateBody((prevState) => ({
  //     ...prevState,
  //     services: servicesRef,
  //   }));
  // };

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

  // const handleBodyChange = (event:any, editor:any) => {
  //   const data = editor.getData();

  //   const tableMatches = data.match(/<table>/gi) || [];
  //   const numberOfTables = tableMatches.length;

  //   setTemplateBody((prevState) => ({
  //     ...prevState,
  //     body: data,
  //     isArray: numberOfTables > 0 ? "1" : "0",
  //     arraysNumber: numberOfTables.toString(),
  //   }));
  // };

  const config = {
    readonly: false,
    height: 652,
    width: 595,
    toolbarAdaptive: false,
    toolbarSticky: false,
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "table",
      "link",
      "|",
      "align",
      "|",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "fullsize",
    ],
    controls: {
      font: {
        list: {
          Arial: "Arial, Helvetica, sans-serif",
          "Times New Roman": "Times New Roman, serif",
          "Courier New": "Courier New, Courier, monospace",
          Georgia: "Georgia, serif",
          Tahoma: "Tahoma, Geneva, sans-serif",
          Verdana: "Verdana, Geneva, sans-serif",
        },
      },
    },
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
    async (/* e: React.FormEvent<HTMLFormElement> */) => {
      // e.preventDefault();
      try {
        console.log(templateBody);
        await addNewTemplateBody(templateBody).unwrap();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Le corps du modèle a été créé avec succès.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/template/liste-template-body");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue lors de la création du corps du modèle.",
        });
      } //finally {
      //   setTemplateBody(initialTemplateBody);
      // }
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

  // const config = {
  //   readonly: false, // Allow editing
  //   height: 842, // Approximate A4 height in pixels
  //   width: 595,  // Approximate A4 width in pixels
  //   toolbarAdaptive: false, // Ensures the toolbar shows all items
  //   toolbarSticky: false, // Keeps the toolbar at the top
  //   buttons: [
  //     'source', '|',
  //     'bold', 'italic', 'underline', 'strikethrough', '|',
  //     'superscript', 'subscript', '|',
  //     'ul', 'ol', '|',
  //     'outdent', 'indent', '|',
  //     'font', 'fontsize', 'brush', 'paragraph', '|',
  //     'table', 'link', '|',
  //     'align', '|',
  //     'undo', 'redo', '|',
  //     'hr', 'eraser', 'fullsize'
  //   ]
  // };

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
              <h5 className="card-title mb-0">Nouveau Modèle</h5>
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
                        {/* <Form.Label>Corps</Form.Label> */}

                        {/* <label
                          htmlFor="docInput"
                          className="m-2"
                          data-bs-toggle="tooltip"
                          data-bs-placement="right"
                          title="Choisir un fichier .docx"
                        >
                          <span className="avatar-xs d-inline-block">
                            <span
                              className="avatar-title bg-light border rounded-circle text-muted cursor-pointer"
                            >
                              <i className="ri-article-line fs-24"></i>
                            </span>
                          </span>
                        </label> */}
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
                        </label>
                        
                      </Col>
                      <Col lg={5} style={{ textAlign: "end" }}>
                        <Button
                          variant="warning"
                          onClick={handleSaveEdited}
                          disabled={
                            canSaveTemplate === true ||
                            isDocumentLoaded === false
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
                          // type="submit"
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
                              Générer modèle
                            </div>
                          )}
                        </Button>
                        <Col lg={4}></Col>
                        {/* <div className="center">
                          <JoditEditor
                            ref={editor}
                            value={body}
                            config={config}
                            onBlur={(newContent) =>
                              handleBodyChange(newContent)
                            }
                          />
                        </div> */}
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={8}>
                        <div
                          ref={previewContainer}
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginTop: "20px",
                            minHeight: "300px",
                          }}
                          onMouseUp={captureCursorPosition}
                        ></div>
                      </Col>
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
