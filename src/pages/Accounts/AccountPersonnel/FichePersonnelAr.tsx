import React, { useRef } from "react";
import {
  Button,
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
import "./hover.css";

const FichePersonnelAr: React.FC = () => {
  document.title = "بطاقة معلومات الموظف | ENIGA";

  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();
  const location = useLocation();
  const detailsPersonnel = location.state;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const lastVariable =
    Variables.length > 0 ? Variables[Variables.length - 1] : null;


    const historique_positions = detailsPersonnel?.historique_positions || [];

// Trier par date_affectation si nécessaire
const sortedPositions = [...historique_positions].sort((a, b) =>
  new Date(b.date_affectation).getTime() - new Date(a.date_affectation).getTime()
);

// Dernier poste (le plus récent)
const lastPosition = sortedPositions[0];


  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="بطاقة الموظف" pageTitle="معلومات الموظف" />
        <Row className="justify-content-center">
          <Col xxl={12}>
            <div
              ref={contentRef}
              className="p-4 border"
              style={{
                maxWidth: "794px",
                maxHeight: "1223px",
                direction: "rtl",
                textAlign: "right",
              }}
            >
              {/* Header */}
              <Row className="m-3 d-flex align-items-center justify-content-between flex-nowrap">
                <Col xs="auto" className="m-2">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                    alt="شعار"
                    className="img-fluid"
                    style={{ maxHeight: "80px" }}
                  />
                </Col>
                <Col className="text-center flex-grow-1">
                  <h3 className="fw-bold text-uppercase mb-2">بطاقة معلومات الموظف</h3>
                  <h5 className="text-uppercase mb-0">{lastVariable?.etablissement_ar}</h5>
                  <span className="fw-bold">{lastVariable?.annee_universitaire}</span>
                </Col>
                <Col xs="auto" className="m-2">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                    alt="شعار"
                    className="img-fluid"
                    style={{ maxHeight: "80px" }}
                  />
                </Col>
              </Row>

              <hr className="border-dark" />

              {/* Personnel Info */}
              <Row className="mb-3">
                <Col xs="auto">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${detailsPersonnel?.photo_profil}`}
                    alt="صورة"
                    className="img-fluid"
                    style={{ maxHeight: "120px" }}
                  />
                </Col>
                <Col className="flex-grow-1">
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">الاسم و اللقب:</td>
                        <td>{detailsPersonnel.prenom_ar} {detailsPersonnel.nom_ar}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">تاريخ ومكان الولادة:</td>
                        <td>{detailsPersonnel.date_naissance} - {detailsPersonnel.lieu_naissance_ar}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الجنسية:</td>
                        <td>{detailsPersonnel.nationalite === "Tunisienne" ? "تونسية" : detailsPersonnel.nationalite}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">رقم بطاقة التعريف:</td>
                        <td>{detailsPersonnel.num_CIN}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">تاريخ الإصدار:</td>
                        <td>{detailsPersonnel.date_delivrance}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الحالة المدنية:</td>
                        <td>
                          {detailsPersonnel.etat_civil === "Celibataire"
                            ? "أعزب | عزباء"
                            : detailsPersonnel.etat_civil === "Marie"
                            ? "متزوج(ة)"
                            : detailsPersonnel.etat_civil}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الجنس:</td>
                        <td>
                          {detailsPersonnel.sexe === "Masculin"
                            ? "ذكر"
                            : detailsPersonnel.sexe === "Feminin"
                            ? "أنثى"
                            : detailsPersonnel.sexe}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الوضعية العسكرية:</td>
                        <td>{detailsPersonnel.situation_militaire}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">رقم الضمان الاجتماعي:</td>
                        <td>{detailsPersonnel.cnss_number}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* Contact Info */}
              <div className="mb-3 border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase">معلومات الاتصال</h5>
                <div className="mb-3 d-flex">
                  <Table bordered size="sm" className="flex-grow-1">
                    <tbody>
                      <tr>
                        <td className="fw-bold">الهاتف 1:</td>
                        <td>{detailsPersonnel.num_phone1}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الهاتف 2:</td>
                        <td>{detailsPersonnel.num_phone2}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">البريد الإلكتروني:</td>
                        <td>{detailsPersonnel.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">العنوان:</td>
                        <td>{detailsPersonnel.adress_fr}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">رقم الحساب الجاري:</td>
                        <td>{detailsPersonnel.compte_courant}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase">معلومات مهنية</h5>
                <div className="d-flex">
                  <Table bordered size="sm" className="flex-grow-1">
                    <tbody>
                      <tr>
                        <td className="fw-bold">الرقم الوظيفي:</td>
                        <td>{detailsPersonnel.matricule}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الوظيفة:</td>
                         <td>{lastPosition?.poste?.poste_ar || "—"}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الرتبة:</td>
                        <td>{lastPosition.grade?.grade_ar}</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">الاختصاص:</td>
                        <td>{detailsPersonnel.specialite?.specialite_ar}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">القسم:</td>
                        <td>{detailsPersonnel.departement?.name_ar}</td>
                      </tr>
                    </tbody>
                  </Table> */}
                </div>
              </div>
            </div>

            <Button onClick={() => reactToPrintFn()} className="mt-4" variant="primary">
              طباعة
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FichePersonnelAr;
