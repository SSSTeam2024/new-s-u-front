import {
  useFetchClasseByIdQuery,
  useFetchClassesQuery,
} from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useFetchExamensQuery,
  useUpdateExamenMutation,
} from "features/examens/examenSlice";
import { useFetchMatiereQuery } from "features/matiere/matiere";
import { useFetchSallesQuery } from "features/salles/salles";

const ProgrammerCalendrier = () => {
  document.title = "Programmer Calendrier | ENIGA";

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const { data: AllMatieres = [] } = useFetchMatiereQuery();
  const { data: AllSalles = [] } = useFetchSallesQuery();
  const { data: AllExamens = [] } = useFetchExamensQuery();

  const [programmerCalendrier] = useUpdateExamenMutation();

  const navigate = useNavigate();
  const [nombreCopie, setNombreCopie] = useState<string>("");
  const [selectedClasse, setSelectedClasse] = useState<string>(
    "67b87c0762cf56e785f8bf2a"
  );
  const [selectedSalle, setSelectedSalle] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [selectedJour, setSelectedJour] = useState<string>("");
  const [heureDebut, setHeureDebut] = useState<string>("");
  const [heureFin, setHeureFin] = useState<string>("");
  const [availableSalles, setAvailableSalles] = useState<any[]>([]);
  const [availableEnseignants, setAvailableEnseignants] = useState<any[]>([]);

  const location = useLocation();
  const calendrierState = location.state;
  console.log("calendrierState", calendrierState);

  const [days, setDays] = useState<any[]>([]);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const tog_AddCard = () => {
    if (selectedClasse === "") {
      alert("Veuillez d'abord choisir la classe!!");
    } else {
      setShowAddCard(!showAddCard);
    }
  };

  const filterEnseignantSurveillants = () => {
    if (!selectedJour || !heureDebut || !heureFin) return [];

    const relevantGroupEnseignants = calendrierState.group_enseignant.filter(
      (group: any) => group.date.includes(selectedJour)
    );

    const relevantEnseignantIds = new Set(
      relevantGroupEnseignants.flatMap((group: any) =>
        group.enseignant.map((ens: any) => ens._id)
      )
    );

    const usedEnseignantIds = new Set<string>();
    AllExamens.forEach((exam) => {
      exam?.epreuve?.forEach((ep) => {
        if (
          ep.date === selectedJour &&
          ((ep.heure_debut <= heureFin && ep.heure_debut >= heureDebut) ||
            (ep.heure_fin >= heureDebut && ep.heure_fin <= heureFin) ||
            (ep.heure_debut <= heureDebut && ep.heure_fin >= heureFin))
        ) {
          ep.group_surveillants.forEach((surveillant: any) =>
            usedEnseignantIds.add(surveillant._id)
          );
        }
      });
    });

    return AllEnseignants.filter(
      (enseignant) =>
        relevantEnseignantIds.has(enseignant?._id!) &&
        !usedEnseignantIds.has(enseignant?._id!)
    );
  };

  useEffect(() => {
    const filteredEnseignants = filterEnseignantSurveillants();
    setAvailableEnseignants(filteredEnseignants);
  }, [selectedJour, heureDebut, heureFin, calendrierState, AllExamens]);

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  useEffect(() => {
    if (calendrierState?.period) {
      const [startDateStr, endDateStr] = calendrierState.period.split(" / ");
      const startDateParts = startDateStr.split("-").reverse();
      const endDateParts = endDateStr.split("-").reverse();

      const startDate = new Date(
        Date.UTC(
          Number(startDateParts[0]),
          Number(startDateParts[1]) - 1,
          Number(startDateParts[2])
        )
      );

      const endDate = new Date(
        Date.UTC(
          Number(endDateParts[0]),
          Number(endDateParts[1]) - 1,
          Number(endDateParts[2])
        )
      );

      const generateDays = (start: Date, end: Date) => {
        const daysArray = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
          if (currentDate.getUTCDay() !== 0) {
            daysArray.push(new Date(currentDate));
          }
          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        return daysArray;
      };

      const allDays = generateDays(startDate, endDate).map((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" });

        const epreuvesForDate =
          calendrierState.epreuve?.filter((epreuve: any) => {
            // Convert epreuve.date (DD-MM-YYYY) to YYYY-MM-DD
            const [day, month, year] = epreuve.date.split("-");
            const normalizedEpreuveDate = `${day}-${month}-${year}`;

            // Check if the epreuve belongs to the selected class
            return (
              normalizedEpreuveDate === dateStr &&
              (selectedClasse ? epreuve.classe._id === selectedClasse : true)
            );
          }) || [];

        return {
          date: dateStr,
          day: dayName,
          epreuve: epreuvesForDate,
        };
      });

      setDays(allDays);
    }
  }, [calendrierState, selectedClasse]);

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const ids = selectedOption.map((option: any) => option.value._id);
    setSelectedColumnValues(ids);
  };

  const [selectedEnseignantSurveillant, setSelectedEnseignantSurveillant] =
    useState<any[]>([]);

  const handleSelectEnseignantSurveillantChange = (selectedOption: any) => {
    const ids = selectedOption.map((option: any) => option.value._id);
    setSelectedEnseignantSurveillant(ids);
  };

  //console.log("availableEnseignants", availableEnseignants);
  const optionColumnsTable = availableEnseignants.map((enseignant: any) => ({
    value: enseignant,
    label: `${enseignant.prenom_fr} ${enseignant.nom_fr}`,
  }));

  const optionEnseignantResponsables = AllEnseignants.map(
    (enseignant: any) => ({
      value: enseignant,
      label: `${enseignant.prenom_fr} ${enseignant.nom_fr}`,
    })
  );

  const handleNombreCopie = (e: any) => {
    setNombreCopie(e.target.value);
  };

  const handleSelectSalle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSalle(value);
  };

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const handleSelectJour = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedJour(value);
  };

  const handleHeureDebutChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newHeureDebut = event.target.value;

    if (selectedClasse && selectedJour) {
      const conflict = AllExamens.some((examen) =>
        examen?.epreuve?.some((epreuve) => {
          if (
            epreuve?.classe?._id === selectedClasse &&
            epreuve.date === selectedJour
          ) {
            const existingStart = epreuve.heure_debut;
            const existingEnd = epreuve.heure_fin;
            const newStart = newHeureDebut;
            return newStart >= existingStart && newStart < existingEnd;
          }

          return false;
        })
      );
      console.log("conflict", conflict);
      if (conflict) {
        alert("Cette classe a déjà un examen prévu à l'heure sélectionnée");
        return;
      }
    }
    setHeureDebut(newHeureDebut);
  };

  const handleHeureFinChange = (e: any) => {
    const selectedHeureFin = e.target.value;

    if (
      new Date(`1970-01-01T${selectedHeureFin}:00`) <=
      new Date(`1970-01-01T${heureDebut}:00`)
    ) {
      alert("Cette classe a déjà un examen prévu à l'heure sélectionnée.");
      setHeureFin("");
      return;
    }

    const conflict = AllExamens.some((examen) =>
      examen?.epreuve?.some((epreuve) => {
        if (
          epreuve?.classe?._id === selectedClasse &&
          epreuve.date === selectedJour
        ) {
          const existingStart = epreuve.heure_debut;
          const existingEnd = epreuve.heure_fin;
          return (
            (heureDebut >= existingStart && heureDebut < existingEnd) ||
            (selectedHeureFin > existingStart &&
              selectedHeureFin <= existingEnd) ||
            (heureDebut <= existingStart && selectedHeureFin >= existingEnd)
          );
        }

        return false;
      })
    );
    if (conflict) {
      alert("Cette classe a déjà un examen prévu à l'heure sélectionnée.");
      setHeureFin("");
    } else {
      setHeureFin(selectedHeureFin);
    }
  };
  const {
    data: OneClasse,
    error,
    isLoading,
  } = useFetchClasseByIdQuery(selectedClasse, {
    skip: !selectedClasse,
  });

  const extractSubjectsBasedOnSemester = (classe: any) => {
    let filtredMatieres: any = [];
    console.log("classe", classe);
    if (OneClasse !== undefined) {
      for (let module of classe?.parcours?.modules!) {
        if (calendrierState?.semestre! === "S1") {
          if (module?.semestre_module! === classe?.semestres[0]!) {
            filtredMatieres = filtredMatieres.concat(module?.matiere!);
          }
        } else {
          if (module?.semestre_module! === classe?.semestres[1]!) {
            filtredMatieres = filtredMatieres.concat(module?.matiere!);
          }
        }
      }
    }

    return filtredMatieres;
  };

  let filtredMatieres: any = extractSubjectsBasedOnSemester(OneClasse);
  console.log("filtredMatieres", filtredMatieres);
  const filteredMat = filtredMatieres.filter(
    (mat: any) =>
      (calendrierState?.type_examen! === "EXAMEN" &&
        mat.regime_matiere === "MX") ||
      (calendrierState?.type_examen! === "Examens" &&
        mat.regime_matiere === "MX") ||
      (calendrierState?.type_examen! === "Examens" &&
        mat.regime_matiere === "Mx") ||
      (calendrierState?.type_examen! === "DS" && mat.regime_matiere === "CC") ||
      (calendrierState?.type_examen! === "DS" && mat.regime_matiere === "MX") ||
      (calendrierState?.type_examen! === "DS" && mat.regime_matiere === "Mx") ||
      (calendrierState?.type_examen! === "Examens" &&
        mat.regime_matiere === "Ex")

    //   // const isMatchingClasse = matiere?.classes!.some(
    //   //   (classe) =>
    //   //     classe._id === selectedClasse || classe.nom_classe_fr === selectedClasse
    //   // );
    //   // console.log("isMatchingClasse", isMatchingClasse);
    //   // const isNotAlreadyExamined = !calendrierState.epreuve.some(
    //   //   (epreuve: any) => {
    //   //     return (
    //   //       epreuve?.matiere?._id! === matiere?._id! &&
    //   //       epreuve?.classe?._id! === selectedClasse
    //   //     );
    //   //   }
    //   // );
  );

  console.log("filteredMat***", filteredMat);

  const filterAvailableSalles = () => {
    if (!selectedJour || !heureDebut || !heureFin) return AllSalles;

    // Get existing epreuves for the selected date
    // const conflictingEpreuves = calendrierState?.epreuve?.filter(
    //   (epreuve: any) => {
    //     return (
    //       epreuve.date === selectedJour &&
    //       // Check if the time range overlaps
    //       ((heureDebut >= epreuve.heure_debut &&
    //         heureDebut < epreuve.heure_fin) ||
    //         (heureFin > epreuve.heure_debut && heureFin <= epreuve.heure_fin) ||
    //         (heureDebut <= epreuve.heure_debut &&
    //           heureFin >= epreuve.heure_fin))
    //     );
    //   }
    // );

    // const usedSalles = calendrierState.epreuve.map(
    //   (epreuve: any) => epreuve.salle?._id
    // );

    console.log("selectedJour", selectedJour);
    console.log("heureDebut", heureDebut);
    console.log("heureFin", heureFin);

    const examCalendarsAtSelectedSemester = AllExamens.filter(
      (ec) => ec.semestre === calendrierState.semestre
    );

    let epreuvesAtSelectedDay: any = [];

    for (const examCalendar of examCalendarsAtSelectedSemester) {
      const epreuvesAtSelectedDayRef = examCalendar?.epreuve?.filter(
        (e: any) => e.date === selectedJour
      );

      epreuvesAtSelectedDay = epreuvesAtSelectedDay.concat(
        epreuvesAtSelectedDayRef
      );
    }

    console.log("epreuvesAtSelectedDay", epreuvesAtSelectedDay);

    let conflictingEpreuves = epreuvesAtSelectedDay.filter(
      (e: any) =>
        (e.heure_debut < heureDebut &&
          e.heure_fin > heureDebut &&
          e.heure_fin < heureFin) ||
        (e.heure_debut === heureDebut && e.heure_fin === heureFin) ||
        (e.heure_debut > heureDebut &&
          e.heure_debut < heureFin &&
          e.heure_fin > heureFin) ||
        (e.heure_debut === heureDebut && e.heure_fin < heureFin) ||
        (e.heure_debut > heureDebut && e.heure_fin === heureFin) ||
        (e.heure_debut > heureDebut && e.heure_fin < heureFin) ||
        (e.heure_debut < heureDebut && e.heure_fin > heureFin) ||
        (e.heure_debut === heureDebut && e.heure_fin > heureFin) ||
        (e.heure_debut < heureDebut && e.heure_fin === heureFin)
    );

    const usedSalles = conflictingEpreuves.map(
      (epreuve: any) => epreuve.salle?._id
    );

    return AllSalles.filter((salle) => !usedSalles.includes(salle._id));
  };

  useEffect(() => {
    setAvailableSalles(filterAvailableSalles());
  }, [selectedJour, heureDebut, heureFin, calendrierState]);

  const [updatedEpreuve, setUpdatedEpreuve] = useState(
    calendrierState?.epreuve!
  );

  const handleSubmit = async () => {
    try {
      const newEpreuve = {
        group_surveillants: selectedEnseignantSurveillant,
        group_responsables: selectedColumnValues,
        nbr_copie: nombreCopie,
        date: selectedJour,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        salle: selectedSalle,
        matiere: selectedMatiere,
        classe: selectedClasse,
      };

      const examenToUpdate = {
        ...calendrierState,
        epreuve: [...updatedEpreuve, newEpreuve],
      };

      await programmerCalendrier(examenToUpdate);
      alert("Epreuve a été ajouté avec succès!");

      setNombreCopie("");
      setSelectedClasse("");
      setSelectedSalle("");
      setSelectedMatiere("");
      setSelectedJour("");
      setHeureDebut("");
      setHeureFin("");
      navigate("/gestion-examen/liste-des-calendrier");
    } catch (error) {
      console.error("Failed to update Examen:", error);
      alert("Failed to update Examen.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card>
            <Card.Body>
              <Row>
                <Col lg={3}>
                  <div className="vstack gap-2">
                    <h5>A.U: {calendrierState?.annee_universitaire!}</h5>
                  </div>
                </Col>
                <Col>
                  <div className="vstack gap-1">
                    <h4 className="text-center">
                      Calendrier des {calendrierState?.type_examen!}{" "}
                      {calendrierState?.semestre!}{" "}
                      {calendrierState?.type_examen! === "Examens" ||
                        (calendrierState?.type_examen! === "EXAMEN" && (
                          <span>Session {calendrierState?.session!}</span>
                        ))}
                    </h4>
                    <h5 className="text-muted text-center">
                      Période: {calendrierState?.period!}
                    </h5>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Row className="mb-3">
              <Col lg={1}>
                <Form.Label>Classe: </Form.Label>
              </Col>
              <Col lg={3}>
                <select className="form-select" onChange={handleSelectClasse}>
                  <option value="">Choisir ...</option>
                  {AllClasses.map((classe) => (
                    <option value={classe?._id!} key={classe?._id!}>
                      {classe?.nom_classe_fr}
                    </option>
                  ))}
                </select>
              </Col>
              <Col>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={tog_AddCard}
                >
                  Ajouter Epreuve
                </button>
              </Col>
            </Row>
            {showAddCard && (
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <Form.Label>Jour </Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectJour}
                      >
                        <option value="">Choisir ...</option>
                        {days.map(({ date, day }) => (
                          <option key={day} value={date}>
                            {day.charAt(0).toUpperCase() + day.slice(1)} {date}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col>
                      <Form.Label htmlFor="heure_debut">Heure Début</Form.Label>
                      <input
                        type="time"
                        className="form-control"
                        value={heureDebut}
                        onChange={handleHeureDebutChange}
                      />
                    </Col>
                    <Col>
                      <Form.Label htmlFor="heure_fin">Heure Fin</Form.Label>
                      <input
                        type="time"
                        className="form-control"
                        value={heureFin}
                        onChange={handleHeureFinChange}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Matière: </Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectMatiere}
                      >
                        <option value="">Choisir ...</option>
                        {filteredMat.map((matiere: any) => (
                          <option value={matiere?._id!} key={matiere?._id!}>
                            {matiere?.matiere!}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col>
                      <Form.Label htmlFor="salle">Salle</Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectSalle}
                      >
                        <option value="">Choisir ...</option>
                        {availableSalles.map((salle) => (
                          <option value={salle?._id!} key={salle?._id!}>
                            {salle?.salle!}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={3}>
                      <Form.Label>Nombre de copie livré: </Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        value={nombreCopie}
                        onChange={handleNombreCopie}
                      />
                    </Col>
                    <Col>
                      <Form.Label htmlFor="enseignant_responsable">
                        Enseignant(s) Responsable
                      </Form.Label>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionEnseignantResponsables}
                        onChange={handleSelectValueColumnChange}
                      />
                    </Col>
                    <Col>
                      <Form.Label htmlFor="enseignant_surveillant">
                        Enseignant(s) Surveillant
                      </Form.Label>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionColumnsTable}
                        onChange={handleSelectEnseignantSurveillantChange}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-info"
                        // onClick={tog_AddCard}
                      >
                        Ajouter
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Form>
          {selectedClasse !== "" && (
            <Row>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-bordered table-striped w-100">
                  <tbody>
                    {days.map(({ date, day, epreuve }) => {
                      const hasExams = epreuve.length > 0;

                      return (
                        <tr key={date}>
                          <td
                            className="py-3 px-4 fw-bold text-center bg-light"
                            rowSpan={1}
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)} {date}
                          </td>
                          {hasExams ? (
                            epreuve.map((exam: any, index: any) => (
                              <td key={index} className="py-3 px-4 text-center">
                                <ul className="list-unstyled mb-0">
                                  <li>
                                    <strong>
                                      {exam.matiere?.matiere ||
                                        "Matière inconnue"}
                                    </strong>
                                    <br />
                                    {exam.heure_debut} - {exam.heure_fin}
                                    <br />
                                    Salle:{" "}
                                    {exam.salle?.salle || "Non attribuée"}
                                  </li>
                                </ul>
                              </td>
                            ))
                          ) : (
                            <td className="py-3 px-4 text-center">
                              <em className="text-muted">Pas de épreuves</em>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProgrammerCalendrier;
