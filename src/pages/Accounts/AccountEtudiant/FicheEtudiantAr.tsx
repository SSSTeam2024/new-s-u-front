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
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { RootState } from "app/store";
import {
  useFetchVaribaleGlobaleQuery,
  VaribaleGlobale,
} from "features/variableGlobale/variableGlobaleSlice";
import "./hover.css";
const FicheEtudiantAr: React.FC = () => {
  document.title = "Détails de l'étudiant | ENIGA";
  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();
  const location = useLocation();
  const detailsEtudiant = location.state;

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Get the last variable
  const lastVariable =
    Variables.length > 0 ? Variables[Variables.length - 1] : null;
  console.log("lastVariable", lastVariable);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Fiche de l'étudiant"
            pageTitle="Détails de l'étudiant"
          />

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
                {/* <div ref={contentRef} className="print-container p-4 border border-dark"> */}

                {/* Formal Header with Logos */}
                <Row
                  className="m-3 d-flex align-items-center justify-content-between flex-nowrap"
                  style={{
                    direction: "rtl",
                    textAlign: "right",
                  }}
                >
                  {/* Left Logo */}
                  <Col xs="auto" className="m-2">
                    <Image
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite!}`}
                      alt="Left Logo"
                      className="img-fluid"
                      style={{ maxHeight: "80px" }}
                    />
                  </Col>

                  {/* Center Title */}
                  <Col className="text-center flex-grow-1">
                    <h3 className="fw-bold text-uppercase mb-2">
                      بطاقة ارشادات الطالب
                    </h3>
                    <h5 className="text-uppercase mb-0">
                      {lastVariable?.etablissement_ar!}{" "}
                    </h5>
                    <span className="fw-bold">
                      {lastVariable?.annee_universitaire!}
                    </span>
                  </Col>

                  {/* Right Logo */}
                  <Col xs="auto" className="m-2">
                    <Image
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite!}`}
                      alt="Right Logo"
                      className="img-fluid"
                      style={{ maxHeight: "80px" }}
                    />
                  </Col>
                </Row>

                <hr className="border-dark" />

                {/* Student Photo & Personal Info */}
                <Row
                  className="mb-3 d-flex  "
                  //  dir="rtl"
                >
                  <Col xs="auto">
                    <Image
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/files/etudiantFiles/PhotoProfil/${detailsEtudiant?.photo_profil!}`}
                      alt="Photo"
                      // className="img-thumbnail border border-dark"
                      className="img-fluid"
                      style={{ maxHeight: "120px" }}
                      // width={100}
                      // height={100}
                    />
                  </Col>
                  <Col className=" flex-grow-1">
                    <Table bordered size="sm" className="mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-bold">الاسم و اللقب:</td>
                          <td>
                            {detailsEtudiant.nom_ar} {detailsEtudiant.prenom_ar}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">تاريخ و مكان الولادة :</td>
                          <td>
                            {detailsEtudiant.date_naissance} -{" "}
                            {detailsEtudiant.lieu_naissance_ar}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">الجنسية:</td>
                          <td>{detailsEtudiant.nationalite}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">رقم بطاقة التعريف :</td>
                          <td>{detailsEtudiant.num_CIN}</td>
                        </tr>
                        <tr>
                          <td>
                            <tr>
                              <td className="fw-bold">الحالة المدنية:</td>
                              <td>
                                {detailsEtudiant.etat_civil === "Celibataire "
                                  ? "أعزب | عزباء"
                                  : detailsEtudiant.etat_civil === "Marie "
                                  ? "متزوج(ة)"
                                  : ""}
                              </td>
                            </tr>
                          </td>
                          <td>
                            <tr>
                              <td className="fw-bold"> الجنس :</td>
                              <td>
                                {detailsEtudiant.sexe === "Masculin "
                                  ? "ذكر"
                                  : detailsEtudiant.sexe === "Feminin "
                                  ? "أنثى"
                                  : ""}
                              </td>
                            </tr>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <td className="fw-bold"> الوضعية العسكرية:</td>
                            <td>{detailsEtudiant.situation_militaire}</td>
                          </td>
                          <td>
                            <td className="fw-bold">رقم الضمان الاجتماعي :</td>
                            <td>{detailsEtudiant.cnss_number}</td>
                          </td>
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
                          <td className="fw-bold">الهاتف</td>
                          <td>{detailsEtudiant.num_phone}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">الايميل</td>
                          <td>{detailsEtudiant.email}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <td className="fw-bold">العنوان</td>
                          <td>{detailsEtudiant.adress_ar}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">هاتف الولي</td>
                          <td>{detailsEtudiant.tel_parents}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="border-top border-dark pt-2">
                  <h5 className="fw-bold text-uppercase">معلومات دراسية</h5>
                  <div className="d-flex">
                    <Table bordered size="sm" className="flex-grow-1">
                      <tbody>
                        <tr>
                          <td className="fw-bold">المُعرف:</td>
                          <td>{detailsEtudiant.matricule_number}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">نوع التسجيل</td>
                          <td>{detailsEtudiant?.type_inscription?.type_ar!}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">المستوى</td>
                          <td>{detailsEtudiant.NiveauAr}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">الاختصاص</td>
                          <td>{detailsEtudiant.SpecialiteAr}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <td className="fw-bold">الشهادة</td>
                          <td>{detailsEtudiant.DiplomeAr}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">المرحلة</td>
                          <td>{detailsEtudiant.Cycle_Ar}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">القسم</td>
                          <td>
                            {detailsEtudiant?.groupe_classe?.nom_classe_ar!}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
                {/* Cin images */}
                <Row>
                  <Col xs="auto" className="m-2">
                    <Image
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/files/etudiantFiles/Face1CIN/${detailsEtudiant?.face_1_CIN!}`}
                      alt="Right Logo"
                      className="img-fluid"
                      style={{ maxHeight: "220px" }}
                    />
                  </Col>
                  <Col xs="auto" className="m-2">
                    <Image
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/files/etudiantFiles/Face2CIN/${detailsEtudiant?.face_2_CIN!}`}
                      alt="Right Logo"
                      className="img-fluid"
                      style={{ maxHeight: "220px" }}
                    />
                  </Col>
                </Row>
              </div>

              {/* Print Button */}
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

export default FicheEtudiantAr;
