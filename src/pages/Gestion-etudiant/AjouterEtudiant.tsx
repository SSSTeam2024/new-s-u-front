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
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";
import country from "Common/country";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import { useAddEtudiantMutation } from "features/etudiant/etudiantSlice";
import { useFetchEtatsEtudiantQuery } from "features/etatEtudiants/etatEtudiants";
import {
  TypeInscriptionEtudiant,
  useFetchTypeInscriptionsEtudiantQuery,
} from "features/typeInscriptionEtudiant/typeInscriptionEtudiant";
import { useFetchClassesQuery } from "features/classe/classe";
import { format } from "date-fns";

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
  type_inscription: {
    _id: string;
    value_type_inscription: string;
    type_ar: string;
    type_fr: string;
    files_type_inscription: {
      name_ar: string;
      name_fr: string;
    }[];
  };
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

const AjouterEtudiant = () => {
  document.title = " Ajouter Etudiant | Smart University";
  const navigate = useNavigate();
  const [selectedFiles, setselectedFiles] = useState<any>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | "">("");
  const [selectedDelegation, setSelectedDelegation] = useState<string>("");
  const [fileInputs, setFileInputs] = useState<{ [key: string]: string[] }>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleCheckboxChange = (
    option: string,
    type_inscription: TypeInscriptionEtudiant[]
  ) => {
    setSelectedOption(option);

    const selectedInscription = type_inscription.find(
      (inscription) => inscription.type_ar === option
    ) || {
      _id: "",
      value_type_inscription: "",
      type_ar: "",
      type_fr: "",
      files_type_inscription: [],
    };

    // Transform the files to match the required format
    const formattedFiles = selectedInscription.files_type_inscription.map(
      (file) => ({
        name_ar: file.name_ar, // Ensure name_ar is correctly assigned
        name_fr: file.name_fr, // Ensure name_fr is correctly assigned
      })
    );

    // Update fileInputs state to reflect selected files for the option
    setFileInputs((prevState) => ({
      ...prevState,
      [option]: formattedFiles.map((file) => file.name_fr),
    }));

    setselectedFiles(formattedFiles.map((file) => file.name_fr));

    // Update formData with correctly formatted files
    setFormData((prevData: Etudiant) => ({
      ...prevData,
      type_inscription: {
        _id: selectedInscription._id,
        value_type_inscription: selectedInscription.value_type_inscription,
        type_ar: selectedInscription.type_ar,
        type_fr: selectedInscription.type_fr,
        files_type_inscription: formattedFiles, // Use the formatted files array here
      },
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
  const [selectedDateBac, setSelectedDateBac] = useState<Date | null>(null);

  const handleDateChangeBac = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    setSelectedDateBac(selectedDate);

    if (selectedDate) {
      // Format the date to "yyyy-MM-dd - HH:mm"
      const formattedDate = format(selectedDate, "yyyy");
      // Update the formData with the formatted date string
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
  const [createEtudiant] = useAddEtudiantMutation();
  const { data: etat_compte = [] } = useFetchEtatsEtudiantQuery();
  const { data: type_inscription = [] } =
    useFetchTypeInscriptionsEtudiantQuery();
  const { data: groupe_classe = [] } = useFetchClassesQuery();

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
        sections: [], // Initialize as an empty array since it expects an array of Section objects
      },
      matieres: [], // Initialize as an empty array
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "groupe_classe") {
      const selectedClass = groupe_classe.find((cls) => cls._id === value);

      if (selectedClass) {
        setFormData((prev) => ({
          ...prev,
          groupe_classe: {
            _id: selectedClass._id,
            nom_classe_fr: selectedClass.nom_classe_fr,
            nom_classe_ar: selectedClass.nom_classe_ar,
            // Ensure 'departement' is set as a string, e.g., its '_id' or 'name_fr'
            departement:
              typeof selectedClass.departement === "string"
                ? selectedClass.departement
                : selectedClass.departement._id, // or selectedClass.departement.name_fr based on your structure
            niveau_classe: {
              _id: selectedClass.niveau_classe._id,
              name_niveau_ar: selectedClass.niveau_classe.name_niveau_ar,
              name_niveau_fr: selectedClass.niveau_classe.name_niveau_fr,
              abreviation: selectedClass.niveau_classe.abreviation,
              sections: selectedClass.niveau_classe.sections, // Array of sections as expected
            },
            matieres: selectedClass.matieres.map(
              (matiere) => (typeof matiere === "string" ? matiere : matiere._id) // Ensure matieres are strings
            ),
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  //change civil status
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const selectChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      etat_civil: value,
    }));
    setSelectedStatus(value);
  };

  //change niveau scolaire
  const [selectedNiveauScolaire, setSelectedNiveauScolaire] =
    useState<string>("");

  const selectChangeNiveauScolaire = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      niveau_scolaire: value,
    }));
    setSelectedNiveauScolaire(value);
  };

  //change gender
  const [selectedGender, setSelectedGender] = useState<string>("");

  const selectChangeGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      sexe: value,
    }));
    setSelectedGender(value);
  };
  //change filiere
  const [selectedFiliere, setSelectedFiliere] = useState<string>("");

  const selectChangeFiliere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      filiere: value,
    }));
    setSelectedFiliere(value);
  };
  //change session
  const [selectedSession, setSelectedSession] = useState<string>("");

  const selectChangeSession = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      session: value,
    }));
    setSelectedSession(value);
  };

  const onSubmitEtudiant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createEtudiant(formData).unwrap();
      notify();
      navigate("/ListeEtudiants");
    } catch (error: any) {
      console.log(error);
    }
  };
  // changer nationalite
  const [selectedCountry1, setSelectedCountry1] = useState<any>({});
  const handleCountrySelect = (country: any) => {
    setSelectedCountry1(country);
    setFormData((prevData) => ({
      ...prevData,
      nationalite: country.countryName,
    }));
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le compte étudiant a été créé avec succès",
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
  const handlePDFCIN1Upload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("Face1CINFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;

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

      setFormData({
        ...formData,
        fiche_paiement: newPDF,
        FichePaiementFileBase64String: base64Data,
        FichePaiementFileExtension: extension,
      });
    }
  };
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
  const [newArray, setNewArray] = useState<any[]>([]);
  const handleFileTypeInscriptionUpload = async (event: any, index: number) => {
    const file = event.target.files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newFile = base64Data + "." + extension;

      let newObj = {
        name_ar: "",
        name_fr: selectedFiles[index],
        file: newFile,
        base64String: base64Data,
        extension: extension,
      };

      setNewArray((prevArray) => {
        const updatedArray = [...prevArray];
        updatedArray[index] = newObj;
        return updatedArray;
      });
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      files: newArray,
    });
  }, [newArray]);
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
                      onSubmit={onSubmitEtudiant}
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
                              <label htmlFor="gender" className="form-label">
                                الجنس
                              </label>
                              <select
                                className="form-select text-muted"
                                name="gender"
                                id="gender"
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
                                    disabled={!selectedWilaya}
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
                                    htmlFor="الشعبة"
                                    className="form-label"
                                  >
                                    الشعبة
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="الشعبة"
                                    id="الشعبة"
                                    onChange={selectChangeFiliere}
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
                                    htmlFor="الدورة"
                                    className="form-label"
                                  >
                                    الدورة
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="الدورة"
                                    id="الدورة"
                                    // required
                                    onChange={selectChangeSession}
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
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                <Col lg={12}>
                                  <div>
                                    {type_inscription.map((inscription) => (
                                      <div
                                        className="form-switch mb-2"
                                        key={inscription._id}
                                      >
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          id={inscription.type_ar}
                                          checked={
                                            selectedOption ===
                                            inscription.type_ar
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              inscription.type_ar,
                                              type_inscription
                                            )
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={inscription.type_ar}
                                          style={{ marginRight: "50px" }}
                                        >
                                          {inscription.type_ar}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                  <Row>
                                    {fileInputs[selectedOption]?.map(
                                      (fileLabel, index) => (
                                        <Col lg={3} key={index}>
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`fileInput${index}`}
                                              className="form-label"
                                            >
                                              {fileLabel}
                                            </label>
                                            <Form.Control
                                              name={`fileInput${index}`}
                                              type="file"
                                              id={`fileInputs${index}`}
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
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
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
                                    value={formData?.etat_compte?.etat_fr}
                                    onChange={handleChange}
                                  >
                                    <option value="">Sélectionner Etat</option>
                                    {etat_compte.map((etat_compte: any) => (
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
                                      {formData.groupe_classe.niveau_classe.sections.map(
                                        (section) => (
                                          <span key={section._id}>
                                            {section.name_section_fr} <br />
                                          </span>
                                        )
                                      )}
                                    </p>
                                  </div>
                                </Col>
                              )}
                              <Col lg={4} className="">
                                <div className="mb-3">
                                  <Form.Label htmlFor="groupe_classe">
                                    مجموعة الطالب / Classe Etudiant
                                  </Form.Label>
                                  <select
                                    className="form-select text-muted"
                                    name="groupe_classe"
                                    id="groupe_classe"
                                    value={formData?.groupe_classe?._id}
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
                              Ajouter Etudiant
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

export default AjouterEtudiant;
