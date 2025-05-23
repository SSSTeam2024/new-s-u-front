import React, { useRef, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Etudiant } from "features/etudiant/etudiantSlice";
import userImage from "../../assets/images/users/user-dummy-img.jpg";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import { useFetchServicesPersonnelQuery } from "features/servicePersonnel/servicePersonnel";
import { useFetchCategoriesPersonnelQuery } from "features/categoriePersonnel/categoriePersonnel";

interface Column {
  name: JSX.Element;
  selector: (cell: Etudiant | any) => JSX.Element | any;
  sortable: boolean;
  width?: string;
}

const RepartitionPersonnel = () => {
  document.title = "Répartition des Personnels | ENIGA";

  const { data = [] } = useFetchPersonnelsQuery();

  const { data: AllServices = [] } = useFetchServicesPersonnelQuery();

  const { data: AllCategories = [] } = useFetchCategoriesPersonnelQuery();

  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();

  const lastVariable =
    variableGlobales.length > 0
      ? variableGlobales[variableGlobales.length - 1]
      : null;

  const [selectedServices, setSelectedServices] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleSelectedServices = (e: any) => {
    setSelectedServices(e.target.value);
    setSelectedStatus("status");
    setSelectedCategory("category");
  };

  const handleSelectedStatus = (e: any) => {
    setSelectedStatus(e.target.value);
    setSelectedCategory("category");
    setSelectedServices("service");
  };

  const handleSelectedCategory = (e: any) => {
    setSelectedCategory(e.target.value);
    setSelectedStatus("status");
    setSelectedServices("service");
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const columns: Column[] = [
    {
      name: <span className="font-weight-bold fs-13">Nom Personnel</span>,
      selector: (personnels: any) => {
        return (
          <div className="d-flex align-items-center gap-2">
            <div className="flex-shrink-0">
              <img
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
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matricule</span>,
      selector: (row: any) => row?.matricule!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Service</span>,
      selector: (row: any) => row?.service?.service_fr!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Grade</span>,
      selector: (row: any) => row?.grade?.grade_fr,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Catégorie</span>,
      selector: (row: any) => row?.categorie?.categorie_fr,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Tél</span>,
      selector: (row: any) => row?.num_phone1!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matricule CNRPS</span>,
      selector: (row: any) => row?.mat_cnrps!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Activation</span>,
      selector: (row: any) => <span>{row?.etat_compte?.etat_fr!}</span>,
      sortable: true,
    },
  ];

  const getFilteredPersonnels = () => {
    let filteredPersonnels = data;
    if (selectedServices && selectedServices !== "service") {
      filteredPersonnels = filteredPersonnels.filter(
        (personnel) => personnel?.service?.service_fr! === selectedServices
      );
    }
    if (selectedCategory && selectedCategory !== "category") {
      filteredPersonnels = filteredPersonnels.filter(
        (personnel) => personnel?.categorie?.categorie_fr! === selectedCategory
      );
    }
    if (selectedStatus && selectedStatus !== "status") {
      if (selectedStatus === "Contracuel") {
        filteredPersonnels = filteredPersonnels.filter(
          (personnel) => personnel?.categorie?.categorie_fr! === "Ouvrier"
        );
      } else {
        filteredPersonnels = filteredPersonnels.filter(
          (personnel) =>
            personnel?.categorie?.categorie_fr! === "Administrateur" ||
            personnel?.categorie?.categorie_fr! === "Technicien "
        );
      }
    }
    return filteredPersonnels;
  };

  const extractTextFromJSX = (element: React.ReactNode): string => {
    if (typeof element === "string") {
      return element;
    } else if (Array.isArray(element)) {
      return element.map(extractTextFromJSX).join(" ");
    } else if (React.isValidElement(element)) {
      return extractTextFromJSX(element.props.children);
    }
    return "";
  };

  const exportToExcel = () => {
    const filteredData = getFilteredPersonnels();

    const headers = columns.map((col) =>
      typeof col.name === "string" ? col.name : col.name.props.children
    );

    const formattedData = filteredData.map((row) => {
      let newRow: Record<string, any> = {};

      columns.forEach((col) => {
        const columnName =
          typeof col.name === "string" ? col.name : col.name.props.children;

        const cellValue = col.selector(row);

        if (React.isValidElement(cellValue)) {
          newRow[columnName] = extractTextFromJSX(cellValue);
        } else {
          newRow[columnName] = cellValue;
        }
      });

      return newRow;
    });

    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...formattedData.map(Object.values),
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personnels");
    XLSX.writeFile(workbook, "Personnels.xlsx");
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Répartition des Personnels"
            pageTitle="Gestion des Personnels"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <Row>
                    <Col lg={2}>
                      <select
                        className="form-select"
                        id="idDepartement"
                        name="departement-single-default"
                        onChange={handleSelectedServices}
                        value={selectedServices}
                      >
                        <option value="service">Services</option>
                        {AllServices.map((service) => (
                          <option
                            value={service?.service_fr!}
                            key={service?._id!}
                          >
                            {service.service_fr}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col lg={2}>
                      <select
                        className="form-select"
                        id="idCategory"
                        name="category-single-default"
                        onChange={handleSelectedCategory}
                        value={selectedCategory}
                      >
                        <option value="category">Catégories</option>
                        {AllCategories.map((category) => (
                          <option
                            value={category?.categorie_fr!}
                            key={category?._id!}
                          >
                            {category.categorie_fr}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col lg={2}>
                      <select
                        className="form-select"
                        id="idStatus"
                        name="status-single-default"
                        onChange={handleSelectedStatus}
                        value={selectedStatus}
                      >
                        <option value="status">Statut</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contracuel">Contrat</option>
                      </select>
                    </Col>
                    <Col lg={6} className="d-flex justify-content-end">
                      <div className="hstack gap-3">
                        <Link
                          to="#"
                          className="badge bg-secondary-subtle text-secondary view-item-btn"
                        >
                          <i
                            className="ph ph-printer"
                            style={{
                              transition: "transform 0.3s ease-in-out",
                              cursor: "pointer",
                              fontSize: "2.6em",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.5)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                            onClick={() => reactToPrintFn()}
                          ></i>
                        </Link>
                        <Link
                          to="#"
                          className="badge bg-success-subtle text-success view-item-btn"
                          onClick={exportToExcel}
                        >
                          <i
                            className="ph ph-microsoft-excel-logo"
                            style={{
                              transition: "transform 0.3s ease-in-out",
                              cursor: "pointer",
                              fontSize: "2.6em",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.5)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          ></i>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <DataTable
                    columns={columns}
                    data={getFilteredPersonnels()}
                    pagination
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ display: "none" }}>
            <Col xxl={9}>
              <div ref={contentRef}>
                <Card>
                  <Card.Header className="border-0">
                    <Row className="g-3">
                      <Col lg={4} className="text-center pt-2">
                        <h6>
                          Ministère de l’Enseignement Supérieur et de la
                          Recherche Scientifique
                        </h6>
                        <h6>{lastVariable?.universite_fr!}</h6>
                        <h6>{lastVariable?.etablissement_fr!}</h6>
                      </Col>
                      <Col lg={4} className="text-center">
                        <img
                          className="w-25"
                          src={`${
                            process.env.REACT_APP_API_URL
                          }/files/variableGlobaleFiles/logoRepubliqueFiles/${lastVariable?.logo_republique!}`}
                          alt={lastVariable?.etablissement_fr!}
                        />
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        <h6>الجمهورية التونسية</h6>
                        <h6>وزارة التعليم العالي و البحث العلمي</h6>

                        <h6>{lastVariable?.universite_ar!}</h6>
                        <h6>{lastVariable?.etablissement_ar!}</h6>
                      </Col>
                    </Row>
                    {selectedStatus !== "status" && (
                      <Row className="mt-3">
                        <Col lg={12} className="text-center">
                          <span>
                            Liste des personnels :{" "}
                            <strong>{selectedStatus}</strong>
                          </span>
                        </Col>
                      </Row>
                    )}
                    {selectedCategory !== "category" && (
                      <Row className="mt-3">
                        <Col lg={12} className="text-center">
                          <span>
                            Liste des personnels :{" "}
                            <strong>{selectedCategory}</strong>
                          </span>
                        </Col>
                      </Row>
                    )}
                    {selectedServices !== "service" && (
                      <Row className="mt-3">
                        <Col lg={12} className="text-center">
                          <span>
                            Liste des personnels :{" "}
                            <strong>{selectedServices}</strong>
                          </span>
                        </Col>
                      </Row>
                    )}
                    <Row className="mt-1 mb-1">
                      <Col lg={12} className="text-center">
                        <h6>
                          Année Universitaire {startYear} / {endYear}
                        </h6>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body
                    style={{
                      paddingLeft: "30px",
                      paddingRight: "30px",
                    }}
                  >
                    <div>
                      <Row className="border border-3">
                        <Col lg={3} className="border-end border-3 p-1">
                          <h6>Nom Personnel</h6>
                        </Col>
                        <Col lg={2} className="border-end border-3 p-1">
                          <h6>Matricule</h6>
                        </Col>
                        <Col lg={1} className="border-end border-3 p-1">
                          <h6>Service</h6>
                        </Col>
                        <Col lg={2} className="border-end border-3 p-1">
                          <h6>Grade</h6>
                        </Col>
                        <Col lg={2} className="border-end border-3 p-1">
                          <h6>Catégorie</h6>
                        </Col>
                        <Col lg={1} className="border-end border-3 p-1">
                          <h6>Tél</h6>
                        </Col>
                        <Col lg={1} className="p-1">
                          <h6>Matricule CNRPS</h6>
                        </Col>
                      </Row>
                      <Row className="border border-3">
                        {getFilteredPersonnels().map((personnel: any) => (
                          <>
                            <Col
                              lg={3}
                              className="border-end border-bottom border-3 p-1"
                            >
                              <span>
                                {personnel?.nom_fr!} {personnel?.prenom_fr!}
                              </span>
                            </Col>
                            <Col
                              lg={2}
                              className="border-end border-bottom border-3 p-1"
                            >
                              <span>{personnel?.matricule!}</span>
                            </Col>
                            <Col
                              lg={1}
                              className="border-end border-bottom border-3 p-1"
                            >
                              <span>{personnel?.service?.service_fr!}</span>
                            </Col>
                            <Col
                              lg={2}
                              className="border-end border-bottom border-3 p-1"
                            >
                              <span>{personnel?.grade?.grade_fr!}</span>
                            </Col>
                            <Col
                              lg={2}
                              className="border-end border-bottom border-3 p-1"
                            >
                              <span>{personnel?.categorie?.categorie_fr!}</span>
                            </Col>
                            <Col
                              lg={1}
                              className="border-end border-bottom border-3 p-1"
                            >
                              <span>{personnel?.num_phone1!}</span>
                            </Col>
                            <Col lg={1} className="border-bottom border-3 p-1">
                              <span>{personnel?.mat_cnrps!}</span>
                            </Col>
                          </>
                        ))}
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RepartitionPersonnel;
