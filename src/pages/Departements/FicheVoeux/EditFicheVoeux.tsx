import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { Matiere, useFetchMatiereQuery } from "features/matiere/matiere";
import {
  useAddFicheVoeuxMutation,
  useFetchFicheVoeuxsQuery,
  useUpdateFicheVoeuxMutation,
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
  document.title = "Modifier fiche de voeux | ENIGA";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/gestion-emplois/gestion-fiche-voeux/liste-fiche-voeux");
  }

  const { data: allClasses = [], isSuccess: allClassesLoaded } =
    useFetchClassesQuery();

  const location = useLocation();
  const voeuxDetails = location.state;

  const { data: subjects = [], isSuccess: subjectsLoaded } =
    useFetchMatiereQuery();

  const { data: allTeachers = [] } = useFetchEnseignantsQuery();
  const { data: allVoeux = [], isSuccess: allVoeuxLoaded } =
    useFetchFicheVoeuxsQuery();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const [formData, setFormData] = useState({
    _id: "",
    fiche_voeux_classes: [
      {
        matieres: "",
        classe: [
          {
            subject_id: "",
            class_id: "",
          },
        ],
        //Temporary data for subjects selection
        consernedClasses: [],
        selectedClasseOptions: [],
        selectedClasses: [],
        filteredClassesOptions: [],
        filtredClasses: [],
        selectionDisabled: true,
      },
    ],
    jours: [
      {
        jour: "",
        temps: "",
      },
    ],
    enseignant: {
      _id: "",
      nom_fr: "",
      nom_ar: "",
      prenom_fr: "",
      prenom_ar: "",
    },
    semestre: "S1",
    remarque: "",
  });

  const [cleanSubjectsBySemester, setCleanSubjectsBySemester] = useState<
    Matiere[]
  >([]);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string[]>([""]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[][]>([[]]);
  const [showSuggestions, setShowSuggestions] = useState<boolean[]>([false]);

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
    fiche_index: number
  ) => {
    console.log(selectedTeacherId);
    console.log(cleanSubjectsBySemester);
    const query = e.target.value.toLowerCase();
    let searchTermRef = [...searchTerm];
    searchTermRef[fiche_index] = query;
    setSearchTerm(searchTermRef);

    if (query.length > 0) {
      const results = cleanSubjectsBySemester.filter((subject) =>
        subject?.matiere!.toLowerCase().includes(query)
      );
      let filteredSubjectsRef = [...filteredSubjects];
      filteredSubjectsRef[fiche_index] = results;
      setFilteredSubjects(filteredSubjectsRef);
      let showSuggestionsRef = [...showSuggestions];
      showSuggestionsRef[fiche_index] = true;
      setShowSuggestions(showSuggestionsRef);
    } else {
      let filteredSubjectsRef = [...filteredSubjects];
      filteredSubjectsRef[fiche_index] = [];
      setFilteredSubjects(filteredSubjectsRef);
      let showSuggestionsRef = [...showSuggestions];
      showSuggestionsRef[fiche_index] = false;
      setShowSuggestions(showSuggestionsRef);
    }

    setFormData((prevState) => {
      let updatedFicheVoeux = [...prevState.fiche_voeux_classes];
      updatedFicheVoeux[fiche_index].selectionDisabled = false;
      updatedFicheVoeux[fiche_index].selectedClasseOptions = [];
      return {
        ...prevState,
        fiche_voeux_classes: updatedFicheVoeux,
      };
    });
  };

  useEffect(() => {
    if (allClassesLoaded && subjectsLoaded && !hasProcessed) {
      const subjectsBySemester = subjects
        .filter(
          (subject) =>
            subject.semestre !== undefined &&
            Number(subject.semestre[1]) % 2 !== 0
        )
        .filter(
          (subject, index, self) =>
            index ===
            self.findIndex(
              (s) =>
                s.matiere === subject.matiere &&
                s.types[0].type === subject.types[0].type
            )
        );

      let listeVouex: any[] = [];
      let searchTermRef = [];
      let filteredSubjectsRef = [];
      let showSuggestionsRef = [];

      for (const voeux of voeuxDetails.fiche_voeux_classes) {
        //************************CONSERNED CLASSES LIST */

        searchTermRef.push(voeux.matieres);
        filteredSubjectsRef.push([]);
        showSuggestionsRef.push(false);

        //*Step 1: Filter all classes based on subject semester and class semesters (Could be S1 or S2)
        const filteredClassesBySubjectSemester = allClasses.filter(
          (c) =>
            c.semestres[0] === voeux?.classe[0]?.subject_id?.semestre ||
            c.semestres[1] === voeux?.classe[0]?.subject_id?.semestre
        );
        console.log("Step1 classes", filteredClassesBySubjectSemester);

        //*Step 2: Filter from the above result all classes based on subject semester module semester and subject id
        let fileteredClasses = [];
        for (const classElement of filteredClassesBySubjectSemester) {
          let modules = classElement.parcours.modules.filter(
            (m: any) =>
              m.semestre_module === voeux?.classe[0]?.subject_id?.semestre
          );
          if (modules.length > 0) {
            const subjects = modules.map((module: any) => {
              let subjectsResult = module.matiere.filter(
                (m: any) => m.matiere === voeux?.classe[0]?.subject_id?.matiere!
              );
              return subjectsResult;
            });
            console.log("subjects", subjects);
            const validSubjects = subjects.filter(
              (subjectArray: any) => subjectArray.length > 0
            );
            if (validSubjects.length > 0) {
              console.log("classElement", classElement);
              fileteredClasses.push(classElement);
            }
          }
        }

        console.log("Step2 classes", fileteredClasses);

        let options = fileteredClasses.map((classe: any) => ({
          value: classe?._id!,
          label: classe?.nom_classe_fr!,
        }));

        //************************CONSERNED CLASSES LIST */

        //************************SELECTED CLASSES LIST */

        const classes_options = voeux.classe.map((classe: any) => ({
          _id: classe.class_id._id,
          label: classe.class_id.nom_classe_fr,
        }));

        const classes = voeux.classe.map((classe: any) => ({
          class_id: classe.class_id._id,
          subject_id: classe.subject_id._id,
        }));

        //************************SELECTED CLASSES LIST */

        listeVouex.push({
          matieres: voeux.matieres,
          classe: classes,
          //Temporary data for subjects selection
          consernedClasses: [],
          selectedClasseOptions: classes_options,
          selectedClasses: [],
          filteredClassesOptions: options,
          filtredClasses: [],
          selectionDisabled: true,
        });
      }

      setFormData((prevState) => {
        let updatedFicheVoeux = [...prevState.fiche_voeux_classes];
        updatedFicheVoeux = listeVouex;
        return {
          ...prevState,
          _id: voeuxDetails._id,
          fiche_voeux_classes: updatedFicheVoeux,
          enseignant: voeuxDetails.enseignant,
          jours: voeuxDetails.jours,
          remarque: voeuxDetails.remarque,
          semestre: voeuxDetails.semestre,
        };
      });

      setSearchTerm(searchTermRef);
      setFilteredSubjects(filteredSubjectsRef);
      setShowSuggestions(showSuggestionsRef);

      setCleanSubjectsBySemester(subjectsBySemester);
      setHasProcessed(true);
    }
  }, [
    subjects,
    hasProcessed,
    searchTerm,
    filteredSubjects,
    showSuggestions,
    allClasses,
  ]);

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

  const [updateFicheVoeux] = useUpdateFicheVoeuxMutation();

  const clearTemporaryDaysData = (element: any) => {
    delete (element as any).allDays;
    delete (element as any).selectedJourOptions;
    delete (element as any).selectedJours;
    delete (element as any).joursArray;
    delete (element as any).filtredJours;
    delete (element as any).jourOptions;
    delete (element as any).filteredJoursOptions;
  };

  const clearTemporaryClassesData = (element: any) => {
    delete (element as any).selectedClasseOptions;
    delete (element as any).selectedClasses;
    delete (element as any).filteredClassesOptions;
    delete (element as any).filtredClasses;
    delete (element as any).consernedClasses;
  };

  const onSubmitFicheVoeux = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFormData((prevState) => {
        const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
        for (let element of updatedFicheVoeux) {
          clearTemporaryDaysData(element);
          clearTemporaryClassesData(element);
        }
        return {
          ...prevState,
          fiche_voeux_classes: updatedFicheVoeux,
        };
      });

      console.log(formData);

      await updateFicheVoeux(formData).unwrap();
      notify();
      navigate("/gestion-emplois/gestion-fiche-voeux/liste-fiche-voeux");
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

  const handleSelectChange = (selectedOptions: any, index: number) => {
    console.log("selectedOptions", selectedOptions);
    setFormData((prevState) => {
      const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
      updatedFicheVoeux[index].selectedClasseOptions = selectedOptions;

      const classes = selectedOptions.map((option: any) => ({
        _id: option.value,
        label: option.nom_classe_fr,
      }));

      // const uniqueClasses: any = [
      //   ...updatedFicheVoeux[index].selectedClasses,
      //   ...classes,
      // ].reduce((acc, current) => {
      //   const x = acc.find((item: any) => item._id === current._id);
      //   if (!x) {
      //     return acc.concat([current]);
      //   } else {
      //     return acc;
      //   }
      // }, [] as Matiere[]);

      // updatedFicheVoeux[index].selectedClasses = uniqueClasses;
      updatedFicheVoeux[index].classe = selectedOptions.map((item: any) => {
        let classElement = allClasses.filter((c) => c._id === item.value);

        let modules = classElement[0].parcours.modules;
        if (modules.length > 0) {
          const subjects = modules.map((module: any) => {
            let subjectsResult = module.matiere.filter(
              (m: any) =>
                m.matiere + " " + m.types[0].type ===
                updatedFicheVoeux[index].matieres
            );
            return subjectsResult;
          });

          const validSubjects = subjects.filter(
            (subjectArray: any) => subjectArray.length > 0
          );

          return {
            class_id: item.value,
            subject_id: validSubjects[0][0]._id,
          };
        }
      });

      console.log(
        "handleSelectChange Class updatedFicheVoeux",
        updatedFicheVoeux
      );

      return {
        ...prevState,
        fiche_voeux_classes: updatedFicheVoeux,
      };
    });
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

    setFormData((prevState) => ({
      ...prevState,
      fiche_voeux_classes: [
        ...prevState.fiche_voeux_classes,
        {
          classe: [],
          jours: [],
          matieres: "",
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
          consernedClasses: [],
          selectedClasseOptions: [],
          selectedClasses: [],
          filteredClassesOptions: [],
          filtredClasses: [],
          selectionDisabled: false,
        },
      ],
    }));

    let searchTermRef = [...searchTerm];
    console.log(searchTermRef);
    searchTermRef.push("");
    setSearchTerm(searchTermRef);

    let filteredSubjectsRef = [...filteredSubjects];
    console.log(filteredSubjectsRef);
    filteredSubjectsRef.push([]);
    setFilteredSubjects(filteredSubjectsRef);

    let showSuggestionsRef = [...showSuggestions];
    console.log(showSuggestionsRef);
    showSuggestionsRef.push(false);
    setShowSuggestions(showSuggestionsRef);
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

    let searchTermRef = [...searchTerm];
    console.log(searchTermRef);
    searchTermRef.splice(index, 1);
    setSearchTerm(searchTermRef);

    let filteredSubjectsRef = [...filteredSubjects];
    console.log(filteredSubjectsRef);
    filteredSubjectsRef.splice(index, 1);
    setFilteredSubjects(filteredSubjectsRef);

    let showSuggestionsRef = [...showSuggestions];
    console.log(showSuggestionsRef);
    showSuggestionsRef.splice(index, 1);
    setShowSuggestions(showSuggestionsRef);
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
      (jour) => !formData.jours.some((selected) => selected.jour === jour)
    );
  };

  const handleSelectSubject = (subject: any, index: number) => {
    let searchTermRef = [...searchTerm];
    searchTermRef[index] = subject?.matiere! + " " + subject?.types[0].type;
    setSearchTerm(searchTermRef);

    let filteredSubjectsRef = [...filteredSubjects];
    filteredSubjectsRef[index] = [];
    setFilteredSubjects(filteredSubjectsRef);

    let showSuggestionsRef = [...showSuggestions];
    showSuggestionsRef[index] = false;
    setShowSuggestions(showSuggestionsRef);

    console.log(subject);
    console.log(allClasses);

    //*Step 1: Filter all classes based on subject semester and class semesters (Could be S1 or S2)
    const filteredClassesBySubjectSemester = allClasses.filter(
      (c) =>
        c.semestres[0] === subject.semestre ||
        c.semestres[1] === subject.semestre
    );
    console.log("Step1 classes", filteredClassesBySubjectSemester);

    //*Step 2: Filter from the above result all classes based on subject semester module semester and subject id
    let fileteredClasses = [];
    for (const classElement of filteredClassesBySubjectSemester) {
      let modules = classElement.parcours.modules.filter(
        (m: any) => m.semestre_module === subject.semestre
      );
      if (modules.length > 0) {
        const subjects = modules.map((module: any) => {
          let subjectsResult = module.matiere.filter(
            (m: any) => m.matiere === subject.matiere
          );
          return subjectsResult;
        });
        console.log("subjects", subjects);
        const validSubjects = subjects.filter(
          (subjectArray: any) => subjectArray.length > 0
        );
        if (validSubjects.length > 0) {
          console.log("classElement", classElement);
          fileteredClasses.push(classElement);
        }
      }
    }

    console.log("Step2 classes", fileteredClasses);

    let options = fileteredClasses.map((classe: any) => ({
      value: classe?._id!,
      label: classe?.nom_classe_fr!,
    }));

    setFormData((prevState) => {
      const updatedFicheVoeux = [...prevState.fiche_voeux_classes];
      updatedFicheVoeux[index].classe = [];
      updatedFicheVoeux[index].selectedClasses = [];
      updatedFicheVoeux[index].selectedClasseOptions = [];
      updatedFicheVoeux[index].matieres =
        subject.matiere + " " + subject.types[0].type;

      let filtredOptions: any = options.filter(
        (option: any) =>
          !updatedFicheVoeux[index].selectedClasses.some(
            (classe: any) => classe._id === option.value
          )
      );

      console.log("filtredOptions", filtredOptions);

      updatedFicheVoeux[index].filteredClassesOptions = filtredOptions;
      return {
        ...prevState,
        fiche_voeux_classes: updatedFicheVoeux,
      };
    });
  };

  const onChangeObservation = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      remarque: value,
    }));
  };

  const resetClassSelection = (fiche_index: number) => {
    setFormData((prevState) => {
      let updatedFicheVoeux = [...prevState.fiche_voeux_classes];
      updatedFicheVoeux[fiche_index].selectionDisabled = false;
      updatedFicheVoeux[fiche_index].selectedClasseOptions = [];
      return {
        ...prevState,
        fiche_voeux_classes: updatedFicheVoeux,
      };
    });
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
                  <Col lg={12}>
                    <div className="mb-3 text-center">
                      <h2>
                        Fiche de Voeux - {voeuxDetails.enseignant.prenom_fr}{" "}
                        {voeuxDetails.enseignant.nom_fr} -{" "}
                        {voeuxDetails.semestre}
                      </h2>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={7}>
                    {formData.fiche_voeux_classes.map((data, fiche_index) => (
                      <Row>
                        <Col lg={5}>
                          <div className="position-relative">
                            <Form.Label className="text-muted">
                              Matière
                            </Form.Label>
                            <Form.Control
                              placeholder="Chercher matière..."
                              type="text"
                              dir="ltr"
                              spellCheck={false}
                              autoComplete="off"
                              autoCapitalize="off"
                              value={searchTerm[fiche_index]}
                              onChange={(e: any) =>
                                handleSearch(e, fiche_index)
                              }
                              onFocus={() => {
                                let showSuggestionsRef = [...showSuggestions];
                                showSuggestionsRef[fiche_index] = true;
                                setShowSuggestions(showSuggestionsRef);
                              }}
                            />
                            {showSuggestions[fiche_index] &&
                              filteredSubjects[fiche_index]?.length > 0 && (
                                <ListGroup className="mt-2 w-100 shadow">
                                  {filteredSubjects[fiche_index]?.map(
                                    (subject, index) => (
                                      <ListGroup.Item
                                        key={index}
                                        action
                                        onClick={() =>
                                          handleSelectSubject(
                                            subject,
                                            fiche_index
                                          )
                                        }
                                      >
                                        {subject?.matiere! +
                                          " " +
                                          subject.types[0].type}
                                      </ListGroup.Item>
                                    )
                                  )}
                                </ListGroup>
                              )}
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="mb-3">
                            <Form.Label
                              htmlFor="choices-multiple-remove-button"
                              className="text-muted"
                            >
                              Sélectionner Classe
                            </Form.Label>

                            <Select
                              closeMenuOnSelect={false}
                              isMulti
                              options={data.filteredClassesOptions}
                              value={data.selectedClasseOptions}
                              styles={customStyles}
                              isDisabled={data.selectionDisabled}
                              onChange={(e) => {
                                handleSelectChange(e, fiche_index);
                              }}
                            />
                          </div>
                        </Col>
                        {/* <Col lg={6}>
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
                        </Col> */}

                        <Col lg={2}>
                          <Button
                            className="mt-4"
                            style={{ marginRight: "5px" }}
                            variant="warning"
                            disabled={!data.selectionDisabled}
                            onClick={() => resetClassSelection(fiche_index)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Button>
                          <Button
                            className="mt-4"
                            variant="danger"
                            onClick={() => removeClassLine(fiche_index)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Row>
                      <Col lg={12} className="text-end">
                        <Button
                          variant="info"
                          disabled={formData.enseignant.nom_ar === ""}
                          onClick={addNewClassLine}
                          style={{ marginRight: "20%" }}
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
                    {formData.jours.map((j, index) => (
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
                        <Button variant="info" onClick={addNewDayLine}>
                          <i
                            className="bi bi-plus"
                            style={{ fontSize: "15px" }}
                          ></i>
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={8}>
                        <div>
                          <label className="form-label">Remarque</label>
                          <textarea
                            onChange={onChangeObservation}
                            value={formData.remarque}
                            className="form-control"
                            id="exampleFormControlTextarea5"
                            rows={3}
                          ></textarea>
                        </div>
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
                      Modifier
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
