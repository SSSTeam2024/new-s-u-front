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
import { useLocation, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import {
  useAddAvisEnseignantMutation,
  AvisEnseignant,
} from "features/avisEnseignant/avisEnseignantSlice";
import {
  useFetchDepartementsQuery,
  Departement,
} from "features/departement/departement";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import {
  useFetchAvisEnseignantByIdQuery,
  useUpdateAvisEnseignantMutation,
} from "features/avisEnseignant/avisEnseignantSlice";

const EditAvisEnseignant = () => {
  document.title = "Modifier Avis Enseignant | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { _id: string };
  const [addAvisEnseignant] = useAddAvisEnseignantMutation();
  const { data: avisEnseignant, isLoading: isLoadingById } =
    useFetchAvisEnseignantByIdQuery(
      { _id: locationState._id },
      { skip: !locationState._id }
    );
  const { data: departements } = useFetchDepartementsQuery();
  const departement: Departement[] = Array.isArray(departements)
    ? departements
    : [];
  const [formData, setFormData] = useState<AvisEnseignant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [updateAvisEnseignant, { isSuccess, isError, error }] =
    useUpdateAvisEnseignantMutation();

  // useEffect(() => {
  //   if (avisEnseignant) {
  //     setFormData(avisEnseignant);
  //     if (avisEnseignant.date_avis) {
  //       setSelectedDate(new Date(avisEnseignant.date_avis));
  //     }
  //   }
  // }, [avisEnseignant]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) =>
      prev ? { ...prev, [e.target.id]: e.target.value } : null
    );
  };

  const onSelectChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions.map((option: any) => option.value);
    setFormData((prev: any) =>
      prev ? { ...prev, departement: selectedValues } : null
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
      setFormData((prev: any) =>
        prev ? { ...prev, date_avis: selectedDate } : null
      );
    }
  };

  // const onSubmitAvisEnseignant = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   if (formData) {
  //     try {
  //       await updateAvisEnseignant(formData).unwrap();
  //       Swal.fire({
  //         icon: "success",
  //         title: "Succès",
  //         text: "Avis modifié avec succès",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       navigate("/avis-enseignant/liste-avis-enseignant");
  //     } catch (err) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Erreur",
  //         text: getErrorMessage(err),
  //       });
  //     }
  //   }
  // };
  const onSubmitAvisEnseignant = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (formData) {
    try {
      // ✅ Only keep old filenames
      const cleanedGallery = formData.gallery.filter(
        (img) => !img.startsWith("data:image")
      );

      const cleanedFormData = {
        ...formData,
        gallery: cleanedGallery,
        // Keep base64Strings + extensions as-is
      };

      await updateAvisEnseignant(cleanedFormData).unwrap();

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Avis modifié avec succès",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/avis-enseignant/liste-avis-enseignant");
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


 useEffect(() => {
  if (avisEnseignant) {
    setFormData({
      ...avisEnseignant,
      gallery: avisEnseignant.gallery || [],
    });

    if (avisEnseignant.date_avis) {
      setSelectedDate(new Date(avisEnseignant.date_avis));
    }
  } else {
    setFormData(null);
  }
}, [avisEnseignant]);

  // ✅ Convert file to base64
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

  // ✅ Handle file drop
 const handleAcceptedFiles = async (files: File[]) => {
  const base64Images = await Promise.all(
    files.map(async (file: File) => {
      const { base64Data, extension } = await convertToBase64(file);
      const mimeType = file.type || `image/${extension}`;
      return {
        dataUrl: `data:${mimeType};base64,${base64Data}`,
        base64Data,
        extension,
      };
    })
  );

  setFormData((prev) => {
    if (!prev) return null;
    return {
      ...prev,
      gallery: [...(prev.gallery || []), ...base64Images.map((img) => img.dataUrl)],
      galleryBase64Strings: [
        ...(prev.galleryBase64Strings || []),
        ...base64Images.map((img) => img.base64Data),
      ],
      galleryExtensions: [
        ...(prev.galleryExtensions || []),
        ...base64Images.map((img) => img.extension),
      ],
    };
  });
};

  // ✅ Handle delete
const handleDeleteFile = (indexToRemove: number) => {
  setFormData((prev) => {
    if (!prev) return null;

    const isBase64 = prev.gallery[indexToRemove]?.startsWith("data:image");

    const newGallery = prev.gallery.filter((_, i) => i !== indexToRemove);

    let newBase64Strings = prev.galleryBase64Strings || [];
    let newExtensions = prev.galleryExtensions || [];

    if (isBase64) {
      const base64Indexes = prev.gallery
        .map((img, i) => (img.startsWith("data:image") ? i : -1))
        .filter((i) => i !== -1);

      const base64IndexToRemove = base64Indexes.indexOf(indexToRemove);

      newBase64Strings = newBase64Strings.filter((_, i) => i !== base64IndexToRemove);
      newExtensions = newExtensions.filter((_, i) => i !== base64IndexToRemove);
    }

    return {
      ...prev,
      gallery: newGallery,
      galleryBase64Strings: newBase64Strings,
      galleryExtensions: newExtensions,
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
                        <h5 className="card-title">Modifier Avis Enseignant</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitAvisEnseignant}
                    >
                      <input
                        type="hidden"
                        id="id-field"
                        value={formData?._id}
                      />
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
                                value={formData?.title ?? ""}
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
                                options={departement.map((c) => ({
                                  value: c._id,
                                  label: c.name_fr,
                                }))}
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
                                data={formData?.description}
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
                                    const { base64Data, extension } =
                                      await convertToBase64(file);
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
                                value={formData?.lien}
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
                           
                              {/* <Card.Body>
                                <div className="dropzone my-dropzone">
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
                                            Déposez des photos ici ou cliquez
                                            pour télécharger.
                                          </h5>
                                        </div>
                                        <input {...getInputProps()} />
                                      </div>
                                    )}
                                  </Dropzone>

                                  <div className="mt-3">
                                    {formData?.gallery?.map((image, index) => (
                                      <div
                                        key={index}
                                        className="image-preview"
                                      >
                                        <img
                                          src={
                                            image.startsWith("data:image")
                                              ? image
                                              : `data:image/jpeg;base64,${image}`
                                          }
                                          alt={`Image ${index + 1}`}
                                          className="img-thumbnail me-2 mb-2"
                                          style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFile(index)
                                          }
                                        >
                                          Supprimer
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Card.Body> */}
                              <Card.Body>
                                 <div className="dropzone my-dropzone">
      {/* Dropzone */}
      <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone dz-clickable text-center" {...getRootProps()}>
            <div className="dz-message needsclick">
              <div className="mb-3">
                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
              </div>
              <h5>Déposez des photos ici ou cliquez pour télécharger.</h5>
            </div>
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>

      {/* Image Previews */}
      <div className="d-flex flex-wrap gap-2 mt-3">
  {formData?.gallery?.map((image, index) => {
    const isBase64 = image.startsWith("data:image");

    const imageSrc = isBase64
      ? image
      : `${process.env.REACT_APP_API_URL}/files/avisEnseignantFiles/photo/${image}`;

    return (
      <div key={index} className="image-preview text-center">
        <img
          src={imageSrc}
          alt={`Image ${index + 1}`}
          className="img-thumbnail"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
          }}
        />
        <Button
          variant="danger"
          size="sm"
          className="mt-1"
          onClick={() => handleDeleteFile(index)}
        >
          Supprimer
        </Button>
      </div>
    );
  })}
</div></div>
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
                              Modifier Avis Enseignant
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

export default EditAvisEnseignant;
