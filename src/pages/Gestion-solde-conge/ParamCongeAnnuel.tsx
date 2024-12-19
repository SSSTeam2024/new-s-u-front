import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  useUpdateLeaveTypeMutation,
  useFetchLeaveTypeByIdQuery,
} from "features/congé/leaveTypeSlice";
import Swal from "sweetalert2";
import { LeaveSubcategory, LeaveType } from "features/congé/leaveTypeSlice";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchGradesPersonnelQuery } from "features/gradePersonnel/gradePersonnel";

const EditAnnuelLeaveType = () => {
  const location = useLocation();
  const idLeaveType = location.state;
  console.log("id leave type", idLeaveType.id);
  const id = "6735f14d787ac074e9e05b1d"; // Replace with dynamic ID if needed

  const {
    data: leaveType,
    isLoading,
    isError,
  } = useFetchLeaveTypeByIdQuery({ _id: idLeaveType.id || "" });
  const [updateLeaveType] = useUpdateLeaveTypeMutation();

  const { data: gradePersonnel } = useFetchGradesPersonnelQuery();
  console.log("gradePersonnel", gradePersonnel);

  const navigate = useNavigate();
  const [formState, setFormState] = useState<LeaveType>({
    _id: "6735f14d787ac074e9e05b1d",
    category: "",
    name_fr: "",
    name_ar: "",
    Accumulable: false,
    sexe: "Both",
    subcategories: [],
  });

  useEffect(() => {
    if (leaveType) {
      setFormState(leaveType);
    }
  }, [leaveType]);

  // Handle changes in subcategory fields
  const handleSubcategoryChange = (
    index: number,
    field: keyof LeaveSubcategory,
    value: string | number | boolean
  ) => {
    const updatedSubcategories = [...(formState.subcategories || [])];
    updatedSubcategories[index] = {
      ...updatedSubcategories[index],
      [field]: value,
    };
    setFormState({ ...formState, subcategories: updatedSubcategories });
  };

  // Add a new subcategory to the list
  const handleAddSubcategory = () => {
    const newSubcategory: LeaveSubcategory = {
      name_fr: "",
      name_ar: "",
      maxDays: 0,
      sexe: "Both",
      Accumulable: false,
      GradePersonnel: [],
    };
    setFormState({
      ...formState,
      subcategories: [...(formState.subcategories || []), newSubcategory],
    });
  };

  // Remove a subcategory
  const handleRemoveSubcategory = (index: number) => {
    // Confirm removal with the user
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this subcategory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the subcategory from the array
        const updatedSubcategories = formState.subcategories?.filter(
          (_, i) => i !== index
        );
        setFormState({ ...formState, subcategories: updatedSubcategories });
        Swal.fire("Deleted!", "The subcategory has been removed.", "success");
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateLeaveType(formState).unwrap();
      Swal.fire("Success", "Leave Type updated successfully!", "success");
      navigate("/type-conge/Liste-type-conge");
    } catch (error) {
      Swal.fire("Error", "Failed to update Leave Type.", "error");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading leave type data.</div>;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-lines-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">Paramètre congé annuel</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <div className="mb-3">
                    <Form onSubmit={handleSubmit}>
                      <Row className="mb-3 mt-2">
                        <h5>
                          Type de congé:{" "}
                          <span>
                            {formState.name_fr} | {formState.name_ar}{" "}
                          </span>
                        </h5>
                      </Row>

                      {/* Subcategory Fields */}
                      <Row>
                        {formState.subcategories?.map((subcategory, index) => (
                          <div key={index} className="border p-3 mb-3 rounded">
                            <h5> Sous-catégorie {index + 1}</h5>

                            <Row>
                              {/* Subcategory Name (French) */}
                              <Col lg={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>
                                    Nom de la sous-catégorie (français)
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={subcategory.name_fr}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "name_fr",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              {/* Subcategory Name (Arabic) */}
                              <Col lg={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>
                                    Nom de la sous-catégorie (arabe)
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={subcategory.name_ar}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "name_ar",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>

                              {/* Max Days */}
                              <Col lg={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>
                                    Nombre Maximum de Jours
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={subcategory.maxDays}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "maxDays",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              {/* Sex */}
                              <Col lg={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Genre</Form.Label>
                                  <Form.Control
                                    as="select"
                                    value={subcategory.sexe}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "sexe",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="Both">Homme et femme</option>
                                    <option value="Homme">Homme</option>
                                    <option value="Femme">Female</option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col lg={2}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Grades</Form.Label>
                                  <Form.Control
                                    as="select"
                                    multiple
                                    value={subcategory.GradePersonnel}
                                    // onChange={(e) =>
                                    //   handleSubcategoryChange(
                                    //     index,
                                    //     "GradePersonnel",
                                    //     Array.from(e.target.value, (option) => option)
                                    //   )
                                    // }
                                  >
                                    {gradePersonnel?.map((grade) => (
                                      <option key={grade._id} value={grade._id}>
                                        {grade.grade_fr}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              {/* <Col lg={4}>
  <Form.Group className="mb-2">
    <Form.Label>Grades</Form.Label>
    <div className="dropdown">
      <Button
        variant="outline-secondary"
        className="w-100 dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {subcategory.GradePersonnel.length
          ? `${subcategory.GradePersonnel.length} Grades Selected`
          : "Select Grades"}
      </Button>
      <ul className="dropdown-menu w-100 p-2">
        {gradePersonnel?.map((grade) => (
          <li key={grade._id} className="form-check">
            <Form.Check
              type="checkbox"
              id={`grade-${grade._id}`}
              label={grade.grade_fr}
              value={grade._id}
              checked={subcategory.GradePersonnel.includes(grade._id)}
              onChange={(e) => {
                const selectedGrades = subcategory.GradePersonnel.includes(grade._id)
                  ? subcategory.GradePersonnel.filter((id) => id !== grade._id)
                  : [...subcategory.GradePersonnel, grade._id];
                handleSubcategoryChange(index, "GradePersonnel", selectedGrades);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  </Form.Group>
</Col> */}

                              {/* Accumulable */}
                              <Col lg={1}>
                                <Form.Group className="mb-2">
                                  <Form.Label>Accumulable</Form.Label>
                                  <Form.Check
                                    type="checkbox"
                                    checked={subcategory.Accumulable}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "Accumulable",
                                        e.target.checked
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {/* Remove Subcategory Button */}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveSubcategory(index)}
                            >
                              Supprimer la sous-catégorie
                            </Button>
                          </div>
                        ))}
                      </Row>

                      <Row>
                        <Col className="d-flex justify-content-start">
                          <Button
                            variant="success"
                            onClick={handleAddSubcategory}
                            className="mb-3"
                          >
                            Ajouter une sous-catégorie
                          </Button>
                        </Col>

                        <Col className="d-flex justify-content-end">
                          <Button type="submit" variant="primary">
                            Enregistrer
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditAnnuelLeaveType;
