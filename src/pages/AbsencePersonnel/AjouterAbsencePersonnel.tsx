import React, { useState } from "react";
import { Container, Card, Table, Form, Button } from "react-bootstrap";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";

const AjouterAbsencePersonnel = () => {

    const { data: personnels,} = useFetchPersonnelsQuery();
 

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState(
    personnels?.map((personnel) => ({
      _id: personnel._id,
      name: `${personnel.prenom_fr} ${personnel.nom_fr}`,
      morning: "present",
      evening: "present",
    }))
  );

  const handleChange = (id: string, field: string, value: string) => {
    setAttendance((prev) =>
      prev?.map((entry) =>
        entry._id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  return (
     <React.Fragment>
          <div className="page-content">
           
    <Container fluid={true}>
      <Card className="shadow p-4">
        <h3 className="mb-3 text-center">Marquer la Présence des Personnels</h3>
        <Form.Group className="mb-3 text-center">
          <Form.Label className="fw-bold">Date:</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-25 mx-auto"
          />
        </Form.Group>
        <Table bordered hover responsive className="text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nom du personnel</th>
              <th>Matin</th>
              <th>Après-midi</th>
            </tr>
          </thead>
          <tbody>
            {attendance?.map((person, index) => (
              <tr key={person._id}>
                <td>{index + 1}</td>
                <td>{person.name}</td>
                <td>
                  <Form.Select
                    value={person.morning}
                    onChange={(e) => handleChange(person._id, "morning", e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Select
                    value={person.evening}
                    onChange={(e) => handleChange(person._id, "evening", e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-center">
          <Button variant="primary" className="mt-3"> Enregistrer</Button>
        </div>
      </Card>
    </Container>
     </div>
        </React.Fragment>
  );
};

export default AjouterAbsencePersonnel;
