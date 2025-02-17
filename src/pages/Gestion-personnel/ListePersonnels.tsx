import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
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
  Personnel,
  useAddPersonnelMutation,
  useDeletePersonnelMutation,
  useFetchPersonnelsQuery,
} from "features/personnel/personnelSlice";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { format } from "date-fns";
import {
  useAddServicePersonnelMutation,
  useFetchServicesPersonnelQuery,
  useGetServicePersonnelValueMutation,
} from "features/servicePersonnel/servicePersonnel";
import {
  useAddPostePersonnelMutation,
  useFetchPostesPersonnelQuery,
  useGetPostePersonnelValueMutation,
} from "features/postePersonnel/postePersonnel";
import {
  useAddGradePersonnelMutation,
  useFetchGradesPersonnelQuery,
  useGetGradePersonnelValueMutation,
} from "features/gradePersonnel/gradePersonnel";
import {
  useAddCategoriePersonnelMutation,
  useFetchCategoriesPersonnelQuery,
  useGetCategoryPersonnelValueMutation,
} from "features/categoriePersonnel/categoriePersonnel";
import {
  useAddEtatPersonnelMutation,
  useGetEtatPersonnelValueMutation,
} from "features/etatPersonnel/etatPersonnelSlice";

const excelDateToJSDate = (excelDate: number): string => {
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000); // Convert Excel date to JS date
  return jsDate.toLocaleDateString("fr-FR"); // Format date to dd/mm/yyyy
};

export interface PersonnelFileEXEL {
  nom_fr: string;
  nom_ar: string;
  mat_cnrps: string;
  matricule: string;
  prenom_fr: string;
  prenom_ar?: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar?: string;
  DateNaissance: number;
  DateDesignation: number;
  DateDelivrance: number;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  DateAffectation: number;
  compte_courant: string;
  identifinat_unique: string;
  num_cin: string;
  date_delivrance: string;
  state: string;
  dependence: string;
  code_postale: string;
  adress_ar?: string;
  adress_fr: string;
  email: string;
  num_phone1: string;
  num_phone2: string;
  nom_conjoint: string;
  job_conjoint: string;
  nombre_fils: string;
}

const ListePersonnels = () => {
  document.title = "Liste des personnels | ENIGA";

  const navigate = useNavigate();

  const [modal_AddEnseignantModals, setmodal_AddEnseignantModals] =
    useState<boolean>(false);

  function tog_AddPersonnel() {
    navigate("/gestion-personnel/ajouter-personnel");
  }
  const { data = [] } = useFetchPersonnelsQuery();
  const [personnelCount, setPersonnelCount] = useState(0);

  useEffect(() => {
    if (data) {
      setPersonnelCount(data.length);
    }
  }, [data]);

  const [deletePersonnel] = useDeletePersonnelMutation();
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
          deletePersonnel(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Personnel a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Personnel est en sécurité :)",
            "error"
          );
        }
      });
  };
  const activatedPersonnelsCount = data.filter(
    (personnel) => personnel.etat_compte?.etat_fr === "Compte Activé"
  ).length;
  const deactivatedPersonnelsCount = data.filter(
    (personnel) => personnel.etat_compte?.etat_fr === "Compte désactivé"
  ).length;

  const columns = useMemo(
    () => [
      {
        Header: "Nom Personnel",
        disableFilters: true,
        filterable: true,
        accessor: (personnels: Personnel) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                  style={{ borderRadius: "50%" }}
                  src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${personnels.photo_profil}`}
                  alt="etudiant-img"
                  id="photo_profil"
                  className="avatar-xs rounded-circle user-profile-img"
                  onError={(e) => {
                    e.currentTarget.src = userImage;
                  }}
                />
              </div>
              <div className="flex-grow-1 user_name">
                {personnels.nom_fr} {personnels.prenom_fr}
              </div>
            </div>
          );
        },
      },

      {
        Header: "Nom et Prénom",
        accessor: (row: any) => `${row.prenom_ar} ${row.nom_ar}`,
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Service",
        accessor: (row: any) => row?.service?.service_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Poste",
        accessor: (row: any) => row?.poste?.poste_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Grade",
        accessor: (row: any) => row?.grade?.grade_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Catégorie",
        accessor: (row: any) => row?.categorie?.categorie_fr || "",
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
        Header: "Matricule",
        accessor: "matricule",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Matricule CNRPS",
        accessor: "mat_cnrps",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Activation",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) => row?.etat_compte?.etat_fr || "",
        // Cell: ({ value }: { value: string }) => {
        //   console.log(value);
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
        accessor: (personnel: Personnel) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/gestion-personnel/compte-personnel"
                  className="badge bg-info-subtle text-info view-item-btn"
                  state={personnel}
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
              <li>
                <Link
                  to="/gestion-personnel/edit-compte-personnel"
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  state={personnel}
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
                    onClick={() => AlertDelete(personnel?._id!)}
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  const [addPersonnel] = useAddPersonnelMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [modal_ImportModals, setmodal_ImportModals] = useState<boolean>(false);
  const [personnelFile, setPersonnelFile] = useState<PersonnelFileEXEL[]>([]);
  const [addService] = useAddServicePersonnelMutation();
  const [addPoste] = useAddPostePersonnelMutation();
  const [addGrade] = useAddGradePersonnelMutation();
  const [addCategorie] = useAddCategoriePersonnelMutation();
  const [addEtatCompte] = useAddEtatPersonnelMutation();
  const [getEtatCompteValue] = useGetEtatPersonnelValueMutation();
  const [getCategoryCompteValue] = useGetCategoryPersonnelValueMutation();
  const [getGradeCompteValue] = useGetGradePersonnelValueMutation();
  const [getPosteCompteValue] = useGetPostePersonnelValueMutation();
  const [getServiceCompteValue] = useGetServicePersonnelValueMutation();

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
        const jsonData: PersonnelFileEXEL[] = XLSX.utils.sheet_to_json(
          worksheet
        ) as PersonnelFileEXEL[];

        // Step 1: Extract unique services, grades, etc.
        const uniqueServices = new Map<
          string,
          { id: string; service_ar: string; service_fr: string }
        >();
        const uniqueGrades = new Map<
          string,
          { id: string; grade_ar: string; grade_fr: string }
        >();
        const uniquePostes = new Map<
          string,
          { id: string; poste_ar: string; poste_fr: string }
        >();
        const uniqueCategories = new Map<
          string,
          { id: string; categorie_ar: string; categorie_fr: string }
        >();
        const uniqueEtatComptes = new Map<
          string,
          { id: string; etat_ar: string; etat_fr: string }
        >();

        jsonData.forEach((item: any) => {
          const serviceKey = `${item["Service AR"]}-${item["Service FR"]}`;
          if (!uniqueServices.has(serviceKey)) {
            uniqueServices.set(serviceKey, {
              id: "",
              service_ar: item["Service AR"],
              service_fr: item["Service FR"],
            });
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

          const categorieKey = `${item["Catégorie AR"]}-${item["Catégorie FR"]}`;
          if (!uniqueCategories.has(categorieKey)) {
            uniqueCategories.set(categorieKey, {
              id: "",
              categorie_ar: item["Catégorie AR"],
              categorie_fr: item["Catégorie FR"],
            });
          }

          const etatKey = `${item["Etat Compte AR"]}-${item["Etat Compte FR"]}`;
          if (!uniqueEtatComptes.has(etatKey)) {
            uniqueEtatComptes.set(etatKey, {
              id: "",
              etat_ar: item["Etat Compte AR"],
              etat_fr: item["Etat Compte FR"],
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

        await getOrCreate(uniqueServices, getServiceCompteValue, addService);
        await getOrCreate(uniqueGrades, getGradeCompteValue, addGrade);
        await getOrCreate(uniquePostes, getPosteCompteValue, addPoste);
        await getOrCreate(
          uniqueCategories,
          getCategoryCompteValue,
          addCategorie
        );
        await getOrCreate(uniqueEtatComptes, getEtatCompteValue, addEtatCompte);

        // Step 3: Process each personnel row with existing or newly created IDs
        const personnelPromises = jsonData.map(async (item: any) => {
          const personnelData = {
            nom_ar: item["Nom Personnel AR"] || "",
            nom_fr: item["Nom Personnel FR"] || "",
            lieu_naissance_fr: item["Lieu Naissance FR"] || "",
            date_naissance: item["Date Naissance"]
              ? excelDateToJSDate(item["Date Naissance"])
              : "",
            adress_fr: item["Adresse FR"] || "",
            state: item["Governorate"] || "",
            dependence: item["Delegation"] || "",
            code_postale: item["Code Postale"] || "",
            nationalite: item.Nationalite || "",
            etat_civil: item["Etat Civil"] || "",
            sexe: item.Sexe || "",
            date_affectation: item["Date Affectation"]
              ? excelDateToJSDate(item["Date Affectation"])
              : "",
            date_designation: item["Date Naissance"]
              ? excelDateToJSDate(item["Date Naissance"])
              : "",
            compte_courant: item["N° Compte Courant"] || "",
            identifinat_unique: item["N° Identifiant"] || "",
            num_cin: item["N° CIN"] || "",
            date_delivrance: item["Date Delivrance"]
              ? excelDateToJSDate(item["Date Delivrance"])
              : "",
            email: item.Email || "",
            num_phone1: item["N° Tel1"] || "",
            num_phone2: item["N° Tel2"] || "",
            nom_conjoint: item["Nom Conjoint"] || "",
            job_conjoint: item["Poste Conjoint"] || "",
            nombre_fils: item["Nombre Fils"] || "",
            matricule: item.Matricule || "",
            mat_cnrps: item["Mat CNRPS"] || "",
            adress_ar: item["Adresse AR"] || "",
            lieu_naissance_ar: item["Lieu Naissance AR"] || "",
            prenom_ar: item["Prenom Personnel AR"] || "",
            prenom_fr: item["Prenom Personnel FR"],
            etat_compte:
              uniqueEtatComptes.get(
                `${item["Etat Compte AR"]}-${item["Etat Compte FR"]}`
              )?.id || "",
            poste:
              uniquePostes.get(`${item["Poste AR"]}-${item["Poste FR"]}`)?.id ||
              "",
            grade:
              uniqueGrades.get(`${item["Grade AR"]}-${item["Grade FR"]}`)?.id ||
              "",
            categorie:
              uniqueCategories.get(
                `${item["Catégorie AR"]}-${item["Catégorie FR"]}`
              )?.id || "",
            service:
              uniqueServices.get(`${item["Service AR"]}-${item["Service FR"]}`)
                ?.id || "",
          };

          try {
            const createdPersonnel = await addPersonnel(personnelData).unwrap();
            console.log("createdPersonnel", createdPersonnel);
            console.log("Personnel created:", createdPersonnel);
          } catch (error) {
            console.error("Error creating personnel:", error);
          }
        });

        await Promise.all(personnelPromises);
        setPersonnelFile(jsonData);
        setFilePath(file.name);
        console.log("All personnel records processed successfully.");
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

  // const handleFileUpload = async (event: any) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.error("No file selected.");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     setIsLoading(true);
  //     try {
  //       const data = new Uint8Array(e.target!.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData: PersonnelFileEXEL[] = XLSX.utils.sheet_to_json(
  //         worksheet
  //       ) as PersonnelFileEXEL[];

  //       // Process each row individually
  //       const personnelPromises = jsonData.map(async (item: any) => {
  //         const personnelData = {
  //           nom_ar: item["Nom Personnel AR"] || "",
  //           nom_fr: item["Nom Personnel FR"] || "",
  //           lieu_naissance_fr: item["Lieu Naissance FR"] || "",
  //           date_naissance: item["Date Naissance"]
  //             ? excelDateToJSDate(item["Date Naissance"])
  //             : "",
  //           adress_fr: item["Adresse FR"] || "",
  //           state: item["Governorate"] || "",
  //           dependence: item["Delegation"] || "",
  //           code_postale: item["Code Postale"] || "",
  //           nationalite: item.Nationalite || "",
  //           etat_civil: item["Etat Civil"] || "",
  //           sexe: item.Sexe || "",
  //           date_affectation: item["Date Affectation"]
  //             ? excelDateToJSDate(item["Date Affectation"])
  //             : "",
  //           date_designation: item["Date Naissance"]
  //             ? excelDateToJSDate(item["Date Naissance"])
  //             : "",
  //           compte_courant: item["N° Compte Courant"] || "",
  //           identifinat_unique: item["N° Identifiant"] || "",
  //           num_cin: item["N° CIN"] || "",
  //           date_delivrance: item["Date Delivrance"]
  //             ? excelDateToJSDate(item["Date Delivrance"])
  //             : "",
  //           email: item.Email || "",
  //           num_phone1: item["N° Tel1"] || "",
  //           num_phone2: item["N° Tel2"] || "",
  //           nom_conjoint: item["Nom Conjoint"] || "",
  //           job_conjoint: item["Poste Conjoint"] || "",
  //           nombre_fils: item["Nombre Fils"] || "",
  //           matricule: item.Matricule || "",
  //           mat_cnrps: item["Mat CNRPS"] || "",
  //           adress_ar: item["Adresse Ar"] || "",
  //           lieu_naissance_ar: item["Lieu Naissance AR"] || "",
  //           prenom_ar: item["Prenom Personnel Ar"] || "",
  //           prenom_fr: item["Prenom Personnel FR"],
  //         };

  //         try {
  //           // Create service and get its ID
  //           const serviceToCreate = {
  //             service_ar: item["Service AR"],
  //             service_fr: item["Service FR"],
  //           };
  //           let serviceId = "";
  //           let serviceValue;
  //           try {
  //             serviceValue = await getServiceCompteValue(
  //               serviceToCreate
  //             ).unwrap();
  //             console.log("serviceValue: " + serviceValue);
  //           } catch (error) {
  //             console.error("Error fetching service:", error);
  //           }

  //           // If the service exists, use its ID
  //           if (serviceValue && serviceValue.id) {
  //             serviceId = serviceValue.id;
  //           } else {
  //             // If service does not exist, create a new one
  //             const createdService = await addService(serviceToCreate).unwrap();
  //             console.log("Created new service:", createdService);
  //             serviceId = createdService?._id!;
  //           }

  //           // Create etat compte and get its ID
  //           const etatCompteToCreate = {
  //             etat_ar: item["Etat Compte AR"],
  //             etat_fr: item["Etat Compte FR"],
  //           };
  //           let etatCompteId = "";
  //           const etatCompteValue = await getEtatCompteValue(
  //             etatCompteToCreate
  //           ).unwrap();

  //           if (etatCompteValue === null) {
  //             const createdEtatCompte = await addEtatCompte(
  //               etatCompteToCreate
  //             ).unwrap();
  //             etatCompteId = createdEtatCompte?._id!;
  //           } else {
  //             etatCompteId = etatCompteValue?.id!;
  //           }
  //           // Create grade and get its ID
  //           let gradeId = "";
  //           const gradeToCreate = {
  //             grade_ar: item["Grade AR"],
  //             grade_fr: item["Grade FR"],
  //           };
  //           const gradeCompteValue = await getGradeCompteValue(
  //             gradeToCreate
  //           ).unwrap();

  //           if (gradeCompteValue === null) {
  //             const createdGrade = await addGrade(gradeToCreate).unwrap();
  //             gradeId = createdGrade?._id!;
  //           } else {
  //             gradeId = gradeCompteValue?.id!;
  //           }

  //           // Create poste and get its ID
  //           const posteToCreate = {
  //             poste_ar: item["Poste AR"],
  //             poste_fr: item["Poste FR"],
  //           };
  //           let posteId = "";
  //           const posteCompteValue = await getPosteCompteValue(
  //             posteToCreate
  //           ).unwrap();

  //           if (posteCompteValue === null) {
  //             const createdPoste = await addPoste(posteToCreate).unwrap();
  //             posteId = createdPoste?._id!;
  //           } else {
  //             posteId = posteCompteValue?.id!;
  //           }

  //           // Create categorie and get its ID
  //           const categorieToCreate = {
  //             categorie_ar: item["Catégorie AR"],
  //             categorie_fr: item["Catégorie FR"],
  //           };
  //           let categorieId = "";
  //           const categorieCompteValue = await getCategoryCompteValue(
  //             categorieToCreate
  //           ).unwrap();

  //           if (categorieCompteValue === null) {
  //             const createdCategorie = await addCategorie(
  //               categorieToCreate
  //             ).unwrap();
  //             categorieId = createdCategorie?._id!;
  //           } else {
  //             posteId = categorieCompteValue?.id!;
  //           }

  //           // Create personnel with the IDs of the related entities
  //           const personnelToCreate = {
  //             ...personnelData,
  //             etat_compte: etatCompteId,
  //             poste: posteId,
  //             grade: gradeId,
  //             categorie: categorieId,
  //             service: serviceId,
  //           };

  //           const createdPersonnel = await addPersonnel(
  //             personnelToCreate
  //           ).unwrap();
  //           console.log("Personnel created:", createdPersonnel);
  //         } catch (error) {
  //           console.error("Error creating personnel:", error);
  //         }
  //       });

  //       await Promise.all(personnelPromises);
  //       setPersonnelFile(jsonData);
  //       setFilePath(file.name);
  //       console.log("All personnel records processed successfully.");
  //     } catch (error) {
  //       console.error("Error processing file:", error);
  //     } finally {
  //       setIsLoading(false);
  //       setmodal_ImportModals(false);
  //     }
  //   };

  //   reader.onerror = () => {
  //     console.error("File could not be read.");
  //     setIsLoading(false);
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  const createAndDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [
      [
        "Nom Personnel FR",
        "Nom Personnel AR",
        "Prenom Personnel FR",
        "Prenom Personnel AR",
        "Lieu Naissance FR",
        "Lieu Naissance AR",
        "Date Naissance",
        "Adresse FR",
        "Adresse AR",
        "Governorate",
        "Delegation",
        "Code Postale",
        "Nationalite",
        "Etat Civil",
        "Sexe",
        "Date Affectation",
        "Date Delivrance",
        "Date Designation",
        "N° Compte Courant",
        "N° Identifiant",
        "N° CIN",
        "Matricule",
        "Mat CNRPS",
        "Email",
        "N° Tel1",
        "N° Tel2",
        "Nom Conjoint",
        "Poste Conjoint",
        "Nombre Fils",
        "Service FR",
        "Service AR",
        "Etat Compte FR",
        "Etat Compte AR",
        "Catégorie FR",
        "Catégorie AR",
        "Grade FR",
        "Grade AR",
        "Poste FR",
        "Poste AR",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personnel");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, "template_personnels.xlsx");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des personnels"
            pageTitle="Liste des personnels "
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
                      end={personnelCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Nombre de personnels
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
                      end={activatedPersonnelsCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Personnels Activés
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
                      end={deactivatedPersonnelsCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Personnels Desactivés
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row id="sellersList">
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
                          // onClick={() => fileInputRef.current?.click()}
                        >
                          Ajouter Depuis Excel
                        </Button>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          // ref={fileInputRef}
                          style={{ display: "none" }}
                          // onChange={handleFileChange}
                        />
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddPersonnel()}
                        >
                          Ajouter Personnel
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
                  {/* <div className="table-responsive table-card mb-1"> */}
                  {/* <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  > */}
                  <TableContainer
                    columns={columns || []}
                    data={data || []}
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
                  {/* </table> */}
                  {/* </div> */}
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center py-4">
                      <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                          <i className="bi bi-search"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ seller We did not find any
                        seller for you search.
                      </p>
                    </div>
                  </div>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>

            {/* Importing personnel */}
            <Modal
              className="fade modal-fullscreen"
              show={modal_ImportModals}
              onHide={tog_ImportModals}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Importer personnels
                </h5>
              </Modal.Header>
              <Form className="tablelist-form">
                <Modal.Body className="p-4">
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">
                          Téléchargement...
                        </span>
                      </Spinner>
                    </div>
                  ) : (
                    <>
                      Vous pouvez importer plusieurs personnels à partir de ce
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

export default ListePersonnels;
