import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import {
  useFetchEnseignantsGroupedByGradeQuery,
  useFetchEnseignantsQuery,
  useFetchTeachersPeriodsQuery,
} from "features/enseignant/enseignantSlice";
import CustomLoader from "Common/CustomLoader/CustomLoader";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchSeancesQuery } from "features/seance/seance";
import { useFetchGradesEnseignantQuery } from "features/gradeEnseignant/gradeEnseignant";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import CountUp from "react-countup";

export interface outputData {
  grade: string;
  nbr: string;
  charge: string;
  total_semaine: string;
  total_s1: string;
  total_s2: string;
}

const EquilibreHorairesGrade = () => {
  document.title = "Equilibre horaires des classes | Smart University";

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data: params = [], isSuccess: areParamsFetched } =
    useFetchTimeTableParamsQuery();

  const { data: grades = [], isSuccess: areGradesFetched } =
    useFetchGradesEnseignantQuery();

  const { data: groupedTeachers = [], isSuccess: areGroupedTeachersFetched } =
    useFetchEnseignantsGroupedByGradeQuery();

  const { data: classes = [], isSuccess: areClassesFetched } =
    useFetchClassesQuery();

  const [hasProcessed, setHasProcessed] = useState(false);
  const [tableData, setTableData] = useState<outputData[]>([]);

  const [totalS1, setTotalS1] = useState(0);
  const [totalS2, setTotalS2] = useState(0);

  const [ecartS1, setEcartS1] = useState(0);
  const [ecartS2, setEcartS2] = useState(0);

  useEffect(() => {
    if (
      areGroupedTeachersFetched &&
      areParamsFetched &&
      areClassesFetched &&
      !hasProcessed
    ) {
      // Perform your logic here
      processBothData(groupedTeachers, classes);

      // Mark as processed
      setHasProcessed(true);
    }
  }, [
    areGroupedTeachersFetched,
    areParamsFetched,
    areClassesFetched,
    groupedTeachers,
    params,
    classes,
    hasProcessed,
  ]);

  const processBothData = (groupedTeachers: any, classes: any) => {
    let output = [];

    let tS1 = 0;
    let tS2 = 0;

    let tcS1 = 0;
    let tcS2 = 0;

    for (const element of groupedTeachers) {
      let outputElement: outputData = {
        grade: element?.gradeLabel?.grade_fr!,
        charge: "0",
        nbr: String(element?.teachers?.length),
        total_semaine: "0",
        total_s1: "0",
        total_s2: "0",
      };

      outputElement.charge = element?.gradeLabel?.charge_horaire.s1MaxHE;

      outputElement.total_semaine = String(
        Number(element?.gradeLabel?.charge_horaire.s1MaxHE) *
          Number(outputElement.nbr)
      );

      const weeksS1 = calculateWeeksAdjusted(
        params[0].semestre1_start,
        params[0].semestre1_end
      );

      const weeksS2 = calculateWeeksAdjusted(
        params[0].semestre2_start,
        params[0].semestre2_end
      );

      outputElement.total_s1 = String(
        weeksS1 * Number(outputElement.total_semaine)
      );
      tS1 += Number(outputElement.total_s1);
      outputElement.total_s2 = String(
        weeksS2 * Number(outputElement.total_semaine)
      );
      tS2 += Number(outputElement.total_s2);

      output.push(outputElement);
    }

    for (const classe of classes) {
      tcS1 += Number(calculerChargeSemestriel(classe.matieres, "1"));
      tcS2 += Number(calculerChargeSemestriel(classe.matieres, "2"));
    }

    setTableData(output);

    setTotalS1(tS1);
    setTotalS2(tS2);

    setEcartS1(tS1 - tcS1);
    setEcartS2(tS2 - tcS2);
  };

  const calculerChargeSemestriel = (matieres: any[], semestre: string) => {
    let volumeTotal = 0;
    if (semestre === "1") {
      let arrS1 = matieres.filter((matiere) => matiere.semestre === "S1");
      volumeTotal = accumulateVolumes(arrS1);
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
    });

    return sum;
  };

  const calculateWeeksAdjusted = (start: string, end: string) => {
    // Step 1: Parse the given dates
    const startDate = new Date(start.split("-").reverse().join("-")); // Convert to YYYY-MM-DD
    const endDate = new Date(end.split("-").reverse().join("-"));

    // Step 2: Find the Monday of the week for the start date
    const startMonday = new Date(startDate);
    startMonday.setDate(
      startDate.getDate() -
        startDate.getDay() +
        (startDate.getDay() === 0 ? -6 : 1)
    ); // Move to Monday

    // Step 3: Find the Sunday of the week for the end date
    const endSunday = new Date(endDate);
    endSunday.setDate(
      endDate.getDate() +
        (7 - endDate.getDay() - (endDate.getDay() === 0 ? 7 : 0))
    ); // Move to Sunday

    // Step 4: Calculate the total number of weeks (inclusive)
    const totalDays =
      (endSunday.getTime() - startMonday.getTime()) / (1000 * 60 * 60 * 24); // Difference in days
    const totalWeeks = Math.floor(totalDays / 7) + 1; // Count overlapping weeks only

    return totalWeeks;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Grades",
        accessor: (row: any) => `${row?.grade!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nombre d'enseignants",
        accessor: (row: any) => `${row?.nbr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Charge",
        accessor: (row: any) => `${row?.charge!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Nombre d'heures/semaine",
        accessor: (row: any) => `${row?.total_semaine!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Total des heures S1",
        accessor: (row: any) => `${row?.total_s1!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Total des heures S2",
        accessor: (row: any) => `${row?.total_s2!}`,
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
                      <Row>
                        <Col xl={3} md={6}>
                          <Card className="card-animate bg-info-subtle border-0 overflow-hidden">
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
                                    <rect
                                      width="400"
                                      height="250"
                                      fill="#ffffff"
                                    ></rect>
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
                                      stopColor="rgba(var(--tb-info-rgb), 0.1)"
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
                                      stopColor="rgba(var(--tb-info-rgb), 0.1)"
                                      offset="1"
                                    ></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <Card.Body className="position-relative">
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                                    Total des heures S1
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalS1}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-primary rounded fs-3">
                                    <i className="ph-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col xl={3} md={6}>
                          <Card className="card-animate bg-success-subtle border-0 overflow-hidden">
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
                                    <rect
                                      width="400"
                                      height="250"
                                      fill="#ffffff"
                                    ></rect>
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
                                      stopColor="rgba(var(--tb-success-rgb), 0.1)"
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
                                      stopColor="rgba(var(--tb-success-rgb), 0.1)"
                                      offset="1"
                                    ></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <Card.Body className="position-relative">
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                                    Ecart Enseignants / Classes S1
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={ecartS1}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-success rounded fs-3">
                                    <i className="ph ph-plus-minus"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col xl={3} md={6}>
                          <Card className="card-animate bg-warning-subtle border-0 overflow-hidden">
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
                                    <rect
                                      width="400"
                                      height="250"
                                      fill="#ffffff"
                                    ></rect>
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
                                      stopColor="rgba(var(--tb-warning-rgb), 0.1)"
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
                                      stopColor="rgba(var(--tb-warning-rgb), 0.1)"
                                      offset="1"
                                    ></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <Card.Body className="position-relative">
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                                    Total des heures S2
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalS2}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-warning rounded fs-3">
                                    <i className="ph-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col xl={3} md={6}>
                          <Card className="card-animate bg-danger-subtle border-0 overflow-hidden">
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
                                <g mask='url("#SvgjsMask1560")' fill="none">
                                  <path
                                    d="M306 65L446 -75"
                                    strokeWidth="8"
                                    stroke="url(#SvgjsLinearGradient1558)"
                                    strokeLinecap="round"
                                    className="BottomLeft"
                                  ></path>
                                  <path
                                    d="M399 2L315 86"
                                    strokeWidth="10"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M83 77L256 -96"
                                    strokeWidth="6"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M281 212L460 33"
                                    strokeWidth="6"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M257 62L76 243"
                                    strokeWidth="6"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M305 123L214 214"
                                    strokeWidth="6"
                                    stroke="url(#SvgjsLinearGradient1558)"
                                    strokeLinecap="round"
                                    className="BottomLeft"
                                  ></path>
                                  <path
                                    d="M327 222L440 109"
                                    strokeWidth="6"
                                    stroke="url(#SvgjsLinearGradient1558)"
                                    strokeLinecap="round"
                                    className="BottomLeft"
                                  ></path>
                                  <path
                                    d="M287 109L362 34"
                                    strokeWidth="10"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M259 194L332 121"
                                    strokeWidth="8"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M376 186L240 322"
                                    strokeWidth="8"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M308 153L123 338"
                                    strokeWidth="6"
                                    stroke="url(#SvgjsLinearGradient1559)"
                                    strokeLinecap="round"
                                    className="TopRight"
                                  ></path>
                                  <path
                                    d="M218 62L285 -5"
                                    strokeWidth="8"
                                    stroke="url(#SvgjsLinearGradient1558)"
                                    strokeLinecap="round"
                                    className="BottomLeft"
                                  ></path>
                                </g>
                                <defs>
                                  <mask id="SvgjsMask1560">
                                    <rect
                                      width="400"
                                      height="250"
                                      fill="#ffffff"
                                    ></rect>
                                  </mask>
                                  <linearGradient
                                    x1="100%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                    id="SvgjsLinearGradient1558"
                                  >
                                    <stop
                                      stopColor="rgba(var(--tb-danger-rgb), 0)"
                                      offset="0"
                                    ></stop>
                                    <stop
                                      stopColor="rgba(var(--tb-danger-rgb), 0.1)"
                                      offset="1"
                                    ></stop>
                                  </linearGradient>
                                  <linearGradient
                                    x1="0%"
                                    y1="100%"
                                    x2="100%"
                                    y2="0%"
                                    id="SvgjsLinearGradient1559"
                                  >
                                    <stop
                                      stopColor="rgba(var(--tb-danger-rgb), 0)"
                                      offset="0"
                                    ></stop>
                                    <stop
                                      stopColor="rgba(var(--tb-danger-rgb), 0.1)"
                                      offset="1"
                                    ></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <Card.Body className="position-relative">
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                                    Ecart Enseignants / Classes S2
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={ecartS2}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-danger rounded fs-3">
                                    <i className="ph ph-plus-minus"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      <table
                        className="table align-middle table-nowrap"
                        id="customerTable"
                      >
                        <TableContainer
                          columns={columns || []}
                          data={tableData}
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

export default EquilibreHorairesGrade;
