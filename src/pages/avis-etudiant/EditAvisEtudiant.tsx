import React,  { useEffect, useState } from "react";
import { Button, Col, Container, Card, Row, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { Classe, useFetchClassesQuery } from "features/classe/classe";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {useFetchAvisEtudiantByIdQuery, useUpdateAvisEtudiantMutation, Avis} from "features/avisEtudiant/avisEtudiantSlice";
const EditAvisEtudiant = () => {
  document.title = "Modifier Avis Etudiant | Smart Institute";
const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { _id: string };

  const [formData, setFormData] = useState<Avis | null>(null);
 const { data: classes } = useFetchClassesQuery();
  const classe: Classe[] = Array.isArray(classes) ? classes : [];
  const { data: avisEtudiant, isLoading: isLoadingById } =
  useFetchAvisEtudiantByIdQuery(
      { _id: locationState._id },
      { skip: !locationState._id }
    );

  const [
    updateAvisEtudiant,
    { isLoading: isUpdating, isSuccess, isError, error },
  ] = useUpdateAvisEtudiantMutation();

  useEffect(() => {
    if (avisEtudiant) {
      setFormData(avisEtudiant);
    }
  }, [avisEtudiant]);

 const handleChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
     setFormData((prevState: any) => ({
       ...prevState,
       [e.target.id]: e.target.value,
     }));
     
   };;
 
  const onDescriptionChange = (event: any, editor: any) => {
    const data = editor.getData();
    setFormData((prevState:any) => ({
      ...prevState,
      description: data,
    }));
  };
  
  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const selectedDate = selectedDates[0];
      setFormData((prevState:any) => ({
        ...prevState,
        date_actualite: selectedDate,
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      updateAvisEtudiant(formData);
    }
    notify();
    navigate("/avis-etudiant/liste-avis-etudiant");
};
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Actualite has been created successfully",
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
  
    setFormData((prevState) => {
      if (!prevState || !prevState._id) return prevState; // Ensure _id exists
      return {
        ...prevState,
        gallery: base64Images.map(img => img.base64Data + "." + img.extension),
        galleryBase64Strings: base64Images.map(img => img.base64Data),
        galleryExtensions: base64Images.map(img => img.extension),
      };
    });
  };
  
  const handleDeleteFile = (indexToRemove: number) => {
    setFormData((prevData) => {
      if (!prevData || !prevData._id) return prevData; // Ensure _id exists
      const newGallery = prevData.gallery?.filter((_, index) => index !== indexToRemove);
      const newGalleryBase64Strings = prevData.galleryBase64Strings?.filter((_, index) => index !== indexToRemove);
      const newGalleryExtensions = prevData.galleryExtensions?.filter((_, index) => index !== indexToRemove);
  
      return {
        ...prevData,
        gallery: newGallery,
        galleryBase64Strings: newGalleryBase64Strings,
        galleryExtensions: newGalleryExtensions,
      };
    });
  };
  useEffect(() => {
    if (isSuccess) {
      navigate("/avis-etudiant/liste-avis-etudiant");
    }
  }, [isSuccess, navigate]);

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      if ("data" in error) {
        const fetchBaseQueryError = error as { data: { message?: string } };
        return fetchBaseQueryError.data.message || "An error occurred";
      }

      if ("message" in error) {
        const serializedError = error as { message: string };
        return serializedError.message || "An error occurred";
      }
    }
    return "An error occurred";
  };

  if (isLoadingById) return <p>Loading...</p>;

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
                      <h5 className="card-title">Modifier Avis Etudiant</h5>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body></Card.Body>
                <div className="mb-3">

                   {isError && <p>Error: {getErrorMessage(error)}</p>}
                           <Form className="tablelist-form" onSubmit={handleSubmit}>
                    <input type="hidden" id="_id"  />
                    <Form.Group className="mb-3">
                      <Form.Label>Titre</Form.Label>
                      <Form.Control
                        type="text"
                        id="title"
                        value={formData?.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={formData?.description}
                        onChange={onDescriptionChange}
                        id="description"
                      />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                      <Form.Label>Classe</Form.Label>
                      <Select
                        options={classe.map(c => ({ value: c._id, label: c.nom_classe_fr }))}
                        onChange={handleChange}
                        // isMulti
                      />
                    </Form.Group> */}

                    <Form.Group className="mb-3">
                      <Form.Label>Date Avis</Form.Label>
                      <Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: "d/m/Y",
                        }}
                        value={formData?.date_avis ?? undefined}
                              onChange={handleDateChange}
                        id="date_avis"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Lien</Form.Label>
                      <Form.Control
                        type="text"
                        id="lien"
                        value={formData?.lien}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>PDF</Form.Label>
                       <Form.Control
                       name="pdfBase64String"
                       type="file"
                       id="pdfBase64String"
                       accept=".pdf"
                       placeholder="Choose File"
                       className="text-muted"
                       onChange={async (e) => {
                         const input = e.target as HTMLInputElement;
                         const file = input.files?.[0];
                         if (file) {
                           const { base64Data, extension } = await convertToBase64(file);
                           setFormData((prev) => {
                             if (!prev) return null; // Add a null check to handle cases where prev might be null
                             return {
                               ...prev,
                               pdfBase64String: base64Data,
                               pdfExtension: extension,
                             };
                           });
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
                        {formData?.gallery?.map((image, index) => (
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

export default EditAvisEtudiant;
