import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  ClassePeriod,
  useAddClassePeriodMutation,
  useFetchClassePeriodsByClassIdQuery,
  useUpdateClassePeriodMutation,
} from "features/classPeriod/classPeriod";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { format } from "date-fns";
import Flatpickr from "react-flatpickr";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import { useGetTeacherPeriodsBySemesterAndIdTeacherQuery } from "features/teachersPeriods/teachersPeriods";
// import { useGetTeacherPeriodsBySemesterAndIdTeacherMutation } from "features/teachersPeriods/teachersPeriods";

const TeacherPeriod = () => {
  document.title = "Liste périodes des emplois enseignants | Smart University";

  const location = useLocation();
  const teacherDetails = location.state;
  console.log("teacherDetails", teacherDetails);

  const { data: teacherPeriods = [], isSuccess: arePeriodsFetched } =
    useGetTeacherPeriodsBySemesterAndIdTeacherQuery({
      teacherId: teacherDetails.enseignant._id,
      semester: teacherDetails.semestre,
    });

  console.log("teacherPeriods", teacherPeriods);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Date Début",
        accessor: "start_date",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date Fin",
        accessor: "end_date",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nombre d'heures d'enseignement",
        accessor: (teacherPeriod: any) => {
          return teacherPeriod?.nbr_heure?.toFixed(2);
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (teacherPeriod: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/gestion-emplois/emlpoi-enseignant/single-emplois"
                  state={{
                    teacher: teacherDetails?.enseignant!,
                    ids: teacherPeriod?.ids!,
                    semestre: teacherDetails?.semestre!,
                    interval: {
                      start_date: teacherPeriod?.start_date,
                      end_date: teacherPeriod?.end_date,
                    },
                  }}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                >
                  <i
                    className="ph ph-eye"
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
          <BreadCrumb
            title="Paramètres des emplois"
            pageTitle="Liste periodes de classe"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={2}>
                      <Form.Label className="mt-3 bg-text-info">
                        {teacherDetails?.enseignant?.prenom_fr!}{" "}
                        {teacherDetails?.enseignant?.nom_fr!} / Semestre{" "}
                        {teacherDetails?.semestre!}
                      </Form.Label>
                    </Col>

                    <Col className="col-lg-auto ms-auto d-flex justify-content-around">
                      <div className="search-box m-2">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
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
                      data={teacherPeriods || []}
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

export default TeacherPeriod;