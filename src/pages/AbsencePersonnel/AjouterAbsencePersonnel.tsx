import React, { useEffect, useState } from "react";
import { Container, Card, Table, Form, Button } from "react-bootstrap";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import { RootState } from "../../app/store";
import { selectCurrentUser } from "features/account/authSlice";
import { useSelector } from "react-redux";
import {
  AbsencePersonnel,
  useAddAbsencePersonnelMutation,
} from "features/absencePersonnel/absencePersonnel";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useFetchPersonnelWorkingDayQuery } from "features/personnelWorkingDay/personnelWorkingDaySlice";
import { useFetchDemandeCongeQuery } from "features/congé/demandeCongeSlice";

const AjouterAbsencePersonnel = () => {
  const { data = [] } = useFetchPersonnelsQuery();
  const { data: AllPersonnelWorkingDay = [] } =
    useFetchPersonnelWorkingDayQuery();

  const { data: AllCongés = [] } = useFetchDemandeCongeQuery();

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const filteredWorkingHour = AllPersonnelWorkingDay.find((day) => {
    const periodStart = day.period_start;
    const periodEnd = day.period_end;

    return date >= periodStart && date <= periodEnd;
  });

  const [createAbsence] = useAddAbsencePersonnelMutation();

  const [attendance, setAttendance] = useState<any[]>([]);

  const filtredCongés = AllCongés.filter(
    (congé: any) =>
      congé.status === "acceptée" &&
      date >= congé.startDay.split("T")[0] &&
      date <= congé.endDay.split("T")[0]
  );

  const uniquePersonnel = new Map();

  useEffect(() => {
    if (data.length > 0) {
      setAttendance(
        data.map((personnel) => ({
          personnel: personnel._id,
          autorisation: "",
          name: `${personnel.prenom_fr} ${personnel.nom_fr}`,
          morning: "Present",
          evening: "Present",
          fullDay: "Present",
          duree: "",
          en_conge: "",
        }))
      );
    }
  }, [data]);

  attendance.forEach((person) => {
    uniquePersonnel.set(person.personnel, { ...person, isCongé: false });
  });

  filtredCongés.forEach((congé: any) => {
    if (!uniquePersonnel.has(congé?.personnelId)) {
      uniquePersonnel.set(congé?.personnelId?._id!, {
        personnel: congé.personnelId?._id!,
        name: `${congé.personnelId.prenom_fr} ${congé.personnelId.nom_fr}`,
        isCongé: true,
        evening: "",
        fullDay: "",
        morning: "",
        en_conge: "yes",
      });
    }
  });

  const finalList = Array.from(uniquePersonnel.values());

  const handleChange = (id: string, field: string, value: string) => {
    setAttendance((prev) =>
      prev?.map((entry) =>
        entry.personnel === id
          ? {
              ...entry,
              [field]: value,
              duree:
                field === "morning" ||
                field === "evening" ||
                field === "fullDay"
                  ? value === "Autorisation"
                    ? entry.duree
                    : ""
                  : entry.duree,
            }
          : entry
      )
    );
  };

  const handleDureeChange = (id: string, type: string, value: string) => {
    setAttendance((prev) =>
      prev?.map((entry) =>
        entry.personnel === id ? { ...entry, duree: value } : entry
      )
    );
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'absence a été créée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const navigate = useNavigate();

  function tog_AllAbsences() {
    navigate("/gestion-personnel/absence-personnel");
  }

  const initialAbsencePersonnel: AbsencePersonnel = {
    jour: "",
    added_by: "",
    personnels: [],
  };

  const [absence, setAbsence] = useState(initialAbsencePersonnel);

  const { jour, added_by, personnels } = absence;

  const createAbsencePayload = (): AbsencePersonnel => {
    const personnelsFormatted = finalList.map((person) => {
      const isCongé = person.en_conge === "yes";

      let morning = person.morning;
      let evening = person.evening;
      let fullDay = person.fullDay;
      let autorisation = "";
      if (
        filteredWorkingHour?.daily_pause_start === "--:--" &&
        filteredWorkingHour?.daily_pause_end === "--:--"
      ) {
        if (fullDay === "Autorisation") {
          autorisation = "yes";
          morning = "Present";
          evening = "Present";
          fullDay = "Autorisation";
        } else if (fullDay !== "Present") {
          morning = "";
          evening = "";
        }
      } else {
        if (morning === "Autorisation") {
          autorisation = "matin";
          if (morning === "Autorisation") morning = "Present";
        }
        if (evening === "Autorisation") {
          autorisation = "apres_midi";
          if (evening === "Autorisation") evening = "Present";
        }
      }

      return {
        personnel: person.personnel,
        autorisation,
        morning: isCongé ? "" : morning,
        evening: isCongé ? "" : evening,
        fullDay: isCongé ? "" : fullDay,
        duree: person.duree || "",
        en_conge: isCongé ? "yes" : "",
      };
    });

    return {
      jour: date,
      personnels: personnelsFormatted,
      added_by: user?._id!,
    };
  };

  const onSubmitAbsence = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = createAbsencePayload();
      createAbsence(payload)
        .then(() => notifySuccess())
        .then(() => setAbsence(initialAbsencePersonnel));
      tog_AllAbsences();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card className="shadow p-4">
            <h3 className="mb-3 text-center">
              Marquer la Présence des Personnels
            </h3>
            <Form onSubmit={onSubmitAbsence}>
              <Form.Group className="mb-3 hstack gap-3 d-flex justify-content-center">
                <Form.Label className="fw-bold">Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-25 text-center"
                  min={today}
                />
              </Form.Group>
              <Table bordered hover responsive className="text-center">
                <thead className="table-dark">
                  {filteredWorkingHour && (
                    <tr>
                      <th>#</th>
                      <th>Nom du personnel</th>
                      {filteredWorkingHour.daily_pause_start === "--:--" &&
                      filteredWorkingHour.daily_pause_end === "--:--" ? (
                        <th>
                          {filteredWorkingHour.day_start_time} -{" "}
                          {filteredWorkingHour.day_end_time}
                        </th>
                      ) : (
                        <>
                          <th>
                            {filteredWorkingHour.day_start_time} -{" "}
                            {filteredWorkingHour.daily_pause_start}
                          </th>
                          <th>
                            {filteredWorkingHour.daily_pause_end} -{" "}
                            {filteredWorkingHour.day_end_time}
                          </th>
                        </>
                      )}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {finalList.map((person, index) => (
                    <tr key={person.personnel}>
                      <td>{index + 1}</td>
                      <td>{person.name}</td>
                      {filteredWorkingHour?.daily_pause_start === "--:--" &&
                      filteredWorkingHour?.daily_pause_end === "--:--" ? (
                        <td>
                          {person.isCongé ? (
                            <span className="badge badge-soft-success fs-18">
                              Congé
                            </span>
                          ) : (
                            <Form.Select
                              value={person.fullDay}
                              onChange={(e) =>
                                handleChange(
                                  person.personnel,
                                  "fullDay",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Autorisation">Autorisation</option>
                            </Form.Select>
                          )}
                          {person.fullDay === "Autorisation" && (
                            <select
                              className="form-control mt-2"
                              value={person.duree}
                              onChange={(e) =>
                                handleDureeChange(
                                  person.personnel,
                                  "dureeEvening",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Sélectionner la durée</option>
                              <option value="1H">1H</option>
                              <option value="2H">2H</option>
                            </select>
                          )}
                        </td>
                      ) : (
                        <>
                          <td>
                            {person.isCongé ? (
                              <span className="badge badge-soft-success fs-18">
                                Congé
                              </span>
                            ) : (
                              <>
                                <Form.Select
                                  value={person.morning}
                                  onChange={(e) =>
                                    handleChange(
                                      person.personnel,
                                      "morning",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Present">Present</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </Form.Select>
                                {person.morning === "Autorisation" && (
                                  <select
                                    className="form-control mt-2"
                                    value={person.duree}
                                    onChange={(e) =>
                                      handleDureeChange(
                                        person.personnel,
                                        "dureeMorning",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      Sélectionner la durée
                                    </option>
                                    <option value="1H">1H</option>
                                    <option value="2H">2H</option>
                                  </select>
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {person.isCongé ? (
                              <span className="badge badge-soft-success fs-18">
                                Congé
                              </span>
                            ) : (
                              <>
                                <Form.Select
                                  value={person.evening}
                                  onChange={(e) =>
                                    handleChange(
                                      person.personnel,
                                      "evening",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Present">Present</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </Form.Select>
                                {person.evening === "Autorisation" && (
                                  <select
                                    className="form-control mt-2"
                                    value={person.duree}
                                    onChange={(e) =>
                                      handleDureeChange(
                                        person.personnel,
                                        "dureeEvening",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      Sélectionner la durée
                                    </option>
                                    <option value="1H">1H</option>
                                    <option value="2H">2H</option>
                                  </select>
                                )}
                              </>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-center">
                <Button variant="primary" className="mt-3" type="submit">
                  {" "}
                  Enregistrer
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterAbsencePersonnel;
