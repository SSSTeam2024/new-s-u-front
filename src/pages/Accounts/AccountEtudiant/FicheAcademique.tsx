import React, { useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Image,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

const HistoriqueAcademique: React.FC = () => {
  document.title = "السيرة الجامعية | ENIGA";

  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();
  const location = useLocation();
  const etudiant = location.state;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const lastVariable =
    Variables.length > 0 ? Variables[Variables.length - 1] : null;
    console.log("last",lastVariable)


 const calculatePeriod = (
  startDate: string | Date | null,
  endDate: string | Date | null
): string => {
  if (!startDate || !endDate) return "-";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;

  let result = "";
  if (diffYears > 0) result += `${diffYears} سنة `;
  if (remainingMonths > 0) result += `${remainingMonths} شهر`;

  return result.trim() || "-";
};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Breadcrumb title="Historique académique" pageTitle="الملف الأكاديمي" /> */}

          <Row className="justify-content-center">
            <Col xxl={10}>
             <div
  ref={contentRef}
  className="p-4 border position-relative"
  style={{
    maxWidth: "794px",
    direction: "rtl",
    textAlign: "right",
    minHeight: "1120px", // A4 height at 96dpi
  }}
>
                {/* Header with Logos */}
                <Row className="m-3 d-flex align-items-center justify-content-between flex-nowrap">
                  <Col xs="auto" className="m-2">
                    <Image
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                      alt="Left Logo"
                      className="img-fluid"
                      style={{ maxHeight: "80px" }}
                    />
                  </Col>

                  <Col className="text-center flex-grow-1">
                    <h3 className="fw-bold text-uppercase mb-2">
                      سيرة الجامعية
                    </h3>
                    <h5 className="text-uppercase mb-0">
                      {lastVariable?.etablissement_ar}
                    </h5>
                    <span className="fw-bold">
                      {lastVariable?.annee_universitaire}
                    </span>
                  </Col>
 <Col xs="auto" className="m-2">
                    <Image
                      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_etablissement}`}
                      alt="Right Logo"
                      className="img-fluid"
                      style={{ maxHeight: "80px" }}
                    />
                  </Col>
                </Row>

                <hr className="border-dark" />

                {/* Student Basic Info */}
                <Row className="mb-4">
                  <Col md={8}>
                    <p>
                      <strong>الاسم واللقب:</strong> {etudiant.prenom_ar}{" "}
                      {etudiant.nom_ar}
                    </p>
                    
                    <p>
                      <strong>تاريخ و مكان الولادة :</strong>
                      {etudiant.date_naissance} - {etudiant.lieu_naissance_ar}
                    </p>
                  <p>
  <strong>الجنسية:</strong>{' '}
  {etudiant.nationalite?.trim().toLowerCase() === 'tunisienne' ? 'تونسية' : etudiant.nationalite}
</p>
                    <p>
                      <strong>رقم بطاقة التعريف :</strong>
                      {etudiant.num_CIN}
                    </p>
                  </Col>
                  {/* <Col md={4}>
                    <Image
                      src={`${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${etudiant.photo_profil}`}
                      alt="Photo"
                      className="img-fluid img-thumbnail"
                      style={{ maxHeight: "120px" }}
                    />
                  </Col> */}
                </Row>

                {/* Historique Table */}
                <Card className="mt-3 border-dark">
                  <Card.Header className="bg-light text-center fw-bold">
                    السيرة الجامعية
                  </Card.Header>
                  <Card.Body>
                    {etudiant.historique_etudiant &&
                    etudiant.historique_etudiant.length > 0 ? (
                      <Table bordered responsive>
                        <thead className="table-light text-center">
                          <tr>
                              <th style={{ width: "15%" }}>من</th>
      <th style={{ width: "15%" }}>إلى</th>
      <th style={{ width: "15%" }}>الفترة</th>
      <th style={{ width: "15%" }}>الوضعية</th>
      <th style={{ width: "40%" }}>المؤسسة</th> {/* wider */}
                          </tr>
                        </thead>
                        <tbody>
                          {etudiant.historique_etudiant.map(
                            (item: any, index: number) => (
                              <tr key={index}>
                                <td>{item.date_debut || "-"}</td>
                                <td>{item.date_fin || "-"}</td>
                                {/* <td>{item.periode || "-"}</td> */}
                                 <td>{calculatePeriod(item.date_debut, item.date_fin)}</td>
                                <td>{item.situation || "-"}</td>
                                <td>{item.etablissement || "-"}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center">لا توجد بيانات.</div>
                    )}
                  </Card.Body>
                </Card>


<div
  style={{
    position: "absolute",
    bottom: "20px",
    left: "0",
    right: "0",
    textAlign: "center",
    fontSize: "0.85rem",
    lineHeight: "1.6",
  }}
>
                  <hr className="border-dark my-4" />

  <div className="fw-semibold">
    {lastVariable?.etablissement_ar} - {lastVariable?.universite_ar}
  </div>
  <div>
    {lastVariable?.address_ar} | الهاتف: {lastVariable?.phone} | الفاكس: {lastVariable?.fax}
  </div>
</div>
              </div>

              {/* Print Button */}
              <Button
                onClick={() => reactToPrintFn()}
                className="mt-4"
                variant="primary"
              >
                طباعة PDF
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default HistoriqueAcademique;
