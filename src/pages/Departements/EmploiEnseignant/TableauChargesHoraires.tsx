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
import "./TableauChargesHorarires.css";
export interface outputData {
  teacher: any;
  charge_s1: string;
  charge_s2: string;
  moyenne: string;
  charge_hs: string;
  charge_hx: string;
}

const TableauChargesHoraires = () => {
  document.title = "Tableau des charges horaires | Smart University";

  const navigate = useNavigate();

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const { data: enseignants = [], isSuccess: areTeachersFetched } =
    useFetchEnseignantsQuery();
  const { data: teachersPeriods = [], isSuccess: arePeriodsFetched } =
    useFetchTeachersPeriodsQuery();
  const [hasProcessed, setHasProcessed] = useState(false);
  const [tableData, setTableData] = useState<outputData[]>([]);

  useEffect(() => {
    if (areTeachersFetched && arePeriodsFetched && !hasProcessed) {
      console.log("enseignants:", enseignants);
      console.log("teachersPeriods:", teachersPeriods);

      // Perform your logic here
      processBothData(enseignants, teachersPeriods);

      // Mark as processed
      setHasProcessed(true);
    }
  }, [
    areTeachersFetched,
    arePeriodsFetched,
    enseignants,
    teachersPeriods,
    hasProcessed,
  ]);

  const processBothData = (teachers: any, periods: any) => {
    console.log("Processing combined data:", teachers, periods);
    let output = [];
    for (const teacher of teachers) {
      let outputElement: outputData = {
        teacher: teacher,
        charge_s1: "0",
        charge_s2: "0",
        moyenne: "0",
        charge_hs: "0",
        charge_hx: "0",
      };
      let smester1Periods = periods.filter(
        (period: any) =>
          period.id_teacher._id === teacher._id && period.semestre === "1"
      );
      console.log("smester1Periods", smester1Periods);

      let smester2Periods = periods.filter(
        (period: any) =>
          period.id_teacher._id === teacher._id && period.semestre === "2"
      );
      console.log("smester2Periods", smester2Periods);

      let teachingHoursS1;
      let teachingHoursS2;
      if (smester1Periods.length > 0) {
        let mergedS1 = mergeIntervals(smester1Periods);
        teachingHoursS1 = getTeacherAverageHoursPerWeek(teacher, mergedS1);
        console.log("teachingHoursS1", teachingHoursS1);
        outputElement.charge_s1 = String(teachingHoursS1.hours);
      }

      if (smester2Periods.length > 0) {
        let mergedS2 = mergeIntervals(smester2Periods);
        teachingHoursS2 = getTeacherAverageHoursPerWeek(teacher, mergedS2);
        console.log("teachingHoursS2", teachingHoursS2);
        outputElement.charge_s2 = String(teachingHoursS2.hours);
      }

      if (outputElement.charge_s1 !== "0" && outputElement.charge_s2 !== "0") {
        outputElement.moyenne = String(
          (Number(outputElement.charge_s1) + Number(outputElement.charge_s2)) /
            2
        );
      }

      if (outputElement.moyenne !== "0") {
        const rest =
          Number(outputElement.moyenne) -
          Number(outputElement.teacher.grade.charge_horaire.annualMaxHE);
        console.log("REST", rest);
        if (rest <= 0) {
          outputElement.charge_hs = "0";
          outputElement.charge_hx = "0";
        } else if (
          rest < Number(outputElement.teacher.grade.charge_horaire.annualMaxHS)
        ) {
          outputElement.charge_hs = String(rest);
          outputElement.charge_hx = "0";
        } else if (
          rest > Number(outputElement.teacher.grade.charge_horaire.annualMaxHS)
        ) {
          outputElement.charge_hs =
            outputElement.teacher.grade.charge_horaire.annualMaxHS;
          outputElement.charge_hx = String(
            rest -
              Number(outputElement.teacher.grade.charge_horaire.annualMaxHS)
          );
        }
      }

      output.push(outputElement);
    }

    console.log("output", output);
    setTableData(output);
  };

  // Function to calculate weeks between two dates
  const calculateWeeksInInterval = (start_date: string, end_date: string) => {
    const [startDay, startMonth, startYear] = start_date.split("-").map(Number);
    const [endDay, endMonth, endYear] = end_date.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return Math.ceil(diffInDays / 7);
  };

  // Function to calculate average hours per week
  const getTeacherAverageHoursPerWeek = (enseignant: any, merged: any) => {
    let totalWeightedHours = 0;
    let totalWeeks = 0;

    for (const element of merged) {
      const weeksInInterval = calculateWeeksInInterval(
        element.start_date,
        element.end_date
      );
      const weightedHours = element.nbr_heure * weeksInInterval;
      totalWeightedHours += weightedHours;
      totalWeeks += weeksInInterval;
    }
    const averageHoursPerWeek =
      totalWeeks > 0 ? totalWeightedHours / totalWeeks : 0;
    return {
      teacher: enseignant,
      hours: Number.isInteger(averageHoursPerWeek)
        ? averageHoursPerWeek
        : averageHoursPerWeek.toFixed(2),
    };
  };

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const mergeIntervals = (intervals: any[]) => {
    const sortedIntervals = [...intervals];

    sortedIntervals.sort(
      (a: any, b: any) =>
        parseDate(a?.id_classe_period?.date_debut!).getTime() -
        parseDate(b?.id_classe_period?.date_debut!).getTime()
    );

    const splitIntervals: any[] = [];
    for (let interval of sortedIntervals) {
      const startDate = parseDate(interval.id_classe_period?.date_debut!);
      const endDate = parseDate(interval.id_classe_period?.date_fin!);
      const hours = Number(interval.nbr_heure);

      splitIntervals.push({ date: startDate, hours });
      splitIntervals.push({
        date: new Date(endDate.getTime() + 1),
        hours: -hours,
      });
    }

    splitIntervals.sort((a, b) => a.date.getTime() - b.date.getTime());

    const result: any[] = [];
    let currentStartDate = splitIntervals[0].date;
    let currentHours = 0;

    for (let i = 0; i < splitIntervals.length - 1; i++) {
      const { date, hours } = splitIntervals[i];
      currentHours += hours;

      // Determine if this is the end of a unique period
      const nextDate = splitIntervals[i + 1].date;
      if (date.getTime() !== nextDate.getTime()) {
        result.push({
          start_date: formatDate(currentStartDate),
          end_date: formatDate(new Date(nextDate.getTime() - 1)), // Adjust end date by one day
          nbr_heure: currentHours,
        });
        currentStartDate = nextDate;
      }
    }

    let refinedResult = [];

    for (const element of result) {
      if (element.start_date !== element.end_date) {
        refinedResult.push(element);
      }
    }

    return refinedResult;
  };

  const getBackgroud_TextColor = (
    teaching_Hours: string,
    charge_horaire: any,
    semestre: string
  ) => {
    //"bg-danger text-white"
    //console.log("teachingHours", teaching_Hours);
    const teachingHours = Number(teaching_Hours);
    //console.log("charge_horaire", charge_horaire);
    //console.log("semestre", semestre);
    const annualVolume = Number(charge_horaire?.annualMaxHE!);
    const HS_Max_S1 =
      Number(charge_horaire?.s1MaxHE!) + Number(charge_horaire?.s1MaxHS!);
    const HS_Max_S2 =
      Number(charge_horaire?.s2MaxHE!) + Number(charge_horaire?.s2MaxHS!);
    let background = "";
    let textColor = "black";
    if (semestre == "1") {
      if (teachingHours <= Number(charge_horaire?.s1MinHE!)) {
        background = "#ff0000b5";
      } else if (
        teachingHours < annualVolume &&
        teachingHours > Number(charge_horaire?.s1MinHE!)
      ) {
        background = "#ffff0096";
      } else if (teachingHours == annualVolume) {
        background = "#8cf78c";
      } else if (
        teachingHours > annualVolume &&
        teachingHours <= Number(charge_horaire?.s1MaxHE!)
      ) {
        background = "lightblue";
      } else if (
        teachingHours > Number(charge_horaire?.s1MaxHE!) &&
        teachingHours <= HS_Max_S1
      ) {
        background = "#1717f5cc";
        textColor = "white";
      } else if (
        teachingHours > HS_Max_S1 &&
        teachingHours <= Number(charge_horaire?.totalS1Max!)
      ) {
        background = "#e1ae00a1";
      } else {
        background = "rgb(10 2 119 / 71%)";
        textColor = "white";
      }
    } else {
      if (teachingHours <= Number(charge_horaire?.s2MinHE!)) {
        background = "#ff0000b5";
      } else if (
        teachingHours < annualVolume &&
        teachingHours > Number(charge_horaire?.s2MinHE!)
      ) {
        background = "#ffff0096";
      } else if (teachingHours == annualVolume) {
        background = "#8cf78c";
      } else if (
        teachingHours > annualVolume &&
        teachingHours <= Number(charge_horaire?.s2MaxHE!)
      ) {
        background = "lightblue";
      } else if (
        teachingHours > Number(charge_horaire?.s2MaxHE!) &&
        teachingHours <= HS_Max_S2
      ) {
        background = "#1717f5cc";
        textColor = "white";
      } else if (
        teachingHours > HS_Max_S2 &&
        teachingHours <= Number(charge_horaire?.totalS2Max!)
      ) {
        background = "#e1ae00a1";
      } else {
        background = "rgb(10 2 119 / 71%)";
        textColor = "white";
      }
    }
    return { bg: background, textColor: textColor };
  };

  const columns = useMemo(
    () => [
      {
        Header: "Enseignant",
        accessor: (row: any) =>
          `${row?.teacher?.prenom_fr!}    ${row?.teacher?.nom_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Grade",
        accessor: (row: any) => `${row?.teacher?.grade?.grade_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Charge Annuel",
        accessor: (row: any) =>
          `${row?.teacher?.grade?.charge_horaire?.annualMaxHE!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "HE S1",
        accessor: (row: any) => `${row?.charge_s1!}`,
        disableFilters: true,
        filterable: true,
        Cell: ({ row }: { row: any }) => {
          const backgroudTxtColor = getBackgroud_TextColor(
            row?.original?.charge_s1!,
            row?.original?.teacher?.grade?.charge_horaire!,
            "1"
          );

          return (
            <div
              style={{
                background: backgroudTxtColor?.bg!,
                padding: "5px",
                borderRadius: "4px",
                color: backgroudTxtColor?.textColor!,
              }}
            >
              {row?.original?.charge_s1!}
            </div>
          );
        },
      },
      {
        Header: "HE S2",
        accessor: (row: any) => `${row?.charge_s2!}`,
        disableFilters: true,
        filterable: true,
        Cell: ({ row }: { row: any }) => {
          const backgroudTxtColor = getBackgroud_TextColor(
            row?.original?.charge_s2!,
            row?.original?.teacher?.grade?.charge_horaire!,
            "2"
          );

          return (
            <div
              style={{
                background: backgroudTxtColor?.bg!,
                padding: "5px",
                borderRadius: "4px",
                color: backgroudTxtColor?.textColor!,
              }}
            >
              {row?.original?.charge_s2!}
            </div>
          );
        },
      },

      {
        Header: "Moyenne",
        accessor: (row: any) => `${Number(row?.moyenne!).toFixed(2)}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "H Sup",
        accessor: (row: any) => `${Number(row?.charge_hs!).toFixed(2)}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "H Extras",
        accessor: (row: any) => `${Number(row?.charge_hx!).toFixed(2)}`,
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
            title="Gestion des départements"
            pageTitle="Tableau des charges horiares"
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

                    {/* Legend Section */}
                    <Col lg={8} className="ms-auto">
                      <Row className="legend-row">
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "#ff0000b5" }}
                          ></span>
                          Charge négative: Emploi non accompli
                        </Col>
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "#ffff0096" }}
                          ></span>
                          Charge semestrielle en défaut
                        </Col>
                      </Row>
                      <Row className="legend-row">
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "#8cf78c" }}
                          ></span>
                          Emploi/Charge semestrielle Équilibré
                        </Col>
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "lightblue" }}
                          ></span>
                          Charge semestrielle en excès
                        </Col>
                      </Row>
                      <Row className="legend-row">
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "#1717f5cc" }}
                          ></span>
                          Charge semestrielle en excès avec heures
                          supplémentaires
                        </Col>
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "#e1ae00a1" }}
                          ></span>
                          Emploi Hyper-chargé
                        </Col>
                      </Row>
                      <Row className="legend-row">
                        <Col lg={6} className="legend-item">
                          <span
                            className="legend-icon"
                            style={{ backgroundColor: "rgb(10 2 119 / 71%)" }}
                          ></span>
                          Emploi saturé
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
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

export default TableauChargesHoraires;