import React, { useRef } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Row,
  Table,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./hover.css";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";


const FicheProEnseignantAr: React.FC = () => {
  const location = useLocation();
  const detailsEnseignant = location.state;
  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();

   const getLatestPosition = () => {
    if (!detailsEnseignant?.historique_positions?.length) return null;

    // Sort by date_affectation descending
    const sorted = [...detailsEnseignant.historique_positions].sort((a, b) => {
      const dateA = new Date(a.date_affectation);
      const dateB = new Date(b.date_affectation);
      return dateB.getTime() - dateA.getTime(); // Latest first
    });

    return sorted[0]; // Latest entry
  };
  const latestPosition = getLatestPosition();
  console.log("latest position", latestPosition.poste)
  

const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const historique_positions = detailsEnseignant?.historique_positions || [];
const lastVariable =
    Variables.length > 0 ? Variables[Variables.length - 1] : null;
   
const calculatePeriod = (start: string, end?: string): string => {
  if (!start) return "—";

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearText = years > 0 ? `${years} سنة` : "";
  const monthText = months > 0 ? `${months} شهر` : "";

  return (
  `${yearText}${yearText && monthText ? " و " : ""}${monthText || "أقل من شهر"}` +
  (!end ? " (إلى الآن)" : "")
);
};

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xxl={12}>
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
                                                 <h4 className="fw-bold text-uppercase">شهادة في الخدمات</h4>

                                  <h5 className="text-uppercase mb-0">
                                    {lastVariable?.etablissement_ar}
                                  </h5>
                                  <span className="fw-bold">
                                    {lastVariable?.annee_universitaire}
                                  </span>
                                </Col>
               <Col xs="auto" className="m-2">
                                  <Image
                                    src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                                    alt="Right Logo"
                                    className="img-fluid"
                                    style={{ maxHeight: "80px" }}
                                  />
                                </Col>
                              </Row>
              

           {/* Enseignant Info */}
<Row className="mb-3">
  <Col>
    <div className="mb-2">
      <span className="fw-bold">الاسم و اللقب: </span>
      <span>{detailsEnseignant.nom_ar} {detailsEnseignant.prenom_ar}</span>
    </div>
    <div className="mb-2">
      <span className="fw-bold"> المعرف الوحيد: </span>
      <span>{detailsEnseignant.matricule}</span>
    </div>
   
     <div className="mb-2">
      <span className="fw-bold">الرتبة: </span>
      <span>{latestPosition.grade.grade_ar}</span>
    </div>
      <div className="mb-2">
      <span className="fw-bold">الوظيفة: </span>
      <span>{latestPosition.poste.poste_ar}</span>
    </div>
  </Col>
</Row>

              {/* Historique Professionnel */}
              <div className="mb-3 border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase mb-3">التسلسل المهني</h5>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>الوظيفة</th>
                      <th>الرتبة</th>
                      <th>تاريخ التعيين</th>
                      <th>تاريخ الترسيم</th>
                      <th>تاريخ المغادرة</th>
                       <th>الفترة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique_positions.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.poste?.poste_ar || "—"}</td>
                        <td>{item.grade?.grade_ar || "—"}</td>
                        
                        <td>{item.date_affectation || "—"}</td>
                        <td>{item.date_titularisation || "—"}</td>
                        <td>{item.date_depart || "—"}</td>
                        <td>{calculatePeriod(item.date_affectation, item.date_depart)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

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
              طباعة
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FicheProEnseignantAr;
