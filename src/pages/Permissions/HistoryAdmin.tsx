import React, { useMemo, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";

import { sellerList } from "Common/data";
import Swal from "sweetalert2";
import TableContainer from "Common/TableContainer";
import {useFetchUserPermissionsHistoryByUserIdQuery} from "features/userPermissions/userPermissionSlice"
import { useLocation } from "react-router-dom";

const HistoryAdmin = () => {
  document.title = "Historique des permissions | Smart University";
  
  const navigate = useNavigate();

  const location = useLocation();
  const userId = location.state._id;

  const { data } = useFetchUserPermissionsHistoryByUserIdQuery({ userId });
  console.log("userHistory:",data)
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });




  const columns = useMemo(
    () => [
       
        {
            Header: "Permission",
            accessor: (row: any) => row.permission_id?.name || "",
            disableFilters: true,
            filterable: true,
        },
        // {
        //     Header: "Section",
        //     accessor: "section",
        //     disableFilters: true,
        //     filterable: true,
        // },
        {
            Header: "Sous section",
            accessor: (row: any) => row.permission_id?.sub_section || "",
            disableFilters: true,
            filterable: true,
        },
        {
            Header: "assigné à",
            accessor: "assigned_at",
            disableFilters: true,
            filterable: true,
        },
        {
            Header: "retiré à",
            accessor: "updated_at",
            disableFilters: true,
            filterable: true,
        },
   
    
       
        // {
        //     Header: "Action",
        //     disableFilters: true,
        //     filterable: true,
        //     accessor: (classe: any) => {
        //         return (
        //             <ul className="hstack gap-2 list-unstyled mb-0">
                     
        //               <li>
        //                 <Link
        //                   to="#"
        //                   className="badge bg-primary-subtle text-primary edit-item-btn"
                    
        //                 >
        //                   <i
        //                     className="ph ph-pencil-line"
        //                     style={{
        //                       transition: "transform 0.3s ease-in-out",
        //                       cursor: "pointer",
        //                       fontSize: "1.5em",
        //                     }}
        //                     onMouseEnter={(e) =>
        //                       (e.currentTarget.style.transform = "scale(1.2)")
        //                     }
        //                     onMouseLeave={(e) =>
        //                       (e.currentTarget.style.transform = "scale(1)")
        //                     }
        //                   ></i>
        //                 </Link>
        //               </li>
        //               <li>
        //                 <Link
        //                   to="#"
        //                   className="badge bg-danger-subtle text-danger remove-item-btn"
        //                 >
        //                   <i
        //                     className="ph ph-trash"
        //                     style={{
        //                       transition: "transform 0.3s ease-in-out",
        //                       cursor: "pointer",
        //                       fontSize: "1.5em",
        //                     }}
        //                     onMouseEnter={(e) =>
        //                       (e.currentTarget.style.transform = "scale(1.2)")
        //                     }
        //                     onMouseLeave={(e) =>
        //                       (e.currentTarget.style.transform = "scale(1)")
        //                     }
                            
        //                   ></i>
        //                 </Link>
        //               </li>
        //             </ul>
        //           );
        //     },
        // },
    ],
    []
);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des départements"
            pageTitle="Liste des classes"
          />

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
                      >
                        <option defaultValue="All">Status</option>
                        <option value="All">tous</option>
                        <option value="Active">Activé</option>
                        <option value="Inactive">Desactivé</option>
                      </select>
                    </Col>

                    {/* <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          
                        >
                          Ajouter classe
                        </Button>
                      </div>
                    </Col> */}
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
                 <React.Fragment>
            <TableContainer
                columns={(columns || [])}
                data={(data || [])}
                // isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-header-css table align-middle table-nowrap"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder='Search Products...'
            />
        </React.Fragment>
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

export default HistoryAdmin;