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
import CountUp from "react-countup";

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
  document.title = "Equilibre horaires des classes | ENIGA";

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

  const [totalChS1, setTotalChS1] = useState(0);
  const [totalChS2, setTotalChS2] = useState(0);

  const [totalDefautS1, setTotalDefautS1] = useState(0);
  const [totalDefautS2, setTotalDefautS2] = useState(0);

  const [totalEmploiS1, setTotalEmploiS1] = useState(0);
  const [totalEmploiS2, setTotalEmploiS2] = useState(0);

  useEffect(() => {
    if (areClassesFetched && areAllSeancesFetched && !hasProcessed) {
      // Perform your logic here
      processBothData(classes, seances);

      // Mark as processed
      setHasProcessed(true);
    }
  }, [areClassesFetched, areAllSeancesFetched, classes, seances, hasProcessed]);

  const processBothData = (classes: any, seances: any) => {
    let tch1 = 0;
    let tch2 = 0;

    let te1 = 0;
    let te2 = 0;

    let td1 = 0;
    let td2 = 0;

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

      let semester2Sessions = seances.filter(
        (seance: any) =>
          seance.classe._id === classe._id && seance.semestre === "2"
      );
      console.log("classe", classe);
      outputElement.charge_s1 = calculerChargeSemestriel(classe, "1");
      tch1 += Number(outputElement.charge_s1);

      outputElement.charge_s2 = calculerChargeSemestriel(classe, "2");
      tch2 += Number(outputElement.charge_s2);

      outputElement.emploi_s1 = calculerHESemestriel(semester1Sessions);
      te1 += Number(outputElement.emploi_s1);

      outputElement.emploi_s2 = calculerHESemestriel(semester2Sessions);
      te2 += Number(outputElement.emploi_s2);

      outputElement.defaut_s1 = String(
        Number(outputElement.charge_s1) - Number(outputElement.emploi_s1)
      );
      td1 += Number(outputElement.defaut_s1);

      outputElement.defaut_s2 = String(
        Number(outputElement.charge_s2) - Number(outputElement.emploi_s2)
      );
      td2 += Number(outputElement.defaut_s2);

      output.push(outputElement);
    }

    setTotalChS1(tch1);
    setTotalChS2(tch2);

    setTotalEmploiS1(te1);
    setTotalEmploiS2(te2);

    setTotalDefautS1(td1);
    setTotalDefautS2(td2);

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
    let volumeTotal = 0;

    for (const seance of seances) {
      let duration = getHoursNumber(seance.heure_debut, seance.heure_fin);
      volumeTotal += duration;
    }

    return volumeTotal.toFixed(2);
  };

  const calculerChargeSemestriel = (classe: any, semestre: string) => {
    let filtredMatieres: any = [];

    let volumeTotal = 0;
    if (semestre === "1" && classe?.parcours !== null) {
      for (let module of classe?.parcours?.modules!) {
        if (module?.semestre_module! === "S1") {
          filtredMatieres = filtredMatieres.concat(module?.matiere!);
        }
      }
    }
    if (semestre === "2" && classe?.parcours !== null) {
      for (let module of classe?.parcours?.modules!) {
        if (module?.semestre_module! === "S2") {
          filtredMatieres = filtredMatieres.concat(module?.matiere!);
        }
      }
    }
    volumeTotal = accumulateVolumes(filtredMatieres);
    return volumeTotal.toFixed(2);
  };

  const accumulateVolumes = (matieres: any[]) => {
    let sum = 0;
    matieres.forEach((matiere) => {
      sum += Number(matiere.types[0].volume);
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
      // {
      //   Header: "Type matière / Heures",
      //   accessor: (row: any) => `TD: 3 | C: 5 | TP: 4 | CI: 3.5`,
      //   disableFilters: true,
      //   filterable: true,
      // },
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
            title="Gestions emplois"
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
                        <Col xl={2} md={6}>
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
                                    Total Charges S1
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalChS1}
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

                        <Col xl={2} md={6}>
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
                                    Total Emploi S1
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalEmploiS1}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-success rounded fs-3">
                                    <i className="ph-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col xl={2} md={6}>
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
                                    Total Défauts S1
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalDefautS1}
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

                        <Col xl={2} md={6}>
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
                                    Total Charges S2
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalChS2}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-info rounded fs-3">
                                    <i className="ph-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col xl={2} md={6}>
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
                                    Total Emploi S2
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalEmploiS2}
                                      decimals={2}
                                      suffix="H"
                                    />
                                  </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-white text-success rounded fs-3">
                                    <i className="ph-clock"></i>
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col xl={2} md={6}>
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
                                    Total Défauts S2
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <h4 className="fs-24 fw-semibold mb-4">
                                    <CountUp
                                      end={totalDefautS2}
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
