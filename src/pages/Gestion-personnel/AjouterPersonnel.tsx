import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";
import country from "Common/country";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import { useAddPersonnelMutation } from "features/personnel/personnelSlice";
import { useFetchEtatsPersonnelQuery } from "features/etatPersonnel/etatPersonnelSlice";
import { useFetchPostesPersonnelQuery } from "features/postePersonnel/postePersonnel";
import { useFetchGradesPersonnelQuery } from "features/gradePersonnel/gradePersonnel";
import { useFetchCategoriesPersonnelQuery } from "features/categoriePersonnel/categoriePersonnel";
import { useFetchServicesPersonnelQuery } from "features/servicePersonnel/servicePersonnel";
import { format } from "date-fns";
import { Wilaya } from "Common/wilaya";
import { delegationOptions } from "Common/delegationOptions";
import { wilayaOptions } from "Common/wilayaOptions";

const AjouterPersonnels = () => {
  document.title = "Ajouter Personnel | ENIGA";
  const navigate = useNavigate();

  const [selectedCountry1, setSelectedCountry1] = useState<any>({});
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | "">("");
  const [selectedDelegation, setSelectedDelegation] = useState<string>("");
  const [selectedDateDelivrance, setSelectedDateDelivrance] =
    useState<Date | null>(null);
  const [selectedDateAffectation, setSelectedDateAffectation] =
    useState<Date | null>(null);
  const [selectedDateDesignation, setSelectedDateDesignation] =
    useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [createPersonnel] = useAddPersonnelMutation();
  const { data: etat_compte = [] } = useFetchEtatsPersonnelQuery();
  const { data: poste = [] } = useFetchPostesPersonnelQuery();
  const { data: grade = [] } = useFetchGradesPersonnelQuery();
  const { data: categorie = [] } = useFetchCategoriesPersonnelQuery();
  const { data: servicePersonnel = [] } = useFetchServicesPersonnelQuery();

  const [formData, setFormData] = useState<any>({
    _id: "",
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    mat_cnrps: "",
    matricule: "",
    prenom_ar: "",
    lieu_naissance_fr: "",
    lieu_naissance_ar: "",
    date_designation: "",
    date_naissance: "",
    nationalite: "",
    etat_civil: "",
    sexe: "",
    etat_compte: "",
    // poste: "",
    // grade: "",
    // categorie: "",
    // service: "",

    date_affectation: "",
    compte_courant: "",
    identifinat_unique: "",
    num_cin: "",
    date_delivrance: "",
    state: "",
    dependence: "",
    code_postale: "",
    adress_ar: "",
    adress_fr: "",
    email: "",
    num_phone1: "",
    num_phone2: "",
    nom_conjoint: "",
    job_conjoint: "",
    nombre_fils: "",
    photo_profil: "",
    PhotoProfilFileExtension: "",
    PhotoProfilFileBase64String: "",
    historique_positions: [
      {
        poste: "",
        grade: "",
        categorie: "",
        date_affectation: "",
        date_titularisation: "",
        date_depart: "",
        fichier_affectationBase64: "",
        fichier_affectationExtension: "",
        fichier_titularisationBase64: "",
        fichier_titularisationExtension: "",
        fichier_departBase64: "",
        fichier_departExtension: "",
      },
    ],
     historique_services: [
      {
        service: "",
        date_affectation: "",
        fichier_affectation: "",
        fichier_affectationBase64: "",
        fichier_affectationExtension: "",
        date_depart: "",
       fichier_depart: "",
       fichier_departBase64: "",
       fichier_departExtension: "",
      },
    ],
    
  });
  const handleHistoricChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...formData.historique_positions];
    updated[index][field] = value;
    setFormData((prev: any) => ({ ...prev, historique_positions: updated }));
  };

  const addHistoricPosition = () => {
    setFormData((prev: any) => ({
      ...prev,
      historique_positions: [
        ...prev.historique_positions,
        {
          poste: "",
          grade: "",
          categorie: "",
          date_affectation: "",
          date_titularisation: "",
          date_depart: "",
          fichier_affectationBase64: "",
          fichier_affectationExtension: "",
          fichier_titularisationBase64: "",
          fichier_titularisationExtension: "",
          fichier_departBase64: "",
          fichier_departExtension: "",
        },
      ],
    }));
  };

  const removeHistoricPosition = (index: number) => {
    const updated = [...formData.historique_positions];
    updated.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, historique_positions: updated }));
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHistoricFileChange = async (
    index: number,
    field: string,
    file: File | undefined
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setFormData((prev: any) => {
        const updated = [...prev.historique_positions];
        updated[index] = {
          ...updated[index],
          [`${field}Base64`]: base64,
          [`${field}Extension`]: file.name.split(".").pop(),
        };
        return {
          ...prev,
          historique_positions: updated,
        };
      });
    };
    reader.readAsDataURL(file);
  };
  const handleHistoriqueServiceChange = (index:number, field:string, value:any) => {
  const updated = [...formData.historique_services];
  updated[index][field] = value;
  setFormData({ ...formData, historique_services: updated });
};

// const handleServiceFileUpload = (index: number, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.result && typeof reader.result === "string") {
//         const base64Data = reader.result.split(",")[1];
//         const extension = file.name.split(".").pop() || "";

//         const updated = [...formData.historique_services];
//         updated[index][`${field}Base64`] = base64Data;
//         updated[index][`${field}Extension`] = extension;

//         setFormData({ ...formData, historique_services: updated });
//       }
//     };
//     reader.readAsDataURL(file);
//   }
// };
 const handleServiceFileUpload = async (
    index: number,
    field: string,
    file: File | undefined
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setFormData((prev: any) => {
        const updated = [...prev.historique_positions];
        updated[index] = {
          ...updated[index],
          [`${field}Base64`]: base64,
          [`${field}Extension`]: file.name.split(".").pop(),
        };
        return {
          ...prev,
          historique_positions: updated,
        };
      });
    };
    reader.readAsDataURL(file);
  };

const addHistoriqueService = () => {
  setFormData({
    ...formData,
    historique_services: [
      ...formData.historique_services,
      {
        service: "",
        date_affectation: "",
        fichier_affectation: "",
        fichier_affectationBase64: "",
        fichier_affectationExtension: "",
        date_depart: "",
        fichier_depart: "",
        fichier_departBase64: "",
        fichier_departExtension: "",
      },
    ],
  });
};

const removeHistoriqueService = (index:any) => {
  const updated = [...formData.historique_services];
  updated.splice(index, 1);
  setFormData({ ...formData, historique_services: updated });
};


  // change state
  const handleWilayaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const wilaya = event.target.value as Wilaya;
    setSelectedWilaya(wilaya);
    setFormData({
      ...formData,
      state: wilaya,
      dependence: "",
    });
    setSelectedDelegation("");
  };
  // change dependance
  const handleDelegationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const delegation = event.target.value;
    setSelectedDelegation(delegation);
    setFormData({
      ...formData,
      dependence: delegation,
    });
  };
  // change date affectation
  const handleDateChangeAffectation = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        date_affectation: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        date_affectation: "",
      }));
    }
  };

  // change date naissance
  const handleDateChangeNaissance = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        date_naissance: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        date_naissance: "",
      }));
    }
  };
  // change date delivrance
  const handleDateChangeDelivrance = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        date_delivrance: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        date_delivrance: "",
      }));
    }
  };

  // change date designation grade /categorie
  const handleDateChangeDesignation = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        date_designation: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        date_designation: "",
      }));
    }
  };
  //change civil status

  const selectChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevState: any) => ({
      ...prevState,
      etat_civil: value,
    }));
    setSelectedStatus(value);
  };

  //change gender
  const selectChangeGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevState: any) => ({
      ...prevState,
      sexe: value,
    }));
    setSelectedGender(value);
  };
  // changer nationalite
  const handleCountrySelect = (country: any) => {
    setSelectedCountry1(country);
    setFormData((prevData: any) => ({
      ...prevData,
      nationalite: country.countryName,
    }));
  };
  const onSubmitPersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createPersonnel(formData).unwrap();
      notify();
      navigate("/gestion-personnel/liste-personnels");
    } catch (error: any) {
      console.log(error);
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le compte personnel a été créé avec succès",
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
        // const base64Data = base64String.split(",")[1]; // Extract only the Base64 data
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("PhotoProfilFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newFile = base64Data + "." + extension;

      setFormData({
        ...formData,
        photo_profil: newFile,
        PhotoProfilFileBase64String: base64Data,
        PhotoProfilFileExtension: extension,
      });
    }
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
                          معلومات شخصية / Information Personnel
                        </h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitPersonnel}
                    >
                      <input type="hidden" id="id-field" />
                      <Row>
                        <div className="text-center mb-3">
                          <div
                            className="position-relative d-inline-block"
                            style={{ marginBottom: "30px" }}
                          >
                            <div className="position-absolute top-100 start-100 translate-middle">
                              <label
                                htmlFor="PhotoProfilFileBase64String"
                                className="mb-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="Choisir Photo Personnel"
                              >
                                <span className="avatar-xs d-inline-block">
                                  <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                    <i className="ri-image-fill"></i>
                                  </span>
                                </span>
                              </label>
                              <input
                                className="d-none"
                                type="file"
                                name="PhotoProfilFileBase64String"
                                id="PhotoProfilFileBase64String"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e)}
                              />
                            </div>
                            <div className="avatar-xl">
                              <div className="avatar-title bg-light rounded-4">
                                <img
                                  src={`data:image/${formData.PhotoProfilFileExtension};base64,${formData.PhotoProfilFileBase64String}`}
                                  alt={formData.prenom_fr}
                                  id="PhotoProfilFileBase64String"
                                  className="avatar-xl h-auto rounded-4 object-fit-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Row>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="prenom_fr">
                                Prénom (en français)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="prenom_fr"
                                placeholder=""
                                // required
                                onChange={onChange}
                                value={formData.prenom_fr}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="nom_fr">
                                Nom (en français)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="nom_fr"
                                placeholder=""
                                onChange={onChange}
                                value={formData.nom_fr}
                              />
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="nom_ar"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                اللقب (بالعربية)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="nom_ar"
                                placeholder=""
                                dir="rtl"
                                onChange={onChange}
                                value={formData.nom_ar}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="prenom_ar"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                الإسم (بالعربية)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="prenom_ar"
                                placeholder=""
                                dir="rtl"
                                // required
                                onChange={onChange}
                                value={formData.prenom_ar}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label> الجنسية/ Nationalité </Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle
                                  as="input"
                                  style={{
                                    backgroundImage: `url(${
                                      selectedCountry1.flagImg &&
                                      selectedCountry1.flagImg
                                    })`,
                                  }}
                                  className="form-control rounded-end flag-input form-select"
                                  placeholder="اختر دولة"
                                  readOnly
                                  defaultValue={selectedCountry1.countryName}
                                ></Dropdown.Toggle>
                                <Dropdown.Menu
                                  as="ul"
                                  className="list-unstyled w-100 dropdown-menu-list mb-0"
                                >
                                  <SimpleBar
                                    style={{ maxHeight: "220px" }}
                                    className="px-3"
                                  >
                                    {(country || []).map(
                                      (item: any, key: number) => (
                                        <Dropdown.Item
                                          as="li"
                                          onClick={() =>
                                            handleCountrySelect(item)
                                          }
                                          key={key}
                                          className="dropdown-item d-flex"
                                        >
                                          <div className="flex-shrink-0 me-2">
                                            <Image
                                              src={item.flagImg}
                                              alt="country flag"
                                              className="options-flagimg"
                                              height="20"
                                            />
                                          </div>
                                          <div className="flex-grow-1">
                                            <div className="d-flex">
                                              <div className="country-name me-1">
                                                {item.countryName}
                                              </div>
                                              <span className="countrylist-codeno text-muted">
                                                {item.countryCode}
                                              </span>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                      )
                                    )}
                                  </SimpleBar>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="lieu_naissance_fr"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                مكان الولادة (بالعربية)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="lieu_naissance_fr"
                                placeholder=""
                                dir="rtl"
                                // required
                                onChange={onChange}
                                value={formData.lieu_naissance_fr}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="lieu_naissance_ar"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                مكان الولادة (بالفرنسية)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="lieu_naissance_ar"
                                placeholder=""
                                dir="rtl"
                                // required
                                onChange={onChange}
                                value={formData.lieu_naissance_ar}
                              />
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label htmlFor="date_naissance">
                                تاريخ الولادة
                              </Form.Label>
                              <Flatpickr
                                value={selectedDate!}
                                onChange={handleDateChangeNaissance}
                                className="form-control flatpickr-input"
                                placeholder="اختر التاريخ"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="date_naissance"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row
                          style={{
                            direction: "rtl",
                            textAlign: "right",
                          }}
                        >
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="etat_civil">
                                الحالة المدنية
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="etat_civil"
                                id="etat_civil"
                                // required
                                onChange={selectChangeStatus}
                              >
                                <option value="">الحالة</option>
                                <option value="متزوج">متزوج</option>
                                <option value="أعزب">أعزب</option>
                                <option value="مطلق">مطلق</option>
                                <option value="أرمل">أرمل</option>
                              </select>
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div className="mb-3">
                              <label htmlFor="sexe" className="form-label">
                                الجنس
                              </label>
                              <select
                                className="form-select text-muted"
                                name="sexe"
                                id="sexe"
                                // required
                                onChange={selectChangeGender}
                              >
                                <option value="">الجنس</option>
                                <option value="ذكر">ذكر</option>
                                <option value="أنثى">أنثى</option>
                              </select>
                            </div>
                          </Col>
                           <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="etat_compte">
                                    حالة الحساب
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="etat_compte"
                                    id="etat_compte"
                                    // required
                                    value={formData?.etat_compte?.etat_fr!}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Séléctionner Etat / اختر الحالة
                                    </option>
                                    {etat_compte.map((etat_compte) => (
                                      <option
                                        key={etat_compte._id}
                                        value={etat_compte._id}
                                      >
                                        {etat_compte.etat_fr}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </Col>
                        </Row>

                        <Col lg={12}>
                          {/* <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-geo-alt-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  معلومات مهنية / Informations Professionnels
                                </h5>
                              </div>
                            </div>
                          </Card.Header> */}
                          <Card.Body>
                            <Row
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Col lg={3}>
                                {/* <div className="mb-3">
                                  <Form.Label htmlFor="matricule">
                                    Matricule
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="matricule"
                                    placeholder=""
                                    onChange={onChange}
                                    value={formData.matricule}
                                  />
                                </div> */}
                              </Col>
                              {/* <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="mat_cnrps">
                                    Matricule CNRPS
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="mat_cnrps"
                                    placeholder=""
                                    onChange={onChange}
                                    value={formData.mat_cnrps}
                                  />
                                </div>
                              </Col> */}
                              <Col lg={3}>
                                {/* <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="poste">
                                    Poste / الخطة الوظيفية
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="poste"
                                    id="poste"
                                    // required
                                    value={formData?.poste?.poste_fr!}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Séléctionner la Poste / اختر الوظيفة
                                    </option>
                                    {poste.map((poste) => (
                                      <option key={poste._id} value={poste._id}>
                                        {poste.poste_fr}
                                      </option>
                                    ))}
                                  </select>
                                </div> */}
                              </Col>

                             
                              {/* <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="date_affectation">
                                    تاريخ الإنتداب
                                  </Form.Label>
                                  <Flatpickr
                                    value={selectedDateAffectation!}
                                    onChange={handleDateChangeAffectation}
                                    className="form-control flatpickr-input"
                                    placeholder="اختر التاريخ"
                                    options={{
                                      dateFormat: "d M, Y",
                                    }}
                                    id="date_affectation"
                                  />
                                </div>
                              </Col> */}
                              {/* <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="grade">
                                    الرتبة
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="grade"
                                    id="grade"
                                    // required
                                    value={formData?.grade?.grade_ar!}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Séléctionner la Poste / اختر الوظيفة
                                    </option>
                                    {grade.map((grade) => (
                                      <option key={grade._id} value={grade._id}>
                                        {grade.grade_ar}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </Col> */}
                              {/* <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="categorie">
                                    الصنف / Catégorie
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="categorie"
                                    id="categorie"
                                    // required
                                    value={formData?.categorie?.categorie_fr!}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Séléctionner la Catégorie / اختر الصنف
                                    </option>
                                    {categorie.map((categorie) => (
                                      <option
                                        key={categorie._id}
                                        value={categorie._id}
                                      >
                                        {categorie.categorie_fr}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </Col> */}
                              {/* <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="date_designation">
                                    تاريخ التسمية في الرتبة أو الصنف
                                  </Form.Label>
                                  <Flatpickr
                                    value={selectedDateDesignation!}
                                    onChange={handleDateChangeDesignation}
                                    className="form-control flatpickr-input"
                                    placeholder="اختر التاريخ"
                                    options={{
                                      dateFormat: "d M, Y",
                                    }}
                                    id="date_designation"
                                  />
                                </div>
                              </Col> */}
                              {/* <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="service">
                                    الخدمات/ Services
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="service"
                                    id="service"
                                    // required
                                    value={formData?.service?.service_fr!}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Séléctionner la Service / اختر الخدمة
                                    </option>
                                    {servicePersonnel.map((service) => (
                                      <option
                                        key={service._id}
                                        value={service._id}
                                      >
                                        {service.service_fr}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </Col> */}
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-person-vcard-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  معلومات البنك / Informations bancaires
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label htmlFor="date_delivrance">
                                    تاريخ إصدار بطاقة التعريف الوطنية
                                  </Form.Label>
                                  <Flatpickr
                                    value={selectedDateDelivrance!}
                                    onChange={handleDateChangeDelivrance}
                                    className="form-control flatpickr-input"
                                    placeholder="اختر التاريخ"
                                    options={{
                                      dateFormat: "d M, Y",
                                    }}
                                    id="date_delivrance"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <label
                                    htmlFor="num_cin"
                                    className="form-label"
                                  >
                                    رقم بطاقة التعريف الوطنية
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="num_cin"
                                    placeholder=""
                                    onChange={onChange}
                                    value={formData.num_cin}

                                    // required
                                  />
                                </div>
                              </Col>

                              <Col lg={3}>
                                <div
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <label
                                    htmlFor="identifinat_unique"
                                    className="form-label"
                                  >
                                    المعرف الوحيد
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="identifinat_unique"
                                    placeholder=""
                                    onChange={onChange}
                                    value={formData.identifinat_unique}
                                    // required
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <label
                                    htmlFor="compte_courant"
                                    className="form-label"
                                  >
                                    الحساب الجاري للعامل
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="compte_courant"
                                    placeholder=""
                                    onChange={onChange}
                                    value={formData.compte_courant}
                                    // required
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>

                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-geo-alt-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  معلومات عنوان الأستاذ / Informations sur
                                  l'adresse de l'enseignant
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="adress_fr">
                                    Adresse (en français)
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="adress_fr"
                                    placeholder=""
                                    dir="rtl"
                                    onChange={onChange}
                                    value={formData.adress_fr}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="adress_ar"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    العنوان (بالعربية)
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="adress_ar"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.adress_ar}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="code_postale"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    الترقيم البريدي
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="code_postale"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.code_postale}
                                  />
                                </div>
                              </Col>

                              <Col lg={2}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <label
                                    htmlFor="المعتمدية"
                                    className="form-label"
                                  >
                                    المعتمدية
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="المعتمدية"
                                    id="المعتمدية"
                                    value={selectedDelegation}
                                    onChange={handleDelegationChange}
                                    disabled={!selectedWilaya} // Disable if no Wilaya is selected
                                  >
                                    <option value="">إخترالمعتمدية</option>
                                    {selectedWilaya &&
                                      delegationOptions[selectedWilaya].map(
                                        (delegation, index) => (
                                          <option
                                            key={index}
                                            value={delegation}
                                          >
                                            {delegation}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <label
                                    htmlFor="الولاية"
                                    className="form-label"
                                  >
                                    الولاية
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="الولاية"
                                    id="الولاية"
                                    value={selectedWilaya}
                                    onChange={handleWilayaChange}
                                  >
                                    <option value="">إخترالولاية</option>
                                    {wilayaOptions.map((wilaya, index) => (
                                      <option key={index} value={wilaya}>
                                        {wilaya}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="num_phone1"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    الهاتف الجوال 1
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="num_phone1"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.num_phone1}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="num_phone2"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    الهاتف الجوال 2
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="num_phone2"
                                    placeholder=""
                                    dir="rtl"
                                    onChange={onChange}
                                    value={formData.num_phone2}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="email"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    البريد الإلكتروني
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    id="email"
                                    placeholder=""
                                    // required
                                    onChange={onChange}
                                    value={formData.email}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>

                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-people-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  معلومات قرين الموظف / Informations du conjoint
                                  du personnel
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={4}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="nombre_fils"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    عدد الأبناء
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="nombre_fils"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.nombre_fils}
                                  />
                                </div>
                              </Col>

                              <Col lg={4}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="job_conjoint"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    مهنة القرين ومكانها
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="job_conjoint"
                                    placeholder=""
                                    dir="rtl"
                                    onChange={onChange}
                                    value={formData.job_conjoint}
                                  />
                                </div>
                              </Col>
                              <Col lg={4}>
                                <div
                                  className="mb-3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="nom_conjoint"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    إسم القرين ولقبه
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="nom_conjoint"
                                    placeholder=""
                                    dir="rtl"
                                    onChange={onChange}
                                    value={formData.nom_conjoint}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-people-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  Historique des positions/ التسلسل المهني
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          {formData.historique_positions.map(
                            (position: any, index: number) => (
                              <Row
                                key={index}
                                className="align-items-end m-3 border-bottom "
                              >
                                <Col lg={4}>
                                  <Form.Label>
                                    Poste / الخطة الوظيفية
                                  </Form.Label>
                                  <Form.Select
                                    value={position.poste}
                                    onChange={(e) =>
                                      handleHistoricChange(
                                        index,
                                        "poste",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      -- Choisir Poste --
                                    </option>
                                    {poste.map((item: any) => (
                                      <option key={item._id} value={item._id}>
                                        {item.poste_ar} / {item.poste_fr}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Col>
                                <Col lg={4}>
                                  <Form.Label>Grade / الرتبة</Form.Label>
                                  <Form.Select
                                    value={position.grade}
                                    onChange={(e) =>
                                      handleHistoricChange(
                                        index,
                                        "grade",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      -- Choisir Grade --
                                    </option>
                                    {grade.map((item: any) => (
                                      <option key={item._id} value={item._id}>
                                        {item.grade_ar} / {item.grade_fr}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Col>
                                <Col lg={4}>
                                  <Form.Label>Catégorie / الصنف</Form.Label>
                                  <Form.Select
                                    value={position.categorie}
                                    onChange={(e) =>
                                      handleHistoricChange(
                                        index,
                                        "categorie",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      -- Choisir Catégorie --
                                    </option>
                                    {categorie.map((item: any) => (
                                      <option key={item._id} value={item._id}>
                                        {item.categorie_ar} /{" "}
                                        {item.categorie_fr}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Col>
                                <Col lg={4}>
                                  <Form.Label>
                                    Date Affectation / تاريخ الإنتداب
                                  </Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={position.date_affectation}
                                    onChange={(e) =>
                                      handleHistoricChange(
                                        index,
                                        "date_affectation",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Form.Label className="mt-2">
                                    Fichier Affectation
                                  </Form.Label>
                                  <Form.Control
                                    type="file"
                                    onChange={(e) => {
                                      const file = (
                                        e.target as HTMLInputElement
                                      ).files?.[0];
                                      if (file) {
                                        handleHistoricFileChange(
                                          index,
                                          "fichier_affectation",
                                          file
                                        );
                                      }
                                    }}
                                  />
                                </Col>
                                <Col lg={4}>
                                  <Form.Label>
                                    Date Titularisation / تاريخ الترسيم
                                  </Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={position.date_titularisation}
                                    onChange={(e) =>
                                      handleHistoricChange(
                                        index,
                                        "date_titularisation",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Form.Label className="mt-2">
                                    Fichier Titularisation
                                  </Form.Label>
                                  <Form.Control
                                    type="file"
                                    onChange={(e) => {
                                      const file = (
                                        e.target as HTMLInputElement
                                      ).files?.[0];
                                      if (file) {
                                        handleHistoricFileChange(
                                          index,
                                          "fichier_titularisation",
                                          file
                                        );
                                      }
                                    }}
                                  />
                                </Col>
                                <Col lg={4}>
                                  <Form.Label className="mt-2">
                                    Date Départ / تاريخ المغادرة
                                  </Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={position.date_depart}
                                    onChange={(e) =>
                                      handleHistoricChange(
                                        index,
                                        "date_depart",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Form.Label className="mt-2">
                                    Fichier Départ
                                  </Form.Label>
                                  <Form.Control
                                    type="file"
                                    onChange={(e) => {
                                      const file = (
                                        e.target as HTMLInputElement
                                      ).files?.[0];
                                      if (file) {
                                        handleHistoricFileChange(
                                          index,
                                          "fichier_depart",
                                          file
                                        );
                                      }
                                    }}
                                  />
                                </Col>
                                <Col lg={3}>
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      removeHistoricPosition(index)
                                    }
                                  >
                                    Supprimer
                                  </Button>
                                </Col>
                              </Row>
                            )
                          )}
                          <Button
                            variant="secondary"
                            onClick={addHistoricPosition}
                          >
                            + Ajouter une position
                          </Button>
                        </Col>
                        <Col lg={12}>
                        <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-people-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                              <h5 className="card-title">Historique des Services / تاريخ الخدمات</h5>
                              </div>
                            </div>
                          </Card.Header>
                          {formData.historique_services.map((service:any, index:any) => (
  <Row key={index} className="align-items-end mb-3">
    <Col md={3}>
      <Form.Group controlId={`service-${index}`}>
        <Form.Label>Service</Form.Label>
        <Form.Select
          value={service.service}
          onChange={(e) =>
            handleHistoriqueServiceChange(index, "service", e.target.value)
          }
        >
          <option value="">-- Choisir --</option>
          {servicePersonnel?.map((s:any) => (
            <option key={s._id} value={s._id}>
              {s.service_fr}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group controlId={`date_affectation-${index}`}>
        <Form.Label>Date d'affectation</Form.Label>
        <Form.Control
          type="date"
          value={service.date_affectation}
          onChange={(e) =>
            handleHistoriqueServiceChange(index, "date_affectation", e.target.value)
          }
        />
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group controlId={`date_depart-${index}`}>
        <Form.Label>Date de départ</Form.Label>
        <Form.Control
          type="date"
          value={service.date_depart}
          onChange={(e) =>
            handleHistoriqueServiceChange(index, "date_depart", e.target.value)
          }
        />
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group controlId={`fichier_affectation-${index}`}>
        <Form.Label>Fichier affectation</Form.Label>
        <Form.Control
          type="file"
          accept=".pdf"
          onChange={(e:any) => handleServiceFileUpload(index, "fichier_affectation", e)}
        />
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group controlId={`fichier_depart-${index}`}>
        <Form.Label>Fichier départ</Form.Label>
        <Form.Control
          type="file"
          accept=".pdf"
          onChange={(e:any) => handleServiceFileUpload(index, "fichier_depart", e)}
        />
      </Form.Group>
    </Col>

    <Col md={1}>
      <Button
        variant="danger"
        onClick={() => removeHistoriqueService(index)}
        className="mt-2"
      >
        &times;
      </Button>
    </Col>
  </Row>
))}

<Button variant="primary" onClick={addHistoriqueService}>
  + Ajouter un service
</Button>


                        </Col>

                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Ajouter Personnel
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

export default AjouterPersonnels;
