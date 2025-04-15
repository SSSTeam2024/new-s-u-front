import React, { useRef, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import userImage from "../../assets/images/users/user-dummy-img.jpg";
import Breadcrumb from "Common/BreadCrumb";
import {
  Etudiant,
  useFetchEtudiantsQuery,
} from "features/etudiant/etudiantSlice";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import * as XLSX from "xlsx";

interface Column {
  name: JSX.Element;
  selector: (cell: Etudiant | any) => JSX.Element | any;
  sortable: boolean;
  width?: string;
}

const RechercheAvance = () => {
  document.title = "Recherche Avancé | ENIGA";

  const customTableStyles = {
    rows: {
      style: {
        minHeight: "72px",
        border: "1px solid #ddd",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        border: "1px solid #ddd",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        border: "1px solid #ddd",
      },
    },
  };

  const customStyles = {
    control: (styles: any, { isFocused }: any) => ({
      ...styles,
      minHeight: "41px",
      borderColor: isFocused ? "#4b93ff" : "#e9ebec",
      boxShadow: isFocused ? "0 0 0 1px #4b93ff" : styles.boxShadow,
      ":hover": {
        borderColor: "#4b93ff",
      },
    }),
    multiValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        backgroundColor: "#4b93ff",
      };
    },
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
      color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "white",
      backgroundColor: "#4b93ff",
      ":hover": {
        backgroundColor: "#4b93ff",
        color: "white",
      },
    }),
  };

  const { data = [] } = useFetchEtudiantsQuery();

  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();

  const uniqueYears = Array.from(
    new Set(data.map((etudiant) => etudiant.annee_scolaire))
  );

  const uniqueFilieres = Array.from(
    new Set(data.map((etudiant) => etudiant.filiere))
  );

  const uniqueGouvernorats = Array.from(
    new Set(data.map((etudiant) => etudiant.gouvernorat))
  ).sort((a, b) => a.localeCompare(b));

  const lastVariable =
    variableGlobales.length > 0
      ? variableGlobales[variableGlobales.length - 1]
      : null;

  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const [selectedFiltre, setSelectedFiltre] = useState<string>("");

  const [selectedSessionBac, setSelectedSessionBac] = useState<string>("");

  const handleSelectedGenre = (e: any) => {
    setSelectedGenre(e.target.value);
  };

  const handleSelectedSessionBac = (e: any) => {
    setSelectedSessionBac(e.target.value);
  };

  const handleSelectedFiltre = (e: any) => {
    setSelectedFiltre(e.target.value);
  };

  const columns: Column[] = [
    {
      name: <span className="font-weight-bold fs-13">Nom Etudiant</span>,
      selector: (etudiants: any) => {
        return (
          <div className="d-flex align-items-center gap-2">
            <div className="flex-shrink-0">
              <img
                src={`${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${etudiants.photo_profil}`}
                alt="etudiant-img"
                id="photo_profil"
                className="avatar-xs rounded-circle user-profile-img"
                onError={(e) => {
                  e.currentTarget.src = userImage;
                }}
              />
            </div>
            <div className="flex-grow-1 user_name">
              {etudiants?.nom_fr!} {etudiants?.prenom_fr!}
            </div>
          </div>
        );
      },
      sortable: true,
      width: "222px",
    },
    {
      name: <span className="font-weight-bold fs-13">CIN</span>,
      selector: (row: any) => row?.num_CIN!,
      sortable: true,
      width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row: any) => row?.email!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Téléphone</span>,
      selector: (row: any) => row?.num_phone!,
      sortable: true,
      width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Gouvernorat</span>,
      selector: (row: any) => row?.gouvernorat!,
      sortable: true,
      width: "93px",
    },
    {
      name: <span className="font-weight-bold fs-13">Groupe Classe</span>,
      selector: (row: any) => row?.Groupe!,
      sortable: true,
      width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Genre</span>,
      selector: (row: any) => row?.sexe!,
      sortable: true,
      width: "71px",
    },
    {
      name: <span className="font-weight-bold fs-13">Date d'inscription</span>,
      selector: (row: any) =>
        format(new Date(row.createdAt), "yyyy-MM-dd - HH:mm"),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etat Compte</span>,
      selector: (row: any) => row?.etat_compte?.etat_fr,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type inscription</span>,
      selector: (row: any) => <span>{row?.type_inscription?.type_fr}</span>,
      sortable: true,
      width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Année Bac</span>,
      selector: (row: any) => row?.annee_scolaire!,
      sortable: true,
      width: "98px",
    },
    {
      name: <span className="font-weight-bold fs-13">Nature Bac</span>,
      selector: (row: any) => row?.filiere!,
      sortable: true,
      width: "98px",
    },
    {
      name: <span className="font-weight-bold fs-13">Session Bac</span>,
      selector: (row: any) => row?.session!,
      sortable: true,
      width: "98px",
    },
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  const optionColumnsTable = [
    { value: "Nom Etudiant", label: "Nom Etudiant" },
    { value: "CIN", label: "CIN" },
    { value: "Groupe Classe", label: "Groupe Classe" },
    { value: "Genre", label: "Genre" },
    { value: "Date d'inscription", label: "Date d'inscription" },
    { value: "Etat Compte", label: "Etat Compte" },
    { value: "Type inscription", label: "Type inscription" },
    { value: "Année Bac", label: "Année Bac" },
    { value: "Téléphone", label: "Téléphone" },
    { value: "Email", label: "Email" },
    { value: "Gouvernorat", label: "Gouvernorat" },
    { value: "Nature Bac", label: "Nature Bac" },
    { value: "Session Bac", label: "Session Bac" },
  ];

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const filteredColumns = columns.filter(
    (column: Column) =>
      !selectedColumnValues.includes(column.name.props.children)
  );

  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const handlePrint = () => {
    if (filteredColumns.length > 6) {
      alert("Le nombre de colonnes à imprimer ne doit pas dépasser 6.");
    } else {
      reactToPrintFn();
    }
  };

  const optionAnneeBac = uniqueYears.map((year) => ({
    value: year,
    label: year,
  }));

  const [selectedAnneeBac, setSelectedAnneeBac] = useState<any[]>([]);

  const handleSelectAnneeBacChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedAnneeBac(values);
  };

  const optionNatureBac = uniqueFilieres.map((filiere) => ({
    value: filiere,
    label: filiere,
  }));

  const [selectedNatureBac, setSelectedNatureBac] = useState<any[]>([]);

  const handleSelectNatureBacChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedNatureBac(values);
  };

  const optionType = [
    { value: "Nouveau", label: "Nouveau" },
    { value: "Mutation", label: "Mutation" },
    { value: "Réintégration", label: "Réintégration" },
    {
      value: "Délimitation exceptionnelle",
      label: "Délimitation exceptionnelle",
    },
    { value: "Redoublant", label: "Redoublant" },
  ];

  const [selectedTypeInscri, setSelectedTypeInscri] = useState<any[]>([]);

  const handleSelectTypeInscriChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedTypeInscri(values);
  };

  const optionGouvernorat = uniqueGouvernorats.map((gouvernorat) => ({
    value: gouvernorat,
    label: gouvernorat,
  }));

  const [selectedGouvernorat, setSelectedGouvernorat] = useState<any[]>([]);

  const handleSelectGouvernoratChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedGouvernorat(values);
  };

  const getFilteredEtudiants = () => {
    let filteredEtudiants = data;
    if (selectedGenre && selectedGenre !== "all") {
      filteredEtudiants = filteredEtudiants.filter(
        (etudiant) => etudiant.sexe === selectedGenre
      );
    }
    if (selectedSessionBac && selectedSessionBac !== "all") {
      filteredEtudiants = filteredEtudiants.filter(
        (etudiant) => etudiant.session === selectedSessionBac
      );
    }
    if (selectedAnneeBac && selectedAnneeBac.length !== 0) {
      filteredEtudiants = filteredEtudiants.filter((etudiant) =>
        selectedAnneeBac.includes(etudiant.annee_scolaire)
      );
    }

    if (selectedGouvernorat && selectedGouvernorat.length !== 0) {
      filteredEtudiants = filteredEtudiants.filter((etudiant) =>
        selectedGouvernorat.includes(etudiant.gouvernorat)
      );
    }

    if (selectedTypeInscri && selectedTypeInscri.length !== 0) {
      filteredEtudiants = filteredEtudiants.filter((etudiant) =>
        selectedTypeInscri.includes(etudiant?.type_inscription?.type_fr!)
      );
    }
    if (selectedNatureBac && selectedNatureBac.length !== 0) {
      filteredEtudiants = filteredEtudiants.filter((etudiant) =>
        selectedNatureBac.includes(etudiant?.filiere!)
      );
    }
    return filteredEtudiants;
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
    const filteredData = getFilteredEtudiants();

    const headers = filteredColumns.map((col) =>
      typeof col.name === "string" ? col.name : col.name.props.children
    );

    const formattedData = filteredData.map((row) => {
      let newRow: Record<string, any> = {};

      filteredColumns.forEach((col) => {
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

    XLSX.utils.book_append_sheet(workbook, worksheet, "Etudiants");
    XLSX.writeFile(workbook, "Etudiants.xlsx");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Recherche Avancé"
            pageTitle="Gestion des Etudiants"
          />
          <Row>
            <Card>
              <Card.Header>
                <Row>
                  <Col lg={4}>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                      styles={customStyles}
                      onChange={handleSelectValueColumnChange}
                      placeholder="Sélection des colonnes"
                    />
                  </Col>
                  <Col lg={4}>
                    <select
                      className="form-select"
                      id="idFiltre"
                      name="filtres-single-default"
                      onChange={handleSelectedFiltre}
                    >
                      <option defaultValue="">Filtre</option>
                      <option value="Genre">Genre</option>
                      <option value="Année de Bac">Année de Bac</option>
                      <option value="Session Bac">Session Bac</option>
                      <option value="Nature Bac">Nature Bac</option>
                      <option value="Gouvernorat">Gouvernorat</option>
                      <option value="Type Inscription">Type Inscription</option>
                    </select>
                  </Col>

                  {selectedFiltre === "Genre" && (
                    <Col>
                      <select
                        className="form-select"
                        id="idGenre"
                        name="genres-single-default"
                        onChange={handleSelectedGenre}
                      >
                        <option value="all">Genre</option>
                        <option value="Feminin ">Feminin</option>
                        <option value="Masculin ">Masculin</option>
                      </select>
                    </Col>
                  )}
                  {selectedFiltre === "Année de Bac" && (
                    <Col>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionAnneeBac}
                        onChange={handleSelectAnneeBacChange}
                        placeholder="Sélection des colonnes"
                      />
                    </Col>
                  )}
                  {selectedFiltre === "Session Bac" && (
                    <Col>
                      <select
                        className="form-select"
                        id="idSessionBac"
                        name="session-bac-single-default"
                        onChange={handleSelectedSessionBac}
                      >
                        <option value="all">Choisir ...</option>
                        <option value="Principale ">Principale</option>
                        <option value="Controle ">Controle</option>
                      </select>
                    </Col>
                  )}
                  {selectedFiltre === "Nature Bac" && (
                    <Col>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionNatureBac}
                        onChange={handleSelectNatureBacChange}
                        placeholder="Sélection des colonnes"
                      />
                    </Col>
                  )}
                  {selectedFiltre === "Type Inscription" && (
                    <Col>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionType}
                        onChange={handleSelectTypeInscriChange}
                        placeholder="Sélection des colonnes"
                      />
                    </Col>
                  )}
                  {selectedFiltre === "Gouvernorat" && (
                    <Col>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={optionGouvernorat}
                        onChange={handleSelectGouvernoratChange}
                        placeholder="Sélection des colonnes"
                      />
                    </Col>
                  )}
                  <Col className="d-flex justify-content-end">
                    <div className="hstack gap-3">
                      <Link
                        to="#"
                        className="badge bg-primary-subtle text-primary view-item-btn"
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
                          onClick={() => handlePrint()}
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
                <div>
                  <DataTable
                    columns={filteredColumns}
                    data={getFilteredEtudiants()}
                    pagination
                    customStyles={customTableStyles}
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </div>
              </Card.Body>
            </Card>
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
                    <Row className="mt-3">
                      <Col lg={12} className="text-center">
                        <span>
                          Liste des étudiants de :{" "}
                          <strong>{selectedFiltre}</strong>
                        </span>
                      </Col>
                    </Row>
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
                        {filteredColumns.map((column) => (
                          <Col lg={2} className="border-end border-3 p-1">
                            <h6>{column.name}</h6>
                          </Col>
                        ))}
                      </Row>
                      <Row className="border border-3">
                        {getFilteredEtudiants().map(
                          (etudiant: any, rowIndex: number) => (
                            <React.Fragment key={rowIndex}>
                              {filteredColumns.map((column, colIndex) => (
                                <Col
                                  key={`${rowIndex}-${colIndex}`}
                                  lg={2}
                                  className="border-end border-bottom border-3 p-1"
                                >
                                  <span>
                                    {column.selector
                                      ? column.selector(etudiant)
                                      : ""}
                                  </span>
                                </Col>
                              ))}
                            </React.Fragment>
                          )
                        )}
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

export default RechercheAvance;
