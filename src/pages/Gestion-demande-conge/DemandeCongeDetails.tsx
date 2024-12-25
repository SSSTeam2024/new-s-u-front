import React, { useRef } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { RootState } from "app/store";

const DemandeCongeDetails: React.FC = () => {
  document.title = "Détails de demande de Congé | Smart Institute";
  const location = useLocation();
  const demandeConge = location.state;

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Détails de demande" pageTitle="Demande Congé" />

          <Row className="justify-content-center">
            <Col
              xxl={9}
              //   ref={componentRef}
            >
              <div ref={contentRef}>
                <Card id="demo">
                  <Col lg={12}>
                    <Card.Body className="p-4">
                      <div>
                        <Row className="g-3">
                          <Col lg={12}>
                            <Card.Header className="border-bottom-dashed p-4 text-end">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <h6>جامعة قفصة</h6>
                                  <h6>المعهد العالي للعلوم</h6>
                                  <h6>التطبيقية و التكنلوجيا بقفصة</h6>
                                </div>
                                <div>
                                  <h6>الجمهورية التونسية</h6>
                                  <h6>وزارة التعليم العالي</h6>
                                  <h6>و البحث العلمي</h6>
                                </div>
                              </div>
                            </Card.Header>
                          </Col>

                          <Col lg={12} className="text-center">
                            <h1 className="mb-2 text-uppercase fw-bold">
                              مطلب عطلة
                            </h1>
                          </Col>

                          <Col lg={12} className="text-end ms-auto">
                            {/* <h4 className="mb-3">النوع:</h4> */}
                            <div
                              style={{ listStyle: "none", paddingRight: 15 }}
                            >
                              <h6 style={{ fontSize: "18px" }}>
                                {demandeConge.leaveType.name_ar}
                              </h6>
                              {demandeConge.leaveType?.name_fr !==
                                "congé annuel" && (
                                <span>{demandeConge.subcategory?.name_ar}</span>
                              )}
                              {demandeConge.leaveType?.name_fr ===
                                "Congé exceptionnel" && (
                                <span style={{ fontSize: "18px" }}>
                                  {" "}
                                  ...........................................................................
                                  : موجبها{" "}
                                </span>
                              )}
                            </div>
                          </Col>

                          <Col lg={12} className="text-end ms-auto p-2">
                            <ul style={{ listStyle: "none", paddingRight: 15 }}>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  <span>
                                    {" "}
                                    {demandeConge.personnelId?.matricule!} :
                                  </span>
                                  صاحب المعرف الوحيد
                                </h6>
                              </li>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  الإسم واللقب :
                                  <span>
                                    {" "}
                                    {demandeConge.personnelId?.prenom_ar!}{" "}
                                    {demandeConge.personnelId?.nom_ar!}
                                  </span>
                                </h6>
                              </li>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  خطته الوظيفية :{"   "}
                                  <span>
                                    {demandeConge.personnelId?.poste?.poste_ar!}
                                  </span>
                                </h6>
                              </li>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  الهيكل الإداري :{" "}
                                  <span>
                                    {demandeConge.personnelId?.poste?.poste_ar!}
                                  </span>
                                </h6>
                              </li>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  المصلحة :{"  "}
                                  <span>
                                    {
                                      demandeConge.personnelId?.service
                                        ?.service_ar!
                                    }
                                  </span>
                                </h6>
                              </li>
                              <li>
                                <div>
                                  <h6
                                    style={{ fontSize: "18px" }}
                                    className="mb-3"
                                  >
                                    مركز العمل : {"  "}
                                    <span>
                                      المعهد العالي للعلوم التطبيقية و
                                      التكنلوجيا بقفصة
                                    </span>
                                  </h6>
                                </div>
                              </li>
                            </ul>
                          </Col>

                          <Col lg={12} className="text-end ms-auto">
                            <ul style={{ listStyle: "none", paddingRight: 15 }}>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  المدة المطلوبة:
                                  {"  "}
                                  <span>
                                    {(() => {
                                      // Convert startDay and endDay to Date objects
                                      const startDate = new Date(
                                        demandeConge.startDay
                                      );
                                      const endDate = new Date(
                                        demandeConge.endDay
                                      );

                                      // Calculate the number of days between start and end date
                                      const timeDiff = Math.abs(
                                        Number(endDate) - Number(startDate)
                                      );
                                      const daysDiff =
                                        Math.ceil(
                                          timeDiff / (1000 * 3600 * 24)
                                        ) + 1; // Adding 1 to include the start day

                                      // Format the start and end dates to YYYY-MM-DD
                                      const formattedStartDate = startDate
                                        .toISOString()
                                        .split("T")[0];
                                      const formattedEndDate = endDate
                                        .toISOString()
                                        .split("T")[0];

                                      return (
                                        <>
                                          {daysDiff} أيام من{" "}
                                          {formattedStartDate} إلى{" "}
                                          {formattedEndDate}
                                        </>
                                      );
                                    })()}
                                  </span>
                                </h6>
                              </li>

                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  عنوان مقر السكنى طيلة العطلة :{"  "}
                                  <span>{demandeConge.adresse_conge}</span>
                                </h6>
                              </li>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  <span>2100 :{"  "}</span>
                                  الترقيم البريدي
                                </h6>
                              </li>
                              <li>
                                <h6
                                  style={{ fontSize: "18px" }}
                                  className="mb-3"
                                >
                                  الوثائق المصاحبة :{"  "}
                                  <span>{demandeConge.nature_fichier}</span>
                                </h6>
                              </li>
                            </ul>
                          </Col>

                          <Row>
                            <Col lg={4} className="text-end ms-auto">
                              <h6 style={{ fontSize: "18px" }}>
                                قفصة في: 13-11-2024
                              </h6>
                              <h6 style={{ fontSize: "18px" }}>
                                الإمضاء و الختم:
                              </h6>
                              <span>........................</span>
                            </Col>
                            <Col lg={4} className=" ms-auto">
                              <ul
                                style={{ listStyle: "none", paddingRight: 15 }}
                              >
                                <li>
                                  <h6 style={{ fontSize: "17px" }}>
                                    ملاحظة الرئيس المباشر:
                                  </h6>
                                  <span>........................</span>
                                </li>
                                <li>
                                  <h6 style={{ fontSize: "17px" }}>
                                    قفصة في: 13-11-2024
                                  </h6>
                                  <h6 style={{ fontSize: "17px" }}>
                                    إمضاء طالب العطلة:
                                  </h6>
                                  <span>........................</span>
                                </li>
                              </ul>
                            </Col>
                          </Row>

                          <Col lg={12} className="text-end ms-auto">
                            <h6>المعوض(ة):</h6>
                            <span>
                              ....................... (عند الموافقة ذكر المعوض)
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Col>
                </Card>
                {/* Print button for generating PDF */}
              </div>
              <Button
                onClick={() => reactToPrintFn()}
                className="mt-4"
                variant="primary"
              >
                Imprimer Pdf
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DemandeCongeDetails;
