import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import Select, { MultiValue, ActionMeta } from "react-select";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useAddExamenMutation } from "features/examens/examenSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const getDaysInRange = (startDate: Date, endDate: Date) => {
  const days = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push({
      label: currentDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      value: currentDate.toISOString(),
    });
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return days;
};

const AjouterCalendrierExamen = () => {
  document.title = "Ajouter Calendrier Examen | ENIGA";

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [createNewCalendrierExamen] = useAddExamenMutation();
  const [selectedPeriod, setSelectedPeriod] = useState<Date[] | null>(null);

  const [dayOptions, setDayOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [rows, setRows] = useState<
    {
      selectedDays: MultiValue<{ label: string; value: string }>;
      selectedEnseignants: MultiValue<{ label: string; value: string }>;
    }[]
  >([]);

  const handlePeriodChange = (selectedDates: Date[]) => {
    setSelectedPeriod(selectedDates);

    if (selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates;
      if (startDate <= endDate) {
        const days = getDaysInRange(startDate, endDate);
        setDayOptions(days);
      } else {
        setDayOptions([]);
      }
    } else {
      setDayOptions([]);
    }
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { selectedDays: [], selectedEnseignants: [] },
    ]);
  };

  const handleRowChange = (
    rowIndex: number,
    field: "selectedDays" | "selectedEnseignants",
    value: MultiValue<{ label: string; value: string }>
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const [selectedTypeExamen, setSelectedTypeExamen] = useState<string>("");
  // This function is triggered when the select Type Examen
  const handleSelectTypeExamen = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTypeExamen(value);
  };

  const [selectedSession, setSelectedSession] = useState<string>("");
  const handleSelectSession = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSession(value);
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le calendrier a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const getFilteredOptions = (
    allOptions: { label: string; value: string }[],
    selectedOptions: MultiValue<{ label: string; value: string }>
  ) =>
    allOptions.filter(
      (option) =>
        !selectedOptions.some((selected) => selected.value === option.value)
    );

  const getAllSelectedValues = (
    rows: {
      selectedDays: MultiValue<{ label: string; value: string }>;
      selectedEnseignants: MultiValue<{ label: string; value: string }>;
    }[],
    field: "selectedDays" | "selectedEnseignants"
  ) =>
    rows.reduce(
      (acc, row) => [...acc, ...row[field]],
      [] as MultiValue<{ label: string; value: string }>
    );
  const allSelectedDays = getAllSelectedValues(rows, "selectedDays");
  const allSelectedEnseignants = getAllSelectedValues(
    rows,
    "selectedEnseignants"
  );
  const finalEnseignants = getAllSelectedValues(rows, "selectedEnseignants");
  const finalDays = getAllSelectedValues(rows, "selectedDays");

  const optionColumnsTable = AllEnseignants.map((enseignant: any) => ({
    value: enseignant._id,
    label: `${enseignant.prenom_fr} ${enseignant.nom_fr}`,
  }));

  const [semestre, setSemestre] = useState("S1");

  const handleToggle = () => {
    setSemestre((prev) => (prev === "S1" ? "S2" : "S1"));
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: "",
    annee_universitaire: "",
    semestre: "",
    session: "",
    salle: "",
    type_examen: "",
    period: "",
    group_enseignant: [
      {
        enseignant: [""],
        date: "",
      },
    ],
    epreuve: [
      {
        group_surveillants: [],
        date: "",
        heure_debut: "",
        heure_fin: "",
        salle: null,
        matiere: null,
        classe: null,
      },
    ],
  });
  const formatPeriod = (period: Date[] | null): string => {
    if (!period || period.length !== 2) {
      return "";
    }

    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return `${formatDate(period[0])} / ${formatDate(period[1])}`;
  };

  const periodString = formatPeriod(selectedPeriod);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enseignantValues = finalEnseignants.map(
      (enseignant) => enseignant.value
    );

    formData["annee_universitaire"] = startYear + "/" + endYear;
    formData["semestre"] = semestre;
    formData["type_examen"] = selectedTypeExamen;
    formData["session"] = selectedSession;
    formData["period"] = periodString;
    if (Array.isArray(formData["group_enseignant"])) {
      formData["group_enseignant"] = formData["group_enseignant"].map(
        (group) => ({
          ...group,
          enseignant: enseignantValues,
          date: "",
        })
      );
    } else {
      console.error("formData['group_enseignant'] is not an array!");
    }

    createNewCalendrierExamen(formData);
    notify();
    navigate("/");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Ajouter Calendrier"
            pageTitle="Gestion des Examens"
          />
          <Form onSubmit={onSubmit}>
            <Card>
              <Card.Body>
                <Row className="mb-4">
                  <Col>
                    <Form.Label htmlFor="semestre">
                      Année Universitaire
                    </Form.Label>
                    <p>2024/2025</p>
                  </Col>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="semestre">Semestre</Form.Label>
                      <div className="form-check form-switch form-switch-lg from-switch-info">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="SwitchCheck6"
                          onChange={handleToggle}
                          checked={semestre === "S2"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="SwitchCheck6"
                        >
                          {semestre}
                        </label>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <Form.Label htmlFor="type">Type</Form.Label>
                    <select
                      className="form-select"
                      onChange={handleSelectTypeExamen}
                    >
                      <option value="Choisir">Choisir...</option>
                      <option value="DS">DS</option>
                      <option value="Examen">Examen</option>
                    </select>
                  </Col>
                  {selectedTypeExamen === "Examen" && (
                    <Col>
                      <Form.Label htmlFor="session">Session</Form.Label>
                      <select
                        className="form-select"
                        onChange={handleSelectSession}
                      >
                        <option value="Choisir">Choisir...</option>
                        <option value="Principal">Principal</option>
                        <option value="Rattrapage">Rattrapage</option>
                      </select>
                    </Col>
                  )}
                  <Col>
                    <Form.Label htmlFor="periode">Période</Form.Label>
                    <Flatpickr
                      value={selectedPeriod || []}
                      onChange={handlePeriodChange}
                      className="form-control flatpickr-input"
                      placeholder="Select Date Range"
                      options={{
                        mode: "range",
                        dateFormat: "d M, Y",
                      }}
                      id="periode"
                    />
                  </Col>
                </Row>
                <Row>
                  {rows.map((row, index) => (
                    <div key={index} className="row mt-3">
                      <div className="col-lg-6">
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={getFilteredOptions(
                            dayOptions,
                            allSelectedDays
                          )}
                          value={row.selectedDays}
                          onChange={(selected) =>
                            handleRowChange(index, "selectedDays", selected)
                          }
                          placeholder="Choisir jour(s)..."
                          isClearable
                        />
                      </div>
                      <div className="col-lg-6">
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={getFilteredOptions(
                            optionColumnsTable,
                            allSelectedEnseignants
                          )}
                          value={row.selectedEnseignants}
                          onChange={(selected) =>
                            handleRowChange(
                              index,
                              "selectedEnseignants",
                              selected
                            )
                          }
                          placeholder="Choisir des enseignants..."
                        />
                      </div>
                    </div>
                  ))}
                </Row>
                <Row>
                  <Col>
                    <button
                      type="button"
                      className="btn btn-success mt-3"
                      onClick={handleAddRow}
                    >
                      Ajouter Groupe
                    </button>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-secondary">
                      Ajouter Nouveau Calendrier
                    </button>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterCalendrierExamen;
