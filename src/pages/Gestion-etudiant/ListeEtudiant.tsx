import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
  Spinner,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import {
  EtatCompte,
  Etudiant,
  EtudiantExcel,
  FileDetail,
  GroupeClasse,
  useAddEtudiantMutation,
  useDeleteEtudiantMutation,
  useFetchEtudiantsQuery,
} from "features/etudiant/etudiantSlice";
import { format } from "date-fns";
import userImage from "../../assets/images/users/user-dummy-img.jpg";
import Swal from "sweetalert2";
import { actionAuthorization } from "utils/pathVerification";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import CustomLoader from "Common/CustomLoader/CustomLoader";
import "./listEtudiantStyle.css";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  useAddTypeInscriptionEtudiantMutation,
  useGetTypeInscriptionValueMutation,
} from "features/typeInscriptionEtudiant/typeInscriptionEtudiant";
import {
  useAddClasseMutation,
  useGetClasseValueMutation,
  useUpdateClasseMutation,
} from "features/classe/classe";
import {
  useAddEtatEtudiantMutation,
  useGetEtatEtudiantValueMutation,
} from "features/etatEtudiants/etatEtudiants";
import {
  useAddCycleMutation,
  useGetCycleByValueMutation,
} from "features/cycle/cycle";
import {
  useAddNiveauMutation,
  useGetNiveauValueMutation,
} from "features/niveau/niveau";

const excelDateToJSDate = (excelDate: number): string => {
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000); // Convert Excel date to JS date
  return jsDate.toLocaleDateString("fr-FR"); // Format date to dd/mm/yyyy
};

export interface EtudiantFileEXEL {
  _id?: string;
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
  etat_compte?: any;
  groupe_classe?: any;
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
  type_inscription?: {
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

  num_inscri?: string;
  Niveau_Fr?: string;
  DIPLOME?: string;
  Spécialité?: string;
  Groupe?: string;
  Cycle?: string;
  Ann_Univ?: string;
  Modele_Carte?: string;
  NiveauAr?: string;
  DiplomeAr?: string;
  SpecialiteAr?: string;
}

const ListEtudiants = () => {
  document.title = "Liste des étudiants | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [addEtudiant] = useAddEtudiantMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function tog_AddEtudiant() {
    navigate("/gestion-etudiant/ajouter-etudiant");
  }
  const { data = [] } = useFetchEtudiantsQuery();
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (data) {
      setStudentCount(data.length);
    }
  }, [data]);

  const [deleteEtudiant] = useDeleteEtudiantMutation();

  const handleDeleteEtudiant = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
      });

      if (result.isConfirmed) {
        await deleteEtudiant({ _id: id }).unwrap();
        Swal.fire("Supprimé !", "L'étudiant a été supprimée.", "success");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant :", error);
      Swal.fire(
        "Erreur !",
        "Un problème est survenu lors de la suppression de l'étudiant.",
        "error"
      );
    }
  };
  const activatedStudentsCount = data.filter(
    (student) => student.etat_compte?.etat_fr === "Inscrit / Activé"
  ).length;
  const deactivatedStudentsCount = data.filter(
    (student) => student.etat_compte?.etat_fr === "Désactivé"
  ).length;

  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setIsLoading(true);
  //     try {
  //       const reader = new FileReader();
  //       reader.onload = async (e) => {
  //         try {
  //           const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //           const workbook = XLSX.read(data, { type: "array" });
  //           const sheetName = workbook.SheetNames[0];
  //           const worksheet = workbook.Sheets[sheetName];
  //           const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //           const mappedData: Etudiant[] = jsonData.map((item: any) => ({
  //             nom_fr: item.nom || "",
  //             nom_ar: item.NomAr || "",
  //             prenom_fr: item.Prenom || "",
  //             prenom_ar: item.PrenomAr || "",
  //             lieu_naissance_fr: item["Lieu de naissance"] || "",
  //             lieu_naissance_ar: item["Lieu de naissance AR"] || "",
  //             date_naissance: item["Date de naissance"]
  //               ? excelDateToJSDate(item["Date de naissance"])
  //               : "",
  //             nationalite: item["Nationalité"] || "",
  //             etat_civil: item.etat_civil || "",
  //             sexe: item.sexe || "",
  //             num_CIN: item.CIN || "",
  //             face_1_CIN: "",
  //             face_2_CIN: "",
  //             fiche_paiement: "",
  //             // etat_compte: {} as EtatCompte,
  //             // groupe_classe: {} as GroupeClasse,
  //             state: "",
  //             dependence: "",
  //             code_postale: "",
  //             adress_ar: "",
  //             adress_fr: "",
  //             num_phone: item.tel || "",
  //             email: item.email || "",
  //             nom_pere: item.nom_pere || "",
  //             job_pere: item.job_pere || "",
  //             nom_mere: item.nom_mere || "",
  //             num_phone_tuteur: item.telephone_tuteur || "",
  //             moyen: "",
  //             session: "",
  //             filiere: "",
  //             niveau_scolaire: "",
  //             annee_scolaire: "",
  //             Face1CINFileBase64String: "",
  //             Face1CINFileExtension: "",
  //             Face2CINFileBase64String: "",
  //             Face2CINFileExtension: "",
  //             FichePaiementFileBase64String: "",
  //             FichePaiementFileExtension: "",
  //             files: [],
  //             photo_profil: "",
  //             PhotoProfilFileExtension: "",
  //             PhotoProfilFileBase64String: "",
  //             //! TO Verify if we keep these fields or not !!
  //             num_inscri: item["N° inscription"] || "",
  //             Niveau_Fr: item["Niveau Fr"] || "",
  //             DIPLOME: item.DIPLOME || "",
  //             Spécialité: item["Spécialité"] || "",
  //             Groupe: item.Groupe || "",
  //             Cycle: item.Cycle || "",
  //             Ann_Univ: item["Ann Univ"] || "",
  //             Modele_Carte: item["Modele Carte"] || "",
  //             NiveauAr: item.NiveauAr || "",
  //             DiplomeAr: item.DiplomeAr || "",
  //             SpecialiteAr: item.SpecialiteAr || "",
  //           }));
  //           console.log("Mapped Data:", mappedData);
  //           await Promise.all(
  //             mappedData.map(async (etudiant) => {
  //               await addEtudiant(etudiant).unwrap();
  //             })
  //           );

  //           setIsLoading(false);
  //           Swal.fire({
  //             icon: "success",
  //             title: "Succès",
  //             text: "Tous les étudiants ont été ajoutés avec succès!",
  //           });
  //         } catch (error) {
  //           setIsLoading(false);
  //           Swal.fire({
  //             icon: "error",
  //             title: "Erreur",
  //             text: "Une erreur s'est produite lors de l'ajout des étudiants.",
  //           });
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     } catch (error) {
  //       setIsLoading(false);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Erreur",
  //         text: "Une erreur inattendue s'est produite.",
  //       });
  //     }
  //   }
  // };
  const [show, setShow] = useState(false);
  const togglePopover = () => setShow(!show);
  const columns = useMemo(
    () => [
      {
        Header: "Nom Etudiant",
        disableFilters: true,
        filterable: true,
        accessor: (etudiants: Etudiant) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                  src={`${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${etudiants.photo_profil}`}
                  alt="etudiant-img"
                  id="photo_profil"
                  className="avatar-xs rounded-circle user-profile-img"
                  onError={(e) => {
                    e.currentTarget.src = userImage;
                  }}
                />
              </div>
              <div className="flex-grow-1 user_name">
                {etudiants?.nom_fr!} {etudiants?.prenom_fr!}
              </div>
            </div>
          );
        },
      },
      {
        Header: "CIN",
        accessor: "num_CIN",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nom et Prénom",
        accessor: (row: any) => `${row?.prenom_fr!} ${row?.nom_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Groupe Classe",
        accessor: (row: any) => row?.Groupe! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Genre",
        accessor: "sexe",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date d'inscription",
        accessor: "createdAt",
        disableFilters: true,
        filterable: true,
        Cell: ({ value }: { value: string }) =>
          format(new Date(value), "yyyy-MM-dd - HH:mm"),
      },
      {
        Header: "Activation",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) => row?.etat_compte?.etat_fr || "",
        // Cell: ({ value }: { value: string }) => {
        //   switch (value) {
        //     case "Inscrit / Activé":
        //       return (
        //         <span className="badge bg-success-subtle text-success">
        //           {value}
        //         </span>
        //       );
        //     case "Non inscrit":
        //       return (
        //         <span className="badge bg-danger-subtle text-danger">
        //           {value}
        //         </span>
        //       );
        //     default:
        //       return (
        //         <span className="badge bg-success-subtle text-info">
        //           {value}
        //         </span>
        //       );
        //   }
        // },
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (students: Etudiant) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/gestion-etudiant/compte-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/gestion-etudiant/compte-etudiant"
                    className="badge bg-info-subtle text-info view-item-btn"
                    state={students}
                  >
                    <i
                      className="ph ph-eye"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "1.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.4)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></i>
                  </Link>
                </li>
              ) : (
                <></>
              )}
              {actionAuthorization(
                "/gestion-etudiant/edit-compte-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/gestion-etudiant/edit-compte-etudiant"
                    className="badge bg-primary-subtle text-primary edit-item-btn"
                    state={students}
                  >
                    <i
                      className="ph ph-pencil-line"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "1.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></i>
                  </Link>
                </li>
              ) : (
                <></>
              )}
              {actionAuthorization(
                "/gestion-etudiant/print-compte-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Dropdown>
                    <Dropdown.Toggle
                      as="span"
                      className="badge bg-secondary-subtle text-secondary"
                      style={{ display: "inline-block", cursor: "pointer" }}
                    >
                      <i
                        className="bi bi-printer"
                        style={{
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          fontSize: "1.5em",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.4)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      ></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        to="/gestion-etudiant/print-compte-etudiant"
                        state={students}
                      >
                        📄Fiche renseignement
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/gestion-etudiant/ar-print-compte-etudiant"
                        state={students}
                      >
                        📄 بطاقة ارشادات
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

              ) : (
                <></>
              )}
              {actionAuthorization(
                "/gestion-etudiant/supprimer-compte-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="#"
                    className="badge bg-danger-subtle text-danger remove-item-btn"
                  >
                    <i
                      className="ph ph-trash"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "1.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => handleDeleteEtudiant(students?._id!)}
                    ></i>
                  </Link>
                </li>
              ) : (
                <></>
              )}
            </ul>
          );
        },
      },
    ],
    []
  );
  const [addTypeInscription] = useAddTypeInscriptionEtudiantMutation();
  const [addClasse] = useAddClasseMutation();
  const [updateClasse] = useUpdateClasseMutation();
  const [addEtatCompte] = useAddEtatEtudiantMutation();
  const [addCycle] = useAddCycleMutation();

  const [getEtatCompteValue] = useGetEtatEtudiantValueMutation();
  const [getCycleValue] = useGetCycleByValueMutation();
  const [getClasseValue] = useGetClasseValueMutation();
  const [getNiveauValue] = useGetNiveauValueMutation();
  const [addNiveauClasse] = useAddNiveauMutation();
  const [getTypeInscriptionValue] = useGetTypeInscriptionValueMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  // Calculate paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [filePath, setFilePath] = useState<string | null>(null);
  const [modal_ImportModals, setmodal_ImportModals] = useState<boolean>(false);
  const [etudiantFile, setEtudiantFile] = useState<EtudiantFileEXEL[]>([]);

  function tog_ImportModals() {
    setmodal_ImportModals(!modal_ImportModals);
  }

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      console.log("File read successfully.");
      setIsLoading(true);
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: EtudiantFileEXEL[] = XLSX.utils.sheet_to_json(
          worksheet
        ) as EtudiantFileEXEL[];

        // Step 1: Extract unique services, grades, etc.
        const uniqueTypeIscription = new Map<
          string,
          { id: string; type_ar: string; type_fr: string }
        >();
        const uniqueClasse = new Map<
          string,
          { id: string; nom_classe_fr: string; nom_classe_ar: string }
        >();

        const uniqueEtatComptes = new Map<
          string,
          { id: string; etat_ar: string; etat_fr: string }
        >();

        const uniqueCycle = new Map<
          string,
          { id: string; cycle_ar: string; cycle_fr: string }
        >();

        const uniqueNiveau = new Map<
          string,
          { id: string; name_niveau_ar: string; name_niveau_fr: string }
        >();

        console.log("Excel Data:", jsonData);

        jsonData.forEach((item: any) => {
          const typeInscriptionKey = `${item["Type_inscription_Ar"]}-${item["Type_inscription"]}`;
          if (!uniqueTypeIscription.has(typeInscriptionKey)) {
            uniqueTypeIscription.set(typeInscriptionKey, {
              id: "",
              type_ar: item["Type_inscription_Ar"],
              type_fr: item["Type_inscription"],
            });
          }

          const classeKey = `${item["Niveau"]}-${item["Specialite"]}-${item["Abbreviation"]}- G${item["Groupe"]}`;
          if (!uniqueClasse.has(classeKey)) {
            uniqueClasse.set(classeKey, {
              id: "",
              nom_classe_ar:
                item["Niveau"] === "Première année"
                  ? `1-${item["Specialite_Ar"]}-${item["Groupe"]}`
                  : item["Niveau"] === "Deuxième année"
                    ? `2-${item["Specialite_Ar"]}-${item["Groupe"]}`
                    : `3-${item["Specialite_Ar"]}-${item["Groupe"]}`,
              nom_classe_fr:
                item["Niveau"] === "Première année"
                  ? `1 ${item["Abbreviation"]}- G${item["Groupe"]}`
                  : item["Niveau"] === "Deuxième année"
                    ? `2 ${item["Abbreviation"]}- G${item["Groupe"]}`
                    : `3 ${item["Abbreviation"]}- G${item["Groupe"]}`,
            });
          }

          const niveauKey = `${item["Niveau"]}-${item["Cycle"]}`;
          if (!uniqueNiveau.has(niveauKey)) {
            uniqueNiveau.set(niveauKey, {
              id: "",
              name_niveau_ar: item["Niveau_Ar"] + " " + item["Cycle_Ar"],
              name_niveau_fr: item["Niveau"] + " " + item["Cycle"],
            });
          }

          const cycleKey = `${item["Cycle_Ar"]}-${item["Cycle"]}`;
          if (!uniqueCycle.has(cycleKey)) {
            uniqueCycle.set(cycleKey, {
              id: "",
              cycle_ar: item["Cycle_Ar"],
              cycle_fr: item["Cycle"],
            });
          }
          const etatKey = `${item["Etat_compte_Ar"]}-${item["Etat_compte"]}`;
          if (!uniqueEtatComptes.has(etatKey)) {
            uniqueEtatComptes.set(etatKey, {
              id: "",
              etat_ar: item["Etat_compte_Ar"],
              etat_fr: item["Etat_compte"],
            });
          }
        });

        // Step 2: Process existing values first
        const map = new Map<string, number>();
        const getOrCreate = async (map: any, getFunc: any, addFunc: any) => {
          for (const [key, value] of map.entries()) {
            const existingValue = await getFunc(value).unwrap();
            if (existingValue !== null) {
              map.set(key, { ...value, id: existingValue.id });
            } else {
              const createdValue = await addFunc(value).unwrap();
              map.set(key, { ...value, id: createdValue._id });
            }
          }
        };

        await getOrCreate(uniqueCycle, getCycleValue, addCycle);
        console.log(uniqueClasse);
        await getOrCreate(uniqueClasse, getClasseValue, addClasse);
        await getOrCreate(uniqueEtatComptes, getEtatCompteValue, addEtatCompte);
        await getOrCreate(uniqueNiveau, getNiveauValue, addNiveauClasse);
        await getOrCreate(
          uniqueTypeIscription,
          getTypeInscriptionValue,
          addTypeInscription
        );
        let testEmails: any[] = [];
        const etudiantPromises = jsonData.map(async (items: any) => {
          testEmails.push(items.Email);
          const etudiantData: EtudiantExcel = {
            _id: "",
            prenom_fr: items.Prénom || "",
            nom_fr: items.Nom || "",
            cnss_number: items.CNSS,
            passeport_number: items.Passeport,
            matricule_number: items.Matricule,
            lieu_naissance_fr: items.Lieu_de_naissance || "",
            date_naissance: items.Date_de_naissance
              ? excelDateToJSDate(items.Date_de_naissance)
              : "",
            adress_fr: items.Adresse || "",
            gouvernorat: items.Gouvernorat || "",
            pays: items.Pays || "",
            adress_ar: items.Adresse_Ar || "",
            state: items.Gouvernorat || "",
            dependence: items.Delegation || "",
            code_postale: items.Code_Postal || "",
            nationalite: items.Nationalité || "",
            etat_civil: items.Etat_civil || "",
            sexe: items.Sexe || "",
            num_CIN: items.cin || "",
            email: items.Email || "",
            lieu_naissance_ar: items.Lieu_de_naissance_Ar || "",
            prenom_ar: items.Prénom_Ar || "",
            nom_ar: items.Nom_Ar || "",
            num_phone: items.Téléphone || "",
            nom_pere: items.Nom_père || "",
            prenom_pere: items.Prénom_père || "",
            job_pere: items.Profession_père || "",
            etat_pere: items.Etat_père || "",
            nom_mere: items.Nom_mère || "",
            prenom_mere: items.Prénom_mère || "",
            profession_mere: items.Profession_mère || "",
            etablissement_mere: items.Etablissement_mère || "",
            etat_mere: items.Etat_mère || "",
            adresse_parents: items.Adresse_parents || "",
            code_postale_parents: items.Code_Postal_parents || "",
            gouvernorat_parents: items.Gouvernorat_parents || "",
            pays_parents: items.Pays_parents || "",
            tel_parents: items.Tél_parents || "",
            situation_militaire: items.Situation_militaire || "",
            moyen: items.Moyenne_Bac || "",
            ville: items.Ville || "",
            pays_bac: items.Pays_Bac || "",
            mention: items.Mention_Bac || "",
            session: items.Session_Bac || "",
            filiere: items.Section_Bac || "",
            annee_scolaire: items["Année_ Bac"]
              ? excelDateToJSDate(items["Année_ Bac"])
              : "",
            num_inscri: items.NumInscription || "",
            prenom_conjoint: items.Prénom_Conjoint || "",
            profesion_Conjoint: items.Profesion_Conjoint || "",
            etablissement_conjoint: items.Etablissement_Conjoint || "",
            nbre_enfants: items.Nbre_enfants || "",
            // type_inscription: items.Type_inscription || "",
            type_inscription_ar: items.Type_inscription_Ar || "",
            // etat_compte: items.Etat_compte || "",
            etat_compte_Ar: items.Etat_compte_Ar || "",
            groupe_classe:
              uniqueClasse.get(
                `${items["Niveau"]}-${items["Specialite"]}-${items["Abbreviation"]}- G${items["Groupe"]}`
              )?.id || "",
            Niveau_Fr: items.Niveau || "",
            DIPLOME: items.Diplôme || "",
            DiplomeAr: items.Diplôme_Ar || "",
            Spécialité: items.Specialite || "",
            SpecialiteAr: items.Specialite_Ar || "",
            //Groupe: items.Groupe || "",
            Cycle: items.Cycle || "",
            Cycle_Ar: items.Cycle_Ar || "",
            Ann_Univ: items.AnneeUniversitaire
              ? excelDateToJSDate(items.AnneeUniversitaire)
              : "",
            Modele_Carte: items.ModeleCarte || "",
            NiveauAr: items.Niveau_Ar || "",
            emails: testEmails,
            etat_compte:
              uniqueEtatComptes.get(
                `${items["Etat_compte_Ar"]}-${items["Etat_compte"]}`
              )?.id || "",
            Groupe:
              // uniqueClasse.get(`${items["Abbreviation"]}-${items["Groupe"]}`)
              //   ?.id || "",
              items["Niveau"] === "Première année"
                ? `1 ${items["Abbreviation"]}- G${items["Groupe"]}`
                : items["Niveau"] === "Deuxième année"
                  ? `2 ${items["Abbreviation"]}- G${items["Groupe"]}`
                  : `3 ${items["Abbreviation"]}- G${items["Groupe"]}`,
            type_inscription:
              uniqueTypeIscription.get(
                `${items["Type_inscription_Ar"]}-${items["Type_inscription"]}`
              )?.id || "",
          };

          try {
            console.log(
              uniqueClasse.get(
                `${items["Niveau"]}-${items["Specialite"]}-${items["Abbreviation"]}- G${items["Groupe"]}`
              )?.id!
            );
            let id = uniqueClasse.get(
              `${items["Niveau"]}-${items["Specialite"]}-${items["Abbreviation"]}- G${items["Groupe"]}`
            )?.id!;
            fetch(
              `${process.env.REACT_APP_API_URL}/api/classe/get-classe/${id}`
            )
              .then((res) => {
                return res.json();
              })
              .then(async (data) => {
                console.log(data);
                console.log(
                  uniqueNiveau.get(`${items["Niveau"]}-${items["Cycle"]}`)
                );
                if (data.niveau_classe === undefined) {
                  const reqData = {
                    id: data._id,
                    niveau_classe: uniqueNiveau.get(
                      `${items["Niveau"]}-${items["Cycle"]}`
                    )?.id!,
                  };
                  console.log(reqData);
                  await updateClasse(reqData).unwrap();
                }
              });
            const createdEtudiant = await addEtudiant(etudiantData).unwrap();
            console.log("createdEtudiant", createdEtudiant);
            console.log("Etudiant created:", createdEtudiant);
          } catch (error) {
            console.error("Error adding Etudiant:", error);
          }
        });

        await Promise.all(etudiantPromises);

        setEtudiantFile(jsonData);
        setFilePath(file.name);
        console.log("File and state updated successfully.");
        tog_ImportModals();
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      console.error("File could not be read.");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const createAndDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [
      [
        "cin", //done
        "Passeport", //done
        "Matricule", //done
        "Nom", //done
        "Prénom", //done
        "Nom_Ar", //done
        "Prénom_Ar", //done
        "Nom_Jeune_Fille",
        "Date_de_naissance", //done
        "Lieu_de_naissance", //done
        "Gouvernorat", //done
        "Pays", //done
        "Sexe", //done
        "Nationalité", //done
        "CNSS", //done
        "Etat_civil", //done
        "Situation_militaire", //done
        "Année_ Bac", //done
        "Session_Bac", //done
        "Section_Bac", //done
        "Mention_Bac", //done
        "Pays_Bac", //done
        "Adresse", //done
        "Code_Postal", //done
        "Ville", //done
        "Gouvernorat", //done
        "Téléphone", //done
        "Profession",
        "Etablissement",
        "Email", //done
        "Compte_Office",
        "Nom_père", //done
        "Prénom_père", //done
        "Profession_père", //done
        "Etablissement_père",
        "Etat_père", //done
        "Nom_mère", //done

        "Prénom_mère", //done
        "Profession_mère", //done
        "Etablissement_mère", //done
        "Etat_mère", //done
        "Adresse_parents", //done

        "Code_Postal_parents", //done
        "Gouvernorat_parents", //done
        "Pays_parents", //done
        "Tél_parents", //done
        "Nom_conjoint", //done
        "Prénom_Conjoint", //done
        "Profesion_Conjoint", //done
        "Etablissement_Conjoint", //done
        "Nbre_enfants", //done

        "Adresse_Ar", //done
        "Lieu_de_naissance_Ar", //done
        "Moyenne_Bac", //done
        "Type_inscription", //done
        "Type_inscription_Ar",
        "Etat_compte", //done
        "Etat_compte_Ar", //done
        "Niveau", //done
        "Niveau_Ar", //done
        "Cycle", //done
        "Cycle_Ar", //done
        "Groupe", //done
        "Specialite", //done
        "Specialite_Ar", //done
        "Diplôme", //done
        "Diplôme_Ar", //done
        "Abbreviation",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiant");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, "template_etudiants.xlsx");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des étudiants"
            pageTitle="Liste des étudiants"
          />
          {isLoading ? (
            <div className="text-center loader-style-list-etudiant">
              <CustomLoader text="Chargement" />
            </div>
          ) : (
            <>
              <Row>
                <Col xxl={3} md={6}>
                  <Card className="card-height-100 bg-warning-subtle border-0 overflow-hidden">
                    <div className="position-absolute end-0 start-0 top-0 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="400"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 250"
                      >
                        <g mask='url("#SvgjsMask1530")' fill="none">
                          <path
                            d="M209 112L130 191"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M324 10L149 185"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M333 35L508 -140"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M282 58L131 209"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M290 16L410 -104"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M216 186L328 74"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M255 53L176 132"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M339 191L519 11"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M95 151L185 61"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M249 16L342 -77"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M129 230L286 73"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M80 216L3 293"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                        </g>
                        <defs>
                          <mask id="SvgjsMask1530">
                            <rect
                              width="400"
                              height="250"
                              fill="#ffffff"
                            ></rect>
                          </mask>
                          <linearGradient
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                            id="SvgjsLinearGradient1531"
                          >
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0.2)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                            id="SvgjsLinearGradient1532"
                          >
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0.2)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <Card.Body className="p-4 z-1 position-relative">
                      <h4 className="fs-22 fw-semibold mb-3">
                        <CountUp
                          start={0}
                          end={studentCount}
                          duration={3}
                          decimals={0}
                        />
                      </h4>
                      <p className="mb-0 fw-medium text-uppercase fs-14">
                        Nombre d'etudiants
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xxl={3} md={6}>
                  <Card className="card-height-100 bg-success-subtle border-0 overflow-hidden">
                    <div className="position-absolute end-0 start-0 top-0 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="400"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 250"
                      >
                        <g mask='url("#SvgjsMask1608")' fill="none">
                          <path
                            d="M390 87L269 208"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M358 175L273 260"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M319 84L189 214"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M327 218L216 329"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M126 188L8 306"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M220 241L155 306"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M361 92L427 26"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M391 188L275 304"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M178 74L248 4"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M84 52L-56 192"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M183 111L247 47"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M46 8L209 -155"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                        </g>
                        <defs>
                          <mask id="SvgjsMask1608">
                            <rect
                              width="400"
                              height="250"
                              fill="#ffffff"
                            ></rect>
                          </mask>
                          <linearGradient
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                            id="SvgjsLinearGradient1609"
                          >
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0.2)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                            id="SvgjsLinearGradient1610"
                          >
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0.2)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <Card.Body className="p-4 z-1 position-relative">
                      <h4 className="fs-22 fw-semibold mb-3">
                        <CountUp
                          start={0}
                          end={activatedStudentsCount}
                          duration={3}
                          decimals={0}
                        />
                      </h4>
                      <p className="mb-0 fw-medium text-uppercase fs-14">
                        Etudiants Activés
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xxl={3} md={6}>
                  <Card className="card-height-100 bg-info-subtle border-0 overflow-hidden">
                    <div className="position-absolute end-0 start-0 top-0 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="400"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 250"
                      >
                        <g mask='url("#SvgjsMask1551")' fill="none">
                          <path
                            d="M306 65L446 -75"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M399 2L315 86"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M83 77L256 -96"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M281 212L460 33"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M257 62L76 243"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M305 123L214 214"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M327 222L440 109"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M287 109L362 34"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M259 194L332 121"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M376 186L240 322"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M308 153L123 338"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M218 62L285 -5"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                        </g>
                        <defs>
                          <mask id="SvgjsMask1551">
                            <rect
                              width="400"
                              height="250"
                              fill="#ffffff"
                            ></rect>
                          </mask>
                          <linearGradient
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                            id="SvgjsLinearGradient1552"
                          >
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0.2)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                            id="SvgjsLinearGradient1553"
                          >
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0.2)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <Card.Body className="p-4 z-1 position-relative">
                      <h4 className="fs-22 fw-semibold mb-3">
                        <CountUp
                          start={0}
                          end={deactivatedStudentsCount}
                          duration={3}
                          decimals={0}
                        />
                      </h4>
                      <p className="mb-0 fw-medium text-uppercase fs-14">
                        Etudiants Desactivés
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Card>
                    <Card.Header>
                      <Row className="g-3">
                        <Col lg={3}>
                          <div className="search-box">
                            <input
                              type="text"
                              className="form-control search"
                              placeholder="Chercher..."
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </Col>
                        <Col className="col-lg-auto">
                          <select
                            className="form-select"
                            id="idStatus"
                            name="choices-single-default"
                          >
                            <option defaultValue="All">Status</option>
                            <option value="All">tous</option>
                            <option value="Active">Activé</option>
                            <option value="Inactive">Desactivé</option>
                          </select>
                        </Col>
                        <Col className="col-lg-auto ms-auto">
                          <div className="hstack gap-2">
                            <Button
                              variant="success"
                              className="add-btn"
                              onClick={() => tog_ImportModals()}
                            >
                              Ajouter Depuis Excel
                            </Button>
                            {/* <input
                              type="file"
                              accept=".xlsx, .xls"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            /> */}
                            <Button
                              variant="primary"
                              className="add-btn"
                              onClick={() => tog_AddEtudiant()}
                            >
                              Ajouter Etudiant
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <table
                        className="table align-middle table-nowrap"
                        id="customerTable"
                      >
                        {/* <TableContainer
                          columns={columns || []}
                          data={data || []}
                          iscustomPageSize={false}
                          isBordered={false}
                          customPageSize={10}
                          className="custom-header-css table align-middle table-nowrap"
                          tableClass="table-centered align-middle table-nowrap mb-0"
                          theadClass="text-muted fs-17 text-start"
                          SearchPlaceholder="Search Products..."
                        /> */}
                        <TableContainer
                          columns={columns || []}
                          data={paginatedData} // Use paginated data here
                          iscustomPageSize={false}
                          isBordered={false}
                          isPagination={false}
                          customPageSize={10}
                          className="custom-header-css table align-middle table-nowrap"
                          tableClass="table-centered align-middle table-nowrap mb-0"
                          theadClass="text-muted fs-17 text-start"
                          SearchPlaceholder="Search Students..."
                        />
                        <div className="pagination">
                          <Button
                            className="btn btn-danger m-2"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Précédent
                          </Button>
                          <span className="mt-3"> Page {currentPage} </span>
                          <Button
                            className="btn btn-success m-2"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                prev * pageSize < data.length ? prev + 1 : prev
                              )
                            }
                            disabled={currentPage * pageSize >= data.length}
                          >
                            Suivant
                          </Button>
                        </div>
                      </table>
                      <div className="noresult" style={{ display: "none" }}>
                        <div className="text-center py-4">
                          <div className="avatar-md mx-auto mb-4">
                            <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                              <i className="bi bi-search"></i>
                            </div>
                          </div>
                          <h5 className="mt-2">Sorry! No Result Found</h5>
                          <p className="text-muted mb-0">
                            We've searched more than 150+ seller We did not find
                            any seller for you search.
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>

      {/* Importing etudiant */}
      <Modal
        className="fade modal-fullscreen"
        show={modal_ImportModals}
        onHide={tog_ImportModals}
        centered
      >
        <Modal.Header className="px-4 pt-4" closeButton>
          <h5 className="modal-title" id="exampleModalLabel">
            Importer etudiants
          </h5>
        </Modal.Header>
        <Form className="tablelist-form">
          <Modal.Body className="p-4">
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Téléchargement...</span>
                </Spinner>
              </div>
            ) : (
              <>
                Vous pouvez importer plusieurs etudiants à partir de ce template{" "}
                <a href="#" onClick={createAndDownloadExcel}>
                  Cliquer ici pour télécharger
                </a>
                <Form.Group controlId="formFile" className="mt-3">
                  <Form.Label>Upload Excel File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={isLoading} // Disable input during loading
                  />
                </Form.Group>
                {filePath && <p>File Path: {filePath}</p>}
              </>
            )}
          </Modal.Body>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default ListEtudiants;
