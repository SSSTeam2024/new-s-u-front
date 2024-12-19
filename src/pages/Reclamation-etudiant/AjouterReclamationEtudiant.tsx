import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import {
  useAddReclamationMutation,
  Reclamation,
} from "features/reclamationEtudiant/recalamationEtudiantSlice";
import {
  useFetchEtudiantsQuery,
  Etudiant,
} from "features/etudiant/etudiantSlice";
import { Classe, useFetchClassesQuery } from "features/classe/classe";
import { useNavigate } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";

const AjouterReclamationEtudiant = () => {
  document.title = "Ajouter Reclamation Etudiant | Smart University";
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [addReclamationEtudiant] = useAddReclamationMutation();
  const { data: etudiants } = useFetchEtudiantsQuery();
  const etudiant: Etudiant[] = Array.isArray(etudiants) ? etudiants : [];

  const { data: classes } = useFetchClassesQuery();
  const classe: Classe[] = Array.isArray(classes) ? classes : [];
  const [selectedClasse, setSelectedClasse] = useState<string | null>(null); // To store selected class
  const handleClassSelect = (selectedOption: any) => {
    setSelectedClasse(selectedOption.value); // Set selected class ID
  };
  // Filter students based on selected class
  const filteredEtudiants = selectedClasse
    ? etudiant.filter(
        (etudiant) => etudiant.groupe_classe._id === selectedClasse
      )
    : etudiant; // Show all students if no class is selected

  const [formData, setFormData] = useState<Partial<Reclamation>>({
    _id: "",
    studentId: "",
    title: "",
    description: "",
    response: "",
    status: "",
    createdAt: undefined,
    updatedAt: undefined,
    pdf: "",
    pdfBase64String: "",
    pdfExtension: "",
    video: "",
    videoBase64String: "",
    videoExtension: "",
    photos: [],
    galleryBase64Strings: [],
    galleryExtensions: [],
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSelectChange = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      studentId: selectedOption.value,
    }));
  };

  const onDescriptionChange = (event: any, editor: any) => {
    const data = editor.getData();
    setFormData((prevState) => ({
      ...prevState,
      description: data,
    }));
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      setSelectedDate(selectedDates[0]);
    } else {
      setSelectedDate(null);
    }
  };

  const onSubmitReclamationEtudiant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await addReclamationEtudiant(formData).unwrap();
      notify();
      navigate("/reclamation-etudiant/liste-reclamation-etudiant");
    } catch (error) {
      console.error("Failed to create reclamation:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la création de la réclamation.",
      });
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Avis has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const [, base64Data] = base64String.split(","); // Extract only the Base64 data
        const extension = file.name.split(".").pop() ?? ""; // Get the file extension
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  const handleAcceptedFiles = async (files: File[]) => {
    const base64Images = await Promise.all(
      files.map(async (file: File) => {
        const { base64Data, extension } = await convertToBase64(file);
        return {
          base64Data,
          extension,
          fileName: file.name,
        };
      })
    );

    setFormData((prevState) => ({
      ...prevState,
      photos: base64Images.map((img) => img.base64Data + "." + img.extension),
      galleryBase64Strings: base64Images.map((img) => img.base64Data),
      galleryExtensions: base64Images.map((img) => img.extension),
    }));
  };

  const handleDeleteFile = (indexToRemove: number) => {
    setFormData((prevData) => {
      const newGallery = prevData.photos?.filter(
        (_, index) => index !== indexToRemove
      );
      const newGalleryBase64Strings = prevData.galleryBase64Strings?.filter(
        (_, index) => index !== indexToRemove
      );
      const newGalleryExtension = prevData.galleryExtensions?.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prevData,
        photos: newGallery,
        galleryBase64Strings: newGalleryBase64Strings,
        galleryExtensions: newGalleryExtension,
      };
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-lines-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">
                          Nouvelle reclamation etudiant
                        </h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitReclamationEtudiant}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                          type="text"
                          id="title"
                          value={formData.title ?? ""}
                          onChange={onChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={formData.description}
                          onChange={onDescriptionChange}
                          id="description"
                        />
                      </Form.Group>
                    
                      <Form.Group className="mb-3">
                        <Form.Label>Classe</Form.Label>
                        <Select
                          options={classe.map((c) => ({
                            value: c._id,
                            label: c.nom_classe_fr,
                          }))}
                          onChange={handleClassSelect} // Update the selected class
                        />
                      </Form.Group>
                      {selectedClasse && (
                        <Form.Group className="mb-3">
                          <Form.Label>Etudiant</Form.Label>
                          <Select
                            options={filteredEtudiants.map((c) => ({
                              value: c._id,
                              label: `${c.prenom_fr} ${c.nom_fr}`,
                            }))}
                            onChange={onSelectChange} // Use the existing handler for student selection
                          />
                        </Form.Group>
                      )}
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                          }}
                          value={selectedDate ? [selectedDate] : []}
                          onChange={handleDateChange}
                          id="date_avis"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Vidéo</Form.Label>
                        <Form.Control
                          type="file"
                          accept="video/*"
                          onChange={async (e) => {
                            const input = e.target as HTMLInputElement;
                            const file = input.files?.[0];
                            if (file) {
                              const { base64Data, extension } =
                                await convertToBase64(file);
                              setFormData((prev) => ({
                                ...prev,
                                videoBase64String: base64Data,
                                videoExtension: extension,
                              }));
                            }
                          }}
                        />
                      </Form.Group>
                      {formData.videoBase64String && (
                        <div className="video-preview mt-3">
                          <video controls width="100%">
                            <source
                              src={`data:video/${formData.videoExtension};base64,${formData.videoBase64String}`}
                              type={`video/${formData.videoExtension}`}
                            />
                            Your browser does not support the video tag.
                          </video>
                          <Button
                            className="mt-2"
                            variant="danger"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                videoBase64String: "",
                                videoExtension: "",
                              }))
                            }
                          >
                            Supprimer la vidéo
                          </Button>
                        </div>
                      )}
                      <Form.Group className="mb-3">
                        <Form.Label>PDF</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf"
                          onChange={async (e) => {
                            const input = e.target as HTMLInputElement;
                            const file = input.files?.[0];
                            if (file) {
                              const { base64Data, extension } =
                                await convertToBase64(file);
                              setFormData((prev) => ({
                                ...prev,
                                pdfBase64String: base64Data,
                                pdfExtension: extension,
                              }));
                            }
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Galerie</Form.Label>
                        <Dropzone
                          onDrop={(acceptedFiles) =>
                            handleAcceptedFiles(acceptedFiles)
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              className="dropzone dz-clickable text-center"
                              {...getRootProps()}
                            >
                              <div className="dz-message needsclick">
                                <div className="mb-3">
                                  <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                </div>
                                <h5>
                                  Déposez des photos ici ou cliquez pour
                                  télécharger.
                                </h5>
                              </div>
                              <input {...getInputProps()} />
                            </div>
                          )}
                        </Dropzone>

                        {formData.photos && formData.photos.length > 0 && (
                          <div className="row mt-3">
                            {formData.photos.map((fileName, index) => (
                              <div key={index} className="col-md-3">
                                <Card>
                                  <Card.Body>
                                    <img
                                      src={`data:image/${formData.galleryExtensions?.[index]};base64,${formData.galleryBase64Strings?.[index]}`}
                                      alt={`preview ${index}`}
                                      className="img-fluid"
                                    />
                                    <Button
                                      className="mt-2"
                                      variant="danger"
                                      onClick={() => handleDeleteFile(index)}
                                    >
                                      Supprimer
                                    </Button>
                                  </Card.Body>
                                </Card>
                              </div>
                            ))}
                          </div>
                        )}
                      </Form.Group>
                      <div className="text-end">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              "/reclamation-etudiant/liste-reclamation-etudiant"
                            )
                          }
                        >
                          Annuler
                        </Button>
                        <Button variant="primary" type="submit">
                          Envoyer
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterReclamationEtudiant;
