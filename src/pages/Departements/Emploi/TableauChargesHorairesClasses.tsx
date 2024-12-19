import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import {
  useFetchEnseignantsQuery,
  useFetchTeachersPeriodsQuery,
} from "features/enseignant/enseignantSlice";
import CustomLoader from "Common/CustomLoader/CustomLoader";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchSeancesQuery } from "features/seance/seance";

export interface outputData {
  classe: any;
  charge_s1: string;
  charge_s2: string;
  defaut_s1: string;
  defaut_s2: string;
  emploi_s1: string;
  emploi_s2: string;
}

const TableauChargesHorairesClasses = () => {
  document.title = "Equilibre horaires des classes | Smart University";

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data: classes = [], isSuccess: areClassesFetched } =
    useFetchClassesQuery();

  const { data: seances = [], isSuccess: areAllSeancesFetched } =
    useFetchSeancesQuery();
  const [hasProcessed, setHasProcessed] = useState(false);
  const [tableData, setTableData] = useState<outputData[]>([]);

  useEffect(() => {
    if (areClassesFetched && areAllSeancesFetched && !hasProcessed) {
      console.log("classes fetched", classes);
      console.log("seances", seances);

      // Perform your logic here
      processBothData(classes, seances);

      // Mark as processed
      setHasProcessed(true);
    }
  }, [areClassesFetched, areAllSeancesFetched, classes, seances, hasProcessed]);

  const processBothData = (classes: any, seances: any) => {
    console.log("Processing combined data:", classes, seances);
    let output = [];
    for (const classe of classes) {
      let outputElement: outputData = {
        classe: classe,
        charge_s1: "0",
        charge_s2: "0",
        defaut_s1: "0",
        defaut_s2: "0",
        emploi_s1: "0",
        emploi_s2: "0",
      };
      let semester1Sessions = seances.filter(
        (seance: any) =>
          seance.classe._id === classe._id && seance.semestre === "1"
      );
      console.log("semester1Sessions", semester1Sessions);

      let semester2Sessions = seances.filter(
        (seance: any) =>
          seance.classe._id === classe._id && seance.semestre === "2"
      );
      console.log("semester2Sessions", semester2Sessions);

      outputElement.charge_s1 = calculerChargeSemestriel(classe.matieres, "1");
      outputElement.charge_s2 = calculerChargeSemestriel(classe.matieres, "2");

      outputElement.emploi_s1 = calculerHESemestriel(semester1Sessions);
      outputElement.emploi_s2 = calculerHESemestriel(semester2Sessions);

      outputElement.defaut_s1 = String(
        Number(outputElement.charge_s1) - Number(outputElement.emploi_s1)
      );
      outputElement.defaut_s2 = String(
        Number(outputElement.charge_s2) - Number(outputElement.emploi_s2)
      );

      output.push(outputElement);
    }

    console.log("output", output);
    setTableData(output);
  };

  const getHoursNumber = (start: any, end: any) => {
    // Parse hours and minutes from the start and end times
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    // Convert to total minutes
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Calculate the difference in minutes
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Convert minutes to decimal hours
    return durationMinutes / 60;
  };

  //* Heures d'enseignement *//
  const calculerHESemestriel = (seances: any[]) => {
    console.log("seances", seances);
    let volumeTotal = 0;

    for (const seance of seances) {
      let duration = getHoursNumber(seance.heure_debut, seance.heure_fin);
      volumeTotal += duration;
    }

    return volumeTotal.toFixed(2);
  };

  const calculerChargeSemestriel = (matieres: any[], semestre: string) => {
    console.log("matieres", matieres);
    let volumeTotal = 0;
    if (semestre === "1") {
      let arrS1 = matieres.filter((matiere) => matiere.semestre === "S1");
      volumeTotal = accumulateVolumes(arrS1);
      console.log("volumeTotal", volumeTotal);
    }

    if (semestre === "2") {
      let arrS2 = matieres.filter((matiere) => matiere.semestre === "S2");
      volumeTotal = accumulateVolumes(arrS2);
    }

    return volumeTotal.toFixed(2);
  };

  const accumulateVolumes = (matieres: any[]) => {
    let sum = 0;
    matieres.forEach((matiere) => {
      sum += Number(matiere.volume);
      console.log("sum", sum);
    });

    return sum;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Classes",
        accessor: (row: any) => `${row?.classe?.nom_classe_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Charges S1",
        accessor: (row: any) => `${row?.charge_s1!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Emploi S1",
        accessor: (row: any) => `${row?.emploi_s1!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Défauts S1",
        accessor: (row: any) => `${row?.defaut_s1!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Charges S2",
        accessor: (row: any) => `${row?.charge_s2!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Emploi S2",
        accessor: (row: any) => `${row?.emploi_s2!}`,
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Défauts S2",
        accessor: (row: any) => `${row?.defaut_s2!}`,
        disableFilters: true,
        filterable: true,
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestions Emplois"
            pageTitle="Equilibre Horaires des classes"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3 align-items-center">
                    {/* Search Box */}
                    <Col lg={3}>
                      <div className="search-box">
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
                  {hasProcessed === false ? (
                    <CustomLoader
                      text={"Chargement en cours ..."}
                    ></CustomLoader>
                  ) : (
                    <>
                      <table
                        className="table align-middle table-nowrap"
                        id="customerTable"
                      >
                        <TableContainer
                          columns={columns || []}
                          data={tableData}
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
                          <h5 className="mt-2">
                            Pas des charges horaires pour le moment!
                          </h5>
                        </div>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TableauChargesHorairesClasses;