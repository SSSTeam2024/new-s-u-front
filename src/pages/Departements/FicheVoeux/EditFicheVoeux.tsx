import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { Matiere, useFetchMatiereQuery } from "features/matiere/matiere";
import {
  useAddFicheVoeuxMutation,
  useFetchFicheVoeuxsQuery,
} from "features/ficheVoeux/ficheVoeux";
import Select, { MultiValue } from "react-select";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";

interface MatiereOption {
  value: string;
  label: string;
  type: string;
  semestre: string;
  code_matiere: string;
  volume: string;
  nbr_elimination: string;
}

const EditFicheVoeux = () => {
  document.title = " Ajouter fiche de voeux | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/gestion-fiche-voeux/liste-fiche-voeux");
  }

  const [createFicheVoeux] = useAddFicheVoeuxMutation();
  // const [selectedJours, setSelectedJours] = useState<any[]>([]);

  const { data: allTeachers = [] } = useFetchEnseignantsQuery();
  const { data: allVoeux = [] } = useFetchFicheVoeuxsQuery();
  const { data: allClasses = [], isSuccess: allClassesFetched } =
    useFetchClassesQuery();
  const [hasProcessed, setHasProcessed] = useState(false);
  const location = useLocation();
  const voeuxDetails = location.state;

  //console.log("voeuxDetails", voeuxDetails);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const [formData, setFormData] = useState({
    _id: voeuxDetails?._id,
    fiche_voeux_classes: [
      {
        matieres: [""],
        classe: "",
        //Temporary data for subjects selection
        consernedClasses: [],
        selectedSubjectOptions: [],
        selectedSubjects: [],
        filteredSubjectsOptions: [],
        filtredSubjects: [],
      },
    ],
    jours: voeuxDetails?.jours!,
    enseignant: voeuxDetails?.enseignant!,
    semestre: voeuxDetails?.semestre!,
  });

  useEffect(() => {
    if (allClassesFetched && !hasProcessed) {
      console.log("formData", formData);
      setSelectedTeacherId(voeuxDetails.enseignant._id);

      /*---------------- Days selection ---------------- */

      setFormData((prevState) => {
        const updatedFicheVoeux = [...prevState.fiche_voeux_classes];

        /*---------------- Days selection ---------------- */

        let classes: any;
        classes = allClasses;

        /*---------------- Subjects selection ---------------- */

        for (let i = 0; i < voeuxDetails?.fiche_voeux_classes?.length; i++) {
          console.log(voeuxDetails?.fiche_voeux_classes[i]);
          console.log(allClasses);
          let consernedClass = allClasses?.filter(
            (classItem: any) =>
              classItem?._id! ===
              voeuxDetails?.fiche_voeux_classes[i].classe?._id!
          );

          console.log(consernedClass);

          const filtredMatieres = allMatieres.filter((mat) =>
            consernedClass[0]?.matieres?.some(
              (obj2) =>
                obj2._id === mat._id && mat.semestre === formData.semestre
            )
          );

          console.log("filtredMatieres", filtredMatieres);

          let options = filtredMatieres.map((matiere) => ({
            value: matiere._id,
            label: matiere.matiere + " " + matiere.type,
            type: matiere.type,
            semestre: matiere.semestre,
            code_matiere: matiere.code_matiere,
            volume: matiere.volume,
            nbr_elimination: matiere.nbr_elimination,
          }));
          console.log("options", options);

          let filtredOptions: any = options; /* .filter(
            (option) =>
              !updatedFicheVoeux[index].selectedSubjects.some(
                (matiere: any) => matiere._id === option.value
              )
          ); */

          let selectedSubjectOptions = voeuxDetails?.fiche_voeux_classes[
            i
          ].matieres?.map((matiere: any) => matiere);

          console.log(
            "/////////////////////////////////",
            selectedSubjectOptions
          );

          const matieres = voeuxDetails?.fiche_voeux_classes[i].matieres?.map(
            (matiere: any) => ({
              _id: matiere._id,
              code_matiere: matiere.code_matiere,
              matiere: matiere.matiere,
              type: matiere.type,
              semestre: matiere.semestre,
              volume: matiere.volume,
              nbr_elimination: matiere.nbr_elimination,
            })
          );

          const uniqueMatieres: any = [
            ...updatedFicheVoeux[i].selectedSubjects,
            ...matieres,
          ].reduce((acc, current) => {
            const x = acc.find((item: any) => item._id === current._id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, [] as Matiere[]);

          let selectedSubjects = uniqueMatieres;

          updatedFicheVoeux.push({
            classe: consernedClass[0]?._id!,
            //  jours: [],
            matieres: selectedSubjectOptions,
            // temps: "",
            //Temporary data for days selection
            //allDays: allJours,
            //selectedJourOptions: [],
            //selectedJours: [],
            //joursArray: [],
            //filtredJours: filtredJours,
            //jourOptions: jourOptions,
            // filteredJoursOptions: filteredJoursOptions,
            //Temporary data for subjects selection
            consernedClasses: classes,
            selectedSubjectOptions: selectedSubjectOptions,
            selectedSubjects: selectedSubjects,
            filteredSubjectsOptions: filtredOptions,
            filtredSubjects: [],
          });
        }
        updatedFicheVoeux.splice(0, 1);
        console.log("updatedFicheVoeux", updatedFicheVoeux);
        return {
          ...prevState,
          fiche_voeux_classes: updatedFicheVoeux,
        };
      });

      setHasProcessed(true);
    }
  }, [allClasses, allClassesFetched, hasProcessed]);

  const teachersWithoutWishCard = allTeachers.filter(
    (teacher:any) =>
      !allVoeux.some(
        (voeux) =>
          voeux.enseignant._id === teacher._id &&
          formData?.semestre! === voeux?.semestre!
      )
  );

  const handleTempsChange = (e: any, index: number) => {
    if (e.target.value !== "") {
      setFormData((prevState) => {
        const updatedJours = [...prevState.jours];
        updatedJours[index].temps = e.target.value;
        return {
          ...prevState,
          jours: updatedJours,
        };
      });
    }
  };

  const handleJourChange = (e: any, index: number) => {
    if (e.target.value !== "") {
      let exist = false;
      for (const elm of formData.jours) {
        if (elm.jour === e.target.value) {
          alert(e.target.value + " déja séléctionné!");
          exist = true;
          break;
        }
      }
      if (!exist) {
        setFormData((prevState) => {
          const updatedJours = [...prevState.jours];
          updatedJours[index].jour = e.target.value;
          return {
            ...prevState,
            jours: updatedJours,
          };
        });
      }
    }
  };

  const handleTeacherChange = (e: any) => {
    if (e.target.value !== "") {
      setSelectedTeacherId(e.target.value);
      /*---------------- Days selection ---------------- */
      let allJours: any = [
        { _id: 0, name: "Lundi" },
        { _id: 1, name: "Mardi" },
        { _id: 2, name: "Mercredi" },
        { _id: 3, name: "Jeudi" },
        { _id: 4, name: "Vendredi" },
        { _id: 5, name: "Samedi" },
      ];

      /*---------------- Days selection ---------------- */

      setFormData((prevState) => {
        const updatedFicheVoeux = [...prevState.fiche_voeux_classes];

        /*---------------- Days selection ---------------- */
        const filtredJours = allJours.map((jour: any) => jour);

        let jourOptions = filtredJours.map((jour: any) => ({
          value: jour._id,
          label: jour.name,
        }));

        // const filteredJoursOptions = jourOptions.filter(
        //   (option: any) =>
        //     !updatedFicheVoeux[0]?.selectedJours?.some(
        //       (jour) => jour === option.value
        //     )
        // );
        /*---------------- Days selection ---------------- */

        /*---------------- Subjects selection ---------------- */
        let selectedTeacher = teachersWithoutWishCard.filter(
          (teacher:any) => teacher._id === e.target.value
        );

        let classes: any;
        classes = allClasses;
        // if (
        //   selectedTeacher[0].departements?.name_fr === "Tous les départements"
        // ) {
        //   classes = allClasses;
        // } else {
        //   classes = allClasses.filter(
        //     (classItem) =>
        //       classItem.departement._id === selectedTeacher[0].departements?._id
        //   );
        // }

        /*---------------- Subjects selection ---------------- */

        updatedFicheVoeux.splice(0, updatedFicheVoeux.length);
        updatedFicheVoeux.push({
          classe: "",
          //  jours: [],
          matieres: [],
          // temps: "",
          //Temporary data for days selection
          //allDays: allJours,
          //selectedJourOptions: [],
          //selectedJours: [],
          //joursArray: [],
          //filtredJours: filtredJours,
          //jourOptions: jourOptions,
          // filteredJoursOptions: filteredJoursOptions,
          //Temporary data for subjects selection
          consernedClasses: classes,
          selectedSubjectOptions: [],
          selectedSubjects: [],
          filteredSubjectsOptions: [],
          filtredSubjects: [],
        });
        return {
          ...prevState,
          fiche_voeux_classes: updatedFicheVoeux,
          enseignant: e.target.value,
          matieres: [],
        };
      });
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

  const clearTemporaryDaysData = (element: any) => {
    delete (element as any).allDays;
    delete (element as any).selectedJourOptions;
    delete (element as any).selectedJours;
    delete (element as any).joursArray;
    delete (element as any).filtredJours;
    delete (element as any).jourOptions;
    delete (element as any).filteredJoursOptions;
  };

  const clearTemporarySubjectsData = (element: any) => {
    delete (element as any).selectedSubjectOptions;
    delete (element as any).selectedSubjects;
    delete (element as any).filteredSubjectsOptions;
    delete (element as any).filtredSubjects;
  };

  const onSubmitFicheVoeux = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(selectedMatieres);
      //TODO
      // formData.matieres = [];
      // for (let matiere of selectedMatieres) {
      //   formData.matieres.push(matiere._id);
      // }
      setFormData((prevState) => {
        const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
        for (let element of updatedFicheVoeux) {
          clearTemporaryDaysData(element);
          clearTemporarySubjectsData(element);
        }
        return {
          ...prevState,
          fiche_voeux_classes: updatedFicheVoeux,
        };
      });

      console.log("formData submit fiche voeux", formData);
      await createFicheVoeux(formData).unwrap();
      notify();
      navigate("/gestion-fiche-voeux/liste-fiche-voeux");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Fiche de voeux a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation fiche de voeux échoué ${error}`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const toggleSemestre = () => {
    setFormData((prevState) => {
      return {
        ...prevState,
        fiche_voeux_classes: [
          {
            matieres: [""],
            jours: [""],
            temps: "",
            classe: "",
            allDays: [],
            selectedJourOptions: [],
            selectedJours: [],
            joursArray: [],
            filtredJours: [],
            jourOptions: [],
            filteredJoursOptions: [],
            consernedClasses: [],
            selectedSubjectOptions: [],
            selectedSubjects: [],
            filteredSubjectsOptions: [],
            filtredSubjects: [],
          },
        ],

        enseignant: {
          _id: "",
          nom_fr: "",
          nom_ar: "",
          prenom_fr: "",
          prenom_ar: "",
        },
        semestre: prevState.semestre === "S1" ? "S2" : "S1",
      };
    });
  };

  // console.log("allClasses", allClasses);

  const { data: allMatieres = [] } = useFetchMatiereQuery();

  const [consernedClasses, setConsernedClasses] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [selectedMatieres, setSelectedMatieres] = useState<Matiere[]>([]);
  const [filteredOptions, setFiltredOptions] = useState<any[]>([]);

  const handleSelectChange = (selectedOptions: any, index: number) => {
    setFormData((prevState) => {
      const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
      updatedFicheVoeux[index].selectedSubjectOptions = selectedOptions;
      const matieres = selectedOptions.map((option: any) => ({
        _id: option.value,
        code_matiere: option.code_matiere,
        matiere: option.label,
        type: option.type,
        semestre: option.semestre,
        volume: option.volume,
        nbr_elimination: option.nbr_elimination,
      }));

      const uniqueMatieres: any = [
        ...updatedFicheVoeux[index].selectedSubjects,
        ...matieres,
      ].reduce((acc, current) => {
        const x = acc.find((item: any) => item._id === current._id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as Matiere[]);

      updatedFicheVoeux[index].selectedSubjects = uniqueMatieres;
      updatedFicheVoeux[index].matieres = selectedOptions.map(
        (item: any) => item.value
      );

      return {
        ...prevState,
        fiche_voeux_classes: updatedFicheVoeux,
      };
    });
  };

  /*-------------------------------------------------------------------------- */

  // const handleSelectJourChange = (selectedJourOptions: any, index: number) => {
  //   setFormData((prevState) => {
  //     const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
  //     updatedFicheVoeux[index].selectedJourOptions = selectedJourOptions;
  //     const jours: any = updatedFicheVoeux[index].selectedJourOptions.map(
  //       (option: any) => ({
  //         _id: option.value,
  //         name: option.label,
  //       })
  //     );

  //     const uniqueJours = [
  //       ...updatedFicheVoeux[index].selectedJours,
  //       ...jours,
  //     ].reduce((acc, current) => {
  //       const x = acc.find((item: any) => item._id === current._id);
  //       if (!x) {
  //         return acc.concat([current]);
  //       } else {
  //         return acc;
  //       }
  //     }, []);

  //     updatedFicheVoeux[index].selectedJours = uniqueJours;
  //     updatedFicheVoeux[index].jours = uniqueJours.map(
  //       (jour: any) => jour.name
  //     );
  //     return {
  //       ...prevState,
  //       fiche_voeux_classes: updatedFicheVoeux,
  //     };
  //   });
  // };

  /*-------------------------------------------------------------------------- */
  const handleChangeClasse = (e: any, index: number) => {
    const value = e.target.value;

    if (value !== "") {
      let exist = false;
      for (const elm of formData.fiche_voeux_classes) {
        if (elm.classe === value) {
          let consernedClass = allClasses.filter(
            (classItem) => classItem._id === value
          );
          alert(
            "Classe " +
              consernedClass[0].nom_classe_fr +
              " est déja séléctionnée!"
          );
          exist = true;
          break;
        }
      }
      if (!exist) {
        let consernedClass = allClasses.filter(
          (classItem) => classItem._id === value
        );

        const filtredMatieres = allMatieres.filter((mat) =>
          consernedClass[0]?.matieres?.some(
            (obj2) => obj2._id === mat._id && mat.semestre === formData.semestre
          )
        );

        console.log("filtredMatieres", filtredMatieres);

        let options = filtredMatieres.map((matiere) => ({
          value: matiere._id,
          label: matiere.matiere + " " + matiere.type,
          type: matiere.type,
          semestre: matiere.semestre,
          code_matiere: matiere.code_matiere,
          volume: matiere.volume,
          nbr_elimination: matiere.nbr_elimination,
        }));
        console.log("options", options);

        setFormData((prevState) => {
          const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
          updatedFicheVoeux[index].classe = value;
          updatedFicheVoeux[index].selectedSubjects = [];
          updatedFicheVoeux[index].selectedSubjectOptions = [];

          let filtredOptions: any = options.filter(
            (option) =>
              !updatedFicheVoeux[index].selectedSubjects.some(
                (matiere: any) => matiere._id === option.value
              )
          );

          updatedFicheVoeux[index].filteredSubjectsOptions = filtredOptions;
          return {
            ...prevState,
            fiche_voeux_classes: updatedFicheVoeux,
          };
        });
      }
    }
  };

  const customStyles = {
    multiValue: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
    }),
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
      color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "white",
      backgroundColor: "#4b93ff",
      ":hover": {
        backgroundColor: "#4b93ff",
        color: "white",
      },
    }),
  };

  const addNewClassLine = () => {
    let allJours: any = [
      { _id: 0, name: "Lundi" },
      { _id: 1, name: "Mardi" },
      { _id: 2, name: "Mercredi" },
      { _id: 3, name: "Jeudi" },
      { _id: 4, name: "Vendredi" },
      { _id: 5, name: "Samedi" },
    ];

    const filtredJours = allJours.map((jour: any) => jour);

    let jourOptions = filtredJours.map((jour: any) => ({
      value: jour._id,
      label: jour.name,
    }));
    let arr: any = [];
    const filteredJoursOptions = jourOptions.filter(
      (option: any) => !arr.some((jour: any) => jour === option.value)
    );

    /*---------------- Subjects selection ---------------- */
    let selectedTeacher = teachersWithoutWishCard.filter(
      (teacher:any) => teacher._id === selectedTeacherId
    );

    let classes: any;
    classes = allClasses;

    // if (selectedTeacher[0].departements?.name_fr === "Tous les départements") {
    //   classes = allClasses;
    // } else {
    //   classes = allClasses.filter(
    //     (classItem) =>
    //       classItem.departement._id === selectedTeacher[0].departements?._id
    //   );
    // }

    /*---------------- Subjects selection ---------------- */

    setFormData((prevState) => ({
      ...prevState,
      fiche_voeux_classes: [
        ...prevState.fiche_voeux_classes,
        {
          classe: "",
          jours: [],
          matieres: [],
          temps: "",
          //Temporary data for days selection
          allDays: allJours,
          selectedJourOptions: [],
          selectedJours: [],
          joursArray: [],
          filtredJours: filtredJours,
          jourOptions: jourOptions,
          filteredJoursOptions: filteredJoursOptions,
          //Temporary data for subjects selection
          consernedClasses: classes,
          selectedSubjectOptions: [],
          selectedSubjects: [],
          filteredSubjectsOptions: [],
          filtredSubjects: [],
        },
      ],
    }));
  };

  const addNewDayLine = () => {
    let jours = [...formData.jours];
    jours.push({ jour: "", temps: "" });

    setFormData((prevState) => ({
      ...prevState,
      jours: jours,
    }));
  };

  const removeClassLine = (index: number) => {
    setFormData((prevState) => {
      const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
      updatedFicheVoeux.splice(index, 1);
      return {
        ...prevState,
        fiche_voeux_classes: updatedFicheVoeux,
      };
    });
  };

  const removeDayLine = (index: number) => {
    setFormData((prevState) => {
      const updatedJours = [...prevState.jours];
      updatedJours.splice(index, 1);
      return {
        ...prevState,
        jours: updatedJours,
      };
    });
  };

  const getAvailableJours = () => {
    const allJours = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    return allJours.filter(
      (jour) => !formData.jours.some((selected: any) => selected.jour === jour)
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitFicheVoeux}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="semestre">Semestre</Form.Label>
                      <div className="form-check form-switch form-switch-lg from-switch-info">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="SwitchCheck6"
                          checked={formData.semestre === "S2"}
                          onChange={toggleSemestre}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="SwitchCheck6"
                        >
                          {formData.semestre}
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="classe">Enseignant</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="etat_compte"
                        id="etat_compte"
                        value={voeuxDetails?.enseignant?.nom_fr}
                        //onChange={handleTeacherChange}
                      >
                        <option value={voeuxDetails?.enseignant?.nom_fr}>
                          {voeuxDetails?.enseignant?.nom_fr}{" "}
                          {voeuxDetails?.enseignant?.prenom_fr}
                        </option>
                        {/* {teachersWithoutWishCard.map((enseignant) => (
                          <option key={enseignant._id} value={enseignant._id}>
                            {`${enseignant.prenom_fr} ${enseignant.nom_fr}`}
                          </option>
                        ))} */}
                      </select>
                    </div>
                  </Col>
                  <Col lg={5}>
                    {formData.fiche_voeux_classes.map((data, index) => (
                      <Row>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="classe">Classe</Form.Label>
                            <select
                              className="form-select text-muted"
                              name="classe"
                              id="classe"
                              value={formData.fiche_voeux_classes[index].classe}
                              onChange={(e) => {
                                handleChangeClasse(e, index);
                              }}
                            >
                              <option value="">Sélectionner Classe</option>
                              {data?.consernedClasses?.map((classe: any) => (
                                <option key={classe._id} value={classe._id}>
                                  {`${classe.nom_classe_fr}`}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Label
                              htmlFor="choices-multiple-remove-button"
                              className="text-muted"
                            >
                              Sélectionner Matière
                            </Form.Label>

                            <Select
                              closeMenuOnSelect={false}
                              isMulti
                              options={data.filteredSubjectsOptions}
                              value={data.selectedSubjectOptions}
                              styles={customStyles}
                              onChange={(e) => {
                                handleSelectChange(e, index);
                              }}
                            />
                          </div>
                        </Col>

                        <Col lg={2}>
                          <Button
                            className="mt-4"
                            variant="danger"
                            onClick={() => removeClassLine(index)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Row>
                      <Col lg={12}>
                        <Button
                          variant="info"
                          disabled={formData.enseignant.nom_ar === ""}
                          onClick={addNewClassLine}
                        >
                          <i
                            className="bi bi-plus"
                            style={{ fontSize: "15px" }}
                          ></i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={5}>
                    {formData.jours.map((j: any, index: any) => (
                      <Row>
                        <Col lg={5}>
                          <div className="mb-3">
                            <Form.Label
                              htmlFor="choices-multiple-remove-button"
                              className="text-muted"
                            >
                              Sélectionner Jour
                            </Form.Label>
                            <select
                              className="form-select text-muted"
                              name="temps"
                              id="temps"
                              value={j.jour}
                              onChange={(e) => {
                                handleJourChange(e, index);
                              }}
                            >
                              <option value="">---------</option>

                              <option value="Lundi">Lundi</option>
                              <option value="Mardi">Mardi</option>
                              <option value="Mercredi">Mercredi</option>
                              <option value="Jeudi">Jeudi</option>
                              <option value="Vendredi">Vendredi</option>
                              <option value="Samedi">Samedi</option>
                            </select>
                          </div>
                        </Col>

                        <Col lg={5}>
                          <div className="mb-3">
                            <Form.Label htmlFor="temps">Temps</Form.Label>
                            <select
                              className="form-select text-muted"
                              name="temps"
                              id="temps"
                              value={j.temps}
                              onChange={(e) => {
                                handleTempsChange(e, index);
                              }}
                            >
                              <option value="">---------</option>
                              <option value="Matin">Matin</option>
                              <option value="Après-midi">Après-midi</option>
                              <option value="Toute la journée">
                                Toute la journée
                              </option>
                            </select>
                          </div>
                        </Col>
                        <Col lg={2}>
                          <Button
                            className="mt-4"
                            variant="danger"
                            onClick={() => removeDayLine(index)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Row>
                      <Col lg={12}>
                        <Button
                          variant="info"
                          //disabled={formData.enseignant.nom_ar === ""}
                          onClick={addNewDayLine}
                        >
                          <i
                            className="bi bi-plus"
                            style={{ fontSize: "15px" }}
                          ></i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        tog_retourParametres();
                      }}
                    >
                      Retour
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditFicheVoeux;