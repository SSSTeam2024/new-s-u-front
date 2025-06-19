import React, { useState, useMemo, useCallback } from "react";
import {
  Col
} from "react-bootstrap";

import TableContainer from "Common/TableContainer";

import { Link, useLocation } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { actionAuthorization } from "utils/pathVerification";
import { selectCurrentUser } from "features/account/authSlice";
import { useFetchDemandeEtudiantQuery } from "features/demandeEtudiant/demandeEtudiantSlice";

const DemandeTable = () => {
  document.title = "Table Demande Etudiant | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const location = useLocation();
  const studentDetails = location.state;

  const idStudent = studentDetails?._id;

  const { data: demandes, error, isLoading } = useFetchDemandeEtudiantQuery();
  const filteredDemandes = demandes?.filter(
    (demande) =>
      (demande?.studentId! as unknown as { _id: string })?._id! === idStudent
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
                  "/demandes-etudiant/Single-demande-etudiant",
                  user?.permissions!
                ) && (
                    <li>
                      <Link
                        to="/demandes-etudiant/Single-demande-etudiant"
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
            {studentDetails.nom_fr} {studentDetails.prenom_fr}
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

export default DemandeTable;
