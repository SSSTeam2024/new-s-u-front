import React, { useEffect, useState } from "react";
import { Button, Form, Container, Card, Col, InputGroup, Row,} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useFetchActualiteByIdQuery,
  useUpdateActualiteMutation,
} from "features/actualite/actualiteSlice";
import { Actualite } from "features/actualite/actualiteSlice";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";

const EditActualite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { _id: string };

  const [formData, setFormData] = useState<Actualite | null>(null);

  const { data: actualite, isLoading: isLoadingById } =
    useFetchActualiteByIdQuery(
      { _id: locationState._id },
      { skip: !locationState._id }
    );

  const [
    updateActualite,
    { isLoading: isUpdating, isSuccess, isError, error },
  ] = useUpdateActualiteMutation();

  useEffect(() => {
    if (actualite) {
      setFormData(actualite);
    }
  }, [actualite]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
 
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
        updateActualite(formData);
    }
    notify();
    navigate("/actualite/liste-actualite");
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
      navigate("/actualite");
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
                      <div className="flex-grow-1 mb-2">
                        <h5 className="card-title">Modifier l'Actualité</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <div className="mb-2">
          
          {isError && <p>Error: {getErrorMessage(error)}</p>}
          <Form className="tablelist-form" onSubmit={handleSubmit}>
           

             <input type="hidden" id="_id"/>
                      <Row>
                        <Row>
                        <Col lg={10}>
                            <div className="mb-3">
                              <Form.Label htmlFor="title">
                                <h4 className="card-title mb-0">Titre</h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="title"
                                value={formData?.title || ""}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                        
                          
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="titre">
                                <h4 className="card-title mb-0">Adresse</h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="address"
                                placeholder="Adresse"
                                value={formData?.address ?? ""}
                                onChange={handleChange}
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
                              value={formData?.date_actualite ?? undefined}
                              onChange={handleDateChange}
                              className="form-control flatpickr-input"
                              placeholder="Selectionner une date"
                              options={{
                                dateFormat: "d M, Y",
                              }}
                              id="date_actualite"
                            />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="category">
                                <h4 className="card-title mb-0">Catégorie</h4>
                              </Form.Label>
                              <Form.Select
                                id="category"
                                value={formData?.category ?? ""}
                                name="category"
                                onChange={handleChange}
                                // required
                              >
                                <option value="">
                                  Sélectionner une catégorie
                                </option>
                                <option value="campus">Campus</option>
                                <option value="culture">Culture</option>
                                <option value="formation">Formation</option>
                                <option value="innovation">Innovation</option>
                                <option value="international">
                                  International
                                </option>
                                <option value="recherche">Recherche</option>
                                <option value="sport">Sport</option>
                                <option value="transitions">Transitions</option>
                                <option value="université">Université</option>
                              </Form.Select>
                            </div>
                          </Col>
                         
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <Card>
                              <Card.Header>
                                <h4 className="card-title mb-0">Description</h4>
                              </Card.Header>
                              <CKEditor
                          editor={ClassicEditor}
                          data={formData?.description}
                          onChange={onDescriptionChange}
                          id="description"
                        />
                            </Card>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="legalcardBase64String"
                                className="form-label"
                              >
                                <h4 className="card-title mb-0">
                                  Fichier (pdf)
                                </h4>
                              </label>
                              <Form.Control
  name="legalcardBase64String"
  type="file"
  id="legalcardBase64String"
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
                                aria-describedby="basic-addon3"
                                value={formData?.lien}
                                onChange={handleChange}
                              />
                            </InputGroup>
                          </Col>
                        </Row>
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

                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                          <Button variant="primary" type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Modifier"}
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

export default EditActualite;
