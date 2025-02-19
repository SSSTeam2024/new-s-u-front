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
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import { actionAuthorization } from "utils/pathVerification";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import {
  useAddDomaineClasseMutation,
  useFetchDomainesClasseQuery,
  useGetDomaineByValueMutation,
} from "features/domaineClasse/domaineClasse";
import {
  Parcours,
  useAddParcoursMutation,
  useDeleteParcoursMutation,
  useFetchParcoursQuery,
  useGetParcoursByValueMutation,
  useUpdateParcoursMutation,
} from "features/parcours/parcours";
import {
  useAddMentionsClasseMutation,
  useFetchMentionsClasseQuery,
  useGetMentionByValueMutation,
} from "features/mentionClasse/mentionClasse";
import {
  useAddTypeParcoursMutation,
  useFetchTypeParcoursQuery,
  useGetTypeParcoursByValueMutation,
} from "features/TypeParcours/TypeParcours";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import {
  useAddModuleParcoursMutation,
  useGetModuleParcoursByCodeMutation,
} from "features/moduleParcours/moduleParcours";
import {
  useAddMatiereMutation,
  useGetMatiereByCodeMutation,
} from "features/matiere/matiere";
export interface ParcoursFileEXEL {
  _id: string;
  Type_Parcours_AR: string;
  Type_Parcours_FR: string;
  Domaine_FR: string;
  Domaine_AR: string;
  Mention_FR: string;
  Mention_AR: string;
  codeParcours: string;
  NomParcours: string;
  codeUE: string;
  Semestre_Module: string;
  NomUE: string;
  CreditUE: string;
  CoefUE: string;
  NatureUE: string;
  RegimeUE: string;
  codeMatiere: string;
  NomMatiere: string;
  RegimeMatiere: string;
  CreditMatiere: string;
  coefficientMatiere: string;
  TypeMatiere: string;
  VolumeHoraire: string;
  NomreElimination: string;
  Abreviation_Domaine: any;
  Abreviation_Mention: any;
  Abreviation_Type_Parcours: any;
  Semestre_Parcours: string;
  Semestre_Matiere: string;
}

const ListParcours = () => {
  document.title = "Liste parcours | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data = [] } = useFetchParcoursQuery();
  // console.log("parcours data", data);
  const { data: allDomaines = [] } = useFetchDomainesClasseQuery();
  const { data: allMentions = [] } = useFetchMentionsClasseQuery();
  const { data: allTypesParcours = [] } = useFetchTypeParcoursQuery();

  const filteredParcours = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((parcours) =>
        [
          parcours.code_parcours,
          parcours.nom_parcours,
          parcours.domaine,
          parcours.mention,
          parcours.type_parcours,
          parcours.semestre_parcours,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);

  const [deleteParcours] = useDeleteParcoursMutation();

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
          deleteParcours(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Parcours a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Parcours est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Code Parcours",
        accessor: "code_parcours",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nom Parcours",
        accessor: "nom_parcours",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Semestres",
        accessor: (row: any) =>
          row?.semestre_parcours && row.semestre_parcours.length > 0
            ? row.semestre_parcours.join(", ")
            : "Aucun semestre assigné",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Domaine",
        accessor: (row: any) => row.domaine?.name_domaine_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Mention",
        accessor: (row: any) => row.mention?.name_mention_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Type Parcours",
        accessor: (row: any) => row.type_parcours?.name_type_parcours_fr! || "",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Plan",
        disableFilters: true,
        filterable: true,
        accessor: (parcours: Parcours) => {
          return (
            <ul className="list-unstyled mb-0">
              {actionAuthorization(
                "/parcours/gestion-parcours/ajouter-plan-parcours",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/parcours/gestion-parcours/ajouter-plan-parcours"
                    state={parcours}
                    className="badge bg-info-subtle text-info edit-item-btn"
                  >
                    <i
                      className="ph ph-arrow-bend-double-up-right"
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
            </ul>
          );
        },
      },

      {
        Header: "Configuration",
        disableFilters: true,
        filterable: true,
        accessor: (parcours: Parcours) => {
          return (
            <ul className="list-unstyled mb-0">
              {actionAuthorization(
                "/parcours/gestion-parcours/configurer-plan-parcours",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="parcours/gestion-parcours/configurer-plan-parcours"
                    state={parcours}
                    className="badge bg-secondary-subtle text-secondary edit-item-btn"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   handleEditModal(domaineClasse);
                    // }}
                  >
                    <i
                      className="ph ph-gear-six"
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
            </ul>
          );
        },
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (parcours: Parcours) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/parcours/gestion-parcours/view-parcours",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/parcours/gestion-parcours/view-parcours"
                    className="badge bg-info-subtle text-info view-item-btn"
                    state={parcours}
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
                "/parcours/gestion-parcours/edit-parcours",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/parcours/gestion-parcours/edit-parcours"
                    state={parcours}
                    className="badge bg-primary-subtle text-primary edit-item-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditModal(parcours);
                    }}
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
                "/parcours/gestion-parcours/delete-parcours",
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
                      onClick={() => AlertDelete(parcours?._id!)}
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
  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  const [createParcours] = useAddParcoursMutation();
  const [createModule] = useAddModuleParcoursMutation();
  const [createMatiere] = useAddMatiereMutation();
  const { state: parcours } = useLocation();
  const [editParcours] = useUpdateParcoursMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    type_parcours: "",
    mention: "",
    domaine: "",
    nom_parcours: "",
    code_parcours: "",
    // semestre_parcours: [],
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      type_parcours: "",
      mention: "",
      domaine: "",
      nom_parcours: "",
      code_parcours: "",
      //semestre_parcours: [],
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (parcours: Parcours) => {
    setFormData({
      _id: parcours._id || "",
      type_parcours: parcours.type_parcours || { name_type_parcours_fr: "" },
      mention: parcours.mention || { name_mention_fr: "" },
      domaine: parcours.domaine || { name_domaine_fr: "" },
      nom_parcours: parcours.nom_parcours || "",
      code_parcours: parcours.code_parcours || "",
      //semestre_parcours: parcours.semestre_parcours || [],
    });
    setShowEditModal(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
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

  const onSubmitParcours = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createParcours(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/parcours/gestion-parcours/liste-parcours");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditParcours = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      formData["domaine"] = selectedDoamin;
      formData["mention"] = selectedMention;
      formData["type_parcours"] = selectedTypeParcours;
      await editParcours(formData).unwrap();
      setShowEditModal(false);
      notifyEdit();
    } catch (error) {
      errorAlert("An error occurred while editing the parcours.");
    }
  };

  useEffect(() => {
    if (parcours && isEditModalOpen) {
      setFormData({
        _id: parcours._id || "",
        nom_parcours: parcours.nom_parcours || "",
        code_parcours: parcours.code_parcours || "",
        domaine: parcours.domaine || { name_domaine_fr: "" },
        type_parcours: parcours.type_parcours || { name_type_parcours_fr: "" },
        mention: parcours.mention || { name_mention_fr: "" },
        //semestre_parcours: parcours.semestre_parcours || "",
      });
    }
  }, [parcours, isEditModalOpen]);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Parcours a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const notifyEdit = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Parcours a été modifié avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [modal_ImportModals, setmodal_ImportModals] = useState<boolean>(false);
  const [parcoursFile, setParcoursFile] = useState<ParcoursFileEXEL[]>([]);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  function tog_ImportModals() {
    setmodal_ImportModals(!modal_ImportModals);
  }

  const [addTypeParcours] = useAddTypeParcoursMutation();
  const [addMention] = useAddMentionsClasseMutation();
  const [addDomaine] = useAddDomaineClasseMutation();

  const [getMatiereCode] = useGetMatiereByCodeMutation();
  const [getParcoursValue] = useGetParcoursByValueMutation();
  const [getModuleParcoursCode] = useGetModuleParcoursByCodeMutation();

  const [getDomaineValue] = useGetDomaineByValueMutation();
  const [getTypeParcoursValue] = useGetTypeParcoursByValueMutation();
  const [getMentionValue] = useGetMentionByValueMutation();

  const getOrCreate = async (
    map: any,
    getFunc: any,
    addFunc: any,
    isMatiere?: boolean
  ) => {
    for (const [key, value] of map.entries()) {
      const existingValue = await getFunc(value).unwrap();
      if (existingValue !== null) {
        //console.log(`existing Value ${key}:`, existingValue);
        map.set(key, { ...value, id: existingValue.id });
      } else {
        if (isMatiere) {
          const createdValue = await addFunc(value).unwrap();
          //console.log(`Created new ${key}:`, createdValue);
          map.set(key, { ...value, id: createdValue[0]?._id! });
          //console.log("map", map);
        } else {
          const createdValue = await addFunc(value).unwrap();
          //console.log(`Created new ${key}:`, createdValue);
          map.set(key, { ...value, id: createdValue?._id! });
          //console.log("map", map);
        }
      }
    }
  };

  // const handleFileUpload = (event: any) => {
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
  //       const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
  //         worksheet
  //       ) as ParcoursFileEXEL[];

  //       const uniqueMatiere = new Map<
  //         string,
  //         {
  //           id: string;
  //           code_matiere: string;
  //           matiere?: string;
  //           type?: string;
  //           semestre?: string;
  //           volume?: string;
  //           nbr_elimination?: string;
  //           regime_matiere?: string;
  //           types?: {
  //             type: string;
  //             volume: string;
  //             nbr_elimination: string;
  //           }[];
  //           credit_matiere?: string;
  //           coefficient_matiere?: string;
  //         }
  //       >();

  //       const uniqueModuleParcours = new Map<
  //         string,
  //         {
  //           id: string;
  //           code_Ue: string;
  //           semestre: string;
  //           libelle: string;
  //           credit: string;
  //           coef: string;
  //           nature: string;
  //           regime: string;
  //           parcours?: string;
  //           matiere?: string[];
  //         }
  //       >();

  //       const uniqueParcours = new Map<
  //         string,
  //         {
  //           id: string;
  //           code_parcours: string;
  //           nom_parcours: string;
  //         }
  //       >();

  //       jsonData.forEach(async (item: any) => {
  //         const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}`;
  //         if (!uniqueParcours.has(parcoursKey)) {
  //           uniqueParcours.set(parcoursKey, {
  //             id: "",
  //             code_parcours: item["codeParcours"],
  //             nom_parcours: item["NomParcours"],
  //           });
  //         }

  //         const matiereKey = `${item["codeMatiere"]}`;
  //         if (!uniqueMatiere.has(matiereKey)) {
  //           uniqueMatiere.set(matiereKey, {
  //             id: "",
  //             code_matiere: item["codeMatiere"],
  //             matiere: item["NomMatiere"],
  //             regime_matiere: item["RegimeMatiere"],
  //             credit_matiere: item["CreditMatiere"],
  //             coefficient_matiere: item["coefficientMatiere"],
  //             types: [
  //               {
  //                 type: item["TypeMatiere"],
  //                 volume: item["VolumeHoraire"],
  //                 nbr_elimination: item["NomreElimination"],
  //               },
  //             ],
  //           });
  //         }

  //         const moduleKey = `${item["codeUE"]}`;
  //         if (!uniqueModuleParcours.has(moduleKey)) {
  //           uniqueModuleParcours.set(moduleKey, {
  //             id: "",
  //             code_Ue: item["codeUE"],
  //             semestre: item["Semestre"],
  //             libelle: item["NomUE"],
  //             credit: item["CreditUE"],
  //             coef: item["CoefUE"],
  //             nature: item["NatureUE"],
  //             regime: item["RegimeUE"],
  //             parcours:
  //               uniqueParcours.get(
  //                 `${item["NomParcours"]}-${item["codeParcours"]}`
  //               )?.id || "",
  //             matiere: [uniqueMatiere.get(`${item["codeMatiere"]}`)?.id!],
  //           });
  //         }
  //       });
  //       console.log("uniqueModuleParcours", uniqueModuleParcours);
  //       await getOrCreate(uniqueParcours, getParcoursValue, createParcours);

  //       await getOrCreate(uniqueMatiere, getMatiereCode, createMatiere);

  //       await getOrCreate(
  //         uniqueModuleParcours,
  //         getModuleParcoursCode,
  //         createModule
  //       );
  //       setParcoursFile(jsonData);
  //       setFilePath(file.name);
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
        const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
          worksheet
        ) as ParcoursFileEXEL[];

        const uniqueMatiere = new Map<string, any>();
        const uniqueModuleParcours = new Map<string, any>();
        const uniqueParcours = new Map<string, any>();

        for (const item of jsonData) {
          const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}`;
          if (!uniqueParcours.has(parcoursKey)) {
            let tab = [];
            tab.push(item["Semestre_Parcours"]);

            uniqueParcours.set(parcoursKey, {
              id: "",
              code_parcours: item["codeParcours"],
              nom_parcours: item["NomParcours"],
              semestre_parcours: tab,
            });
          } else {
            let s = uniqueParcours.get(parcoursKey)?.semestre_parcours;
            s.push(item["Semestre_Parcours"]);
            uniqueParcours.set(parcoursKey, {
              id: "",
              code_parcours: item["codeParcours"],
              nom_parcours: item["NomParcours"],
              semestre_parcours: s,
            });
          }

          const matiereKey = `${item["codeMatiere"]}`;
          if (Number(item["Semestre_Parcours"].slice(1, 2)) % 2 === 0) {
            if (!uniqueMatiere.has(matiereKey)) {
              uniqueMatiere.set(matiereKey, {
                id: "",
                code_matiere: item["codeMatiere"],
                semestre: "S2",
                matiere: item["NomMatiere"],
                regime_matiere: item["RegimeMatiere"],
                credit_matiere: item["CreditMatiere"],
                coefficient_matiere: item["coefficientMatiere"],
                types: [
                  {
                    type: item["TypeMatiere"],
                    volume: item["VolumeHoraire"],
                    nbr_elimination: item["NomreElimination"],
                  },
                ],
              });
            }
          } else {
            if (!uniqueMatiere.has(matiereKey)) {
              uniqueMatiere.set(matiereKey, {
                id: "",
                code_matiere: item["codeMatiere"],
                semestre: "S1",
                matiere: item["NomMatiere"],
                regime_matiere: item["RegimeMatiere"],
                credit_matiere: item["CreditMatiere"],
                coefficient_matiere: item["coefficientMatiere"],
                types: [
                  {
                    type: item["TypeMatiere"],
                    volume: item["VolumeHoraire"],
                    nbr_elimination: item["NomreElimination"],
                  },
                ],
              });
            }
          }
        }
        console.log("unique parcours", uniqueParcours);
        await getOrCreate(uniqueParcours, getParcoursValue, createParcours);

        await getOrCreate(uniqueMatiere, getMatiereCode, createMatiere, true);

        // for (const item of jsonData) {
        //   const moduleKey = `${item["codeUE"]}`;
        //   if (!uniqueModuleParcours.has(moduleKey)) {
        //     const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}`;
        //     const matiereKey = `${item["codeMatiere"]}`;

        //     uniqueModuleParcours.set(moduleKey, {
        //       id: "",
        //       code_Ue: item["codeUE"],
        //       semestre_module: item["Semestre_Module"],
        //       libelle: item["NomUE"],
        //       credit: item["CreditUE"],
        //       coef: item["CoefUE"],
        //       nature: item["NatureUE"],
        //       regime: item["RegimeUE"],
        //       parcours: uniqueParcours.get(parcoursKey)?.id || "",
        //       matiere: [uniqueMatiere.get(matiereKey)?.id || ""],
        //     });
        //   }
        // }
        for (const item of jsonData) {
          const moduleKey = `${item["codeUE"]}`;
          if (Number(item["Semestre_Parcours"].slice(1, 2)) % 2 === 0) {
            if (!uniqueModuleParcours.has(moduleKey)) {
              const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}`;
              const matiereKey = `${item["codeMatiere"]}`;

              const matiereId = uniqueMatiere.has(matiereKey)
                ? uniqueMatiere.get(matiereKey)?.id
                : null;
              //console.log("matiereId", uniqueMatiere.get(matiereKey)?.id!);
              if (matiereId) {
                uniqueModuleParcours.set(moduleKey, {
                  id: "",
                  code_Ue: item["codeUE"],
                  semestre_module: "S2",
                  libelle: item["NomUE"],
                  credit: item["CreditUE"],
                  coef: item["CoefUE"],
                  nature: item["NatureUE"],
                  regime: item["RegimeUE"],
                  parcours: uniqueParcours.get(parcoursKey)?.id || "",
                  matiere: [matiereId],
                });
              } else {
                console.error(`Matiere ID for ${matiereKey} not found.`);
              }
            }
          } else {
            if (!uniqueModuleParcours.has(moduleKey)) {
              const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}`;
              const matiereKey = `${item["codeMatiere"]}`;

              const matiereId = uniqueMatiere.has(matiereKey)
                ? uniqueMatiere.get(matiereKey)?.id
                : null;
              //console.log("matiereId", uniqueMatiere.get(matiereKey)?.id!);
              if (matiereId) {
                uniqueModuleParcours.set(moduleKey, {
                  id: "",
                  code_Ue: item["codeUE"],
                  semestre_module: "S1",
                  libelle: item["NomUE"],
                  credit: item["CreditUE"],
                  coef: item["CoefUE"],
                  nature: item["NatureUE"],
                  regime: item["RegimeUE"],
                  parcours: uniqueParcours.get(parcoursKey)?.id || "",
                  matiere: [matiereId],
                });
              } else {
                console.error(`Matiere ID for ${matiereKey} not found.`);
              }
            }
          }
        }

        await getOrCreate(
          uniqueModuleParcours,
          getModuleParcoursCode,
          createModule
        );

        setParcoursFile(jsonData);
        setFilePath(file.name);
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
  //       const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
  //         worksheet
  //       ) as ParcoursFileEXEL[];

  //       const uniqueMatiere = new Map<string, any>();
  //       const uniqueModuleParcours = new Map<string, any>();
  //       const uniqueParcours = new Map<string, any>();

  //       // Populate uniqueParcours and uniqueMatiere maps
  //       for (const item of jsonData) {
  //         const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}`;
  //         if (!uniqueParcours.has(parcoursKey)) {
  //           uniqueParcours.set(parcoursKey, {
  //             id: "",
  //             code_parcours: item["codeParcours"],
  //             nom_parcours: item["NomParcours"],
  //             semestre_parcours: item["Semestre_Parcours"],
  //           });
  //         }

  //         const matiereKey = `${item["codeMatiere"]}`;
  //         if (!uniqueMatiere.has(matiereKey)) {
  //           uniqueMatiere.set(matiereKey, {
  //             id: "",
  //             code_matiere: item["codeMatiere"],
  //             semestre: item["Semestre_Matiere"],
  //             matiere: item["NomMatiere"],
  //             regime_matiere: item["RegimeMatiere"],
  //             credit_matiere: item["CreditMatiere"],
  //             coefficient_matiere: item["coefficientMatiere"],
  //             types: [
  //               {
  //                 type: item["TypeMatiere"],
  //                 volume: item["VolumeHoraire"],
  //                 nbr_elimination: item["NomreElimination"],
  //               },
  //             ],
  //           });
  //         }
  //       }

  //       // Await the creation of parcours and matiere
  //       await getOrCreate(uniqueParcours, getParcoursValue, createParcours);
  //       await getOrCreate(uniqueMatiere, getMatiereCode, createMatiere);
  //       // console.log("uniqueMatiere", uniqueMatiere);
  //       // let tabMat = [];
  //       // for (const umatiere of Array.from(uniqueMatiere.entries())) {
  //       //   tabMat.push(umatiere[1].id);
  //       // }
  //       // console.log("tabMat", tabMat);
  //       // // Now, create module entries with the correct IDs
  //       for (const item of jsonData) {
  //         const moduleKey = `${item["codeUE"]}`;
  //         if (!uniqueModuleParcours.has(moduleKey)) {
  //           const parcoursKey = `${item["NomParcours"]}-${item["codeParcours"]}-${item["Semestre_Parcours"]}`;
  //           const matiereKey = `${item["codeMatiere"]}`;

  //           uniqueModuleParcours.set(moduleKey, {
  //             id: "",
  //             code_Ue: item["codeUE"],
  //             semestre_module: item["Semestre_Module"],
  //             libelle: item["NomUE"],
  //             credit: item["CreditUE"],
  //             coef: item["CoefUE"],
  //             nature: item["NatureUE"],
  //             regime: item["RegimeUE"],
  //             parcours: uniqueParcours.get(parcoursKey)?.id || "",
  //             matiere: [uniqueMatiere.get(matiereKey)?.id || ""],
  //           });
  //         }
  //       }

  //       // Await the creation of modules
  //       await getOrCreate(
  //         uniqueModuleParcours,
  //         getModuleParcoursCode,
  //         createModule
  //       );

  //       setParcoursFile(jsonData);
  //       setFilePath(file.name);
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
        "codeParcours",
        "NomParcours",
        "Semestre_Parcours",
        "codeUE",
        "NomUE",
        "CreditUE",
        "CoefUE",
        "NatureUE",
        "RegimeUE",
        "Semestre_Module",
        "codeMatiere",
        "NomMatiere",
        "RegimeMatiere",
        "CreditMatiere",
        "coefficientMatiere",
        "TypeMatiere",
        "VolumeHoraire",
        "NomreElimination",
        "Semestre_Matiere",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parcours");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, "template_parcours.xlsx");
  };
  const [selectedDoamin, setSelectedDoamin] = useState("");
  const [selectedTypeParcours, setSelectedTypeParcours] = useState("");
  const [selectedMention, setSelectedMention] = useState("");
  const handleSelectDomain = (e: any) => {
    const value = e.target.value;
    setSelectedDoamin(value);
  };
  const handleSelectTypeParcours = (e: any) => {
    const value = e.target.value;
    setSelectedTypeParcours(value);
  };
  const handleSelectMention = (e: any) => {
    const value = e.target.value;
    setSelectedMention(value);
  };

  const [selectedSemestre, setSelectedSemestre] = useState<string | null>(null);
  const semestres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; // Example groupe numbers
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Paramètres des Parcours"
            pageTitle="Liste des parcours"
          />

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
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
                      <div className="">
                        {actionAuthorization(
                          "/parcours/gestion-parcours/ajouter-parcours",
                          user?.permissions!
                        ) ? (
                          <Button
                            variant="primary"
                            className="add-btn"
                            onClick={() => handleAddClick()}
                          >
                            Ajouter parcours
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Col>
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
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <TableContainer
                      columns={columns || []}
                      data={filteredParcours || []}
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
                        We've searched more than 150+ seller We did not find any
                        seller for you search.
                      </p>
                    </div>
                  </div>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>
            {/* Add parcours */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Parcours
                </h5>
              </Modal.Header>
              <Form className="tablelist-form" onSubmit={onSubmitParcours}>
                <Modal.Body className="p-4">
                  <Row>
                    {/* <Col lg={12}>
                      <div className="mb-3">
                        <Form.Label htmlFor="semestre_parcours">
                          Semestre
                        </Form.Label>
                        <select
                          className="form-select text-muted"
                          name="semestre_parcours"
                          id="semestre_parcours"
                          value={selectedSemestre || ""}
                          onChange={(e) => {
                            const newSemestre = e.target.value;
                            setSelectedSemestre(newSemestre);
                            setFormData((prev) => ({
                              ...prev,
                              semestre_parcours: newSemestre,
                            })); // Update FormData
                          }}
                        >
                          <option value="">Sélectionner Semestre</option>
                          {semestres.map((num: any) => (
                            <option key={num} value={num}>
                              Semestre {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col> */}
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Form.Label htmlFor="code_parcours">
                          Code Parcours
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="code_parcours"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.code_parcours}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Form.Label htmlFor="nom_parcours">
                          Nom Parcours
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="nom_parcours"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.nom_parcours}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Label htmlFor="nom_parcours">
                        Type Parcours
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="type_parcours"
                        id="type_parcours"
                        value={formData.type_parcours}
                        onChange={handleChange}
                        disabled={
                          !allTypesParcours || allTypesParcours.length === 0
                        }
                      >
                        <option value="">Sélectionner Type Parcours</option>
                        {allTypesParcours.length > 0 ? (
                          allTypesParcours.map((type_parcours) => (
                            <option
                              key={type_parcours._id}
                              value={type_parcours._id}
                            >
                              {type_parcours.name_type_parcours_fr}
                            </option>
                          ))
                        ) : (
                          <option value="">No type parcours available</option>
                        )}
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Label htmlFor="nom_parcours">Mention</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="mention"
                        id="mention"
                        value={formData.mention}
                        onChange={handleChange}
                        disabled={!allMentions || allMentions.length === 0}
                      >
                        <option value="">Sélectionner Mention</option>
                        {allMentions.length > 0 ? (
                          allMentions.map((mention) => (
                            <option key={mention._id} value={mention._id}>
                              {mention.name_mention_fr}
                            </option>
                          ))
                        ) : (
                          <option value="">No mentions available</option>
                        )}
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Label htmlFor="nom_parcours">Domaine</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="domaine"
                        id="domaine"
                        value={formData.domaine}
                        onChange={handleChange}
                        disabled={!allDomaines || allDomaines.length === 0}
                      >
                        <option value="">Sélectionner Domaine</option>
                        {allDomaines.length > 0 ? (
                          allDomaines.map((domaine) => (
                            <option key={domaine._id} value={domaine._id}>
                              {domaine.name_domaine_fr}
                            </option>
                          ))
                        ) : (
                          <option value="">No domains available</option>
                        )}
                      </select>
                    </Col>
                  </Row>
                </Modal.Body>
                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button className="btn-ghost-danger">Fermer</Button>
                    <Button
                      variant="success"
                      id="add-btn"
                      type="submit"
                      onClick={tog_AddOrderModals}
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Form>
            </Modal>

            {/*Edit Type Parcours */}
            <Modal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Modifier Type Parcours
                </h5>
              </Modal.Header>
              <Form className="tablelist-form" onSubmit={onSubmitEditParcours}>
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Form.Label htmlFor="code_parcours">
                          Code Parcours
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_type_parcours_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.code_parcours}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Form.Label htmlFor="nom_parcours">
                          Nom Parcours
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="nom_parcours"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.nom_parcours}
                        />
                      </div>
                    </Col>
                    <Row>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Form.Label htmlFor="name_domaine_fr">
                            Domaine Classe
                          </Form.Label>
                          <select
                            className="form-select text-muted"
                            name="name_domaine_fr"
                            id="name_domaine_fr"
                            // value={formData.domaine.name_domaine_fr}
                            onChange={handleSelectDomain}
                          >
                            <option value="">Sélectionner Domaine</option>
                            {allDomaines.map((domaine) => (
                              <option key={domaine._id} value={domaine._id}>
                                {domaine.name_domaine_fr}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Label htmlFor="nom_parcours">Mention</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="mention"
                        id="mention"
                        //value={formData.mention}
                        onChange={handleSelectMention}
                        disabled={!allMentions || allMentions.length === 0}
                      >
                        <option value="">Sélectionner Mention</option>
                        {allMentions.length > 0 ? (
                          allMentions.map((mention) => (
                            <option key={mention._id} value={mention._id}>
                              {mention.name_mention_fr}
                            </option>
                          ))
                        ) : (
                          <option value="">No mentions available</option>
                        )}
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Label htmlFor="nom_parcours">
                        Type Parcours
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="type_parcours"
                        id="type_parcours"
                        //value={formData.type_parcours}
                        onChange={handleSelectTypeParcours}
                        disabled={
                          !allTypesParcours || allTypesParcours.length === 0
                        }
                      >
                        <option value="">Sélectionner Type Parcours</option>
                        {allTypesParcours.length > 0 ? (
                          allTypesParcours.map((type_parcours) => (
                            <option
                              key={type_parcours._id}
                              value={type_parcours._id}
                            >
                              {type_parcours.name_type_parcours_fr}
                            </option>
                          ))
                        ) : (
                          <option value="">No type parcours available</option>
                        )}
                      </select>
                    </Col>
                  </Row>
                </Modal.Body>
                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => setShowEditModal(false)}
                    >
                      Fermer
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Form>
            </Modal>

            <Modal
              className="fade modal-fullscreen"
              show={modal_ImportModals}
              onHide={tog_ImportModals}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Importer parcours
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
                      Vous pouvez importer plusieurs parcours à partir de ce
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

export default ListParcours;
