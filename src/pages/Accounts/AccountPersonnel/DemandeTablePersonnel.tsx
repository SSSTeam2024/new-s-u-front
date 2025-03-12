import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import TableContainer from "Common/TableContainer";
import Flatpickr from "react-flatpickr";
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";
import { Link, useLocation } from "react-router-dom";
import img1 from "assets/images/users/avatar-1.jpg";
import { useFetchDemandePersonnelQuery } from "features/demandePersonnel/demandePersonnelSlice";

const DemandeTablePersonnel = () => {
  document.title = " Table Demande Personnel | ENIGA";

  const location = useLocation();
  const personnelDetails = location.state;
  const idPersonnel = personnelDetails?._id;

  const { data: demandes, error, isLoading } = useFetchDemandePersonnelQuery();
  const filteredDemandes = demandes?.filter(
    (demande) =>
      (demande.personnelId as unknown as { _id: string })._id === idPersonnel
  );

  const [modal_AddUserModals, setmodal_AddUserModals] =
    useState<boolean>(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
  function tog_AddUserModals() {
    setmodal_AddUserModals(!modal_AddUserModals);
  }

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkAll") as HTMLInputElement;
    const ele = document.querySelectorAll(".userCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    checkedbox();
  }, []);

  const checkedbox = () => {
    const ele = document.querySelectorAll(".userCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Pièce demandée",
        accessor: "title",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Description",
        accessor: "description",
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
        Header: "Nbr Copie",
        accessor: "nombre_copie",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Date d'Envoi",
        accessor: "createdAt",
        disableFilters: true,
        filterable: true,
        Cell: ({ value }: { value: any }) =>
          new Date(value).toLocaleDateString(),
      },
      {
        Header: "Etat",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          switch (cellProps.status) {
            case "en cours":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.status}
                </span>
              );
            case "Inactive":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {" "}
                  {cellProps.status}
                </span>
              );
            default:
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.status}
                </span>
              );
          }
        },
      },

      {
        Header: "Actions",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/SingleDemandeEtudiant"
                  state={cellProps}
                  className="badge bg-info-subtle text-info view-item-btn"
                  data-bs-toggle="offcanvas"
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
              </li>
              <li>
                <Link
                  to="/EditDemandeEtudiant"
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
    [checkedAll]
  );

  return (
    <React.Fragment>
      <Col md={9}>
        <div className="flex-grow-1 card-title m-2">
          <h5>
            {" "}
            {personnelDetails.nom_fr} {personnelDetails.prenom_fr}
          </h5>
        </div>
      </Col>

      <TableContainer
        columns={columns || []}
        data={filteredDemandes || []}
        // isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={10}
        isPagination={true}
        className="custom-header-css table align-middle table-nowrap"
        tableClass="table-centered align-middle table-nowrap mb-0"
        theadClass="text-muted table-light"
        SearchPlaceholder="Search Products..."
      />
      <div className="noresult" style={{ display: "none" }}>
        <div className="text-center">
          <h5 className="mt-2">Sorry! No Result Found</h5>
          <p className="text-muted mb-0">
            We've searched more than 150+ Orders We did not find any orders for
            you search.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DemandeTablePersonnel;
