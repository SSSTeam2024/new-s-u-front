import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import { useUpdateDossierAdministratifMutation } from "features/dossierAdministratif/dossierAdministratif";
import { useFetchPapierAdministratifQuery } from "features/papierAdministratif/papierAdministratif";

export interface PapierAdministratif {
  _id?: string;
  nom_ar: string;
  nom_fr: string;
  category: string[];
}

export interface Paper {
  papier_administratif: PapierAdministratif;
  annee: string;
  remarques: string;
  file: string;
  FileExtension: string;
  FileBase64String: string;
}

export interface DossierAdministratif {
  _id?: string;
  papers: Paper[];
  enseignant?: {
    _id: string;
    nom_fr: string;
    nom_ar: string;
    prenom_fr: string;
    prenom_ar: string;
  };
}

const EditDossierAdministratifEnseignants = () => {
  document.title = "Modifier dossier Administratif | ENIGA";
  const navigate = useNavigate();
  const { state: dossierAdministratif } = useLocation();
  const [editDossierAdministratif] = useUpdateDossierAdministratifMutation();
  function tog_retourParametres() {
    navigate("/gestion-enseignant/liste-dossier-administartif");
  }

  const { data: allEnseignants = [] } = useFetchEnseignantsQuery();

  const { data: allPapierAdministratifs = [] } =
    useFetchPapierAdministratifQuery();

  const [formData, setFormData] = useState<DossierAdministratif>({
    _id: "",
    papers: [],
    enseignant: {
      _id: "",
      nom_fr: "",
      nom_ar: "",
      prenom_fr: "",
      prenom_ar: "",
    },
  });
  useEffect(() => {
    if (dossierAdministratif) {
      setFormData({
        _id: dossierAdministratif._id || "",
        enseignant: {
          _id: dossierAdministratif.enseignant._id || "",
          nom_fr: dossierAdministratif.enseignant.nom_fr || "",
          nom_ar: dossierAdministratif.enseignant.nom_ar || "",
          prenom_fr: dossierAdministratif.enseignant.prenom_fr || "",
          prenom_ar: dossierAdministratif.enseignant.prenom_ar || "",
        },
        papers: dossierAdministratif.papers || [],
      });
    }
  }, [dossierAdministratif]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("enseignant");

  const filterByCategory = (category: string) => {
    return allPapierAdministratifs.filter((paper) =>
      paper.category.includes(category)
    );
  };

  // Get filtered papers based on the selected category
  const filteredPapers = filterByCategory(selectedCategory);

  const handlePapierChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const selectedNomFr = event.target.value;
    const selectedPaper = filteredPapers.find(
      (paper) => paper.nom_fr === selectedNomFr
    );
    if (selectedPaper) {
      const updatedPapier: PapierAdministratif = {
        _id: selectedPaper._id,
        nom_ar: selectedPaper.nom_ar,
        nom_fr: selectedPaper.nom_fr,
        category: selectedPaper.category,
      };

      setFormData((prevData) => ({
        ...prevData,
        papers: prevData.papers.map((paper, i) =>
          i === index
            ? {
                ...paper,
                papier_administratif: updatedPapier,
                file: selectedPaper.nom_fr || "",
                FileBase64String: "",
                FileExtension: "",
              }
            : paper
        ),
      }));
    }
  };

  const handleEnseignantChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedEnseignantId = event.target.value;
    const doesSelectedEnseignantExist = allEnseignants.some(
      (enseignant: any) =>
        enseignant._id.trim().toLowerCase() ===
        selectedEnseignantId.trim().toLowerCase()
    );
    allEnseignants.forEach((enseignant: any, index: any) => {
      console.log(`Enseignant ${index}:`, enseignant);
    });
    const selectedEnseignant = allEnseignants.find(
      (enseignant: any) =>
        enseignant._id.trim().toLowerCase() ===
        selectedEnseignantId.trim().toLowerCase()
    ) || {
      _id: "",
      nom_fr: "",
      nom_ar: "",
      prenom_fr: "",
      prenom_ar: "",
    };
    setFormData((prevData) => {
      console.log("Previous Form Data:", prevData);
      return {
        ...prevData,
        personnel: selectedEnseignant,
      };
    });
  };

  const handleDateChange = (selectedDates: Date[], index: number) => {
    if (selectedDates.length > 0) {
      const selectedDate = selectedDates[0];
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      setFormData((prevData) => ({
        ...prevData,
        papers: prevData.papers.map((paper, i) =>
          i === index ? { ...paper, annee: formattedDate } : paper
        ),
      }));
    }
  };

  // function convertToBase64(
  //   file: File
  // ): Promise<{ base64Data: string; extension: string }> {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.onload = () => {
  //       const base64String = fileReader.result as string;
  //       const [, base64Data] = base64String.split(",");
  //       const extension = file.name.split(".").pop() ?? "";
  //       resolve({ base64Data, extension });
  //     };
  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //     fileReader.readAsDataURL(file);
  //   });
  // }
  // const handlePDFUpload = async (event: any, index: number) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     try {
  //       const { base64Data, extension } = await convertToBase64(file);

  //       // Update formData to store the base64 string and extension
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         papers: prevData.papers.map((paper, i) =>
  //           i === index
  //             ? {
  //                 ...paper,
  //                 FileBase64String: base64Data, // New file base64
  //                 FileExtension: extension,    // New file extension
  //                 file: "",                    // Will be replaced by new file
  //               }
  //             : paper
  //         ),
  //       }));
  //     } catch (error) {
  //       console.error("Error converting file to Base64:", error);
  //     }
  //   }
  // };
  const convertToBase64 = (
    file: File
  ): Promise<{ base64Data: string; extension: string }> => {
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
  };

  const handlePDFUpload = async (event: any, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64Data, extension } = await convertToBase64(file);
        setFormData((prevData) => ({
          ...prevData,
          papers: prevData.papers.map((paper, i) =>
            i === index
              ? {
                  ...paper,
                  FileBase64String: base64Data,
                  FileExtension: extension,
                  file: "", // Will be handled by the server
                }
              : paper
          ),
        }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };
  const onChange = (e: any, index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      papers: prevData.papers.map((paper, i) =>
        i === index ? { ...paper, remarques: e.target.value } : paper
      ),
    }));
  };

  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

  const onSubmitDossier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData?.enseignant?._id ||
      !isValidObjectId(formData?.enseignant?._id)
    ) {
      console.error("enseignant ID is missing or invalid.");
      return;
    }

    const preparedData = {
      dossierId: formData._id,
      papers: formData.papers.map((paper) => ({
        papier_administratif: paper.papier_administratif,
        annee: paper.annee,
        remarques: paper.remarques,
        file: paper.file,
        FileBase64String: paper.FileBase64String,
        FileExtension: paper.FileExtension,
      })),
      enseignant: {
        _id: formData.enseignant._id,
        nom_fr: formData.enseignant.nom_fr,
        nom_ar: formData.enseignant.nom_ar,
        prenom_fr: formData.enseignant.prenom_fr,
        prenom_ar: formData.enseignant.prenom_ar,
      },
    };
    try {
      await editDossierAdministratif(preparedData).unwrap();
      notify();
      navigate("/gestion-enseignant/liste-dossier-administartif");
    } catch (error: any) {
      console.log("Error submitting form:", error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Dossier enseignant a été modifié avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const addNewLine = () => {
    setFormData((prevData) => ({
      ...prevData,
      papers: [
        ...prevData.papers,
        {
          papier_administratif: {
            _id: "",
            nom_ar: "",
            nom_fr: "",
            category: [],
          },
          annee: "",
          remarques: "",
          file: "",
          FileBase64String: "",
          FileExtension: "",
        },
      ],
    }));
  };

  const removeClassLine = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      papers: prevData.papers.filter((_, i) => i !== index),
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitDossier}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="enseignant">Enseignant</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="enseignant"
                        id="enseignant"
                        value={formData?.enseignant?._id || ""}
                        onChange={handleEnseignantChange}
                        disabled
                      >
                        <option value={formData?.enseignant?._id || ""}>
                          {`${formData?.enseignant?.prenom_fr || ""} ${
                            formData?.enseignant?.nom_fr || ""
                          }`}
                        </option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={10}>
                    {formData.papers.map((paper, index) => (
                      <Row>
                        <Col lg={3}>
                          <Form.Group controlId={`formPapier${index}`}>
                            <Form.Label htmlFor={`papier-${index}`}>
                              Papier Administratif
                            </Form.Label>
                            <Form.Select
                              aria-label={`Papier Administratif ${index}`}
                              value={paper.papier_administratif.nom_fr || ""}
                              onChange={(e) => handlePapierChange(e, index)}
                            >
                              <option value="">Sélectionner Papier</option>
                              {filteredPapers.map(
                                (papier: PapierAdministratif) => (
                                  <option
                                    key={papier.nom_fr}
                                    value={papier.nom_fr}
                                  >
                                    {`${papier.nom_fr} (${papier.nom_ar})`}
                                  </option>
                                )
                              )}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col lg={2}>
                          <Form.Group controlId={`formDate${index}`}>
                            <Form.Label htmlFor={`date-${index}`}>
                              Année
                            </Form.Label>
                            <Flatpickr
                              className="form-control"
                              options={{ dateFormat: "Y-m-d" }}
                              onChange={(date) => handleDateChange(date, index)}
                              value={paper.annee ? new Date(paper.annee) : ""}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={3}>
                          <Form.Group controlId={`formRemarks${index}`}>
                            <Form.Label htmlFor={`remarks-${index}`}>
                              Remarques
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={1}
                              value={paper.remarques}
                              onChange={(e) => onChange(e, index)}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={2}>
                          <Form.Group controlId={`formFile${index}`}>
                            <Form.Label htmlFor={`file-${index}`}>
                              Telécharger Fichier
                            </Form.Label>
                            <Form.Control
                              type="file"
                              accept=".pdf,.jpg,.png"
                              onChange={(e) => handlePDFUpload(e, index)}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={1}>
                          <Button
                            className="mt-4"
                            variant="danger"
                            onClick={() => removeClassLine(index)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Row>
                      <Col lg={12}>
                        <Button
                          className="mt-4"
                          variant="info"
                          disabled={formData?.enseignant?.nom_ar! === ""}
                          onClick={addNewLine}
                        >
                          <i
                            className="bi bi-plus"
                            style={{ fontSize: "15px" }}
                          >
                            {" "}
                            Ajouter Nouvelle Ligne
                          </i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button className="btn btn-primary" type="submit">
                    Enregistrer
                  </Button>
                  <Button
                    className="btn btn-secondary ms-2"
                    type="button"
                    onClick={tog_retourParametres}
                  >
                    Retour
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditDossierAdministratifEnseignants;
