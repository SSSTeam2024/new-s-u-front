import React, { useState, useRef } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteAbsenceMutation,
  useFetchAbsenceEtudiantsQuery,
} from "features/absenceEtudiant/absenceSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useFetchClassesQuery } from "features/classe/classe";
import Flatpickr from "react-flatpickr";
import { French } from "flatpickr/dist/l10n/fr";
import * as XLSX from "xlsx";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import exportAnimation from "../../../assets/images/Animation - 1744040183999.json";

const AbsenceEtudiant = () => {
  document.title = "Absences | ENIGA";

  //! add this line just to push it in github !!
  const { data = [] } = useFetchAbsenceEtudiantsQuery();

  const lottieRef3 = useRef<LottieRefCurrentProps>(null);

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [showObservation, setShowObservation] = useState<boolean>(false);
  const [selectFilter, setSelectFilter] = useState<string>("filter");

  const [selectGroupe, setSelectGroupe] = useState<string>("");
  const [selectEnseignant, setSelectEnseignant] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const handleSelectFilter = (e: any) => {
    setSelectFilter(e.target.value);
  };

  const handleSelectGroupe = (e: any) => {
    setSelectGroupe(e.target.value);
  };

  const handleSelectEnseignant = (e: any) => {
    setSelectEnseignant(e.target.value);
  };

  const navigate = useNavigate();

  function tog_AddAbsence() {
    navigate("/application-enseignant/ajouter-absence");
  }

  const [selectedRow, setSelectedRow] = useState<any>();
  const handleChange = ({ selectedRows }: { selectedRows: any }) => {
    setSelectedRow(selectedRows);
  };

  const [deleteAbsence] = useDeleteAbsenceMutation();
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
          deleteAbsence(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Absence Etudiant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Absence Etudiant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => <span>{row?.classe?.nom_classe_fr!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row?.date!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure Début</span>,
      selector: (row: any) => row?.seance?.heure_debut!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure Fin</span>,
      selector: (row: any) => row?.seance?.heure_fin!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.seance?.matiere?.matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enseignant</span>,
      selector: (row: any) => (
        <span>
          {row?.enseignant?.prenom_fr!} {row?.enseignant?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etudiants Absents</span>,
      selector: (row: any) =>
        row.etudiants.filter((e: any) => e?.typeAbsent! === "A").length,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/application-enseignant/visualiser-absence-etudiant"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowObservation(!showObservation)}
                state={{ absenceDetails: row }}
              >
                <i
                  className="ri-eye-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>

            <li>
              <Link
                to="/application-enseignant/modifier-absence-etudiant"
                className="badge badge-soft-success edit-item-btn"
                state={{ absenceDetails: row }}
              >
                <i
                  className="ri-edit-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>

            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => AlertDelete(row._id)}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const handleDateChange = (selectedDates: Date[]) => {
    const start = selectedDates[0] || null;
    const end = selectedDates[1] || null;
    setSelectedRange([start, end]);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredAbsences = () => {
    let filteredAbsences = [...data];

    if (searchTerm) {
      filteredAbsences = filteredAbsences.filter(
        (absence: any) =>
          absence?.classe
            ?.nom_classe_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.seance?.matiere
            ?.matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.seance
            ?.heure_debut!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.date!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.prenom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectGroupe && selectGroupe !== "grou") {
      filteredAbsences = filteredAbsences.filter(
        (absence: any) => absence?.classe?._id! === selectGroupe
      );
    }

    if (selectEnseignant && selectEnseignant !== "ensei") {
      filteredAbsences = filteredAbsences.filter(
        (absence: any) => absence?.enseignant?._id! === selectEnseignant
      );
    }

    const [startDate, endDate] = selectedRange;
    if (startDate && endDate) {
      filteredAbsences = filteredAbsences.filter((absence: any) => {
        const [day, month, year] = absence.date.split("-").map(Number);
        const absenceDate = new Date(year, month - 1, day);
        return absenceDate >= startDate && absenceDate <= endDate;
      });
    }

    return filteredAbsences.reverse();
  };

  const exportToExcel = () => {
    if (!selectedRow || selectedRow.length === 0) return;

    const excelData = selectedRow.map((row: any) => {
      const totalAbsents = row.etudiants.filter(
        (e: any) => e.typeAbsent === "A"
      ).length;

      return {
        Classe: row.classe?.nom_classe_fr || "",
        Date: row.date || "",
        "Heure Début": row.seance?.heure_debut || "",
        "Heure Fin": row.seance?.heure_fin || "",
        Matiere: row.seance?.matiere?.matiere || "",
        Enseignant: `${row.enseignant?.prenom_fr || ""} ${
          row.enseignant?.nom_fr || ""
        }`,
      };
    });

    const worksheetData = excelData.map(({ ...rest }) => rest);

    const totalAbsences = selectedRow.reduce((sum: number, row: any) => {
      return (
        sum + row.etudiants.filter((e: any) => e.typeAbsent === "A").length
      );
    }, 0);

    worksheetData.push({
      Classe: "",
      Date: "",
      "Heure Début": "",
      "Heure Fin": "",
      Matiere: "",
      // Enseignant: "",
      Enseignant: "Total Absence",
      Total: totalAbsences,
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absences");
    XLSX.writeFile(workbook, "Absences.xlsx");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Absences" pageTitle="Application Enseignant" />
          <Col lg={12}>
            <Card>
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={5} className="mt-4">
                    <Row>
                      <Col lg={4}>
                        <label className="search-box">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Rechercher ..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                          <i className="ri-search-line search-icon"></i>
                        </label>
                      </Col>
                      <Col>
                        <div className="hstack gap-2">
                          <select
                            className="form-select"
                            onChange={handleSelectFilter}
                          >
                            <option value="filter">Choisir ...</option>
                            <option value="Enseignant">Enseignant</option>
                            <option value="Groupe">Groupe</option>
                            <option value="Date">Date</option>
                          </select>
                          {selectFilter === "Enseignant" && (
                            <select
                              className="form-select"
                              onChange={handleSelectEnseignant}
                            >
                              <option value="ensei">Enseignants</option>
                              {AllEnseignants.map((enseignant) => (
                                <option
                                  value={enseignant?._id!}
                                  key={enseignant?._id!}
                                >
                                  {enseignant?.prenom_fr} {enseignant?.nom_fr!}
                                </option>
                              ))}
                            </select>
                          )}
                          {selectFilter === "Groupe" && (
                            <select
                              className="form-select"
                              onChange={handleSelectGroupe}
                            >
                              <option value="grou">Groupes</option>
                              {AllClasses.map((classe) => (
                                <option value={classe?._id!} key={classe?._id!}>
                                  {classe?.nom_classe_fr!}
                                </option>
                              ))}
                            </select>
                          )}
                          {selectFilter === "Date" && (
                            <Flatpickr
                              className="form-control flatpickr-input"
                              placeholder="Date d'absence"
                              onChange={handleDateChange}
                              value={selectedRange.filter(
                                (date): date is Date => date !== null
                              )}
                              options={{
                                dateFormat: "d M, Y",
                                locale: French,
                                mode: "range",
                              }}
                              id="date"
                              name="date"
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4}></Col>
                  <Col lg={3} className="d-flex justify-content-end">
                    <div className="hstack gap-3">
                      <Lottie
                        lottieRef={lottieRef3}
                        onComplete={() => {
                          lottieRef3.current?.goToAndPlay(5, true);
                        }}
                        animationData={exportAnimation}
                        loop={false}
                        style={{
                          width: 60,
                          cursor:
                            !selectedRow || selectedRow.length === 0
                              ? "default"
                              : "pointer",
                          opacity:
                            !selectedRow || selectedRow.length === 0 ? 0.5 : 1,
                        }}
                        disabled={!selectedRow || selectedRow.length === 0}
                        onClick={
                          !selectedRow || selectedRow.length === 0
                            ? undefined
                            : exportToExcel
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => tog_AddAbsence()}
                      >
                        <i
                          className="ri-add-fill align-middle"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "1.5em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        ></i>{" "}
                        <span>Ajouter Absence</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredAbsences()}
                  pagination
                  selectableRows={selectFilter !== "filter"}
                  noDataComponent="Il n'y a aucun enregistrement à afficher"
                  onSelectedRowsChange={handleChange}
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default AbsenceEtudiant;
