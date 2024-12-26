import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useLocation } from "react-router-dom";

const ProgrammerCalendrier = () => {
  document.title = "Programmer Calendrier | ENIGA";

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const location = useLocation();
  const calendrierState = location.state;

  const [days, setDays] = useState<any[]>([]);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const tog_AddCard = () => {
    setShowAddCard(!showAddCard);
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
            const normalizedEpreuveDate = `${year}-${month}-${day}`;
            return normalizedEpreuveDate === dateStr;
          }) || [];

        return {
          date: dateStr,
          day: dayName,
          epreuve: epreuvesForDate,
        };
      });

      setDays(allDays);
    }
  }, [calendrierState]);

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const optionColumnsTable = calendrierState.group_enseignant
    .flatMap((group: any) => group.enseignant)
    .map((enseignantId: any) => ({
      value: enseignantId,
      label: `${enseignantId.prenom_fr} ${enseignantId.nom_fr}`,
    }));

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <div className="vstack gap-2">
                    <h3>{calendrierState.annee_universitaire}</h3>
                    <h3>Semestre : {calendrierState.semestre}</h3>
                  </div>
                </Col>
                <Col>
                  <h3>Calendrier: {calendrierState.period}</h3>
                </Col>
                <Col className="text-end">
                  <div className="vstack gap-2">
                    <h3>Type : {calendrierState.type_examen}</h3>
                    {calendrierState.type_examen === "Examen" && (
                      <h3>Session : {calendrierState.session}</h3>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row className="mb-3">
            <Col lg={1}>
              <Form.Label>Classe: </Form.Label>
            </Col>
            <Col lg={3}>
              <select className="form-select">
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
                    <Form.Label>Nombre de copie livré: </Form.Label>
                    <input type="text" className="form-control" />
                  </Col>
                  <Col>
                    <Form.Label>Matière: </Form.Label>
                    <select className="form-select">
                      <option value="">Choisir ...</option>
                      {AllClasses.map((classe) => (
                        <option value={classe._id} key={classe._id}>
                          {classe.nom_classe_fr}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col>
                    <Form.Label>Jour: </Form.Label>
                    <select className="form-select">
                      <option value="">Choisir ...</option>
                      {days.map(({ date, day }) => (
                        <option key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)} {date}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Label htmlFor="heure_debut">Heure Début</Form.Label>
                    <input type="time" className="form-control" />
                  </Col>
                  <Col>
                    <Form.Label htmlFor="heure_fin">Heure Fin</Form.Label>
                    <input type="time" className="form-control" />
                  </Col>
                  <Col>
                    <Form.Label htmlFor="salle">Salle</Form.Label>
                    <select className="form-select">
                      <option value="">Choisir ...</option>
                      <option value="Salle 11">Salle 11</option>
                      <option value="Salle 12">Salle 12</option>
                      <option value="Salle 13">Salle 13</option>
                    </select>
                  </Col>
                  <Col>
                    <Form.Label htmlFor="salle">E.R</Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                    />
                  </Col>
                  <Col>
                    <Form.Label htmlFor="salle">E.S</Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="d-flex justify-content-end">
                    <button type="button" className="btn btn-info">
                      Ajouter
                    </button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
          <Row>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table table-bordered table-striped w-100">
                <tbody>
                  {days.map(({ date, day, epreuve }) => (
                    <tr key={date}>
                      <td className="py-3 px-4 fw-bold text-center bg-light">
                        {day.charAt(0).toUpperCase() + day.slice(1)} {date}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {epreuve.length === 0 ? (
                          <em className="text-muted">Pas de séances</em>
                        ) : (
                          <ul className="list-unstyled">
                            {epreuve.map((exam: any, index: any) => (
                              <li key={index}>
                                <strong>
                                  {exam.matiere?.nom || "Matière inconnue"}
                                </strong>{" "}
                                <br />
                                {exam.heure_debut} - {exam.heure_fin} <br />
                                Salle: {exam.salle?.nom || "Non attribuée"}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProgrammerCalendrier;
