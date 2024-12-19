import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import { useFetchShortCodeQuery } from "features/shortCode/shortCodeSlice";

const ShortCode = () => {
  document.title = "Liste des code courts | Smart University";

  const navigate = useNavigate();

  const {data: allShortCodes = []} = useFetchShortCodeQuery()

  const [languageFilter, setLanguageFilter] = useState("tout");


  // Handle language filter change
  const handleLanguageChange = (event:any) => {
    setLanguageFilter(event.target.value);
  };
  // Filter the data based on the selected language
  const filteredShortCodes = useMemo(() => {
    if (languageFilter === "tout") {
      return allShortCodes; // Show all short codes if "All" is selected
    }
    return allShortCodes.filter((shortCode) => shortCode.intended_for === languageFilter);
  }, [allShortCodes, languageFilter]);
  const columns = useMemo(
    () => [
      {
        Header: "Titre",
        accessor: "titre",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Categorie",
        accessor: "intended_for",
        disableFilters: true,
        filterable: true,
      },
      
      {
        Header: "Langue",
        accessor: "langue",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {/* <li>
                        <Link
                          to="#"
                          className="badge bg-info-subtle text-info view-item-btn"
               
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
                        </Link>
                      </li> */}
              <li>
                <Link
                  to="#"
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
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
                      (e.currentTarget.style.transform = "scale(1.2)")
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
    []
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Code Court" pageTitle="Liste des codes courts" />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
                      <select
                        className="form-select"
                        id="idStatus"
                        name="choices-single-default"
                        value={languageFilter}
                        onChange={handleLanguageChange}
                      >
                        <option defaultValue="tout">Tout</option>
                        <option value="global">Globale</option>
                        <option value="enseignant">Enseignant</option>
                        <option value="etudiant">Etudiant</option>
                        <option value="personnel">Personnel</option>
                     
                      </select>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() =>navigate("/shortCode/ajouter-short-code")}
                        >
                          Ajouter un code court
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <TableContainer
                      columns={columns || []}
                      data={filteredShortCodes  || []}
                      // isGlobalFilter={false}
                      iscustomPageSize={false}
                      isBordered={false}
                      customPageSize={10}
                      className="custom-header-css table align-middle table-nowrap"
                      tableClass="table-centered align-middle table-nowrap mb-0"
                      theadClass="text-muted table-light"
                      SearchPlaceholder="Search Products..."
                    />
                  </table>
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center py-4">
                      <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                          <i className="bi bi-search"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ seller We did not find any
                        seller for you search.
                      </p>
                    </div>
                  </div>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ShortCode;