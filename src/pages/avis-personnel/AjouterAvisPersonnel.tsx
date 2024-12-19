import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { useAddAvisEnseignantMutation, AvisEnseignant } from "features/avisEnseignant/avisEnseignantSlice";
import { useFetchDepartementsQuery, Departement} from "features/departement/departement"
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice'; 


const AjouterAvisEnseignant = () => {
  document.title = "Ajouter Avis Enseignant | Smart University";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
const [addAvisEnseignant] = useAddAvisEnseignantMutation();
const { data: departements } = useFetchDepartementsQuery();
const departement: Departement[] = Array.isArray(departements) ? departements : [];



const [formData, setFormData] = useState<Partial<AvisEnseignant>>({
  _id: "",
  title: "",
  description: "",
  auteurId:user?._id,
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
    departement: selectedOption.value,
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

const onSubmitAvisEnseignant = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  addAvisEnseignant(formData).then(() => setFormData(formData));
  notify();
  navigate("/avis-personnel/liste-avis-personnel");
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
                        <h5 className="card-title">Nouvel Avis Enseignant</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form"  onSubmit={onSubmitAvisEnseignant}>
                      <input type="hidden" id="id-field" value={formData._id} />
                      <Row>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="title">
                                <h4 className="card-title mb-0">Titre</h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="title"
                                value={formData.title ?? ""}
                                onChange={onChange}
                                placeholder="Titre"
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="dateOfBirth">
                                <h4 className="card-title mb-0">Date</h4>
                              </Form.Label>
                              <Flatpickr
                                value={selectedDate!}
                                onChange={handleDateChange}
                                className="form-control flatpickr-input"
                                placeholder="Select Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="dateOfBirth"
                              />
                            </div>
                          </Col>
                          <Col lg={4} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">Département</h4>
                              </Form.Label>
                              <Select
                          options={departement.map(c => ({ value: c._id, label: c.name_fr }))}
                          onChange={onSelectChange}
                          isMulti
                        />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                          <div className="mb-3">
                          <Form.Label>Description</Form.Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={formData.description}
                          onChange={onDescriptionChange}
                          id="description"
                        />
                          </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="legalcardBase64String"
                                className="form-label"
                              >
                                Fichier (pdf)
                              </label>
                              <Form.Control
                                type="file"
                                accept=".pdf"
                                
                                className="text-muted"
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

                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <Form.Label
                              htmlFor="basic-url"
                              className="form-label"
                            >
                              <h4 className="card-title mb-0">Lien</h4>
                            </Form.Label>
                            <InputGroup>
                              <span
                                className="input-group-text"
                                id="basic-addon3"
                              >
                               Insérer un lien
                              </span>
                              <Form.Control
                                type="text"
                                id="lien"
                                value={formData.lien}
                                onChange={onChange}
                                aria-describedby="basic-addon3"
                              />
                            </InputGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={12}>
                            <Card>
                              <Card.Header>
                                <div className="d-flex">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                      <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                        <i className="bi bi-images"></i>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <h5 className="card-title mb-1">
                                      Gallerie de Photos
                                    </h5>
                                    <p className="text-muted mb-0">
                                      Ajouter des images à l'avis
                                    </p>
                                  </div>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <div className="dropzone my-dropzone">
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
                                </div>
                               
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Enregistrer
                            </Button>
                          </div>
                        </Col>
                      </Row>
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

export default AjouterAvisEnseignant;


