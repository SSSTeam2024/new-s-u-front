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
import { useFetchDomainesClasseQuery } from "features/domaineClasse/domaineClasse";
import {
  Parcours,
  useAddParcoursMutation,
  useDeleteParcoursMutation,
  useFetchParcoursQuery,
  useUpdateParcoursMutation,
} from "features/parcours/parcours";
import { useFetchMentionsClasseQuery } from "features/mentionClasse/mentionClasse";
import { useFetchTypeParcoursQuery } from "features/TypeParcours/TypeParcours";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { useAddModuleParcoursMutation } from "features/moduleParcours/moduleParcours";
import { useAddMatiereMutation } from "features/matiere/matiere";
export interface ParcoursFileEXEL {
  _id: string;
  type_parcours: any;
  nom_parcours: string;
  code_parcours: string;
  semestre: string;
  code_Ue: string;
  libelle: string;
  credit: string;
  coef: string;
  nature: string;
  regime: string;
  code_matiere?: string;
  matiere?: string;
  type?: string;
  volume?: string;
  nbr_elimination?: string;
  regime_matiere?: string;
  credit_matiere?: string;
  coefficient_matiere?: string;
}

const ConfigurationParcours = () => {
  document.title = "Configurartion parcours | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data = [] } = useFetchParcoursQuery();
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
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      type_parcours: "",
      mention: "",
      domaine: "",
      nom_parcours: "",
      code_parcours: "",
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
  // const handleFileUpload = (event: any) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.error("No file selected.");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     console.log("File read successfully.");
  //     try {
  //       const data = new Uint8Array(e.target!.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
  //         worksheet
  //       ) as ParcoursFileEXEL[];

  //       console.log("Excel Data:", jsonData);

  //       const mappedData: any[] = jsonData.map((item: any) => ({
  //         nom_parcours: item.NomParcours || "",
  //         code_parcours: item.codeParcours || "",
  //         semestre: item.Semestre,
  //         code_Ue: item.codeUE,
  //         libelle: item.NomUE,
  //         credit: item.CreditUE,
  //         coef: item.CoefUE,
  //         nature: item.NatureUE,
  //         regime: item.RegimeUE,
  //       }));

  //       const parcoursToCreate = mappedData.slice(0, 1)[0];
  //       try {
  //         const createdParcours = await createParcours(
  //           parcoursToCreate
  //         ).unwrap();

  //         const modulesToCreate = mappedData.map((module) => ({
  //           ...module,
  //           parcours: createdParcours?._id!,
  //         }));

  //         await Promise.all(
  //           modulesToCreate.map(async (module) => {
  //             try {
  //               await createModule(module).unwrap();
  //               console.log("Module created:", module);
  //             } catch (error) {
  //               console.error("Error creating module:", error);
  //             }
  //           })
  //         );
  //       } catch (error) {
  //         console.error("Error creating parcours:", error);
  //       }

  //       setParcoursFile(jsonData);
  //       setFilePath(file.name);
  //       console.log("File and state updated successfully.");
  //     } catch (error) {
  //       console.error("Error processing file:", error);
  //     }
  //   };

  //   reader.onerror = () => {
  //     console.error("File could not be read.");
  //   };

  //   reader.readAsArrayBuffer(file);
  // };
  // const handleFileUpload = (event: any) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.error("No file selected.");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     console.log("File read successfully.");
  //     try {
  //       const data = new Uint8Array(e.target!.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
  //         worksheet
  //       ) as ParcoursFileEXEL[];

  //       console.log("Excel Data:", jsonData);

  //       // Group data by NomParcours to ensure modules are linked to their parcours
  //       const groupedData = jsonData.reduce((acc, item: any) => {
  //         const key = item.NomParcours || "";
  //         if (!acc[key]) {
  //           acc[key] = [];
  //         }
  //         acc[key].push(item);
  //         return acc;
  //       }, {} as Record<string, any[]>);

  //       for (const [nom_parcours, items] of Object.entries(groupedData)) {
  //         const parcoursData = {
  //           nom_parcours: items[0].NomParcours || "",
  //           code_parcours: items[0].codeParcours || "",
  //           semestre: items[0].Semestre,
  //         };

  //         try {
  //           const createdParcours = await createParcours(parcoursData).unwrap();
  //           console.log("Parcours created:", createdParcours);

  //           const modulesToCreate = items.map((module) => ({
  //             code_Ue: module.codeUE,
  //             libelle: module.NomUE,
  //             credit: module.CreditUE,
  //             coef: module.CoefUE,
  //             nature: module.NatureUE,
  //             regime: module.RegimeUE,
  //             code_matiere: module.codeMatiere,
  //             nom_matiere: module.NomMatiere,
  //             type_matiere: module.TypeMatiere,
  //             volume_horaire: module.VolumeHoraire,
  //             nomre_elimination: module.NomreElimination,
  //             regime_matiere: module.RegimeMatiere,
  //             credit_matiere: module.CreditMatiere,
  //             coefficient_matiere: module.coefficientMatiere,
  //             parcours: createdParcours?._id!, // Associate with the created parcours
  //           }));

  //           await Promise.all(
  //             modulesToCreate.map(async (module: any) => {
  //               try {
  //                 await createModule(module).unwrap();
  //                 console.log("Module created:", module);
  //               } catch (error) {
  //                 console.error("Error creating module:", error);
  //               }
  //             })
  //           );
  //         } catch (error) {
  //           console.error("Error creating parcours:", error);
  //         }
  //       }

  //       setParcoursFile(jsonData);
  //       setFilePath(file.name);
  //       console.log("File and state updated successfully.");
  //     } catch (error) {
  //       console.error("Error processing file:", error);
  //     }
  //   };

  //   reader.onerror = () => {
  //     console.error("File could not be read.");
  //   };

  //   reader.readAsArrayBuffer(file);
  // };
  // const handleFileUpload = (event: any) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.error("No file selected.");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     console.log("File read successfully.");
  //     setIsLoading(true);
  //     try {
  //       const data = new Uint8Array(e.target!.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
  //         worksheet
  //       ) as ParcoursFileEXEL[];

  //       console.log("Excel Data:", jsonData);

  //       // Group data by NomParcours to ensure modules are linked to their parcours
  //       const groupedData = jsonData.reduce((acc, item: any) => {
  //         const key = item.NomParcours || "";
  //         if (!acc[key]) {
  //           acc[key] = [];
  //         }
  //         acc[key].push(item);
  //         return acc;
  //       }, {} as Record<string, any[]>);

  //       for (const [nom_parcours, items] of Object.entries(groupedData)) {
  //         const parcoursData = {
  //           nom_parcours: items[0].NomParcours || "",
  //           code_parcours: items[0].codeParcours || "",
  //           semestre: items[0].Semestre,
  //         };

  //         try {
  //           const createdParcours = await createParcours(parcoursData).unwrap();
  //           console.log("Parcours created:", createdParcours);

  //           const modulesToCreate = items.map((module) => ({
  //             code_Ue: module.codeUE,
  //             libelle: module.NomUE,
  //             credit: module.CreditUE,
  //             coef: module.CoefUE,
  //             nature: module.NatureUE,
  //             regime: module.RegimeUE,
  //             parcours: createdParcours?._id!, // Associate with the created parcours
  //           }));

  //           await Promise.all(
  //             modulesToCreate.map(async (module: any) => {
  //               try {
  //                 const createdModule = await createModule(module).unwrap();
  //                 console.log("Module created:", createdModule);

  //                 const matieresToCreate = items
  //                   .filter((item) => item.codeUE === module.code_Ue) // Ensure matieres belong to this module
  //                   .map((matiere) => ({
  //                     code_matiere: matiere.codeMatiere,
  //                     matiere: matiere.NomMatiere,
  //                     types: [
  //                       {
  //                         type: matiere.TypeMatiere,
  //                         volume: matiere.VolumeHoraire,
  //                         nbr_elimination: matiere.NomreElimination,
  //                       },
  //                     ],
  //                     regime_matiere: matiere.RegimeMatiere,
  //                     credit_matiere: matiere.CreditMatiere,
  //                     coefficient_matiere: matiere.coefficientMatiere,
  //                     module: createdModule?._id!, // Associate with the created module
  //                   }));

  //                 await Promise.all(
  //                   matieresToCreate.map(async (matiere) => {
  //                     try {
  //                       await createMatiere(matiere).unwrap();
  //                       console.log("Matiere created:", matiere);
  //                     } catch (error) {
  //                       console.error("Error creating matiere:", error);
  //                     }
  //                   })
  //                 );
  //               } catch (error) {
  //                 console.error("Error creating module:", error);
  //               }
  //             })
  //           );
  //         } catch (error) {
  //           console.error("Error creating parcours:", error);
  //         }
  //       }

  //       setParcoursFile(jsonData);
  //       setFilePath(file.name);
  //       console.log("File and state updated successfully.");
  //     } catch (error) {
  //       console.error("Error processing file:", error);
  //     }
  //   };

  //   reader.onerror = () => {
  //     console.error("File could not be read.");
  //     setIsLoading(false);
  //   };

  //   reader.readAsArrayBuffer(file);
  // };
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
        const jsonData: ParcoursFileEXEL[] = XLSX.utils.sheet_to_json(
          worksheet
        ) as ParcoursFileEXEL[];

        console.log("Excel Data:", jsonData);

        const groupedData = jsonData.reduce((acc, item: any) => {
          const key = item.NomParcours || "";
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {} as Record<string, any[]>);

        const parcoursPromises = Object.entries(groupedData).map(
          async ([nom_parcours, items]) => {
            const parcoursData = {
              nom_parcours: items[0].NomParcours || "",
              code_parcours: items[0].codeParcours || "",
              semestre: items[0].Semestre,
            };

            try {
              const createdParcours = await createParcours(
                parcoursData
              ).unwrap();
              console.log("Parcours created:", createdParcours);

              const modulesToCreate = items.map((module) => ({
                code_Ue: module.codeUE,
                libelle: module.NomUE,
                credit: module.CreditUE,
                coef: module.CoefUE,
                nature: module.NatureUE,
                regime: module.RegimeUE,
                parcours: createdParcours?._id!,
              }));

              const modulePromises = modulesToCreate.map(
                async (module: any) => {
                  try {
                    const createdModule = await createModule(module).unwrap();
                    console.log("Module created:", createdModule);

                    const matieresToCreate = items
                      .filter((item) => item.codeUE === module.code_Ue)
                      .map((matiere) => ({
                        code_matiere: matiere.codeMatiere,
                        matiere: matiere.NomMatiere,
                        types: [
                          {
                            type: matiere.TypeMatiere,
                            volume: matiere.VolumeHoraire,
                            nbr_elimination: matiere.NomreElimination,
                          },
                        ],
                        regime_matiere: matiere.RegimeMatiere,
                        credit_matiere: matiere.CreditMatiere,
                        coefficient_matiere: matiere.coefficientMatiere,
                        module: createdModule?._id!,
                      }));

                    await Promise.all(
                      matieresToCreate.map(async (matiere) => {
                        try {
                          await createMatiere(matiere).unwrap();
                          console.log("Matiere created:", matiere);
                        } catch (error) {
                          console.error("Error creating matiere:", error);
                        }
                      })
                    );
                  } catch (error) {
                    console.error("Error creating module:", error);
                  }
                }
              );

              await Promise.all(modulePromises);
            } catch (error) {
              console.error("Error creating parcours:", error);
            }
          }
        );

        await Promise.all(parcoursPromises);

        setParcoursFile(jsonData);
        setFilePath(file.name);
        console.log("File and state updated successfully.");
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
        "NomParcours",
        "codeParcours",
        "Semestre",
        "codeUE",
        "NomUE",
        "CreditUE",
        "CoefUE",
        "NatureUE",
        "RegimeUE",
        "codeMatiere",
        "NomMatiere",
        "TypeMatiere",
        "VolumeHoraire",
        "NomreElimination",
        "RegimeMatiere",
        "CreditMatiere",
        "coefficientMatiere",
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
  console.log("selectDomain", selectedDoamin);
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

export default ConfigurationParcours;
