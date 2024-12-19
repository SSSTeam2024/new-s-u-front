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
import {
  useAddAvisEnseignantMutation,
  AvisEnseignant,
} from "features/avisEnseignant/avisEnseignantSlice";
import {
  useFetchDepartementsQuery,
  Departement,
} from "features/departement/departement";
import {
  useAddDemandeCongeMutation,
  DemandeConge,
  Subcategory,
} from "features/congé/demandeCongeSlice";
import {
  useFetchLeaveTypeQuery,
  LeaveType,
  LeaveSubcategory,
} from "features/congé/leaveTypeSlice";
import {
  useFetchPersonnelsQuery,
  Personnel,
} from "features/personnel/personnelSlice";

import Select from "react-select";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";

interface OptionType {
  value: any;
  label: string;
}

const AjouterDemandeConge = () => {
  document.title = "Ajouter Demande de Congé | Smart University";

  const [personnell, setPersonnel] = useState<Personnel | null>(null);
  const [leaveType, setLeaveType] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    LeaveSubcategory[]
  >([]);
  const [grade, setGrade] = useState<string>("");
  const [sexee, setSexee] = useState<string>("");

  const navigate = useNavigate();
  const [addDemandeConge] = useAddDemandeCongeMutation();

  const { data: leaveTypes } = useFetchLeaveTypeQuery();
  const leavetype: LeaveType[] = Array.isArray(leaveTypes) ? leaveTypes : [];

  const { data: personnels } = useFetchPersonnelsQuery();
  const personnel: Personnel[] = Array.isArray(personnels) ? personnels : [];
  console.log("personnel object", personnel);
  const [availableSubcategories, setAvailableSubcategories] = useState<
    LeaveSubcategory[]
  >([]);

  const [formData, setFormData] = useState<Partial<DemandeConge>>({
    _id: "",
    personnelId: "",
    leaveType: "",
    subcategory: {
      _id: "",
      name_fr: "",
      name_ar: "",
      maxDays: 0,
      sexe: "Both",
      Accumulable: false,
    },
    remainingDays: 0,
    requestedDays: 0,
    startDay: undefined,
    endDay: undefined,
    lastUpdated: new Date(),
    status: "en cours",
    daysUsed: 0,
    year:2024,
    file: "",
    fileBase64String: "",
    fileExtension: "",
    adresse_conge: "",
    nature_fichier: "",
    reponse: "",
    dateResponse: new Date(),
    dateInterruption: new Date(),
  });
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSelectPersonnel = (selectedOption: any) => {
    const selectedPersonnel = personnel.find(
      (c) => c._id === selectedOption?.value
    );

    // Extract and set the grade ID if it exists
    if (selectedPersonnel?.grade) {
      setGrade(selectedPersonnel.grade._id);
    } else {
      setGrade("");
    }

    // Extract and set the sexe if it exists
    if (selectedPersonnel?.sexe) {
      setSexee(selectedPersonnel.sexe);
    } else {
      setSexee("");
    }

    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      personnelId: selectedOption.value,
    }));
  };

  //leave type change

  const handleLeaveTypeChange = (selectedOption: any) => {
    const selectedLeaveType = leavetype.find(
      (lt) => lt._id === selectedOption.value
    );

    setLeaveType(selectedOption.label);
    setFormData((prev) => ({
      ...prev,
      leaveType: selectedOption.value,
    }));

    if (selectedOption.label === "congé annuel") {
      const filteredSubcategories = selectedLeaveType?.subcategories?.filter(
        (subcat) => subcat.GradePersonnel?.includes(grade)
      );
      setSelectedSubcategory(filteredSubcategories!);
    }

    if (selectedOption.label === "Congé de maladie") {
      // Get the selected personnel's sexe (assuming you have set it in a state called `sexe`)
      const mappedSexe =
        sexee === "أنثى" ? "Femme" : sexee === "ذكر" ? "Homme" : null;

      // Filter subcategories based on mappedSexe and "Both"
      const filteredSubcategories = selectedLeaveType?.subcategories?.filter(
        (subcat) => {
          const isSexeMatch =
            subcat.sexe === "Both" || subcat.sexe === mappedSexe;
          return isSexeMatch;
        }
      );

      setSelectedSubcategory(filteredSubcategories || []);
    }
  };

  console.log("selectedSubcategory", selectedSubcategory);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (dates: Date[], field: "startDay" | "endDay") => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: dates[0]?.toISOString() || "" };

      // If both startDay and endDay are filled, calculate requestedDays
      if (updatedData.startDay && updatedData.endDay) {
        const startDate = new Date(updatedData.startDay);
        const endDate = new Date(updatedData.endDay);

        if (endDate >= startDate) {
          const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
          updatedData.requestedDays =
            Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Include the start day
        } else {
          updatedData.requestedDays = 0; // Reset if end date is earlier
        }
      }

      return updatedData;
    });
  };

  const [selectedsubcat, setSelectedsubcat] = useState<OptionType | null>(null);
  // This function is triggered when the select Sub Category
  const handleSelectsubcat = (option: OptionType | null) => {
    setSelectedsubcat(option);
  };
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("file") as HTMLFormElement).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const fileConge = base64Data + "." + extension;
      console.log("extension", extension);
      setFormData({
        ...formData,
        file: fileConge,
        fileBase64String: base64Data,
        fileExtension: extension,
      });
    }
  };

  const onSubmitDemandeConge = (e: any) => {
    e.preventDefault();
    console.log("formData", formData);
    console.log("type", typeof formData.fileBase64String);
    if (formData.subcategory) {
      formData.subcategory._id = selectedsubcat?.value?._id;
      formData.subcategory.Accumulable = selectedsubcat?.value?.Accumulable;
      formData.subcategory.maxDays = selectedsubcat?.value?.maxDays;
      formData.subcategory.name_ar = selectedsubcat?.value?.name_ar;
      formData.subcategory.name_fr = selectedsubcat?.value?.name_fr;
      formData.subcategory.sexe = selectedsubcat?.value?.sexe;
    }

    addDemandeConge(formData).then(() => setFormData(formData));
    notify();
    navigate("/demande-conge/liste-demande-conge");
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
        const [, base64Data] = base64String.split(",");
        const extension = file.name.split(".").pop() ?? "";
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

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
                        <h5 className="card-title">Ajouter demande de congé</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitDemandeConge}
                    >
                      <input type="hidden" id="id-field" value={formData._id} />
                      <Row>
                        <Row>
                          <Col lg={4} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">
                                  Nom du Personnel
                                </h4>
                              </Form.Label>
                              <Select
                                options={personnel.map((c) => ({
                                  value: c._id,
                                  label: (
                                    <span>
                                      {`${c.prenom_fr} ${c.nom_fr}`}{" "}
                                      <span
                                        style={{
                                          color: "gray",
                                          fontSize: "0.9em",
                                        }}
                                      >
                                        ({c.grade?.grade_fr})
                                      </span>
                                    </span>
                                  ),
                                }))}
                                onChange={onSelectPersonnel}
                              />
                            </div>
                          </Col>

                          <Col lg={4} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="leaveType">
                                <h4 className="card-title mb-0">
                                  Type de congé
                                </h4>
                              </Form.Label>
                              <Select
                                options={leavetype.map((lt) => ({
                                  value: lt._id,
                                  label: lt.name_fr,
                                }))}
                                onChange={handleLeaveTypeChange}
                                placeholder="Select Leave Type"
                              />
                            </div>
                          </Col>
                          <Col lg={4} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="subcategory">
                                <h4 className="card-title mb-0">Categorie</h4>
                              </Form.Label>
                              {leaveType === "congé annuel" ? (
                                <Select
                                  options={selectedSubcategory.map((sc) => ({
                                    value: sc,
                                    label: sc.name_fr,
                                  }))}
                                  onChange={handleSelectsubcat}
                                  isDisabled={!selectedSubcategory.length}
                                  placeholder="Sélectionnez une catégorie"
                                />
                              ) : leaveType === "Congé de maladie" ? (
                                <Select
                                  options={selectedSubcategory.map((sc) => ({
                                    value: sc,
                                    label: sc.name_fr,
                                  }))}
                                  onChange={handleSelectsubcat}
                                  isDisabled={!selectedSubcategory.length}
                                  placeholder="Sélectionnez une catégorie"
                                />
                              ) : (
                                <Select
                                  options={availableSubcategories.map((sc) => ({
                                    value: sc,
                                    label: sc.name_fr,
                                  }))}
                                  onChange={handleSelectsubcat}
                                  isDisabled={!availableSubcategories.length}
                                  placeholder="Sélectionnez une catégorie"
                                />
                              )}
                            </div>
                          </Col>

                          <Col lg={4}>
                            <Form.Label>Date Debut</Form.Label>
                            <Flatpickr
                              value={
                                formData.startDay
                                  ? new Date(formData.startDay)
                                  : undefined
                              }
                              onChange={(dates) =>
                                handleDateChange(dates, "startDay")
                              }
                              className="form-control"
                              options={{ dateFormat: "d M, Y" }}
                            />
                          </Col>
                          <Col lg={4}>
                            <Form.Label>Date Fin</Form.Label>
                            <Flatpickr
                              value={
                                formData.endDay
                                  ? new Date(formData.endDay)
                                  : undefined
                              }
                              onChange={(dates) =>
                                handleDateChange(dates, "endDay")
                              }
                              className="form-control"
                              options={{ dateFormat: "d M, Y" }}
                            />
                          </Col>
                          <Col lg={4}>
                            <Form.Label>Nombre de Jours Demandés</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.requestedDays}
                              readOnly
                              className="text-center"
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <label htmlFor="file" className="form-label">
                                Fichier
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                accept=".pdf"
                                name="file"
                                id="file"
                                onChange={(e) => handleFileUpload(e)}
                              />
                            </div>
                          </Col>

                          <Col>
                            <div className="mb-3">
                              <Form.Label htmlFor="nature_fichier">
                                <h4 className="card-title mb-0">
                                  Nature du fichier (نوع الوثيقة)
                                </h4>
                              </Form.Label>
                              <Select
                                options={[
                                  {
                                    value: "شهادة طبية",
                                    label: "Certificat Médical (شهادة طبية)",
                                  },
                                  {
                                    value: "رسالة رسمية",
                                    label: "Lettre Officielle (رسالة رسمية)",
                                  },
                                  {
                                    value: "وثيقة إثبات",
                                    label:
                                      "Document Justificatif (وثيقة إثبات)",
                                  },
                                  {
                                    value: "تصريح شخصي",
                                    label:
                                      "Déclaration Personnelle (تصريح شخصي)",
                                  },
                                  { value: "أخرى", label: "Autre (أخرى)" },
                                ]}
                                onChange={(
                                  selectedOption: OptionType | null
                                ) => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    nature_fichier: selectedOption?.value || "",
                                  }));
                                }}
                                placeholder="Sélectionnez la nature du fichier"
                              />
                            </div>
                          </Col>
                          <Row>
                            <div className="mb-3">
                              <Form.Label htmlFor="adresse_conge">
                                <h4 className="card-title mb-0">
                                  Adresse de résidence pendant le congé (عنوان
                                  مقر السكنى طيلة العطلة){" "}
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="adresse_conge"
                                placeholder="Entrez l'adresse pendant le congé"
                                value={formData.adresse_conge || ""}
                                onChange={onChange}
                              />
                            </div>
                          </Row>
                        </Row>

                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Ajouter demande de congé
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

export default AjouterDemandeConge;
