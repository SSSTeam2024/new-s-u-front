import { useFetchClassesQuery } from "features/classe/classe";
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
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedSalle, setSelectedSalle] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [selectedJour, setSelectedJour] = useState<string>("");
  const [heureDebut, setHeureDebut] = useState<string>("");
  const [heureFin, setHeureFin] = useState<string>("");
  const [availableSalles, setAvailableSalles] = useState<any[]>([]);

  const location = useLocation();
  const calendrierState = location.state;

  const [days, setDays] = useState<any[]>([]);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const tog_AddCard = () => {
    if (selectedClasse === "") {
      alert("Veuillez d'abord choisir la classe!!");
    } else {
      setShowAddCard(!showAddCard);
    }
  };

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
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const optionColumnsTable = calendrierState
    ?.group_enseignant!.flatMap((group: any) => group.enseignant)
    .map((enseignantId: any) => ({
      value: enseignantId,
      label: `${enseignantId.prenom_fr} ${enseignantId.nom_fr}`,
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
    console.log(event.target.value);
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
        examen.epreuve.some((epreuve) => {
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
      if (conflict) {
        alert("Cette classe a déjà un examen prévu à l'heure sélectionnée");
        return;
      }
    }
    setHeureDebut(newHeureDebut);
  };

  const handleHeureFinChange = (e: any) => {
    const selectedHeureFin = e.target.value;

    // Validate that the selected heure_fin is greater than the heure_debut
    if (
      new Date(`1970-01-01T${selectedHeureFin}:00`) <=
      new Date(`1970-01-01T${heureDebut}:00`)
    ) {
      alert("Cette classe a déjà un examen prévu à l'heure sélectionnée.");
      setHeureFin(""); // Reset the value
      return;
    }

    // Check for conflicts with existing exams
    const conflict = AllExamens.some((examen) =>
      examen.epreuve.some((epreuve) => {
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

  const filteredMatieres = AllMatieres.filter((matiere) => {
    // Match the semestre
    const isSameSemestre = matiere.semestre === calendrierState?.semestre!;
    // Check the regime_matiere based on type_examen
    //! It will be changed to Examens
    const isMatchingRegimeMatiere =
      (calendrierState?.type_examen! === "EXAMEN" &&
        matiere.regime_matiere === "MX") ||
      (calendrierState?.type_examen! === "Examens" &&
        matiere.regime_matiere === "MX") ||
      (calendrierState?.type_examen! === "DS" &&
        matiere.regime_matiere === "CC");
    const isMatchingClasse = matiere?.classes!.some(
      (classe) =>
        classe._id === selectedClasse || classe.nom_classe_fr === selectedClasse
    );
    const isNotAlreadyExamined = !calendrierState?.epreuve?.some(
      (epreuve: any) => {
        return (
          epreuve?.matiere?._id! === matiere?._id! &&
          epreuve?.classe?._id! === selectedClasse
        );
      }
    );

    return (
      isSameSemestre &&
      isMatchingRegimeMatiere &&
      isMatchingClasse &&
      isNotAlreadyExamined
    );
  });

  // Function to filter available salles
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

    const usedSalles = calendrierState.epreuve.map(
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
        group_surveillants: [],
        group_responsables: [],
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
                        {filteredMatieres.map((matiere) => (
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
                      <Form.Label htmlFor="salle">
                        Enseignant(s) Responsable
                      </Form.Label>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionEnseignantResponsables}
                      />
                    </Col>
                    <Col>
                      <Form.Label htmlFor="salle">
                        Enseignant(s) Surveillant
                      </Form.Label>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionColumnsTable}
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
