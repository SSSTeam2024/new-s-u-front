import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row
} from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { useAddAvisEtudiantMutation, Avis } from "features/avisEtudiant/avisEtudiantSlice";
import { Classe, useFetchClassesQuery } from "features/classe/classe";
import { useNavigate } from "react-router-dom";
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice'; 


const AjouterAvisEtudiant = () => {
  document.title = "Ajouter Avis Etudiant | Smart University";
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [addAvisEtudiant] = useAddAvisEtudiantMutation();
  const { data: classes } = useFetchClassesQuery();
  const classe: Classe[] = Array.isArray(classes) ? classes : [];

  
  const [formData, setFormData] = useState<Partial<Avis>>({
    _id: "",
    title: "",
    description: "",
    auteurId:user?._id,
    groupe_classe: [],
    date_avis: "",
    lien: "",
    pdf: "",
    pdfBase64String: "",
    pdfExtension: "",
    gallery: [],
    galleryBase64Strings: [],
    galleryExtensions: [],
    createdAt:""
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSelectChange = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      groupe_classe: selectedOption.value,
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

  const onSubmitAvisEtudiant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addAvisEtudiant(formData).then(() => setFormData(formData));
    notify();
    navigate("/avis-etudiant/liste-avis-etudiant");
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

  function convertToBase64(file: File): Promise<{ base64Data: string; extension: string }> {
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
          fileName: file.name
        };
      })
    );
    
    setFormData((prevState) => ({
      ...prevState,
      gallery: base64Images.map(img => img.base64Data + "." + img.extension),
      galleryBase64Strings: base64Images.map(img => img.base64Data),
      galleryExtensions: base64Images.map(img => img.extension)
    }));
  };
  console.log("galleryExtension", formData)
  const handleDeleteFile = (indexToRemove: number) => {
    setFormData((prevData) => {
      const newGallery = prevData.gallery?.filter((_, index) => index !== indexToRemove);
      const newGalleryBase64Strings = prevData.galleryBase64Strings?.filter((_, index) => index !== indexToRemove);
      const newGalleryExtension = prevData.galleryExtensions?.filter((_, index) => index !== indexToRemove);

      return {
        ...prevData,
        gallery: newGallery,
        galleryBase64Strings: newGalleryBase64Strings,
        galleryExtensions: newGalleryExtension
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
                        <h5 className="card-title">Nouvel Avis Etudiant</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmitAvisEtudiant}>
                      <input type="hidden" id="_id" value={formData._id} />
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
                          options={classe.map(c => ({ value: c._id, label: c.nom_classe_fr }))}
                          onChange={onSelectChange}
                          isMulti
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Date Avis</Form.Label>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                          }}
                          value={selectedDate ? [selectedDate] : []} // Convert to array or empty array
                          onChange={handleDateChange}
                          id="date_avis"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Lien</Form.Label>
                        <Form.Control
                          type="text"
                          id="lien"
                          value={formData.lien}
                          onChange={onChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>PDF</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf"
                          onChange={async (e) => {
                            const input = e.target as HTMLInputElement;
                            const file = input.files?.[0];
                            if (file) {
                              const { base64Data, extension } = await convertToBase64(file);
                              setFormData(prev => ({
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
                        <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}>
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone dz-clickable text-center" {...getRootProps()}>
                              <div className="dz-message needsclick">
                                <div className="mb-3">
                                  <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                </div>
                                <h5>
                                  Déposez des photos ici ou cliquez pour télécharger.
                                </h5>
                              </div>
                              <input {...getInputProps()} />
                            </div>
                          )}
                        </Dropzone>
                        <div className="mt-3">
                          {formData.gallery?.map((image, index) => (
                            <div key={index} className="image-preview">
                              <img src={image} alt={`Image ${index + 1}`} className="img-thumbnail" />
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteFile(index)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Form.Group>

                      <div className="mb-3 text-end">
                        <Button type="submit" color="primary">Enregistrer</Button>
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

export default AjouterAvisEtudiant;
