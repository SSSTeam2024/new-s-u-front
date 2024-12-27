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

const NewTemplateBody = () => {
  document.title = "Ajouter Corps du Modèle | Smart Institute";

  const navigate = useNavigate();
  const [addNewTemplateBody, { isLoading }] = useAddNewTemplateBodyMutation();
  const { data: shortCodeList = [] } = useFetchShortCodeQuery();

  //************************************************************************** */

  const [content, setContent] = useState<any>("");

  const previewContainer: any = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");

  const rangeRef: any = useRef(null);

  const [canSaveTemplate, setCanSaveTemplate] = useState<boolean>(false);

  const [isDocumentLoaded, setIsDocumentLoaded] = useState<boolean>(false);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        if (previewContainer.current) {
          previewContainer.current.innerHTML = ""; // Clear existing content
          await renderAsync(arrayBuffer, previewContainer.current);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    previewContainer.current.contentEditable = true;
    setIsDocumentLoaded(true);
  };

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

  const handleSaveEdited = () => {
    if (previewContainer.current) {
      const editedContent = previewContainer.current.innerHTML;
      console.log("Edited Content:", editedContent);
      // You can save or send this content as needed
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
    isArray: "0",
    arraysNumber: "0",
  };

  const [templateBody, setTemplateBody] = useState(initialTemplateBody);
  const [step, setStep] = useState(1);
  const [selectedLangue, setSelectedLangue] = useState("");
  const [selectedIntendedFor, setSelectedIntendedFor] = useState("");

  const { title, body, langue, intended_for, isArray, arraysNumber } =
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
  let displayShortCodeList = [];
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

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);

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
              <h5 className="card-title mb-0">Nouveau Corps du Modèle</h5>
            </Card.Header>

            <Card.Body>
              <Form /* onSubmit={handleFormSubmit} */>
                {step === 1 && (
                  <>
                    <Row>
                      <Col lg={4}>
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
                      <Col lg={4}>
                        <Form.Group controlId="intended_for">
                          <Form.Label>Destiné aux</Form.Label>
                          <Form.Select
                            value={intended_for}
                            onChange={onChangeIntendedFor}
                            className="text-muted"
                          >
                            <option value="">Sélectionner</option>
                            <option value="enseignant">Enseignants</option>
                            <option value="etudiant">Étudiants</option>
                            <option value="personnel">Personnels</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="primary" onClick={handleNextStep}>
                        Suivant
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Form.Group controlId="title">
                          <Form.Label>Titre</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Entrer titre"
                            value={title}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg={12}>
                        <Form.Label>Corps</Form.Label>
                        <div className="mb-3">
                          {displayShortCodeList.map((code) => (
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
                          ))}
                        </div>
                        <input
                          type="file"
                          accept=".docx"
                          onChange={handleFileUpload}
                        />
                        <button
                          onClick={handleSaveEdited}
                          disabled={
                            canSaveTemplate === true ||
                            isDocumentLoaded === false
                          }
                        >
                          Enregistrer les modifications
                        </button>

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

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handlePreviousStep}>
                        Précédent
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading || canSaveTemplate === false}
                        onClick={handleFormSubmit}
                      >
                        {isLoading ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          "Ajouter Corps"
                        )}
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
