import React, { useState, useMemo, useCallback } from "react";
import { Col } from "react-bootstrap";
import TableContainer from "Common/TableContainer";
import { Link, useLocation } from "react-router-dom";
import { useFetchDemandeEnseignantQuery } from "../../../features/demandeEnseignant/demandeEnseignantSlice";

const DemandeTableEnseignant = () => {
  document.title = "table Demande Enseignant | Smart University";

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
                  to="/demandes-enseignant/single-demande-enseignant"
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
                  to="/demandes-enseignant/edit-demande-enseignant"
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