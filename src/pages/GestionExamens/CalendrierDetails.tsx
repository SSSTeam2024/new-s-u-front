import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useFetchSallesQuery } from "features/salles/salles";

const CalendrierDetails = () => {
  document.title = "Details de Calendrier | ENIGA";

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const { data: AllSalles = [] } = useFetchSallesQuery();

  const location = useLocation();
  const calendrierState = location.state;
  console.log("calendrierState", calendrierState);

  const [days, setDays] = useState<any[]>([]);

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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="vstack gap-2">
                    <h3>
                      Année Universitaire: {calendrierState.annee_universitaire}
                    </h3>
                    <h3>Semestre: {calendrierState.semestre}</h3>
                  </div>
                </Col>
                <Col className="text-center">
                  <h3>Calendrier: {calendrierState.period}</h3>
                </Col>
                <Col className="text-end">
                  <div className="vstack gap-2">
                    <h3>Type: {calendrierState.type_examen}</h3>
                    {calendrierState.type_examen === "Examen" && (
                      <h3>Session: {calendrierState.session}</h3>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row className="mb-3 align-items-center">
            {/* Classe Selection */}
            <Col lg={2}>
              <Form.Label>Classe:</Form.Label>

              <select className="form-select">
                <option value="">Choisir ...</option>
                {AllClasses.map((classe) => (
                  <option value={classe?._id!} key={classe?._id!}>
                    {classe?.nom_classe_fr}
                  </option>
                ))}
              </select>
            </Col>

            {/* Enseignants Selection */}
            <Col lg={2}>
              <Form.Label>Enseignants:</Form.Label>

              <select className="form-select">
                <option value="">Choisir ...</option>
                {AllEnseignants.map((enseignant) => (
                  <option value={enseignant?._id!} key={enseignant?._id!}>
                    {enseignant?.prenom_fr} {enseignant?.nom_fr}
                  </option>
                ))}
              </select>
            </Col>

            {/* Salle Selection */}
            <Col lg={2}>
              <Form.Label>Salle:</Form.Label>

              <select className="form-select">
                <option value="">Choisir ...</option>
                {AllSalles.map((salle) => (
                  <option value={salle?._id!} key={salle?._id!}>
                    {salle?.salle}
                  </option>
                ))}
              </select>
            </Col>

            {/* Jour Selection */}
            <Col lg={2}>
              <Form.Label>Jour:</Form.Label>
              <select className="form-select">
                <option value="">Choisir ...</option>
                {[
                  "Lundi",
                  "Mardi",
                  "Mercredi",
                  "Jeudi",
                  "Vendredi",
                  "Samedi",
                  "Dimanche",
                ].map((jour, index) => (
                  <option value={jour} key={index}>
                    {jour}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

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

export default CalendrierDetails;
