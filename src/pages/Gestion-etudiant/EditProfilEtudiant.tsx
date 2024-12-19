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
import SimpleBar from "simplebar-react";
import Flatpickr from "react-flatpickr";
import country from "Common/country";
import { format } from "date-fns";
import {
  useGetTypeInscriptionByIdStudentMutation,
  useUpdateEtudiantMutation,
} from "features/etudiant/etudiantSlice";
import { useFetchEtatsEtudiantQuery } from "features/etatEtudiants/etatEtudiants";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchTypeInscriptionsEtudiantQuery } from "features/typeInscriptionEtudiant/typeInscriptionEtudiant";
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

interface FileDetail {
  name_ar: string;
  name_fr: string;
  file?: string;
  base64String?: string;
  extension?: string;
}
interface Section {
  _id: string;
  name_section_fr: string;
  name_section_ar: string;
  abreviation: string;
  departements: string[];
}

interface NiveauClasse {
  _id: string;
  name_niveau_ar: string;
  name_niveau_fr: string;
  abreviation: string;
  sections: Section[];
}

interface GroupeClasse {
  _id: string;
  nom_classe_fr: string;
  nom_classe_ar: string;
  departement: string;
  niveau_classe: NiveauClasse;
  matieres: string[];
}

interface Etudiant {
  _id: string;
  nom_fr: string;
  nom_ar: string;
  prenom_fr: string;
  prenom_ar: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar: string;
  date_naissance: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  num_CIN: string;
  face_1_CIN: string;
  face_2_CIN: string;
  fiche_paiement: string;
  etat_compte: {
    _id: string;
    value_etat_etudiant: string;
    etat_ar: string;
    etat_fr: string;
  };
  groupe_classe: GroupeClasse;
  state: string;
  dependence: string;
  code_postale: string;
  adress_ar: string;
  adress_fr: string;
  num_phone: string;
  email: string;
  nom_pere: string;
  job_pere: string;
  nom_mere: string;
  num_phone_tuteur: string;
  moyen: string;
  session: string;
  filiere: string;
  niveau_scolaire: string;
  annee_scolaire: string;
  type_inscription: TypeInscriptionEtudiant;
  Face1CINFileBase64String: string;
  Face1CINFileExtension: string;
  Face2CINFileBase64String: string;
  Face2CINFileExtension: string;
  FichePaiementFileBase64String: string;
  FichePaiementFileExtension: string;
  files: FileDetail[];
  photo_profil: string;
  PhotoProfilFileExtension: string;
  PhotoProfilFileBase64String: string;
}
export interface TypeInscriptionEtudiant {
  _id: string;
  value_type_inscription: string;
  type_ar: string;
  type_fr: string;
  files_type_inscription: FileDetail[];
}
const EditProfilEtudiant = () => {
  document.title = " Modifier Profil Etudiant | Application Smart Institute";
  const navigate = useNavigate();
  const { state: etudiant } = useLocation();
  const [editEtudiant] = useUpdateEtudiantMutation();
  const { data: etat_compte = [] } = useFetchEtatsEtudiantQuery();
  const { data: typeInscriptionOptions = [] } =
    useFetchTypeInscriptionsEtudiantQuery();
  const { data: groupe_classe = [] } = useFetchClassesQuery();
  const [studentTypeInscription, setStudentTypeInscription] =
    useState<TypeInscriptionEtudiant | null>(null);

  const [selectedCountry1, setSelectedCountry1] = useState<any>({});
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | "">(
    etudiant?.state! || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateBac, setSelectedDateBac] = useState<Date | null>(null);
  const [typeInscriptionData, setTypeInscriptionData] =
    useState<TypeInscriptionEtudiant | null>(null);

  const [getTypeInscriptionByIdStudent, { data, isLoading, error }] =
    useGetTypeInscriptionByIdStudentMutation();
  const [formData, setFormData] = useState<Etudiant>({
    _id: "",
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    lieu_naissance_fr: "",
    lieu_naissance_ar: "",
    date_naissance: "",
    nationalite: "",
    etat_civil: "",
    sexe: "",
    num_CIN: "",
    face_1_CIN: "",
    face_2_CIN: "",
    fiche_paiement: "",
    etat_compte: {
      _id: "",
      value_etat_etudiant: "",
      etat_ar: "",
      etat_fr: "",
    },
    groupe_classe: {
      _id: "",
      nom_classe_fr: "",
      nom_classe_ar: "",
      departement: "",
      niveau_classe: {
        _id: "",
        name_niveau_ar: "",
        name_niveau_fr: "",
        abreviation: "",
        sections: [],
      },
      matieres: [],
    },
    state: "",
    dependence: "",
    code_postale: "",
    adress_ar: "",
    adress_fr: "",
    num_phone: "",
    email: "",
    nom_pere: "",
    job_pere: "",
    nom_mere: "",
    num_phone_tuteur: "",
    moyen: "",
    session: "",
    filiere: "",
    niveau_scolaire: "",
    annee_scolaire: "",
    type_inscription: {
      _id: "",
      value_type_inscription: "",
      type_ar: "",
      type_fr: "",
      files_type_inscription: [
        {
          name_ar: "",
          name_fr: "",
        },
      ],
    },
    Face1CINFileBase64String: "",
    Face1CINFileExtension: "",
    Face2CINFileBase64String: "",
    Face2CINFileExtension: "",
    FichePaiementFileBase64String: "",
    FichePaiementFileExtension: "",
    files: [
      { name_ar: "", name_fr: "", file: "", base64String: "", extension: "" },
    ],
    photo_profil: "",
    PhotoProfilFileExtension: "",
    PhotoProfilFileBase64String: "",
  });

  // useEffect(() => {
  //   console.log("Fetched etudiant data:", etudiant);
  //   if (etudiant) {
  //     // Initialize formData with fetched data
  //     setFormData({
  //       _id: etudiant._id || "",
  //       nom_fr: etudiant.nom_fr || "",
  //       nom_ar: etudiant.nom_ar || "",
  //       prenom_fr: etudiant.prenom_fr || "",
  //       prenom_ar: etudiant.prenom_ar || "",
  //       lieu_naissance_fr: etudiant.lieu_naissance_fr || "",
  //       lieu_naissance_ar: etudiant.lieu_naissance_ar || "",
  //       date_naissance: etudiant.date_naissance || "",
  //       nationalite: etudiant.nationalite || "",
  //       etat_civil: etudiant.etat_civil || "",
  //       face_1_CIN: etudiant.face_1_CIN || "",
  //       face_2_CIN: etudiant.face_2_CIN || "",
  //       fiche_paiement: etudiant.fiche_paiement || "",
  //       sexe: etudiant.sexe || "",
  //       num_CIN: etudiant.num_CIN || "",
  //       state: etudiant.state || "",
  //       dependence: etudiant.dependence || "",
  //       code_postale: etudiant.code_postale || "",
  //       adress_ar: etudiant.adress_ar || "",
  //       adress_fr: etudiant.adress_fr || "",
  //       email: etudiant.email || "",
  //       num_phone: etudiant.num_phone || "",
  //       nom_pere: etudiant.nom_pere || "",
  //       job_pere: etudiant.job_pere || "",
  //       nom_mere: etudiant.nom_mere || "",
  //       num_phone_tuteur: etudiant.num_phone_tuteur || "",
  //       moyen: etudiant.moyen || "",
  //       session: etudiant.session || "",
  //       filiere: etudiant.filiere || "",
  //       niveau_scolaire: etudiant.niveau_scolaire || "",
  //       annee_scolaire: etudiant.annee_scolaire || "",
  //       photo_profil: etudiant.photo_profil || "",
  //       PhotoProfilFileExtension: etudiant.PhotoProfilFileExtension || "",
  //       PhotoProfilFileBase64String: etudiant.PhotoProfilFileBase64String || "",
  //       etat_compte: {
  //         _id: etudiant.etat_compte?._id || "",
  //         value_etat_etudiant: etudiant.etat_compte?.value_etat_etudiant || "",
  //         etat_fr: etudiant.etat_compte?.etat_fr || "",
  //         etat_ar: etudiant.etat_compte?.etat_ar || "",
  //       },
  //       groupe_classe: {
  //         _id: etudiant.groupe_classe?._id || "",
  //         nom_classe_fr: etudiant.groupe_classe?.nom_classe_fr || "",
  //         nom_classe_ar: etudiant.groupe_classe?.nom_classe_ar || "",
  //         departement: etudiant.groupe_classe?.departement || "",
  //         niveau_classe: etudiant.groupe_classe?.niveau_classe || "",
  //         section_classe: etudiant.groupe_classe?.section_classe || "",
  //         matieres: etudiant.groupe_classe?.matieres || [],
  //       },
  //       type_inscription: {
  //         _id: etudiant.type_inscription?._id || "",
  //         value_type_inscription:
  //           etudiant.type_inscription?.value_type_inscription || "",
  //         type_ar: etudiant.type_inscription?.type_ar || "",
  //         type_fr: etudiant.type_inscription?.type_fr || "",
  //         files_type_inscription:
  //           etudiant?.type_inscription?.files_type_inscription || [],
  //       },
  //       files: [
  //         {
  //           name_ar: etudiant.files?.[0]?.name_ar || "",
  //           name_fr: etudiant.files?.[0]?.name_fr || "",
  //           file: etudiant.files?.[0]?.file || "",
  //           base64String: etudiant.files?.[0]?.base64String || "",
  //           extension: etudiant.files?.[0]?.extension || "",
  //         },
  //       ],
  //       Face1CINFileBase64String: etudiant.Face1CINFileBase64String || "",
  //       Face1CINFileExtension: etudiant.Face1CINFileExtension || "",
  //       Face2CINFileBase64String: etudiant.Face2CINFileBase64String || "",
  //       Face2CINFileExtension: etudiant.Face2CINFileExtension || "",
  //       FichePaiementFileBase64String:
  //         etudiant.FichePaiementFileBase64String || "",
  //       FichePaiementFileExtension: etudiant.FichePaiementFileExtension || "",
  //     });

  //     // Update the groupe_classe property specifically
  //     setFormData((prev) => ({
  //       ...prev,
  //       groupe_classe: {
  //         ...prev.groupe_classe,
  //         matieres: etudiant.groupe_classe?.matieres || [],
  //       },
  //     }));

  //     // Fetch and set the profile photo if necessary
  //     if (!etudiant.PhotoProfilFileBase64String && etudiant.photo_profil) {
  //       const fetchImageData = async () => {
  //         try {
  //           const response = await fetch(
  //             `${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${etudiant.photo_profil}`
  //           );
  //           if (!response.ok) throw new Error("Network response was not ok");

  //           const blob = await response.blob();
  //           const reader = new FileReader();
  //           reader.onloadend = () => {
  //             const base64String = reader.result as string;
  //             const base64Data = base64String.split(",")[1];
  //             const extension = etudiant.photo_profil.split(".").pop();
  //             setFormData((prev) => ({
  //               ...prev,
  //               PhotoProfilFileBase64String: base64Data,
  //               PhotoProfilFileExtension: extension,
  //             }));
  //           };
  //           reader.readAsDataURL(blob);
  //         } catch (error) {
  //           console.error("Error fetching image data:", error);
  //         }
  //       };
  //       fetchImageData();
  //     }

  //     // Update date and state fields
  //     if (etudiant.date_naissance)
  //       setSelectedDate(new Date(etudiant.date_naissance));
  //     else setSelectedDate(null);

  //     if (etudiant.annee_scolaire)
  //       setSelectedDateBac(new Date(etudiant.annee_scolaire));
  //     else setSelectedDateBac(null);

  //     if (etudiant?.state) setSelectedWilaya(etudiant.state as Wilaya);
  //   }
  // }, [etudiant]);

  const [fileInputs, setFileInputs] = useState<{ [key: string]: string[] }>({});
  const [selectedFiles, setselectedFiles] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [newArray, setNewArray] = useState<any[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("Fetching student data...");
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/api/etudiant/get-etudiant/${etudiant._id}`
  //       );
  //       const data = await response.json();
  //       setStudentTypeInscription(data.type_inscription);
  //       console.log("Student Data:", data);

  //       setFormData(data);
  //       if (data.date_naissance) {
  //         setSelectedDate(new Date(data.date_naissance));
  //       } else {
  //         setSelectedDate(null);
  //       }
  //       if (data.annee_scolaire) {
  //         setSelectedDateBac(new Date(data.annee_scolaire));
  //       } else {
  //         setSelectedDateBac(null);
  //       }
  //       if (data.state) {
  //         setSelectedWilaya(data.state as Wilaya);
  //       }

  //       if (data.type_inscription) {
  //         console.log("Type Inscription Data from student:", data.type_inscription);
  //         setTypeInscriptionData(data.type_inscription);
  //       }

  //       // Fetch type inscription by student ID
  //       const result = await getTypeInscriptionByIdStudent({
  //         studentId: etudiant._id,
  //       }).unwrap();
  //       console.log("Fetched Type Inscription Data:", result);
  //       if (result?.type_inscription) setTypeInscriptionData(result.type_inscription);

  //       if (!data.PhotoProfilFileBase64String && data.photo_profil) {
  //         console.log("Fetching photo profile from server...");
  //         const fetchImageData = async () => {
  //           try {
  //             const response = await fetch(
  //               `${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${data.photo_profil}`
  //             );
  //             if (!response.ok) throw new Error("Network response was not ok");

  //             const blob = await response.blob();
  //             const reader = new FileReader();
  //             reader.onloadend = () => {
  //               const base64String = reader.result as string;
  //               const base64Data = base64String.split(",")[1];
  //               const extension = data.photo_profil.split(".").pop();
  //               console.log("Decoded image data:", base64Data, "with extension:", extension);
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 PhotoProfilFileBase64String: base64Data,
  //                 PhotoProfilFileExtension: extension,
  //               }));
  //             };
  //             reader.readAsDataURL(blob);
  //           } catch (error) {
  //             console.error("Error fetching image data:", error);
  //           }
  //         };
  //         fetchImageData();
  //       }

  //       if (!data.Face1CINFileBase64String && data.face_1_CIN) {
  //         console.log("Fetching photo cin 1 from server...");
  //         const fetchImageData = async () => {
  //           try {
  //             const response = await fetch(
  //               `${process.env.REACT_APP_API_URL}/files/etudiantFiles/Face1CIN/${data.face_1_CIN}`
  //             );
  //             if (!response.ok) throw new Error("Network response was not ok");

  //             const blob = await response.blob();
  //             const reader = new FileReader();
  //             reader.onloadend = () => {
  //               const base64String = reader.result as string;
  //               const base64Data = base64String.split(",")[1];
  //               const extension = data.face_1_CIN.split(".").pop();
  //               //console.log("Decoded image data:", base64Data, "with extension:", extension);
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 Face1CINFileBase64String: base64Data,
  //                 Face1CINFileExtension: extension,
  //               }));
  //             };
  //             reader.readAsDataURL(blob);
  //           } catch (error) {
  //             console.error("Error fetching image data:", error);
  //           }
  //         };
  //         fetchImageData();
  //       }
  //       if (!data.Face2CINFileBase64String && data.face_2_CIN) {
  //         console.log("Fetching photo cin 2 from server...");
  //         const fetchImageData = async () => {
  //           try {
  //             const response = await fetch(
  //               `${process.env.REACT_APP_API_URL}/files/etudiantFiles/Face2CIN/${data.face_2_CIN}`
  //             );
  //             if (!response.ok) throw new Error("Network response was not ok");

  //             const blob = await response.blob();
  //             const reader = new FileReader();
  //             reader.onloadend = () => {
  //               const base64String = reader.result as string;
  //               const base64Data = base64String.split(",")[1];
  //               const extension = data.face_2_CIN.split(".").pop();
  //               //console.log("Decoded image data:", base64Data, "with extension:", extension);
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 Face2CINFileBase64String: base64Data,
  //                 Face2CINFileExtension: extension,
  //               }));
  //             };
  //             reader.readAsDataURL(blob);
  //           } catch (error) {
  //             console.error("Error fetching image data:", error);
  //           }
  //         };
  //         fetchImageData();
  //       }
  //       if (!data.FichePaiementFileBase64String && data.fiche_paiement) {
  //         console.log("Fetching photo fiche paiement from server...");
  //         const fetchImageData = async () => {
  //           try {
  //             const response = await fetch(
  //               `${process.env.REACT_APP_API_URL}/files/etudiantFiles/FichePaiement/${data.fiche_paiement}`
  //             );
  //             if (!response.ok) throw new Error("Network response was not ok");

  //             const blob = await response.blob();
  //             const reader = new FileReader();
  //             reader.onloadend = () => {
  //               const base64String = reader.result as string;
  //               const base64Data = base64String.split(",")[1];
  //               const extension = data.fiche_paiement.split(".").pop();
  //               //console.log("Decoded image data:", base64Data, "with extension:", extension);
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 FichePaiementFileBase64String: base64Data,
  //                 FichePaiementFileExtension: extension,
  //               }));
  //             };
  //             reader.readAsDataURL(blob);
  //           } catch (error) {
  //             console.error("Error fetching image data:", error);
  //           }
  //         };
  //         fetchImageData();
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [etudiant._id, getTypeInscriptionByIdStudent]);
  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("Fetching student data...");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/etudiant/get-etudiant/${etudiant._id}`
        );
        const data = await response.json();
        console.log("Student Data:", data);

        // Setting initial data
        setStudentTypeInscription(data.type_inscription);
        setFormData(data);

        // Setting Date Values
        setSelectedDate(
          data.date_naissance ? new Date(data.date_naissance) : null
        );
        setSelectedDateBac(
          data.annee_scolaire ? new Date(data.annee_scolaire) : null
        );
        setSelectedWilaya(data.state as Wilaya);
        setTypeInscriptionData(data.type_inscription);

        // Fetch type inscription by student ID
        const result = await getTypeInscriptionByIdStudent({
          studentId: etudiant._id,
        }).unwrap();
        //console.log("Fetched Type Inscription Data:", result);
        if (result?.type_inscription)
          setTypeInscriptionData(result.type_inscription);

        // Function to fetch image data and convert to base64
        const fetchImageData = async (filePath: string, type: string) => {
          try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const base64Data = base64String.split(",")[1];
              const extension = filePath.split(".").pop();
              // console.log(
              //   `Decoded ${type} image data:`,
              //   base64Data,
              //   "with extension:",
              //   extension
              // );
              setFormData((prev) => ({
                ...prev,
                [`${type}FileBase64String`]: base64Data,
                [`${type}FileExtension`]: extension,
              }));
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            console.error(`Error fetching ${type} image data:`, error);
          }
        };

        // Conditionally fetch images
        if (!data.PhotoProfilFileBase64String && data.photo_profil) {
          //console.log("Fetching photo profile from server...");
          await fetchImageData(
            `${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${data.photo_profil}`,
            "PhotoProfil"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [etudiant?._id, getTypeInscriptionByIdStudent]);
  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("Fetching student data...");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/etudiant/get-etudiant/${etudiant._id}`
        );
        const data = await response.json();
        //console.log("Student Data:", data);

        setTypeInscriptionData(data.type_inscription);
        setFormData(data);

        const result = await getTypeInscriptionByIdStudent({
          studentId: etudiant._id,
        }).unwrap();

        //console.log("Fetched Type Inscription Data:", result);
        if (result?.type_inscription)
          setTypeInscriptionData(result.type_inscription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [etudiant?._id, getTypeInscriptionByIdStudent]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      files: newArray,
    }));
  }, [newArray]);

  const handleCheckboxChange = (
    option: string,
    inscription: TypeInscriptionEtudiant
  ) => {
    setSelectedOption(option);

    const formattedFiles = inscription.files_type_inscription.map((file) => ({
      name_ar: file.name_ar,
      name_fr: file.name_fr,
    }));

    setTypeInscriptionData({
      ...inscription,
      files_type_inscription: formattedFiles,
    });

    setFormData((prevData) => ({
      ...prevData,
      type_inscription: {
        ...inscription,
        files_type_inscription: formattedFiles,
      },
    }));
  };


  const handleFileTypeInscriptionUpload = (event: any, index: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setselectedFiles((prevFiles: any) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = file;
      return updatedFiles;
    });
  };

  const onChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const selectedGroupeClasse = groupe_classe.find(
      (classe) => classe._id === value
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "state") {
      setSelectedWilaya(value as Wilaya);
      setFormData((prevFormData) => ({
        ...prevFormData,
        dependence: "",
      }));
    }
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
  const onSubmitEditEtudiant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Submitting form with data:", formData);
      await editEtudiant(formData).unwrap();
      notify();
      navigate("/ListeEtudiants");
    } catch (error: any) {
      console.log(error);
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
  // change date naissance
  const handleDateChange = (selectedDates: Date[]) => {
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
  // change date bac

  const handleDateChangeBac = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDateBac(selectedDate);

    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy");
      setFormData((prevState) => ({
        ...prevState,
        annee_scolaire: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        annee_scolaire: "",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "etat_compte") {
      setFormData((prev) => ({
        ...prev,
        etat_compte: {
          ...prev.etat_compte,
          _id: value,
        },
      }));
    } else if (name === "groupe_classe") {
      const selectedGroupeClasse = groupe_classe.find(
        (classe) => classe._id === value
      );

      if (selectedGroupeClasse) {
        setFormData((prev) => ({
          ...prev,
          groupe_classe: {
            ...selectedGroupeClasse,
            departement: selectedGroupeClasse.departement?._id || "",
            matieres: selectedGroupeClasse.matieres.map(
              (matiere) => matiere._id
            ),
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          groupe_classe: {} as GroupeClasse,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
          photo_profil: `${file.name}`,
          PhotoProfilFileBase64String: base64Data,
          PhotoProfilFileExtension: extension,
        }));
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };
  const handlePDFCIN1Upload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("Face1CINFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
     // console.log(extension);
      setFormData({
        ...formData,
        face_1_CIN: newPDF,
        Face1CINFileBase64String: base64Data,
        Face1CINFileExtension: extension,
      });
    }
  };
  const handlePDFCIN2Upload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("Face2CINFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
      //console.log(extension);
      setFormData({
        ...formData,
        face_2_CIN: newPDF,
        Face2CINFileBase64String: base64Data,
        Face2CINFileExtension: extension,
      });
    }
  };
  const handlePDFFichePaiementUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById(
        "FichePaiementFileBase64String"
      ) as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
      console.log(extension);
      setFormData({
        ...formData,
        fiche_paiement: newPDF,
        FichePaiementFileBase64String: base64Data,
        FichePaiementFileExtension: extension,
      });
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
                      onSubmit={onSubmitEditEtudiant}
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
                                title="Choisir Photo Etudiant"
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
                          {/* First Name  == Done */}
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
                          {/* Last Name == Done */}
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
                                value={formData.nom_fr || ""}
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
                              <Form.Label htmlFor="lieu_naissance_fr">
                                مكان الولادة (بالفرنسية)
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
                                مكان الولادة (بالعربية)
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
                                onChange={handleDateChange}
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
                                // required
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
                                    <i className="bi bi-person-vcard-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  الوثائق المطلوبة / Documents naicessaires
                                  format image (jpg, png)
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
                                  <label
                                    htmlFor="num_CIN"
                                    className="form-label"
                                  >
                                    Numéro de passeport / رقم بطاقة التعريف
                                    الوطنية
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="num_CIN"
                                    placeholder=""
                                    // required
                                    onChange={onChange}
                                    value={formData.num_CIN}
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
                                  <label
                                    htmlFor="Face1CINFileBase64String"
                                    className="form-label"
                                  >
                                    CIN (Face 1) / بطاقة التعريف الوطنية الوجه
                                    الأول
                                  </label>
                                  <Form.Control
                                    name="Face1CINFileBase64String"
                                    onChange={handlePDFCIN1Upload}
                                    type="file"
                                    id="Face1CINFileBase64String"
                                    accept="*/*"
                                    placeholder="Choose File"
                                    className="text-muted"

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
                                  <label
                                    htmlFor="Face2CINFileBase64String"
                                    className="form-label"
                                  >
                                    CIN (Face 2) / بطاقة التعريف الوطنية الوجه
                                    الثاني
                                  </label>
                                  <Form.Control
                                    name="Face2CINFileBase64String"
                                    onChange={handlePDFCIN2Upload}
                                    type="file"
                                    id="Face2CINFileBase64String"
                                    accept="*/*"
                                    placeholder="Choose File"
                                    className="text-muted"

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
                                  <label
                                    htmlFor="FichePaiementFileBase64String"
                                    className="form-label"
                                  >
                                    Fiche de Paiement (inscription.tn) / وصل
                                    التسجيل
                                  </label>
                                  <Form.Control
                                    name="FichePaiementFileBase64String"
                                    onChange={handlePDFFichePaiementUpload}
                                    type="file"
                                    id="FichePaiementFileBase64String"
                                    accept="*/*"
                                    placeholder="Choose File"
                                    className="text-muted"

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
                                  معلومات عنوان الطالب / Informations sur
                                  l'adresse de l'étudiant
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
                                    disabled={!selectedWilaya}
                                  >
                                    <option value="">إخترالمعتمدية</option>
                                    {selectedWilaya &&
                                      delegationOptions[selectedWilaya]?.map(
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
                                  <label htmlFor="state" className="form-label">
                                    الولاية
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="state"
                                    id="state"
                                    value={formData?.state}
                                    onChange={handleSelectChange}
                                  >
                                    <option value="">إختر الولاية</option>
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
                                    htmlFor="num_phone"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    رقم هاتف الطالب
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="num_phone"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.num_phone}
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
                                  معلومات ولي الطالب / Informations du tuteur de
                                  l'étudiant
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
                                  <Form.Label
                                    htmlFor="num_phone_tuteur"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    رقم هاتف الولي
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="num_phone_tuteur"
                                    placeholder=""
                                    dir="rtl"
                                    onChange={onChange}
                                    value={formData.num_phone_tuteur}
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
                                    htmlFor="nom_mere"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    إسم الأم و لقبها
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="nom_mere"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.nom_mere}
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
                                    htmlFor="job_pere"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    مهنة الأب
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="job_pere"
                                    placeholder=""
                                    dir="rtl"
                                    onChange={onChange}
                                    value={formData.job_pere}
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
                                    htmlFor="nom_pere"
                                    style={{
                                      direction: "rtl",
                                      textAlign: "right",
                                    }}
                                  >
                                    إسم الأب و لقبه
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="nom_pere"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.nom_pere}
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
                                  البكالوريا أو مايعادلها/ Baccalauréat ou
                                  diplome équivalent
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="annee_scolaire">
                                    السنة الدراسية
                                  </Form.Label>
                                  <Flatpickr
                                    value={selectedDateBac!}
                                    onChange={handleDateChangeBac}
                                    className="form-control flatpickr-input"
                                    placeholder="اختر التاريخ"
                                    options={{
                                      dateFormat: "d M, Y",
                                    }}
                                    id="annee_scolaire"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="filiere"
                                    className="form-label"
                                  >
                                    الشعبة
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="filiere"
                                    id="filiere"
                                    value={formData?.filiere || ""} // Reflect the selected value from formData
                                    onChange={handleSelectChange}
                                  >
                                    <option value="">إختر الشعبة</option>
                                    <option value="آداب ">
                                      Lettres / آداب
                                    </option>
                                    <option value="رياضيات">
                                      Mathématiques /رياضيات
                                    </option>
                                    <option value="علوم تجريبية">
                                      Sciences Exprimentales / علوم تجريبية
                                    </option>
                                    <option value="اقتصاد وتصرف">
                                      Economie et Gestion / اقتصاد وتصرف
                                    </option>
                                    <option value="تقنية">
                                      Technique /تقنية
                                    </option>
                                    <option value="علوم إعلامية">
                                      Sciences Informatiques / علوم إعلامية
                                    </option>
                                    <option value="أخرى">Autres /أخرى</option>
                                  </select>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="session"
                                    className="form-label"
                                  >
                                    الدورة
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="session"
                                    id="session"
                                    // required
                                    value={formData?.session || ""} // Reflect the selected value from formData
                                    onChange={handleSelectChange}
                                  >
                                    <option value="">إختر الدورة</option>
                                    <option value="Principale">
                                      Principale / الدورة الرئيسية
                                    </option>
                                    <option value="Controle">
                                      Controle /دورة التدارك
                                    </option>
                                  </select>
                                </div>
                              </Col>

                              <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="moyen">
                                    المعدل
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="moyen"
                                    placeholder=""
                                    dir="rtl"
                                    // required
                                    onChange={onChange}
                                    value={formData.moyen}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>

                        <Col lg={12}>
                          <>
                            {/* Debugging log to verify typeInscriptionData
                            {console.log(
                              "Type Inscription Data during render:",
                              studentTypeInscription
                            )} */}

                            <Card>
                              <Card.Header>
                                <div className="d-flex">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                      <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                        <i className="bi bi-person-fill-add"></i>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <h5 className="card-title">
                                      نوعية الترسيم / Type d'inscription
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
                                  <Col lg={12}>
                                    {typeInscriptionOptions.length > 0 ? (
                                      typeInscriptionOptions.map(
                                        (
                                          typeInscription: TypeInscriptionEtudiant
                                        ) => (
                                          <div
                                            key={typeInscription._id}
                                            className="form-switch mb-2"
                                          >
                                            {/* Radio input to select type inscription */}
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              role="switch"
                                              id={typeInscription.type_ar}
                                              checked={
                                                typeInscriptionData?.value_type_inscription ===
                                                typeInscription.value_type_inscription
                                              }
                                              onChange={() =>
                                                handleCheckboxChange(
                                                  typeInscription.value_type_inscription,
                                                  typeInscription
                                                )
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={typeInscription.type_ar}
                                              style={{ marginRight: "50px" }}
                                            >
                                              {typeInscription.type_ar}
                                            </label>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p>
                                        No type inscription options available
                                      </p>
                                    )}
                                  </Col>

                                  {/* Conditionally render file inputs based on the selected type inscription */}
                                  {typeInscriptionData &&
                                    typeInscriptionData.files_type_inscription && (
                                      <Row>
                                        {typeInscriptionData.files_type_inscription.map(
                                          (file, index) => (
                                            <Col lg={3} key={index}>
                                              <div className="mb-3">
                                                <label
                                                  htmlFor={`fileInput${index}`}
                                                  className="form-label"
                                                >
                                                  {file.name_ar} /{" "}
                                                  {file.name_fr}{" "}
                                                  {/* Display both Arabic and French names */}
                                                </label>
                                                <Form.Control
                                                  name={`fileInput${index}`}
                                                  type="file"
                                                  id={`fileInput${index}`}
                                                  accept=".pdf"
                                                  placeholder="Choose File"
                                                  className="text-muted"
                                                  onChange={(event) =>
                                                    handleFileTypeInscriptionUpload(
                                                      event,
                                                      index
                                                    )
                                                  }
                                                />
                                              </div>
                                            </Col>
                                          )
                                        )}
                                      </Row>
                                    )}
                                </Row>
                              </Card.Body>
                            </Card>
                          </>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-person-check-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  حالة حساب الطالب / Etat Compte Etudiant
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="etat_compte">
                                    حالة حساب الطالب / Etat Compte Etudiant
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="etat_compte"
                                    id="etat_compte"
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
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-person-check-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  مجموعة الطالب / Classe Etudiant
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              {formData.groupe_classe.niveau_classe && (
                                <Col lg={4}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="niveau_classe">
                                      Niveau
                                    </Form.Label>
                                    <p
                                      className="form-control-plaintext"
                                      id="niveau_classe"
                                    >
                                      {formData.groupe_classe.niveau_classe
                                        .name_niveau_fr || ""}{" "}
                                    </p>
                                  </div>
                                </Col>
                              )}
                              {formData.groupe_classe.niveau_classe
                                .sections && (
                                <Col lg={4}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="section_classe">
                                      Section
                                    </Form.Label>
                                    <p
                                      className="form-control-plaintext"
                                      id="section_classe"
                                    >
                                      {/* Assuming you want to display the first section's name; adjust as needed */}
                                      {formData.groupe_classe.niveau_classe
                                        .sections.length > 0
                                        ? formData.groupe_classe.niveau_classe
                                            .sections[0].name_section_fr // Accessing the first section as an example
                                        : ""}
                                    </p>
                                  </div>
                                </Col>
                              )}

                              <Col lg={4}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="groupe_classe">
                                    مجموعة الطالب / Classe Etudiant
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="groupe_classe"
                                    id="groupe_classe"
                                    value={formData?.groupe_classe?._id || ""}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Sélectionner Classe
                                    </option>
                                    {groupe_classe.map((groupe_classe) => (
                                      <option
                                        key={groupe_classe._id}
                                        value={groupe_classe._id}
                                      >
                                        {groupe_classe.nom_classe_fr}
                                      </option>
                                    ))}
                                  </select>
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
                              Modifier Etudiant
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

export default EditProfilEtudiant;