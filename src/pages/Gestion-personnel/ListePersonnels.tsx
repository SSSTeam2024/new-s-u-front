import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import userImage from "assets/images/profile-bg.jpg";
import {
  Personnel,
  useDeletePersonnelMutation,
  useFetchPersonnelsQuery,
} from "features/personnel/personnelSlice";

const ListePersonnels = () => {
  document.title = "Liste des personnels | Smart University";

  const navigate = useNavigate();

  const [modal_AddEnseignantModals, setmodal_AddEnseignantModals] =
    useState<boolean>(false);
  function tog_AddEnseignantModals() {
    navigate("/AjouterPersonnel");
  }

  function tog_AddPersonnel() {
    navigate("/AjouterPersonnel");
  }
  const { data = [] } = useFetchPersonnelsQuery();
  const [personnelCount, setPersonnelCount] = useState(0);

  useEffect(() => {
    if (data) {
      setPersonnelCount(data.length);
    }
  }, [data]);

  const [deletePersonnel] = useDeletePersonnelMutation();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deletePersonnel(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Personnel a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Personnel est en sécurité :)",
            "error"
          );
        }
      });
  };
  const activatedPersonnelsCount = data.filter(
    (personnel) => personnel.etat_compte?.etat_fr === "Compte Activé"
  ).length;
  const deactivatedPersonnelsCount = data.filter(
    (personnel) => personnel.etat_compte?.etat_fr === "Compte désactivé"
  ).length;

  const columns = useMemo(
    () => [
      {
        Header: "Nom Personnel",
        disableFilters: true,
        filterable: true,
        accessor: (personnels: Personnel) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                style={{borderRadius:"50%"}}
                  src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${personnels.photo_profil}`}
                  alt="etudiant-img"
                  id="photo_profil"
                  className="avatar-xs rounded-circle user-profile-img"
                  onError={(e) => {
                    e.currentTarget.src = userImage;
                  }}
                />
              </div>
              <div className="flex-grow-1 user_name">
                {personnels.nom_fr} {personnels.prenom_fr}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Matricule",
        accessor: "_id",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nom et Prénom",
        accessor: (row: any) => `${row.prenom_fr} ${row.nom_fr}`,
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Service",
        accessor: (row: any) => row?.service?.service_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Poste",
        accessor: (row: any) => row?.poste?.poste_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Grade",
        accessor: (row: any) => row?.grade?.grade_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Catégorie",
        accessor: (row: any) => row?.categorie?.categorie_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Tél",
        accessor: "num_phone1",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Activation",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) => row?.etat_compte?.etat_fr || "",
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case "Inscrit / Activé":
              return (
                <span className="badge bg-success-subtle text-success">
                  {value}
                </span>
              );
            case "Non inscrit":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {value}
                </span>
              );
            default:
              return (
                <span className="badge bg-success-subtle text-info">
                  {value}
                </span>
              );
          }
        },
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (personnel: Personnel) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/gestion-personnel/compte-personnel"
                  className="badge bg-info-subtle text-info view-item-btn"
                  state={personnel}
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
                  to="/gestion-personnel/edit-compte-personnel"
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  state={personnel}
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
                    onClick={() => AlertDelete(personnel?._id!)}
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
          <Breadcrumb
            title="Gestion des personnels"
            pageTitle="Liste des personnels "
          />
          <Row>
            <Col xxl={3} md={6}>
              <Card className="card-height-100 bg-warning-subtle border-0 overflow-hidden">
                <div className="position-absolute end-0 start-0 top-0 z-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="400"
                    height="250"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 250"
                  >
                    <g mask='url("#SvgjsMask1530")' fill="none">
                      <path
                        d="M209 112L130 191"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M324 10L149 185"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1532)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M333 35L508 -140"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1532)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M282 58L131 209"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M290 16L410 -104"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1532)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M216 186L328 74"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M255 53L176 132"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M339 191L519 11"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M95 151L185 61"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1532)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M249 16L342 -77"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1532)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M129 230L286 73"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M80 216L3 293"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1531)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                    </g>
                    <defs>
                      <mask id="SvgjsMask1530">
                        <rect width="400" height="250" fill="#ffffff"></rect>
                      </mask>
                      <linearGradient
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                        id="SvgjsLinearGradient1531"
                      >
                        <stop
                          stopColor="rgba(var(--tb-warning-rgb), 0)"
                          offset="0"
                        ></stop>
                        <stop
                          stopColor="rgba(var(--tb-warning-rgb), 0.2)"
                          offset="1"
                        ></stop>
                      </linearGradient>
                      <linearGradient
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                        id="SvgjsLinearGradient1532"
                      >
                        <stop
                          stopColor="rgba(var(--tb-warning-rgb), 0)"
                          offset="0"
                        ></stop>
                        <stop
                          stopColor="rgba(var(--tb-warning-rgb), 0.2)"
                          offset="1"
                        ></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <Card.Body className="p-4 z-1 position-relative">
                  <h4 className="fs-22 fw-semibold mb-3">
                    <CountUp
                      start={0}
                      end={personnelCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Nombre de personnels
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={3} md={6}>
              <Card className="card-height-100 bg-success-subtle border-0 overflow-hidden">
                <div className="position-absolute end-0 start-0 top-0 z-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="400"
                    height="250"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 250"
                  >
                    <g mask='url("#SvgjsMask1608")' fill="none">
                      <path
                        d="M390 87L269 208"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1609)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M358 175L273 260"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M319 84L189 214"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1609)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M327 218L216 329"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M126 188L8 306"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M220 241L155 306"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M361 92L427 26"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1609)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M391 188L275 304"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1609)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M178 74L248 4"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M84 52L-56 192"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M183 111L247 47"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1610)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M46 8L209 -155"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1609)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                    </g>
                    <defs>
                      <mask id="SvgjsMask1608">
                        <rect width="400" height="250" fill="#ffffff"></rect>
                      </mask>
                      <linearGradient
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                        id="SvgjsLinearGradient1609"
                      >
                        <stop
                          stopColor="rgba(var(--tb-success-rgb), 0)"
                          offset="0"
                        ></stop>
                        <stop
                          stopColor="rgba(var(--tb-success-rgb), 0.2)"
                          offset="1"
                        ></stop>
                      </linearGradient>
                      <linearGradient
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                        id="SvgjsLinearGradient1610"
                      >
                        <stop
                          stopColor="rgba(var(--tb-success-rgb), 0)"
                          offset="0"
                        ></stop>
                        <stop
                          stopColor="rgba(var(--tb-success-rgb), 0.2)"
                          offset="1"
                        ></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <Card.Body className="p-4 z-1 position-relative">
                  <h4 className="fs-22 fw-semibold mb-3">
                    <CountUp
                      start={0}
                      end={activatedPersonnelsCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Personnels Activés
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={3} md={6}>
              <Card className="card-height-100 bg-info-subtle border-0 overflow-hidden">
                <div className="position-absolute end-0 start-0 top-0 z-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="400"
                    height="250"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 250"
                  >
                    <g mask='url("#SvgjsMask1551")' fill="none">
                      <path
                        d="M306 65L446 -75"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1552)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M399 2L315 86"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M83 77L256 -96"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M281 212L460 33"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M257 62L76 243"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M305 123L214 214"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1552)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M327 222L440 109"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1552)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                      <path
                        d="M287 109L362 34"
                        strokeWidth="10"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M259 194L332 121"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M376 186L240 322"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M308 153L123 338"
                        strokeWidth="6"
                        stroke="url(#SvgjsLinearGradient1553)"
                        strokeLinecap="round"
                        className="TopRight"
                      ></path>
                      <path
                        d="M218 62L285 -5"
                        strokeWidth="8"
                        stroke="url(#SvgjsLinearGradient1552)"
                        strokeLinecap="round"
                        className="BottomLeft"
                      ></path>
                    </g>
                    <defs>
                      <mask id="SvgjsMask1551">
                        <rect width="400" height="250" fill="#ffffff"></rect>
                      </mask>
                      <linearGradient
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                        id="SvgjsLinearGradient1552"
                      >
                        <stop
                          stopColor="rgba(var(--tb-info-rgb), 0)"
                          offset="0"
                        ></stop>
                        <stop
                          stopColor="rgba(var(--tb-info-rgb), 0.2)"
                          offset="1"
                        ></stop>
                      </linearGradient>
                      <linearGradient
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                        id="SvgjsLinearGradient1553"
                      >
                        <stop
                          stopColor="rgba(var(--tb-info-rgb), 0)"
                          offset="0"
                        ></stop>
                        <stop
                          stopColor="rgba(var(--tb-info-rgb), 0.2)"
                          offset="1"
                        ></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <Card.Body className="p-4 z-1 position-relative">
                  <h4 className="fs-22 fw-semibold mb-3">
                    <CountUp
                      start={0}
                      end={deactivatedPersonnelsCount}
                      duration={3}
                      decimals={0}
                    />
                  </h4>
                  <p className="mb-0 fw-medium text-uppercase fs-14">
                    Personnels Desactivés
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

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
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddPersonnel()}
                        >
                          Ajouter Personnel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  {/* <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  > */}
                    <TableContainer
                      columns={columns || []}
                      data={data || []}
                      // isGlobalFilter={false}
                      iscustomPageSize={false}
                      isBordered={false}
                      customPageSize={10}
                      className="custom-header-css table align-middle table-nowrap"
                      tableClass="table-centered align-middle table-nowrap mb-0"
                      theadClass="text-muted table-light"
                      SearchPlaceholder="Search Products..."
                    />
                  {/* </table> */}
                  {/* </div> */}
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

export default ListePersonnels;