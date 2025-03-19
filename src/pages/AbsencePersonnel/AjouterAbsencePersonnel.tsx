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

  const workingHours = AllPersonnelWorkingDay.map((day) => ({
    morningTime: `${day.day_start_time} - ${day.daily_pause_start}`,
    eveningTime: `${day.daily_pause_end} - ${day.day_end_time}`,
  }));

  const [createAbsence] = useAddAbsencePersonnelMutation();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
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
          typeAbsent: "",
          name: `${personnel.prenom_fr} ${personnel.nom_fr}`,
          morning: "Present",
          evening: "Present",
          duree: "",
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
        evening: "En congé",
        morning: "En congé",
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
                field === "morning" || field === "evening"
                  ? value === "Autorisation"
                    ? entry.duree
                    : ""
                  : entry.duree,
            }
          : entry
      )
    );
  };

  const handleDureeChange = (id: string, value: string) => {
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

  const onSubmitAbsence = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const absenceData = {
        ...absence,
        added_by: user?._id!,
        personnels: finalList,
        jour: date,
      };

      createAbsence(absenceData)
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
                  <tr>
                    <th>#</th>
                    <th>Nom du personnel</th>
                    <th>{workingHours[0]?.morningTime!}</th>
                    <th>{workingHours[0]?.eveningTime!}</th>
                  </tr>
                </thead>
                <tbody>
                  {finalList.map((person, index) => (
                    <tr key={person.personnel}>
                      <td>{index + 1}</td>
                      <td>{person.name}</td>
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
                              <option value="Autorisation">Autorisation</option>
                            </Form.Select>
                            {person.morning === "Autorisation" && (
                              <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Durée"
                                value={person.duree}
                                onChange={(e) =>
                                  handleDureeChange(
                                    person.personnel,
                                    e.target.value
                                  )
                                }
                              />
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
                              <option value="Autorisation">Autorisation</option>
                            </Form.Select>
                            {person.evening === "Autorisation" && (
                              <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Durée"
                                value={person.duree}
                                onChange={(e) =>
                                  handleDureeChange(
                                    person.personnel,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </>
                        )}
                      </td>
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
