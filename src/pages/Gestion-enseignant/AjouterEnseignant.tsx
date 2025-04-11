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
import { useAddEnseignantMutation } from "features/enseignant/enseignantSlice";
import { useFetchEtatsEnseignantQuery } from "features/etatEnseignant/etatEnseignant";
import { useFetchPostesEnseignantQuery } from "features/posteEnseignant/posteEnseignant";
import { useFetchGradesEnseignantQuery } from "features/gradeEnseignant/gradeEnseignant";
import { useFetchSpecialitesEnseignantQuery } from "features/specialiteEnseignant/specialiteEnseignant";
import { useFetchDepartementsQuery } from "features/departement/departement";
import { format } from "date-fns";
import { Wilaya } from "Common/wilaya";
import { wilayaOptions } from "Common/wilayaOptions";
import { delegationOptions } from "Common/delegationOptions";

interface GradeOptions {
  _id: string;
  value_grade_enseignant: string;
  grade_ar: string;
  grade_fr: string;
}

const AjouterEnseignant = () => {
  document.title = "Ajouter Enseignant | ENIGA";
  const navigate = useNavigate();

  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | "">("");
  const [selectedCountry1, setSelectedCountry1] = useState<any>({});
  const [selectedDelegation, setSelectedDelegation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateAffectation, setSelectedDateAffectation] =
    useState<Date | null>(null);
  const [selectedDateDelivrance, setSelectedDateDelivrance] =
    useState<Date | null>(null);
  const [selectedDateCertif1, setSelectedDateCertif1] = useState<Date | null>(
    null
  );
  const [selectedDateCertif2, setSelectedDateCertif2] = useState<Date | null>(
    null
  );
  const [selectedDateCertif3, setSelectedDateCertif3] = useState<Date | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [createEnseignant] = useAddEnseignantMutation();
  const { data: etat_compte = [] } = useFetchEtatsEnseignantQuery();
  const { data: poste = [] } = useFetchPostesEnseignantQuery();
  const { data: grade = [] } = useFetchGradesEnseignantQuery();
  const { data: specilaite = [] } = useFetchSpecialitesEnseignantQuery();
  const { data: departements = [] } = useFetchDepartementsQuery();

  const [formData, setFormData] = useState<any>({
    _id: "",
    nom_fr: "",
    matricule: "",
    mat_cnrps: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    lieu_naissance_fr: "",
    lieu_naissance_ar: "",
    date_naissance: "",
    nationalite: "",
    etat_civil: "",
    sexe: "",
    etat_compte: "",
    poste: "",
    grade: "",
    specilaite: "",
    departements: {
      _id: "",
      description: "",
      volume_horaire: "",
      nom_chef_dep: "",
      name_ar: "",
      name_fr: "",
      SignatureFileExtension: "",
      SignatureFileBase64String: "",
      signature: "",
    },
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

    entreprise1: "",
    annee_certif1: "",
    certif1: "",

    entreprise2: "",
    annee_certif2: "",
    certif2: "",

    entreprise3: "",
    annee_certif3: "",
    certif3: "",
    photo_profil: "",
    PhotoProfilFileExtension: "",
    PhotoProfilFileBase64String: "",
    situation_fr: "",
    situation_ar: "",
  });

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
  // change date certif 1
  const handleDateChangeCertif1 = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        annee_certif1: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        annee_certif1: "",
      }));
    }
  };
  // change date certif 3
  const handleDateChangeCertif3 = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        annee_certif3: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        annee_certif3: "",
      }));
    }
  };
  // change date certif 2
  const handleDateChangeCertif2 = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState: any) => ({
        ...prevState,
        annee_certif2: formattedDate,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        annee_certif2: "",
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
  const onSubmitEnseignant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createEnseignant(formData).unwrap();
      notify();
      navigate("/gestion-enseignant/liste-enseignants");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le compte enseignant a été créé avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const getOptionLabel = (option: GradeOptions) =>
    `${option.grade_fr} / ${option.grade_ar}`;

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
                <Form onSubmit={onSubmitEnseignant}>
                  <Card.Body>
                    <Col lg={12}>
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
                              معلومات شخصية / Informations Personnelles
                            </h5>
                          </div>
                        </div>
                      </Card.Header>
                      <div className="text-center mb-3 mt-3">
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
                              title="Choisir Photo Enseignant"
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
                              // value={formData.gender}
                              onChange={selectChangeGender}
                            >
                              <option value="">الجنس</option>
                              <option value="ذكر">ذكر</option>
                              <option value="أنثى">أنثى</option>
                            </select>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={12}>
                      <Card.Header>
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar-sm">
                              <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                <i className="bi bi-info-circle-fill"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="card-title">
                              معلومات مهنية / Informations Professionnels
                            </h5>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col lg={3}>
                            <div className="mb-3">
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
                            </div>
                          </Col>
                          <Col lg={3}>
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
                          </Col>
                          <Col lg={3}>
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
                          </Col>

                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              <Form.Label htmlFor="grade">
                                الرتبة أو الصنف للأستاذ
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="grade"
                                id="grade"
                                // required
                                value={formData?.grade?.grade_ar!}
                                onChange={handleChange}
                              >
                                <option value="">Sélectionner Classe</option>
                                {grade.map((grade) => (
                                  <option key={grade._id} value={grade._id}>
                                    {grade.grade_ar}
                                  </option>
                                ))}
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
                                حالة الحساب / Etat Compte
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="etat_compte"
                                id="etat_compte"
                                // required
                                value={formData?.etat_compte?.etat_fr}
                                onChange={handleChange}
                              >
                                <option value="">Sélectionner Etat</option>
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
                          <Col lg={3}>
                            <div
                              className="mb-3"
                              style={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              <Form.Label htmlFor="poste">
                                {" "}
                                خطة / Poste
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="poste"
                                id="poste"
                                // required
                                value={formData?.poste?.poste_fr!}
                                onChange={handleChange}
                              >
                                <option value="">Sélectionner Poste</option>
                                {poste.map((poste) => (
                                  <option key={poste._id} value={poste._id}>
                                    {poste.poste_fr}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="situation_fr">
                                Statut
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="situation_fr"
                                id="situation_fr"
                                value={formData?.situation_fr!}
                                onChange={handleChange}
                              >
                                <option value="">Sélectionner Statut</option>
                                <option value="Permanent">Permanent</option>
                                <option value="Contracuel">Contrat</option>
                                <option value="Expert">Expert</option>
                                <option value="Vacataire">Vacataire</option>
                              </select>
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="situation_ar">
                                مرتبة
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="situation_ar"
                                id="situation_ar"
                                value={formData?.situation_ar!}
                                onChange={handleChange}
                              >
                                <option value="">اختر مرتبة</option>
                                <option value="قار">قار</option>
                                <option value="عرضي">عرضي</option>
                                <option value="متعاقد">متعاقد</option>
                                <option value="خبير">خبير</option>
                              </select>
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
                                <i className="bi bi-person-vcard-fill"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="card-title">
                              معلومات بنكية / Informations bancaires
                            </h5>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col lg={3}>
                            <div
                              style={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              <label htmlFor="matricule" className="form-label">
                                رقم التسجيل
                              </label>
                              <Form.Control
                                type="text"
                                id="matricule"
                                placeholder=""
                                onChange={onChange}
                                value={formData.matricule}

                                // required
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
                              <label htmlFor="num_cin" className="form-label">
                                رقم بطاقة التعريف الوطنية
                              </label>
                              <Form.Control
                                type="text"
                                id="num_cin"
                                placeholder=""
                                onChange={onChange}
                                value={formData.num_cin}
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
                                الحساب الجاري للأستاذ
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
                              معلومات عنوان الأستاذ / Informations sur l'adresse
                              de l'enseignant
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
                              <label htmlFor="المعتمدية" className="form-label">
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
                                      <option key={index} value={delegation}>
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
                              <label htmlFor="الولاية" className="form-label">
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
                              معلومات قرين الأستاذ / Informations du conjoint de
                              l'enseignant
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
                                <i className="bi bi-file-earmark-plus"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="card-title">
                              الشهادات العلمية /Diplômes Académiques
                            </h5>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col lg={6}>
                            <div
                              className="mb-3"
                              style={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              <label
                                htmlFor="departements"
                                className="form-label"
                              >
                                (Département) القسم
                              </label>
                              <select
                                className="form-select text-muted"
                                name="departements"
                                id="departements"
                                // required
                                value={formData?.departements?.name_fr!}
                                onChange={handleChange}
                              >
                                <option value="">
                                  Sélectionner Département
                                </option>
                                {departements.map((departements) => (
                                  <option
                                    key={departements._id}
                                    value={departements._id}
                                  >
                                    {departements.name_fr}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div
                              className="mb-3"
                              style={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              <label
                                htmlFor="specilaite"
                                className="form-label"
                              >
                                إختصاص الأستاذ
                              </label>
                              <select
                                className="form-select text-muted"
                                name="specilaite"
                                id="specilaite"
                                // required
                                value={formData?.specilaite?.specialite_fr!}
                                onChange={handleChange}
                              >
                                <option value="">
                                  Choisir Spécialité / إختر الإختصاص
                                </option>
                                {specilaite.map((specilaite) => (
                                  <option
                                    key={specilaite._id}
                                    value={specilaite._id}
                                  >
                                    {specilaite.specialite_fr}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>

                    <Col lg={12}>
                      <Card>
                        <Card.Header>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <h5 className="card-title">
                                (1) الشهادات العلمية
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
                                  htmlFor="certif1"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  الشهادة
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="certif1"
                                  placeholder=""
                                  dir="rtl"
                                  onChange={onChange}
                                  value={formData.certif1}
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
                                <Form.Label htmlFor="annee_certif1">
                                  سنة الشهادة
                                </Form.Label>
                                <Flatpickr
                                  value={selectedDateCertif1!}
                                  onChange={handleDateChangeCertif1}
                                  className="form-control flatpickr-input"
                                  placeholder="اختر التاريخ"
                                  options={{
                                    dateFormat: "d M, Y",
                                  }}
                                  id="annee_certif1"
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
                                  htmlFor="entreprise1"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  المؤسسة
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="entreprise1"
                                  placeholder=""
                                  dir="rtl"
                                  onChange={onChange}
                                  value={formData.entreprise1}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={12}>
                      <Card>
                        <Card.Header>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <h5 className="card-title">
                                (2) الشهادات العلمية
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
                                  htmlFor="certif2"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  الشهادة (2)
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="certif2"
                                  placeholder=""
                                  dir="rtl"
                                  onChange={onChange}
                                  value={formData.certif2}
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
                                <Form.Label htmlFor="annee_certif2">
                                  سنة الشهادة (2)
                                </Form.Label>
                                <Flatpickr
                                  value={selectedDateCertif2!}
                                  onChange={handleDateChangeCertif2}
                                  className="form-control flatpickr-input"
                                  placeholder="اختر التاريخ"
                                  options={{
                                    dateFormat: "d M, Y",
                                  }}
                                  id="annee_certif2"
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
                                  htmlFor="entreprise2"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  المؤسسة (2)
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="entreprise2"
                                  placeholder=""
                                  dir="rtl"
                                  onChange={onChange}
                                  value={formData.entreprise2}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={12}>
                      <Card>
                        <Card.Header>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <h5 className="card-title">
                                (3) الشهادات العلمية
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
                                  htmlFor="certif3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  الشهادة (3)
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="certif3"
                                  placeholder=""
                                  dir="rtl"
                                  onChange={onChange}
                                  value={formData.certif3}
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
                                <Form.Label htmlFor="annee_certif3">
                                  سنة الشهادة (3)
                                </Form.Label>
                                <Flatpickr
                                  value={selectedDateCertif3!}
                                  onChange={handleDateChangeCertif3}
                                  className="form-control flatpickr-input"
                                  placeholder="اختر التاريخ"
                                  options={{
                                    dateFormat: "d M, Y",
                                  }}
                                  id="annee_certif3"
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
                                  htmlFor="entreprise3"
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  المؤسسة (3)
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="entreprise3"
                                  placeholder=""
                                  dir="rtl"
                                  onChange={onChange}
                                  value={formData.entreprise3}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Card.Body>
                  <Card.Footer>
                    <Col lg={12}>
                      <div className="hstack gap-2 justify-content-end">
                        <Button variant="primary" id="add-btn" type="submit">
                          Ajouter Enseignant
                        </Button>
                      </div>
                    </Col>
                  </Card.Footer>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterEnseignant;
