import React, { useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import { Link } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { useFetchMissionQuery } from "features/mission/missionSlice";
import {
  TemplateBody,
  useFetchTemplateBodyQuery,
} from "features/templateBody/templateBodySlice";

const ListeMissions = () => {
  document.title = "Liste des missions | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: missions } = useFetchMissionQuery();
  const { data: templateBodies } = useFetchTemplateBodyQuery();

  const templateBody: TemplateBody[] = Array.isArray(templateBodies)
    ? templateBodies
    : [];

  // State to track which row has the select dropdown visible

  console.log("templates", templateBodies);
  const [visibleRow, setVisibleRow] = useState<number | null>(null);
  const missionTemplates: any = templateBodies?.filter(
    (template) => template.intended_for === "mission"
  );
  console.log(missionTemplates);
  const navigate = useNavigate();
  const handleAction = (cellProps: any, templateBody: any) => {
    // Initialize the navigate function

    // Navigate to another page, passing the state with `cellProps` and `templateBody`
    navigate("/gestion-mission/generer-fiche", {
      state: {
        cellProps,
        templateBody,
      },
    });
  };

  function tog_AddTask() {
    navigate("/gestion-mission/ajouter-mission");
  }

  const columns = useMemo(
    () => [
      {
        Header: "Motif de la tâche",
        accessor: "motif",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Attribué à",
        accessor: (row: any) => {
          if (row.personnel !== null) {
            return (
              <>
                {row.personnel?.nom_fr +
                  " " +
                  row.personnel?.prenom_fr +
                  " | Personnel"}
              </>
            );
          } else {
            return (
              <>
                {row.enseignant?.nom_fr +
                  " " +
                  row.enseignant?.prenom_fr +
                  " | Enseignant"}
              </>
            );
          }
        },
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Date d'affectation",
        accessor: "date_affectation",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: " Date de fin",
        accessor: "date_fin",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Objectif",
        accessor: "objectif",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Etat",
        accessor: "etat",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any, rowIndex: number) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li className="dropdown">
                <button
                  className="btn btn-info btn-sm dropdown-toggle"
                  id={`dropdownMenuButton-${rowIndex}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="ph ph-eye"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </button>

                <ul
                  className="dropdown-menu"
                  aria-labelledby={`dropdownMenuButton-${rowIndex}`}
                  style={{ minWidth: "150px" }}
                >
                  {" "}
                  {
                    // missionTemplates?.length > 0 ? (
                    missionTemplates?.map((template: any) => (
                      <li key={template._id}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleAction(cellProps, template)}
                        >
                          {template.title}
                        </button>
                      </li>
                    ))
                    // )
                    //  : (
                    //   <li>
                    //     <span className="dropdown-item text-muted">
                    //       Aucun modèle disponible
                    //     </span>
                    //   </li>
                    // )
                  }
                </ul>
              </li>
              <li>
                <Link
                  to="/avis-enseignant/edit-avis-enseignant"
                  className="badge bg-success-subtle text-success edit-item-btn"
                  state={cellProps}
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                >
                  <i
                    className="ph ph-trash"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [visibleRow]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liste des Taches" pageTitle="Tache" />

          <Row id="usersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-lg-2 g-4">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher ..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddTask()}
                        >
                          Ajouter une tache
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  <TableContainer
                    columns={columns || []}
                    data={missions || []}
                    // isGlobalFilter={false}
                    iscustomPageSize={false}
                    isBordered={false}
                    customPageSize={10}
                    className="custom-header-css table align-middle table-nowrap"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Products..."
                  />
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center">
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ Orders We did not find any
                        orders for you search.
                      </p>
                    </div>
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

export default ListeMissions;
