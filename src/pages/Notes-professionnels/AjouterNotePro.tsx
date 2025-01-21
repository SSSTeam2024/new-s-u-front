import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "flatpickr/dist/flatpickr.min.css";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import {
  NotesPro,
  useAddNotesProMutation,
  useFetchNotesProQuery,
  useGetNotesProByYearMutation,
} from "features/notesPro/notesProSlice";
import { useFetchCategoriesPersonnelQuery } from "features/categoriePersonnel/categoriePersonnel";

const AjouterNotePro = () => {
  document.title = "Ajouter Notes Professionnelles| ENIGA";

  const [addNotesPro] = useAddNotesProMutation();
  const { data: personnels, isSuccess: arePersonnelFetched } =
    useFetchPersonnelsQuery();

  const { data: categories } = useFetchCategoriesPersonnelQuery();

  const [getNotesProByYear] = useGetNotesProByYearMutation();

  const navigate = useNavigate();

  const [hasProcessed, setHasProcessed] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>(""); // cat id

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const [administrativeYears, setAdministrativeYears] = useState<number[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    if (arePersonnelFetched && !hasProcessed) {
      let currentYear = new Date().getFullYear();
      setAdministrativeYears([currentYear, currentYear - 1]);

      setHasProcessed(true);
    }
  }, [arePersonnelFetched, hasProcessed, personnels]);

  const [formData, setFormData] = useState<NotesPro[]>([]);

  const handleObservationChange = (
    field: string,
    value: any,
    personnelId: string
  ) => {
    let refFromData = [...formData];

    const index = refFromData?.findIndex((data) => {
      return data.personnel._id === personnelId;
    });

    console.log("field", field);
    console.log("value", value);
    console.log("index", index);

    refFromData[index] = { ...refFromData[index], [field]: value };

    setFormData(refFromData);
  };

  const handleInputChange = (
    field: string,
    value: any,
    personnelId: string
  ) => {
    let refFromData = [...formData];

    const index = refFromData?.findIndex((data) => {
      return data.personnel._id === personnelId;
    });

    console.log("field", field);
    console.log("value", value);
    console.log("index", index);

    refFromData[index] = { ...refFromData[index], [field]: value };
    refFromData[index].note_finale = getNewTotal(
      field,
      value,
      index,
      refFromData
    );
    setFormData(refFromData);
  };

  const getNewTotal = (
    field: string,
    value: string,
    index: number,
    refFromData: any[]
  ) => {
    let sum = 0;

    switch (field) {
      case "note1":
        sum =
          Number(value) +
          Number(refFromData[index].note2) +
          Number(refFromData[index].note3) +
          Number(refFromData[index].note4) +
          Number(refFromData[index].note5);
        break;
      case "note2":
        sum =
          Number(value) +
          Number(refFromData[index].note1) +
          Number(refFromData[index].note3) +
          Number(refFromData[index].note4) +
          Number(refFromData[index].note5);
        break;
      case "note3":
        sum =
          Number(value) +
          Number(refFromData[index].note2) +
          Number(refFromData[index].note1) +
          Number(refFromData[index].note4) +
          Number(refFromData[index].note5);
        break;
      case "note4":
        sum =
          Number(value) +
          Number(refFromData[index].note2) +
          Number(refFromData[index].note3) +
          Number(refFromData[index].note1) +
          Number(refFromData[index].note5);
        break;
      case "note5":
        sum =
          Number(value) +
          Number(refFromData[index].note2) +
          Number(refFromData[index].note3) +
          Number(refFromData[index].note4) +
          Number(refFromData[index].note1);
        break;

      default:
        break;
    }

    return sum.toFixed();
  };

  const onSelectAdministrativeYear = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedYear(e.target.value);
    setSelectedCategory("");
    setFormData([]);
  };

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (selectedYear === "") {
      alert("Veuillez choisir une année administrative");
    } else {
      setSelectedCategory(e.target.value);

      let category: any = categories?.filter((c) => c._id === e.target.value);

      setSelectedCategoryName(category[0].categorie_fr);

      let data: any = personnels?.map((p) => ({
        personnel: p,
        note1: "20",
        note2: "20",
        note3: "20",
        note4: "20",
        note5: "20",
        note_finale: "100",
        annee: "",
        observation: "",
      }));

      let requestData = {
        annee: selectedYear,
      };

      let res: any = await getNotesProByYear(requestData).unwrap();

      console.log(res);

      console.log(data);

      const personnelsWithoutNotesPro = data.filter(
        (notesPro: any) =>
          !res.some((note: any) => note.personnel === notesPro.personnel._id)
      );

      console.log(personnelsWithoutNotesPro);

      let filteredData = personnelsWithoutNotesPro.filter(
        (p: any) => e.target.value === p.personnel.categorie._id
      );

      setFormData(filteredData);
    }
  };

  // const onSubmitNotesPro = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   await addNotesPro(formData).then(() => setFormData(formData));
  //   notify();
  //   navigate("/gestion-notes-professionelles/Liste-notes-professionelles");
  //   console.log(formData);
  // };

  const onSubmitNotesPro = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // Pass the entire array at once
      let req_data: any = formData?.map((data) => ({
        personnel: data.personnel._id,
        note1: data.note1,
        note2: data.note2,
        note3: data.note3,
        note4: data.note4,
        note5: data.note5,
        note_finale: data.note_finale,
        annee: selectedYear,
        observation: data.observation,
      }));
      await addNotesPro({ notes: req_data }); // Assuming addNotesPro expects an array of NotesPro

      notify();
      navigate("/gestion-notes-professionelles/Liste-notes-professionelles");
      console.log(formData);
    } catch (error) {
      console.error("Error submitting notes:", error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Notes professionnelles ajoutées avec succès!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const renderContent = () => {
    if (formData.length === 0) {
      if (selectedYear === "" && selectedCategory === "") {
        return (
          <>Veuillez selectionner une année administrative et une catégorie</>
        );
      } else if (selectedYear !== "" && selectedCategory === "") {
        return <>Veuillez selectionner une catégorie</>;
      } else if (selectedYear === "" && selectedCategory !== "") {
        return <>Veuillez selectionner une année administrative</>;
      } else if (selectedYear !== "" && selectedCategory !== "") {
        return (
          <>
            Les personnels du catégorie "{selectedCategoryName}" ont des note
            pour l'année {selectedYear}
          </>
        );
      }
    } else {
      return formData.map((form, index) => {
        return (
          <Row key={index} className="mb-3">
            <Col lg={2}>
              {form.personnel.prenom_fr} {form.personnel.nom_fr}
            </Col>
            <Col lg={1}>
              <Form.Control
                type="number"
                value={form.note1}
                onChange={(e) =>
                  handleInputChange("note1", e.target.value, form.personnel._id)
                }
                required
              />
            </Col>
            <Col lg={1}>
              <Form.Control
                type="number"
                value={form.note2}
                onChange={(e) =>
                  handleInputChange("note2", e.target.value, form.personnel._id)
                }
                required
              />
            </Col>
            <Col lg={1}>
              <Form.Control
                type="number"
                value={form.note3}
                onChange={(e) =>
                  handleInputChange("note3", e.target.value, form.personnel._id)
                }
                required
              />
            </Col>
            <Col lg={1}>
              <Form.Control
                type="number"
                value={form.note4}
                onChange={(e) =>
                  handleInputChange("note4", e.target.value, form.personnel._id)
                }
                required
              />
            </Col>
            <Col lg={1}>
              <Form.Control
                type="number"
                value={form.note5}
                onChange={(e) =>
                  handleInputChange("note5", e.target.value, form.personnel._id)
                }
                required
              />
            </Col>
            <Col lg={1}>
              <Form.Control
                type="text"
                value={form.note_finale /* noteFinale */}
                readOnly
              />
            </Col>
            <Col lg={2}>
              <Form.Control
                type="text"
                value={form.observation}
                onChange={(e) =>
                  handleObservationChange(
                    "observation",
                    e.target.value,
                    form.personnel._id
                  )
                }
                required
              />
            </Col>
          </Row>
        );
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <Card>
            <Card.Body className="p-0"> */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">
                Ajouter Notes Professionnelles
              </h3>
              <Row className="mb-3">
                <Col lg={3}>
                  <Form.Label>Année administrative</Form.Label>
                  <select
                    className="form-select mt-3 mt-sm-0"
                    data-choices
                    data-choices-search-false
                    name="choices-single-default"
                    id="idStatus"
                    value={selectedYear}
                    onChange={onSelectAdministrativeYear}
                  >
                    <option value="">Sélectionner année</option>
                    {administrativeYears?.map((year) => (
                      <option value={year}>{year}</option>
                    ))}
                  </select>
                </Col>

                <Col lg={3}>
                  <Form.Label>Catégorie personnel</Form.Label>
                  <select
                    className="form-select mt-3 mt-sm-0"
                    data-choices
                    data-choices-search-false
                    name="choices-single-default"
                    id="idStatus"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Sélectionner catégorie</option>
                    {categories?.map((categorie) => (
                      <option value={categorie._id}>
                        {categorie.categorie_fr}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={2}>
                  <Form.Label>Personnel</Form.Label>
                </Col>
                <Col lg={1}>
                  <Form.Label>Note 1</Form.Label>
                </Col>
                <Col lg={1}>
                  <Form.Label>Note 2</Form.Label>
                </Col>
                <Col lg={1}>
                  <Form.Label>Note 3</Form.Label>
                </Col>
                <Col lg={1}>
                  <Form.Label>Note 4</Form.Label>
                </Col>
                <Col lg={1}>
                  <Form.Label>Note 5</Form.Label>
                </Col>
                <Col lg={1}>
                  <Form.Label>Note Finale</Form.Label>
                </Col>
                <Col lg={2}>
                  <Form.Label>Observations</Form.Label>
                </Col>
              </Row>

              {renderContent()}

              {/* {formData.length === 0 &&
              selectedYear === "" &&
              selectedCategory === "" ? (
                <>Veuillez selectionner une annee admi et une categorie</>
              ) : (
                formData.map((form, index) => {
                  return (
                    <Row key={index} className="mb-3">
                      <Col lg={2}>
                        {form.personnel.prenom_fr} {form.personnel.nom_fr}
                      </Col>
                      <Col lg={1}>
                        <Form.Control
                          type="number"
                          value={form.note1}
                          onChange={(e) =>
                            handleInputChange(
                              "note1",
                              e.target.value,
                              form.personnel._id
                            )
                          }
                          required
                        />
                      </Col>
                      <Col lg={1}>
                        <Form.Control
                          type="number"
                          value={form.note2}
                          onChange={(e) =>
                            handleInputChange(
                              "note2",
                              e.target.value,
                              form.personnel._id
                            )
                          }
                          required
                        />
                      </Col>
                      <Col lg={1}>
                        <Form.Control
                          type="number"
                          value={form.note3}
                          onChange={(e) =>
                            handleInputChange(
                              "note3",
                              e.target.value,
                              form.personnel._id
                            )
                          }
                          required
                        />
                      </Col>
                      <Col lg={1}>
                        <Form.Control
                          type="number"
                          value={form.note4}
                          onChange={(e) =>
                            handleInputChange(
                              "note4",
                              e.target.value,
                              form.personnel._id
                            )
                          }
                          required
                        />
                      </Col>
                      <Col lg={1}>
                        <Form.Control
                          type="number"
                          value={form.note5}
                          onChange={(e) =>
                            handleInputChange(
                              "note5",
                              e.target.value,
                              form.personnel._id
                            )
                          }
                          required
                        />
                      </Col>
                      <Col lg={1}>
                        <Form.Control
                          type="text"
                          value={form.note_finale }
                          readOnly
                        />
                      </Col>
                      <Col lg={2}>
                        <Form.Control
                          type="text"
                          value={form.observation}
                          onChange={(e) =>
                            handleObservationChange(
                              "observation",
                              e.target.value,
                              form.personnel._id
                            )
                          }
                          required
                        />
                      </Col>
                    </Row>
                  );
                })
              )} */}

              <div className="d-flex justify-content-end mt-4">
                {formData.length > 0 ? (
                  <Button
                    variant="success"
                    onClick={onSubmitNotesPro}
                    className="me-2"
                  >
                    Save Notes
                  </Button>
                ) : (
                  <></>
                )}
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterNotePro;
