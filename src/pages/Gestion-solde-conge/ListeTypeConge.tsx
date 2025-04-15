import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import TableContainer from "Common/TableContainer";
import Flatpickr from "react-flatpickr";
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import { actionAuthorization } from "utils/pathVerification";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useFetchLeaveTypeQuery,
  useAddLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} from "features/congé/leaveTypeSlice";

type VisibleSubcategories = Record<string, boolean>;

const ListeLeaveType = () => {
  document.title = "Liste solde Congés | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const MySwal = withReactContent(Swal);

  // Fetch reclamations query hook
  const { data: leaveTypes, error, isLoading } = useFetchLeaveTypeQuery();
  console.log("leaveTypes", leaveTypes);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/type-conge/ajouter-type-conge");
  };

  const [visibleSubcategories, setVisibleSubcategories] =
    useState<VisibleSubcategories>({});

  // Toggle visibility for a specific leave type
  const toggleSubcategories = (id: string) => {
    setVisibleSubcategories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleEdit = (id: string) => {
    navigate(`/type-conge/edit-annuel-type-conge`, { state: { id } });
  };
  return (
    <React.Fragment>
      <Container fluid className="page-content">
        <Row className="align-items-center mb-4">
          <Col>
            <h2>Liste des Types de Congé</h2>
          </Col>
          {/* <Col className="text-end">
            <Button onClick={handleNavigate} variant="primary">
              Ajouter type congé
            </Button>
          </Col> */}
        </Row>

        <Row>
          {leaveTypes && leaveTypes.length > 0 ? (
            leaveTypes.map((leaveType) => (
              <Col lg={4} md={6} sm={12} key={leaveType._id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title>{leaveType.name_fr}</Card.Title>
                      {/* Edit button aligned to the right (conditionally rendered) */}

                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleEdit(leaveType._id)}
                      >
                        Paramétrer
                      </Button>
                    </div>
                    <Card.Text>
                      <strong>Accumulable:</strong>{" "}
                      {leaveType.Accumulable ? "Oui" : "Non"}
                      <br />
                      <strong>Sexe:</strong>{" "}
                      {leaveType.sexe === "Both"
                        ? "Homme et femme"
                        : leaveType.sexe === "Homme"
                        ? "Homme"
                        : "Femme"}{" "}
                      <br />
                      <strong>Description:</strong>{" "}
                      {leaveType.description || "N/A"}
                    </Card.Text>

                    {/* Toggle Button for Subcategories */}
                    <Button
                      variant="link"
                      className="p-0 mb-2"
                      onClick={() => toggleSubcategories(leaveType._id)}
                    >
                      {visibleSubcategories[leaveType._id]
                        ? "Masquer les sous-catégories"
                        : "Voir les sous-catégories"}
                    </Button>

                    {/* Conditionally render subcategories */}
                    {visibleSubcategories[leaveType._id] &&
                      leaveType.subcategories && (
                        <ul className="list-unstyled">
                          {leaveType.subcategories.map((subcategory, index) => (
                            <li key={index}>
                              {subcategory.name_fr}: ({subcategory.maxDays}{" "}
                              jours)
                            </li>
                          ))}
                        </ul>
                      )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">Aucun type de congé trouvé.</p>
            </Col>
          )}
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default ListeLeaveType;
