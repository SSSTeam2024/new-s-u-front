import React, { useEffect, useMemo, useState } from "react";
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
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import userImage from "../../assets/images/users/user-dummy-img.jpg";
import {
  Enseignant,
  EnseignantExcel,
  useAddEnseignantMutation,
  useDeleteEnseignantMutation,
  useFetchEnseignantsQuery,
} from "features/enseignant/enseignantSlice";
import { actionAuthorization } from "utils/pathVerification";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import {
  useAddSpecialiteEnseignantMutation,
  useGetSpecialiteEnseignantValueMutation,
} from "features/specialiteEnseignant/specialiteEnseignant";
import {
  useAddPosteEnseignantMutation,
  useGetPosteEnseignantValueMutation,
} from "features/posteEnseignant/posteEnseignant";
import {
  useAddGradeEnseignantMutation,
  useGetGradeEnseignantValueMutation,
} from "features/gradeEnseignant/gradeEnseignant";
import {
  useAddEtatEnseignantMutation,
  useGetEtatEnseignantValueMutation,
} from "features/etatEnseignant/etatEnseignant";

export interface EnseignantFileEXEL {
  nom_fr: string;
  nom_ar?: string;
  matricule: string;
  mat_cnrps: string;
  prenom_fr: string;
  prenom_ar?: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar?: string;
  date_naissance: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;

  date_affectation: string;
  compte_courant: string;
  identifinat_unique: string;
  num_cin: string;
  date_delivrance: string;
  state: string;
  dependence: string;
  code_postale: string;
  adress_ar: string;
  adress_fr: string;
  email: string;
  num_phone1: string;
  num_phone2: string;
  nom_conjoint: string;
  job_conjoint: string;
  nombre_fils: string;
  entreprise1: string;
  annee_certif1: string;
  certif1: string;

  entreprise2: string;
  annee_certif2: string;
  certif2: string;

  entreprise3: string;
  annee_certif3: string;
  certif3: string;
}

const excelDateToJSDate = (excelDate: number): string => {
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000); // Convert Excel date to JS date
  return jsDate.toLocaleDateString("fr-FR"); // Format date to dd/mm/yyyy
};
const ListEnseignants = () => {
  document.title = "Liste des enseignants | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  function tog_AddEnseignant() {
    navigate("/gestion-enseignant/ajouter-enseignant");
  }
  const { data = [] } = useFetchEnseignantsQuery();
  const [filterStatus, setFilterStatus] = useState("All");
  const [enseignantCount, setEnseignantCount] = useState(0);
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  const filteredEnseignants = useMemo(() => {
    let result = data;

    if (filterStatus !== "All") {
      result = result.filter(
        (enseignant) => enseignant.etat_compte?.etat_fr! === filterStatus
      );
    }

    if (searchQuery) {
      result = result.filter((enseignant) =>
        [
          enseignant.matricule,
          `${enseignant.prenom_fr} ${enseignant.nom_fr}`,
          `${enseignant.prenom_ar} ${enseignant.nom_ar}`,
          enseignant.grade?.grade_fr,
          enseignant.departements?.name_fr,
          enseignant.specilaite?.specialite_fr,
          enseignant.mat_cnrps,
          enseignant?.poste?.poste_fr!,
          enseignant.sexe,
          enseignant.etat_compte?.etat_fr,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, filterStatus, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  useEffect(() => {
    if (data) {
      setEnseignantCount(data.length);
    }
  }, [data]);

  const [deleteEnseignant] = useDeleteEnseignantMutation();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteEnseignant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Enseignant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Enseignant est en sécurité :)",
            "error"
          );
        }
      });
  };
  const activatedEnseignantsCount = data.filter(
    (enseignant) => enseignant.etat_compte?.etat_fr === "Activé"
  ).length;
  const deactivatedEnseignantsCount = data.filter(
    (enseignant) => enseignant.etat_compte?.etat_fr === "Désactivé"
  ).length;

  const columns = useMemo(
    () => [
      {
        Header: "Nom Enseignant",
        disableFilters: true,
        filterable: true,
        accessor: (enseignants: Enseignant) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                  src={`${process.env.REACT_APP_API_URL}/files/enseignantFiles/PhotoProfil/${enseignants.photo_profil}`}
                  alt="etudiant-img"
                  id="photo_profil"
                  className="avatar-xs rounded-circle user-profile-img"
                  onError={(e) => {
                    e.currentTarget.src = userImage;
                  }}
                />
              </div>
              <div className="flex-grow-1 user_name">
                {enseignants.nom_fr} {enseignants.prenom_fr}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Matricule",
        accessor: (row: Enseignant) => row.matricule || "---",
        disableFilters: true,
        filterable: true,
      },
      // {
      //   Header: "Nom et Prénom",
      //   accessor: (row: any) => `${row.prenom_ar} ${row.nom_ar}`,
      //   disableFilters: true,
      //   filterable: true,
      // },
      {
        Header: "Spécialité",
        accessor: (row: any) => row?.specilaite?.specialite_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Poste",
        accessor: (row: any) => row?.poste?.poste_fr || "",
        disableFilters: true,
        filterable: true,
      },
      // {
      //   Header: "Département",
      //   accessor: (row: any) => row?.departements?.name_fr || "",
      //   disableFilters: true,
      //   filterable: true,
      // },
      {
        Header: "Grade",
        accessor: (row: any) => row?.grade?.grade_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Tél",
        accessor: "num_phone1",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Activation",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) => row?.etat_compte?.etat_fr || "",
        // Cell: ({ value }: { value: string }) => {
        //   switch (value) {
        //     case "Activé":
        //       return (
        //         <span className="badge bg-success-subtle text-success">
        //           {value}
        //         </span>
        //       );
        //     case "Désactivé":
        //       return (
        //         <span className="badge bg-danger-subtle text-danger">
        //           {value}
        //         </span>
        //       );
        //     case "Nouveau":
        //       return (
        //         <span className="badge bg-secondary-subtle text-secondary">
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
        accessor: (enseignant: Enseignant) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/gestion-etudiant/compte-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/gestion-enseignant/compte-enseignant"
                    className="badge bg-info-subtle text-info view-item-btn"
                    state={enseignant}
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
                "/gestion-enseignant/edit-compte-enseignant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/gestion-enseignant/edit-compte-enseignant"
                    className="badge bg-primary-subtle text-primary edit-item-btn"
                    state={enseignant}
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
                  to="/gestion-enseignant/print-compte-enseignant"
                  state={enseignant}
                >
                  📄Fiche renseignement
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/gestion-enseignant/ar-print-compte-enseignant"
                  state={enseignant}
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
                "/gestion-enseignant/supprimer-compte-enseignant",
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
                      onClick={() => AlertDelete(enseignant?._id!)}
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
  const [addEnseignant] = useAddEnseignantMutation();
  const [isLoading, setIsLoading] = useState(false);
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

  //           const mappedData: Enseignant[] = jsonData.map((item: any) => ({
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
  //             num_cin: item.CIN || "",
  //             mat_cnrps: item["N° CNRPS"] || "",
  //             matricule: item["N° Matricule"] || "",
  //             state: "",
  //             dependence: "",
  //             code_postale: "",
  //             adress_ar: "",
  //             adress_fr: "",
  //             num_phone1: item.tel || "",
  //             email: item.email || "",
  //             papers: item.papier,
  //             photo_profil: "",
  //             PhotoProfilFileExtension: "",
  //             PhotoProfilFileBase64String: "",
  //             etat_compte: "",
  //             poste: "",
  //             grade: "",
  //             specilaite: "",
  //             departements: "",
  //             nom_conjoint: "",
  //             job_conjoint: "",
  //             nombre_fils: "",
  //             entreprise1: "",
  //             annee_certif1: "",
  //             certif1: "",

  //             entreprise2: "",
  //             annee_certif2: "",
  //             certif2: "",

  //             entreprise3: "",
  //             annee_certif3: "",
  //             certif3: "",
  //             compte_courant: "",
  //             identifinat_unique: "",
  //             date_delivrance: item["Date de Delivrance"]
  //               ? excelDateToJSDate(item["Date de Delivrance"])
  //               : "",
  //             date_affectation: item["Date d'affectation"]
  //               ? excelDateToJSDate(item["Date d'affectation"])
  //               : "",
  //           }));
  //           console.log("Mapped Data:", mappedData);
  //           await Promise.all(
  //             mappedData.map(async (etudiant) => {
  //               await addEnseignant(etudiant).unwrap();
  //             })
  //           );

  //           setIsLoading(false);
  //           Swal.fire({
  //             icon: "success",
  //             title: "Succès",
  //             text: "Tous les enseignants ont été ajoutés avec succès!",
  //           });
  //         } catch (error) {
  //           setIsLoading(false);
  //           Swal.fire({
  //             icon: "error",
  //             title: "Erreur",
  //             text: "Une erreur s'est produite lors de l'ajout des enseignants.",
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
  const [filePath, setFilePath] = useState<string | null>(null);
  const [modal_ImportModals, setmodal_ImportModals] = useState<boolean>(false);
  const [enseignantFile, setEnseignantFile] = useState<EnseignantFileEXEL[]>(
    []
  );
  const [addSpecialite] = useAddSpecialiteEnseignantMutation();
  const [addPoste] = useAddPosteEnseignantMutation();
  const [addGrade] = useAddGradeEnseignantMutation();
  const [addEtatCompte] = useAddEtatEnseignantMutation();
  const [getEtatCompteValue] = useGetEtatEnseignantValueMutation();
  const [getGradeCompteValue] = useGetGradeEnseignantValueMutation();
  const [getPosteCompteValue] = useGetPosteEnseignantValueMutation();
  const [getSpecialiteValue] = useGetSpecialiteEnseignantValueMutation();

  function tog_ImportModals() {
    setmodal_ImportModals(!modal_ImportModals);
  }

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      setIsLoading(true);
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: EnseignantFileEXEL[] = XLSX.utils.sheet_to_json(
          worksheet
        ) as EnseignantFileEXEL[];

        // Step 1: Extract unique services, grades, etc.
        const uniqueSpecialites = new Map<
          string,
          { id: string; specialite_ar: string; specialite_fr: string }
        >();
        const uniqueGrades = new Map<
          string,
          { id: string; grade_ar: string; grade_fr: string }
        >();
        const uniquePostes = new Map<
          string,
          { id: string; poste_ar: string; poste_fr: string }
        >();

        const uniqueEtatComptes = new Map<
          string,
          { id: string; etat_ar: string; etat_fr: string }
        >();

        jsonData.forEach((item: any) => {
          const specialiteKey = `${item["Spécialité AR"]}-${item["Spécialité FR"]}`;
          if (!uniqueSpecialites.has(specialiteKey)) {
            uniqueSpecialites.set(specialiteKey, {
              id: "",
              specialite_ar: item["Spécialité AR"],
              specialite_fr: item["Spécialité FR"],
            });
            console.log("specialiteKey", specialiteKey);
          }

          const gradeKey = `${item["Grade AR"]}-${item["Grade FR"]}`;
          if (!uniqueGrades.has(gradeKey)) {
            uniqueGrades.set(gradeKey, {
              id: "",
              grade_ar: item["Grade AR"],
              grade_fr: item["Grade FR"],
            });
          }

          const posteKey = `${item["Poste AR"]}-${item["Poste FR"]}`;
          if (!uniquePostes.has(posteKey)) {
            uniquePostes.set(posteKey, {
              id: "",
              poste_ar: item["Poste AR"],
              poste_fr: item["Poste FR"],
            });
          }

          const etatKey = `${item["Etat AR"]}-${item["Etat FR"]}`;
          if (!uniqueEtatComptes.has(etatKey)) {
            uniqueEtatComptes.set(etatKey, {
              id: "",
              etat_ar: item["Etat AR"],
              etat_fr: item["Etat FR"],
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

        await getOrCreate(uniqueSpecialites, getSpecialiteValue, addSpecialite);
        await getOrCreate(uniqueGrades, getGradeCompteValue, addGrade);
        await getOrCreate(uniquePostes, getPosteCompteValue, addPoste);
        await getOrCreate(uniqueEtatComptes, getEtatCompteValue, addEtatCompte);

        // Step 3: Process each personnel row with existing or newly created IDs
        const enseigantPromises = jsonData.map(async (items: any) => {
          const enseignantData = {
            prenom_fr: items.PrenomEnseignant || "",
            nom_fr: items.NomEnseignant || "",
            lieu_naissance_fr: items.LieuNaissance || "",
            date_naissance: items.DateNaissance || "",
            adress_fr: items.Adress || "",
            state: items.Governorate || "",
            dependence: items.Delegation || "",
            code_postale: items.CodePostale || "",
            nationalite: items.Nationalite || "",
            etat_civil: items.EtatCvil || "",
            sexe: items.Sexe || "",
            date_affectation: items.DateAffectation || "",
            compte_courant: items.NumCompteCourant || "",
            identifinat_unique: items.NumIdentifiant || "",
            num_cin: items.NumCIN || "",
            date_delivrance: items.Datedelivrance || "",
            email: items.Email || "",
            num_phone1: items.NumTel1 || "",
            num_phone2: items.NumTel2 || "",
            nom_conjoint: items.NomConjoint || "",
            job_conjoint: items.PosteConjoint || "",
            nombre_fils: items.NombreFils || "",
            entreprise1: items.Entreprise1 || "",
            annee_certif1: items.AnneeCertif1 || "",
            certif1: items.NomCertif1 || "",
            entreprise2: items.Entreprise2 || "",
            annee_certif2: items.AnneeCertif2 || "",
            certif2: items.NomCertif2 || "",
            entreprise3: items.Entreprise3 || "",
            annee_certif3: items.AnneeCertif3 || "",
            certif3: items.NomCertif3 || "",
            matricule: items.Matricule || "",
            mat_cnrps: items.MatCNRPS || "",
            adress_ar: items.AdressAr || "",
            lieu_naissance_ar: items.LieuNaissanceAr || "",
            prenom_ar: items.PrenomEnseignantAr || "",
            nom_ar: items.NomEnseignantAr || "",
            situation_fr: items.SituationFr || "",
            situation_ar: items.SituationAr || "",
            etat_compte:
              uniqueEtatComptes.get(`${items["Etat AR"]}-${items["Etat FR"]}`)
                ?.id || "",
            poste:
              uniquePostes.get(`${items["Poste AR"]}-${items["Poste FR"]}`)
                ?.id || "",
            grade:
              uniqueGrades.get(`${items["Grade AR"]}-${items["Grade FR"]}`)
                ?.id || "",
            specilaite:
              uniqueSpecialites.get(
                `${items["Spécialité AR"]}-${items["Spécialité FR"]}`
              )?.id || "",
          };

          try {
            const createdEnseignant = await addEnseignant(
              enseignantData
            ).unwrap();
            console.log("createdEnseignant", createdEnseignant);
            console.log("Enseignant created:", createdEnseignant);
          } catch (error) {
            console.error("Error creating personnel:", error);
          }
        });

        await Promise.all(enseigantPromises);
        setEnseignantFile(jsonData);
        setFilePath(file.name);
        console.log("All enseignants records processed successfully.");
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setIsLoading(false);
        setmodal_ImportModals(false);
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
        "NomEnseignant",
        "NomEnseignantAr",
        "PrenomEnseignant",
        "PrenomEnseignantAr",
        "LieuNaissance",
        "LieuNaissanceAr",
        "DateNaissance",
        "Adress",
        "AdressAr",
        "Governorate",
        "Delegation",
        "CodePostale",
        "Nationalite",
        "EtatCvil",
        "Etat AR",
        "Etat FR",
        "Poste AR",
        "Poste FR",
        "SituationAr",
        "SituationFr",
        "Grade AR",
        "Grade FR",
        "Spécialité FR",
        "Spécialité AR",
        "Sexe",
        "DateAffectation",
        "Datedelivrance",
        "NumCompteCourant",
        "NumIdentifiant",
        "NumCIN",
        "Matricule",
        "MatCNRPS",
        "Email",
        "NumTel1",
        "NumTel2",
        "NomConjoint",
        "PosteConjoint",
        "NombreFils",

        "Entreprise1",
        "AnneeCertif1",
        "NomCertif1",

        "Entreprise2",
        "AnneeCertif2",
        "NomCertif2",

        "Entreprise3",
        "AnneeCertif3",
        "NomCertif3",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enseignant");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, "template_enseignants.xlsx");
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des enseignants"
            pageTitle="Liste des enseignants"
          />
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
                        <rect width="400" height="250" fill="#ffffff"></rect>
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
                      end={enseignantCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Nombre d'enseignants
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
                        <rect width="400" height="250" fill="#ffffff"></rect>
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
                      end={activatedEnseignantsCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Enseignants Activés
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
                        <rect width="400" height="250" fill="#ffffff"></rect>
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
                      end={deactivatedEnseignantsCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Enseignants Desactivés
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
                      <select
                        className="form-select"
                        id="idStatus"
                        name="choices-single-default"
                        value={filterStatus}
                        onChange={handleFilterChange}
                      >
                        <option defaultValue="All">Status</option>
                        <option value="All">Tous</option>
                        <option value="Activé">Activé</option>
                        <option value="Désactivé">Désactivé</option>
                        <option value="Nouveau">Nouveau</option>
                      </select>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        {/* <Button
                          variant="success"
                          className="add-btn"
                          // onClick={() => fileInputRef.current?.click()}
                        >
                          Ajouter Depuis Excel
                        </Button> */}
                        {/* <input
                          type="file"
                          accept=".xlsx, .xls"
                          // ref={fileInputRef}
                          style={{ display: "none" }}
                          // onChange={handleFileChange}
                        /> */}
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddEnseignant()}
                        >
                          Ajouter Enseignant
                        </Button>
                        <Col className="col-lg-auto ms-auto">
                          <div className="">
                            <Button
                              variant="secondary"
                              className="add-btn"
                              onClick={() => tog_ImportModals()}
                            >
                              Importer depuis Excel
                            </Button>
                          </div>
                        </Col>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="p-0">
                  <div className="table-responsive mb-1 p-0">
                    <table
                      className="table align-middle table-nowrap"
                      id="customerTable"
                    >
                      <TableContainer
                        columns={columns || []}
                        data={filteredEnseignants || []}
                        // isGlobalFilter={false}
                        iscustomPageSize={false}
                        isBordered={false}
                        isPagination={true}
                        customPageSize={10}
                        className="custom-header-css table align-middle table-nowrap"
                        tableClass="table-centered align-middle table-nowrap mb-0"
                        theadClass="text-muted table-light"
                        SearchPlaceholder="Search Products..."
                      />
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
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Importing teachers */}
            <Modal
              className="fade modal-fullscreen"
              show={modal_ImportModals}
              onHide={tog_ImportModals}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Importer enseignants
                </h5>
              </Modal.Header>
              <Form className="tablelist-form">
                <Modal.Body className="p-4">
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-itemss-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">
                          Téléchargement...
                        </span>
                      </Spinner>
                    </div>
                  ) : (
                    <>
                      Vous pouvez importer plusieurs enseignants à partir de ce
                      template{" "}
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListEnseignants;
