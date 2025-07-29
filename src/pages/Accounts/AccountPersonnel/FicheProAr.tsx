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
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./hover.css";

const FicheProPersonnelAr: React.FC = () => {
  const location = useLocation();
  const detailsPersonnel = location.state;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const historique_positions = detailsPersonnel?.historique_positions || [];
  const historique_services = detailsPersonnel?.historique_services || [];

  
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
              className="p-4 border"
              style={{ maxWidth: "794px", direction: "rtl", textAlign: "right" }}
            >
              {/* Header */}
              <div className="text-center mb-4">
                <h4 className="fw-bold text-uppercase">شهادة في الخدمات</h4>
              </div>

              {/* Personnel Info */}
              <Row className="mb-3">
                {/* <Col xs="auto">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${detailsPersonnel?.photo_profil}`}
                    alt="photo"
                    className="img-fluid"
                    style={{ maxHeight: "120px" }}
                  />
                </Col> */}
                <Col className="flex-grow-1">
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">الاسم و اللقب:</td>
                        <td>{detailsPersonnel.nom_ar} {detailsPersonnel.prenom_ar}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">رقم البطاقة:</td>
                        <td>{detailsPersonnel.matricule}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الهاتف:</td>
                        <td>{detailsPersonnel.num_phone1}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* Historique des Positions */}
              <div className="mb-3 border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase mb-3">التسلسل المهني</h5>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>الوظيفة</th>
                      <th>الرتبة</th>
                      <th>الصنف</th>
                      <th>تاريخ التعيين</th>
                      <th>تاريخ الترسيم</th>
                      <th>تاريخ المغادرة</th>
                       <th>الفترة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique_positions.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.poste?.poste_ar}</td>
                        <td>{item.grade?.grade_ar}</td>
                        <td>{item.categorie?.categorie_ar || "—"}</td>
                        <td>{item.date_affectation}</td>
                        <td>{item.date_titularisation}</td>
                        <td>{item.date_depart}</td>
                        <td>{calculatePeriod(item.date_affectation, item.date_depart)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Historique des Services */}
              <div className="mb-3 border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase mb-3">تسلسل الخدمات</h5>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>الخدمة</th>
                      <th>تاريخ التعيين</th>
                      <th>تاريخ المغادرة</th>
                      <th>الفترة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique_services.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.service?.service_ar || "—"}</td>
                        <td>{item.date_affectation}</td>
                         <td>{item.date_fin}</td>
                          <td>{calculatePeriod(item.date_affectation, item.date_fin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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

export default FicheProPersonnelAr;
