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
const FicheEtudiant: React.FC = () => {
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
                style={{ maxWidth: "794px", maxHeight: "1223px" }}
              >
                {/* <div ref={contentRef} className="print-container p-4 border border-dark"> */}

                {/* Formal Header with Logos */}
                <Row className="m-3 d-flex align-items-center justify-content-between flex-nowrap">
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
                      FICHE de Renseignements etudiant
                    </h3>
                    <h5 className="text-uppercase mb-0">
                      {lastVariable?.etablissement_fr!}{" "}
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
                <Row className="mb-3 d-flex  ">
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
                          <td className="fw-bold">Nom & Prénom:</td>
                          <td>
                            {detailsEtudiant.nom_fr} {detailsEtudiant.prenom_fr}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Date & Lieu de naissance:</td>
                          <td>
                            {detailsEtudiant.date_naissance} -{" "}
                            {detailsEtudiant.lieu_naissance_fr}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Nationalité:</td>
                          <td>{detailsEtudiant.nationalite}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">CIN:</td>
                          <td>{detailsEtudiant.num_CIN}</td>
                        </tr>
                        <tr>
                          <td>
                            <tr>
                              <td className="fw-bold">Etat civil:</td>
                              <td>{detailsEtudiant.etat_civil}</td>
                            </tr>
                          </td>
                          <td>
                            <tr>
                              <td className="fw-bold">Sexe:</td>
                              <td>{detailsEtudiant.sexe}</td>
                            </tr>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <td className="fw-bold">Situation militaire:</td>
                            <td>{detailsEtudiant.situation_militaire}</td>
                          </td>
                          <td>
                            <td className="fw-bold">Marticule CNSS:</td>
                            <td>{detailsEtudiant.cnss_number}</td>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                {/* Contact Info */}
                <div className="mb-3 border-top border-dark pt-2">
                  <h5 className="fw-bold text-uppercase">
                    Informations de Contact
                  </h5>
                  <div className="mb-3 d-flex">
                    <Table bordered size="sm" className="flex-grow-1">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Téléphone:</td>
                          <td>{detailsEtudiant.num_phone}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Email:</td>
                          <td>{detailsEtudiant.email}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Adresse:</td>
                          <td>{detailsEtudiant.adress_fr}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Téléphone parents:</td>
                          <td>{detailsEtudiant.tel_parents}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="border-top border-dark pt-2">
                  <h5 className="fw-bold text-uppercase">
                    Informations Académiques
                  </h5>
                  <div className="d-flex">
                    <Table bordered size="sm" className="flex-grow-1">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Matricule:</td>
                          <td>{detailsEtudiant.matricule_number}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Type d'inscription:</td>
                          <td>{detailsEtudiant?.type_inscription?.type_fr!}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Niveau:</td>
                          <td>
                            {detailsEtudiant.Niveau_Fr ||
                              detailsEtudiant.NiveauAr}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Spécialité:</td>
                          <td>{detailsEtudiant.Spécialité}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Diplome:</td>
                          <td>{detailsEtudiant.DIPLOME}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Cycle:</td>
                          <td>{detailsEtudiant.Cycle}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Groupe:</td>
                          <td>
                            {detailsEtudiant?.groupe_classe?.nom_classe_fr!}
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

export default FicheEtudiant;
