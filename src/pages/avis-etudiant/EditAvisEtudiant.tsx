
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Card,
  Row,
  Form,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "flatpickr/dist/flatpickr.min.css";

import {
  useFetchAvisEtudiantByIdQuery,
  useUpdateAvisEtudiantMutation,
  Avis,
} from "features/avisEtudiant/avisEtudiantSlice";
import {
  Classe,
  useFetchClassesQuery,
} from "features/classe/classe";

const EditAvisEtudiant = () => {
  document.title = "Modifier Avis Etudiant | ENIGA";

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { _id: string };

  const [formData, setFormData] = useState<Avis | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: avisEtudiant, isLoading: isLoadingById } =
    useFetchAvisEtudiantByIdQuery(
      { _id: locationState._id },
      { skip: !locationState._id }
    );

  const { data: classes } = useFetchClassesQuery();
  const classe: Classe[] = Array.isArray(classes) ? classes : [];

  const [updateAvisEtudiant, { isSuccess, isError, error }] =
    useUpdateAvisEtudiantMutation();

  useEffect(() => {
    if (avisEtudiant) {
      setFormData(avisEtudiant);
      if (avisEtudiant.date_avis) {
        setSelectedDate(new Date(avisEtudiant.date_avis));
      }
    }
  }, [avisEtudiant]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) =>
      prev ? { ...prev, [e.target.id]: e.target.value } : null
    );
  };

  const onDescriptionChange = (event: any, editor: any) => {
    const data = editor.getData();
    setFormData((prev) => (prev ? { ...prev, description: data } : null));
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const selectedDate = selectedDates[0];
      setSelectedDate(selectedDate);
      setFormData((prev:any) =>
        prev ? { ...prev, date_avis: selectedDate } : null
      );
    }
  };

  const onSelectChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions.map((option: any) => option.value);
    setFormData((prev) =>
      prev ? { ...prev, groupe_classe: selectedValues } : null
    );
  };

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

    setFormData((prev) => {
      if (!prev || !prev._id) return prev;
      return {
        ...prev,
        gallery: base64Images.map((img) => img.base64Data + "." + img.extension),
        galleryBase64Strings: base64Images.map((img) => img.base64Data),
        galleryExtensions: base64Images.map((img) => img.extension),
      };
    });
  };

  const handleDeleteFile = (indexToRemove: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newGallery = prev.gallery?.filter((_, i) => i !== indexToRemove);
      const newBase64 = prev.galleryBase64Strings?.filter((_, i) => i !== indexToRemove);
      const newExt = prev.galleryExtensions?.filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        gallery: newGallery,
        galleryBase64Strings: newBase64,
        galleryExtensions: newExt,
      };
    });
  };

  const convertToBase64 = (
    file: File
  ): Promise<{ base64Data: string; extension: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const [, base64Data] = base64String.split(",");
        const extension = file.name.split(".").pop() ?? "";
        resolve({ base64Data, extension });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      try {
        await updateAvisEtudiant(formData).unwrap();
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Avis modifié avec succès",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/avis-etudiant/liste-avis-etudiant");
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: getErrorMessage(err),
        });
      }
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      if ("data" in error) {
        const fetchBaseQueryError = error as { data: { message?: string } };
        return fetchBaseQueryError.data.message || "Une erreur s'est produite.";
      }
      if ("message" in error) {
        const serializedError = error as { message: string };
        return serializedError.message || "Une erreur s'est produite.";
      }
    }
    return "Une erreur s'est produite.";
  };

  if (isLoadingById) return <p>Chargement...</p>;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Modifier Avis Étudiant" pageTitle="Avis Étudiant" />
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <h5 className="mb-4">Modifier Avis Étudiant</h5>
                {isError && <p className="text-danger">{getErrorMessage(error)}</p>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Titre</Form.Label>
                    <Form.Control
                      type="text"
                      id="title"
                      value={formData?.title || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={formData?.description || ""}
                      onChange={onDescriptionChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Classe</Form.Label>
                    <Select
                      isMulti
                      options={classe.map((c) => ({
                        value: c._id,
                        label: c.nom_classe_fr,
                      }))}
                      value={classe
                        .filter((c) => formData?.groupe_classe?.includes(c._id))
                        .map((c) => ({
                          value: c._id,
                          label: c.nom_classe_fr,
                        }))}
                      onChange={onSelectChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Date de l'avis</Form.Label>
                    <Flatpickr
                      className="form-control"
                      options={{ dateFormat: "d/m/Y" }}
                      value={selectedDate ? [selectedDate] : []}
                      onChange={handleDateChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Lien</Form.Label>
                    <Form.Control
                      type="text"
                      id="lien"
                      value={formData?.lien || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>PDF</Form.Label>
                    {formData?.pdfBase64String && (
                      <div className="mb-2">
                        <a
                          href={`data:application/pdf;base64,${formData.pdfBase64String}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Voir le PDF existant
                        </a>
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                          const input = e.target as HTMLInputElement;
                            const file = input.files?.[0];
                        if (file) {
                          const { base64Data, extension } = await convertToBase64(file);
                          setFormData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  pdfBase64String: base64Data,
                                  pdfExtension: extension,
                                }
                              : null
                          );
                        }
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Galerie</Form.Label>
                    <Dropzone onDrop={handleAcceptedFiles}>
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="dropzone dz-clickable text-center border p-3 rounded"
                          {...getRootProps()}
                        >
                          <div className="dz-message needsclick">
                            <i className="display-4 text-muted ri-upload-cloud-2-fill"></i>
                            <h5 className="mt-2">
                              Déposez des images ici ou cliquez pour télécharger.
                            </h5>
                          </div>
                          <input {...getInputProps()} />
                        </div>
                      )}
                    </Dropzone>
                    <div className="mt-3 d-flex flex-wrap gap-3">
                      {formData?.gallery?.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="img-thumbnail"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0"
                            onClick={() => handleDeleteFile(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>

                  <div className="text-end">
                    <Button type="submit" variant="primary">
                      Enregistrer
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditAvisEtudiant;

