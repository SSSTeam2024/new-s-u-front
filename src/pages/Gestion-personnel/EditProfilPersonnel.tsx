import React, { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdatePersonnelMutation } from "features/personnel/personnelSlice";
import SimpleBar from "simplebar-react";
import Flatpickr from "react-flatpickr";
import country from "Common/country";
import { format } from "date-fns";
import { useFetchEtatsPersonnelQuery } from "features/etatPersonnel/etatPersonnelSlice";
import { useFetchPostesPersonnelQuery } from "features/postePersonnel/postePersonnel";
import { useFetchGradesPersonnelQuery } from "features/gradePersonnel/gradePersonnel";
import { useFetchCategoriesPersonnelQuery } from "features/categoriePersonnel/categoriePersonnel";
import { useFetchServicesPersonnelQuery } from "features/servicePersonnel/servicePersonnel";
type Wilaya =
  | "اريانة"
  | "بن عروس"
  | "باجة"
  | "بنزرت"
  | "قابس"
  | "قفصة"
  | "جندوبة"
  | "قبلي"
  | "الكاف"
  | "القيروان"
  | "مدنين"
  | "المهدية"
  | "المنستير"
  | "نابل"
  | "صفاقس"
  | "سليانة"
  | "سوسة"
  | "تطاوين"
  | "توزر"
  | "تونس"
  | "زغوان"
  | "منوبة"
  | "القصرين"
  | "سيدي بوزيد";

const wilayaOptions: Wilaya[] = [
  "اريانة",
  "بن عروس",
  "باجة",
  "بنزرت",
  "قابس",
  "قفصة",
  "جندوبة",
  "قبلي",
  "الكاف",
  "القيروان",
  "مدنين",
  "المهدية",
  "المنستير",
  "نابل",
  "صفاقس",
  "سليانة",
  "سوسة",
  "تطاوين",
  "توزر",
  "تونس",
  "زغوان",
  "منوبة",
  "القصرين",
  "سيدي بوزيد",
];

type DelegationOptions = {
  [key in Wilaya]: string[];
};

const delegationOptions: DelegationOptions = {
  اريانة: [
    "اريانة المدينة",
    "سكرة",
    "رواد",
    "قلعة الأندلس",
    "سيدي ثابت",
    "حي التضامن",
    "المنيهلة",
  ],
  "بن عروس": [
    "حمام الأنف",
    "بن عروس",
    "المدينة الجديدة",
    "المروج",
    "حمام الشط",
    "بومهل البساتين",
    "الزهراء",
    "رادس",
    "مقرين",
    "المحمدية",
    "المحمدية",
    "مرناق",
  ],
  باجة: [
    "باجة الشمالية",
    "باجة الجنوبية",
    "تبرسق",
    "نفزة",
    "تيبار",
    "تستور",
    "قبلاط",
    "مجاز الباب",
  ],
  بنزرت: [
    "بنزرت الشمالية",
    "جرزونة",
    "بنزرت الجنوبية",
    "سجنان",
    "جومين",
    "ماطر",
    "غزالة",
    "منزل بورقيبة",
    "تينجة",
    "أوتيك",
    "غار الملح",
    "منزل جميل",
    "العالية",
    "رأس الجبل",
  ],
  قابس: [
    "قابس المدينة",
    "قابس الغربية",
    "قابس الجنوبية",
    "غنوش",
    "المطوية",
    "منزل الحبيب",
    "الحامة",
    "مطماطة",
    "مطماطة الجديدة",
    "مارث",
    "دخيلة توجان",
  ],
  قفصة: [
    "قفصة الشمالية",
    "سيدي عيش",
    "القصر",
    "قفصة الجنوبية",
    "أم العرائس",
    "سيدي بوبكر",
    "الرديف",
    "المتلوي",
    "المظيلة",
    "القطار",
    "بالخير",
    "زنوش",
  ],
  جندوبة: [
    "جندوبة",
    "جندوبة الشمالية",
    "بوسالم",
    "طبرقة",
    "عين دراهم",
    "فرنانة",
    "غار الدماء",
    "وادي مليز",
    "بلطة بوعوان",
  ],
  قبلي: [
    "قبلي الجنوبية",
    "قبلي الشمالية",
    "سوق الأحد",
    "دوز الشمالية",
    "دوز الجنوبية",
    "الفوار",
    "رجيم معتوق",
  ],
  الكاف: [
    "الكاف الغربية",
    "الكاف الشرقية",
    "نبر",
    "الطويرف",
    "ساقية سيدي يوسف",
    "تاجروين",
    "القلعة الخصبة",
    "الجريصة",
    "القصور",
    "الدهماني",
    "السرس",
  ],
  القيروان: [
    "القيروان الشمالية",
    "القيروان الجنوبية",
    "الشبيكة",
    "السبيخة",
    "الوسلاتية",
    "حفوز",
    "العلا",
    "حاجب العيون",
    "نصر الله",
    "الشراردة",
    "بوحجلة",
    "عين جلولة",
    "منزل المهيري",
  ],
  مدنين: [
    "مدنين الشمالية",
    "مدنين الجنوبية",
    "بني خداش",
    "بن قردان",
    "جرجيس",
    "جربة حومة السوق",
    "جربة ميدون",
    "جربة اجيم",
    "سيدي مخلوف",
  ],
  المهدية: [
    "المهدية",
    "بومرداس",
    "أولاد الشامخ",
    "هبيرة",
    "السواسي",
    "الجم",
    "الشابة",
    "ملولش",
    "قصور الساف",
  ],
  المنستير: [
    "المنستير",
    "الوردانين",
    "الساحلين",
    "زرمدين",
    "بني حسان",
    "جمال",
    "بنبلة",
    "المكنين",
    "البقالطة",
    "طبلبة",
    "قصر هلال",
    "قصيبة الميدوني",
    "صيادة لمطة بوحجر",
  ],
  نابل: [
    "نابل",
    "دار شعبان الفهري",
    "بني خيار",
    "قربة",
    "منزل تميم",
    "الميدة",
    "قليبية",
    "حمام الأغزاز",
    "الهوارية",
    "تاكسلة",
    "سليمان",
    "منزل بوزلفة",
    "بني خلاد",
    "قرمبالية",
    "بوعرقوب",
    "الحمامات",
  ],
  صفاقس: [
    "صفاقس المدينة",
    "صفاقس الغربية",
    "ساقية الزيت",
    "صفاقس الجنوبية",
    "ساقية الداير",
    "طينة",
    "عقارب",
    "جبنيانة",
    "العامرة",
    "الحنشة",
    "منزل شاكر",
    "الغريبة",
    "بئر علي بن خليفة",
    "محرس",
    "الصخيرة",
    "قرقنة",
  ],
  سليانة: [
    "سليانة الجنوبية",
    "سليانة الشمالية",
    "بوعرادة",
    "قعفور",
    "العروسة",
    "الكريب",
    "بورويس",
    "مكثر",
    "الروحية",
    "كسرى",
    "برقو",
  ],
  سوسة: [
    "سوسة المدينة",
    "الزاوية القصيبة الثريات",
    "سوسة الرياض",
    "سوسة جوهرة",
    "سوسة سيدي عبد الحميد",
    "حمام سوسة",
    "أكودة",
    "القلعة الكبرى",
    "سيدي بو علي",
    "هرقلة",
    "النفيضة",
    "بوفيشة",
    "كندار",
    "سيدي الهاني",
    "مساكن",
    "القلعة الصغرى",
  ],
  تطاوين: [
    "تطاوين الشمالية",
    "تطاوين الجنوبية",
    "الصمار",
    "البئر الأحمر",
    "غمراسن",
    "ذهيبة",
    "رمادة",
    "بني مهيرة",
  ],
  توزر: ["توزر", "دقاش", "تمغزة", "نفطة", "حزوة", "حامة الجريد"],
  تونس: [
    "قرطاج",
    "المدينة",
    "باب البحر",
    "باب سويقة",
    "العمران",
    "العمران الأعلى",
    "التحرير",
    "المنزه",
    "حي الخضراء",
    "باردو",
    "السيجومي",
    "الزهور",
    "الحرائرية",
    "سيدي حسين",
    "الوردية",
    "الكبارية",
    "سيدي البشير",
    "جبل الجلود",
    "حلق الوادي",
    "الكرم",
    "المرسى",
  ],
  زغوان: ["زغوان", "الزريبة", "بئر مشارقة", "الفحص", "الناظور", "صواف"],
  منوبة: [
    "منوبة",
    "وادي الليل",
    "طبربة",
    "البطان",
    "الجديدة",
    "المرناقية",
    "برج العامري",
    "دوار هيشر",
  ],
  القصرين: [
    "القصرين الشمالية",
    "القصرين الجنوبية",
    "الزهور",
    "حاسي الفريد",
    "سبيطلة",
    "سبيبة",
    "جدليان",
    "العيون",
    "تالة",
    "حيدرة",
    "فوسانة",
    "ماجل بالعباس",
  ],
  "سيدي بوزيد": [
    "سيدي بوزيد الغربية",
    "سيدي بوزيد الشرقية",
    "سبالة أولاد عسكر",
    "بئر الحفي",
    "سيدي علي بن عون",
    "منزل بوزيان",
    "المكناسي",
    "سوق الجديد",
    "المزونة",
    "الرقاب",
    "السعيدة",
    "أولاد حفوز",
  ],
};

const EditProfilPersonnel = () => {
  document.title = " Modifier Profil Personnel | Application Smart Institute";
  const navigate = useNavigate();
  const { state: personnel } = useLocation();
  const [editPersonnel] = useUpdatePersonnelMutation();
  const { data: etat_compte = [] } = useFetchEtatsPersonnelQuery();
  const { data: poste = [] } = useFetchPostesPersonnelQuery();
  const { data: grade = [] } = useFetchGradesPersonnelQuery();
  const { data: categorie = [] } = useFetchCategoriesPersonnelQuery();
  const { data: service = [] } = useFetchServicesPersonnelQuery();

  const [formData, setFormData] = useState({
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
    etat_compte: {
      _id: "",
      value: "",
      etat_fr: "",
      etat_ar: "",
    },
    poste: {
      _id: "",
      value: "",
      poste_fr: "",
      poste_ar: "",
    },
    grade: {
      _id: "",
      value_grade_personnel: "",
      grade_fr: "",
      grade_ar: "",
    },
    categorie: {
      _id: "",
      value: "",
      categorie_fr: "",
      categorie_ar: "",
    },
    service: {
      _id: "",
      value: "",
      service_fr: "",
      service_ar: "",
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
    photo_profil: "",
    PhotoProfilFileExtension: "",
    PhotoProfilFileBase64String: "",
  });
  const [selectedCountry1, setSelectedCountry1] = useState<any>({});
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | "">(
    personnel?.state! || ""
  );
  const [selectedDelegation, setSelectedDelegation] = useState<string>("");
  const [selectedDateDelivrance, setSelectedDateDelivrance] =
    useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateDesignation, setSelectedDateDesignation] =
    useState<Date | null>(null);
  const [selectedDateAffectation, setSelectedDateAffectation] =
    useState<Date | null>(null);

  useEffect(() => {
    console.log(personnel);
    if (personnel) {
      setFormData({
        _id: personnel._id || "",
        nom_fr: personnel.nom_fr || "",
        mat_cnrps: personnel.mat_cnrps || "",
        matricule: personnel.matricule || "",
        nom_ar: personnel.nom_ar || "",
        prenom_fr: personnel.prenom_fr || "",
        prenom_ar: personnel.prenom_ar || "",
        lieu_naissance_fr: personnel.lieu_naissance_fr || "",
        lieu_naissance_ar: personnel.lieu_naissance_ar || "",
        date_designation: personnel.date_designation || "",
        date_naissance: personnel.date_naissance || "",
        nationalite: personnel.nationalite || "",
        etat_civil: personnel.etat_civil || "",
        sexe: personnel.sexe || "",
        date_affectation: personnel.date_affectation || "",
        compte_courant: personnel.compte_courant || "",
        identifinat_unique: personnel.identifinat_unique || "",
        num_cin: personnel.num_cin || "",
        date_delivrance: personnel.date_delivrance || "",
        state: personnel.state || "",
        dependence: personnel.dependence || "",
        code_postale: personnel.code_postale || "",
        adress_ar: personnel.adress_ar || "",
        adress_fr: personnel.adress_fr || "",
        email: personnel.email || "",
        num_phone1: personnel.num_phone1 || "",
        num_phone2: personnel.num_phone2 || "",
        nom_conjoint: personnel.nom_conjoint || "",
        job_conjoint: personnel.job_conjoint || "",
        nombre_fils: personnel.nombre_fils || "",
        photo_profil: personnel.photo_profil || "",
        PhotoProfilFileExtension: personnel.PhotoProfilFileExtension || "",
        PhotoProfilFileBase64String:
          personnel.PhotoProfilFileBase64String || "",
        etat_compte: {
          _id: personnel.etat_compte?._id || "",
          value: personnel.etat_compte?.value || "",
          etat_fr: personnel.etat_compte?.etat_fr || "",
          etat_ar: personnel.etat_compte?.etat_ar || "",
        },
        poste: {
          _id: personnel.poste?._id || "",
          value: personnel.poste?.value || "",
          poste_fr: personnel.poste?.poste_fr || "",
          poste_ar: personnel.poste?.poste_ar || "",
        },
        grade: {
          _id: personnel.grade?._id || "",
          value_grade_personnel: personnel.grade?.value_grade_personnel || "",
          grade_fr: personnel.grade?.grade_fr || "",
          grade_ar: personnel.grade?.grade_ar || "",
        },
        categorie: {
          _id: personnel.categorie?._id || "",
          value: personnel.categorie?.value || "",
          categorie_fr: personnel.categorie?.categorie_fr || "",
          categorie_ar: personnel.categorie?.categorie_ar || "",
        },
        service: {
          _id: personnel.service?._id || "",
          value: personnel.service?.value || "",
          service_fr: personnel.service?.service_fr || "",
          service_ar: personnel.service?.service_ar || "",
        },
      });

      if (!personnel.PhotoProfilFileBase64String && personnel.photo_profil) {
        const fetchImageData = async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${personnel.photo_profil}`
            );

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const blob = await response.blob();

            // Convert blob to base64
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const base64Data = base64String.split(",")[1];
              const extension = personnel.photo_profil.split(".").pop();

              setFormData((prev) => ({
                ...prev,
                PhotoProfilFileBase64String: base64Data,
                PhotoProfilFileExtension: extension,
              }));
            };

            reader.readAsDataURL(blob);
          } catch (error) {
            console.error("Error fetching image data:", error);
          }
        };

        fetchImageData();
      }
      if (personnel.state) {
        setSelectedWilaya(personnel.state as Wilaya);
      }

      if (personnel.date_delivrance) {
        setSelectedDateDelivrance(new Date(personnel.date_delivrance));
      } else {
        setSelectedDateDelivrance(null);
      }

      if (personnel.date_naissance) {
        setSelectedDate(new Date(personnel.date_naissance));
      } else {
        setSelectedDate(null);
      }
      if (personnel.date_designation) {
        setSelectedDateDesignation(new Date(personnel.date_designation));
      } else {
        setSelectedDateDesignation(null);
      }
      if (personnel.date_affectation) {
        setSelectedDateAffectation(new Date(personnel.date_affectation));
      } else {
        setSelectedDateAffectation(null);
      }
    }
  }, [personnel]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const onSubmitPersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Submitting form with data:", formData);
      await editPersonnel(formData).unwrap();
      notify();
      navigate("/ListePersonnels");
    } catch (error: any) {
      console.log(error);
    }
  };
  // change date delivrance
  const handleDateChangeDelivrance = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState) => ({
        ...prevState,
        date_delivrance: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        date_delivrance: "",
      }));
    }
  };
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Matière a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  // change date affectation
  const handleDateChangeAffectation = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState) => ({
        ...prevState,
        date_affectation: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
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
      setFormData((prevState) => ({
        ...prevState,
        date_naissance: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        date_naissance: "",
      }));
    }
  };

  // change date designation grade /categorie
  const handleDateChangeDesignation = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData((prevState) => ({
        ...prevState,
        date_designation: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        date_designation: "",
      }));
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "poste") {
      setFormData({
        ...formData,
        poste: {
          ...formData.poste,
          _id: value,
        },
      });
    } else if (name === "etat_compte") {
      setFormData({
        ...formData,
        etat_compte: {
          ...formData.etat_compte,
          _id: value,
        },
      });
    } else if (name === "service") {
      setFormData({
        ...formData,
        service: {
          ...formData.service,
          _id: value,
        },
      });
    } else if (name === "grade") {
      setFormData({
        ...formData,
        grade: {
          ...formData.grade,
          _id: value,
        },
      });
    } else if (name === "categorie") {
      setFormData({
        ...formData,
        categorie: {
          ...formData.categorie,
          _id: value,
        },
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "state") {
      setSelectedWilaya(value as Wilaya);
      setFormData((prevFormData) => ({
        ...prevFormData,
        dependence: "",
      }));
    }
  };

  const convertToBase64 = (
    file: File
  ): Promise<{ base64Data: string; extension: string }> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const base64Data = base64String.split(",")[1];
        const extension = file.name.split(".").pop() || "";
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64Data, extension } = await convertToBase64(file);
        setFormData((prev) => ({
          ...prev,
          photo_profil: `${file.name}`, // Keep the original file name
          PhotoProfilFileBase64String: base64Data,
          PhotoProfilFileExtension: extension,
        }));
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };
  const handleCountrySelect = (country: any) => {
    setSelectedCountry1(country);
    setFormData((prevData) => ({
      ...prevData,
      nationalite: country.countryName,
    }));
  };

  const photoProfilSrc =
    formData.PhotoProfilFileBase64String && formData.PhotoProfilFileExtension
      ? `data:image/${formData.PhotoProfilFileExtension};base64,${formData.PhotoProfilFileBase64String}`
      : ""; // Fallback image

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
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
                                      src={photoProfilSrc}
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
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="nom_ar"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
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
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="prenom_ar"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
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
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label>
                                    {" "}
                                    الجنسية/ Nationalité{" "}
                                  </Form.Label>
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
                                      defaultValue={
                                        selectedCountry1.countryName
                                      }
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
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="lieu_naissance_fr"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
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
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
                                  <Form.Label
                                    htmlFor="lieu_naissance_ar"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
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
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
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
                                    value={formData?.etat_civil || ""} // Reflect the selected value from formData
                                    onChange={handleSelectChange}
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
                                    value={formData?.sexe || ""} // Reflect the selected value from formData
                                    onChange={handleSelectChange}
                                  >
                                    <option value="">الجنس</option>
                                    <option value="ذكر">ذكر</option>
                                    <option value="أنثى">أنثى</option>
                                  </select>
                                </div>
                              </Col>
                            </Row>

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
                                      معلومات مهنية / Informations
                                      Professionnels
                                    </h5>
                                  </div>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <Row
                                  style={{
                                    direction: "rtl",
                                    textAlign: "right",
                                  }}
                                >
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
                                      <Form.Label htmlFor="poste">
                                        Poste / الخطة الوظيفية
                                      </Form.Label>
                                      <select
                                        className="form-select text-muted"
                                        name="poste"
                                        id="poste"
                                        // required
                                        value={formData?.poste?._id || ""}
                                        onChange={handleChange}
                                      >
                                        <option value="">
                                          Séléctionner la Poste / اختر الوظيفة
                                        </option>
                                        {poste.map((poste) => (
                                          <option
                                            key={poste._id}
                                            value={poste._id}
                                          >
                                            {poste.poste_fr}
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
                                        حالة الحساب
                                      </Form.Label>
                                      <select
                                        className="form-select text-muted"
                                        name="etat_compte"
                                        id="etat_compte"
                                        // required
                                        value={formData?.etat_compte?._id || ""}
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
                                        الرتبة
                                      </Form.Label>
                                      <select
                                        className="form-select text-muted"
                                        name="grade"
                                        id="grade"
                                        // required
                                        value={formData?.grade?._id || ""}
                                        onChange={handleChange}
                                      >
                                        <option value="">
                                          Séléctionner la Poste / اختر الوظيفة
                                        </option>
                                        {grade.map((grade) => (
                                          <option
                                            key={grade._id}
                                            value={grade._id}
                                          >
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
                                      <Form.Label htmlFor="categorie">
                                        الصنف / Catégorie
                                      </Form.Label>
                                      <select
                                        className="form-select text-muted"
                                        name="categorie"
                                        id="categorie"
                                        // required
                                        value={formData?.categorie?._id || ""}
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
                                  </Col>
                                  <Col lg={3}>
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
                                  </Col>
                                  <Col lg={3}>
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
                                        value={formData?.service?._id || ""}
                                        onChange={handleChange}
                                      >
                                        <option value="">
                                          Séléctionner la Service / اختر الخدمة
                                        </option>
                                        {service.map((service) => (
                                          <option
                                            key={service._id}
                                            value={service._id}
                                          >
                                            {service.service_fr}
                                          </option>
                                        ))}
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
                                        htmlFor="dependence"
                                        className="form-label"
                                      >
                                        المعتمدية
                                      </label>
                                      <select
                                        className="form-select text-muted"
                                        name="dependence"
                                        id="dependence"
                                        value={formData?.dependence}
                                        onChange={handleSelectChange}
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
                                        htmlFor="state"
                                        className="form-label"
                                      >
                                        الولاية
                                      </label>
                                      <select
                                        className="form-select text-muted"
                                        name="state"
                                        id="state"
                                        value={formData?.state}
                                        onChange={handleSelectChange}
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
                                      معلومات قرين الموظف / Informations du
                                      conjoint du personnel
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
                              <div className="hstack gap-2 justify-content-end">
                                <Button
                                  variant="primary"
                                  id="add-btn"
                                  type="submit"
                                >
                                  Modifier Personnel
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditProfilPersonnel;