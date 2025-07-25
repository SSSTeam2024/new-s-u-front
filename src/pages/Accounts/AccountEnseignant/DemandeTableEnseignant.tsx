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
import { actionAuthorization } from "utils/pathVerification";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import img1 from "assets/images/users/avatar-1.jpg";
import { useFetchDemandeEnseignantQuery } from "features/demandeEnseignant/demandeEnseignantSlice";

const DemandeTableEnseignant = () => {
  document.title = "Table Demande Enseignant | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const location = useLocation();
  const EnseignantDetails = location.state;

  const idEnseignant = EnseignantDetails?._id;

  const { data: demandes, error, isLoading } = useFetchDemandeEnseignantQuery();
  // Filter demandes only if idEnseignant is defined
  const filteredDemandes = useMemo(() => {
    if (!idEnseignant || !demandes) return [];
    return demandes.filter(
      (demande) =>
        (demande.enseignantId as unknown as { _id: string })._id ===
        idEnseignant
    );
  }, [demandes, idEnseignant]);

  const [modal_AddUserModals, setmodal_AddUserModals] =
    useState<boolean>(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
 

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
        Header: "Titre Demande",
        accessor: (row: any) => row.piece_demande?.title || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Ajouté par",
        accessor: (row: any) => row.added_by?.login! || "",
        disableFilters: true,
        filterable: true,
      }
      ,

      {
        Header: "Langue",
        accessor: (row: any) => {
          if (row.langue === "arabic") return "Arabe";
          if (row.langue === "french") return "Français";
          return ""; // fallback if langue is undefined or other
        },
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
          switch (cellProps.current_status) {
            case "Approuvée":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
            case "Réfusée":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
            case "Générée":
              return (
                <span className="badge bg-secondary-subtle text-secondary">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
            default:
              return (
                <span className="badge bg-warning-subtle text-warning">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
          }
        },
      },

      {
        Header: "Visualiser Demande",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <div>
              <ul className="hstack gap-2 list-unstyled mb-1">
                {actionAuthorization(
                  "/demandes-enseignant/single-demande-enseignant",
                  user?.permissions!
                ) && (
                    <li>
                      <Link
                        to="/demandes-enseignant/single-demande-enseignant"
                        state={cellProps}
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
                    </li>
                  )}

              </ul>

            </div>
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
            {EnseignantDetails.nom_fr} {EnseignantDetails.prenom_fr}
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

export default DemandeTableEnseignant;
