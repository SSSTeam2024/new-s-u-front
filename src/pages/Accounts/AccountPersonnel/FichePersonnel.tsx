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

const FichePersonnel: React.FC = () => {
  document.title = "Détails du personnel | ENIGA";

  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();
  const location = useLocation();
  const detailsPersonnel = location.state;
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const lastVariable = Variables.length > 0 ? Variables[Variables.length - 1] : null;

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
        <Breadcrumb title="Fiche du personnel" pageTitle="Détails du personnel" />
        <Row className="justify-content-center">
          <Col xxl={12}>
            <div
              ref={contentRef}
              className="p-4 border"
              style={{ maxWidth: "794px", maxHeight: "1223px" }}
            >
              {/* Header */}
              <Row className="m-3 d-flex align-items-center justify-content-between flex-nowrap">
                <Col xs="auto" className="m-2">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                    alt="Logo"
                    className="img-fluid"
                    style={{ maxHeight: "80px" }}
                  />
                </Col>
                <Col className="text-center flex-grow-1">
                  <h3 className="fw-bold text-uppercase mb-2">FICHE DE RENSEIGNEMENTS PERSONNEL</h3>
                  <h5 className="text-uppercase mb-0">{lastVariable?.etablissement_fr}</h5>
                  <span className="fw-bold">{lastVariable?.annee_universitaire}</span>
                </Col>
                <Col xs="auto" className="m-2">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                    alt="Logo"
                    className="img-fluid"
                    style={{ maxHeight: "80px" }}
                  />
                </Col>
              </Row>

              <hr className="border-dark" />

              {/* Photo and Personal Info */}
              <Row className="mb-3 d-flex">
                <Col xs="auto">
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${detailsPersonnel?.photo_profil}`}
                    alt="Photo"
                    className="img-fluid"
                    style={{ maxHeight: "120px" }}
                  />
                </Col>
                <Col className="flex-grow-1">
                  <Table bordered size="sm" className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Nom & Prénom:</td>
                        <td>{detailsPersonnel.nom_fr} {detailsPersonnel.prenom_fr}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Date & Lieu de naissance:</td>
                        <td>{detailsPersonnel.date_naissance} - {detailsPersonnel.lieu_naissance_fr}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Nationalité:</td>
                        <td>{detailsPersonnel.nationalite}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">CIN:</td>
                        <td>{detailsPersonnel.num_CIN}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">État civil:</td>
                        <td>
                          {detailsPersonnel.etat_civil === "متزوج" ? "Marié(e)" :
                           detailsPersonnel.etat_civil === "أعزب" ? "Célibataire" : detailsPersonnel.etat_civil}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Sexe:</td>
                        <td>{detailsPersonnel.sexe}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Situation militaire:</td>
                        <td>{detailsPersonnel.situation_militaire}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* Contact Info */}
              <div className="mb-3 border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase">Informations de Contact</h5>
                <div className="mb-3 d-flex">
                  <Table bordered size="sm" className="flex-grow-1">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Téléphone 1:</td>
                        <td>{detailsPersonnel.num_phone1}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Téléphone 2:</td>
                        <td>{detailsPersonnel.num_phone2}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Marticule CNSS:</td>
                        <td>{detailsPersonnel.cnss_number}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Email:</td>
                        <td>{detailsPersonnel.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Adresse:</td>
                        <td>{detailsPersonnel.adress_fr}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Compte courant:</td>
                        <td>{detailsPersonnel.compte_courant}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-top border-dark pt-2">
                <h5 className="fw-bold text-uppercase">Informations Professionnelles</h5>
                <div className="d-flex">
                  <Table bordered size="sm" className="flex-grow-1">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Matricule:</td>
                        <td>{detailsPersonnel.matricule}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Poste:</td>
                        <td>{lastPosition?.poste?.poste_fr}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Grade:</td>
                        <td>{lastPosition?.grade?.grade_fr}</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Spécialité:</td>
                        <td>{detailsPersonnel.specialite?.specialite_fr}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Département:</td>
                        <td>{detailsPersonnel.departement?.name_fr}</td>
                      </tr>
                    </tbody>
                  </Table> */}
                </div>
              </div>
            </div>

            <Button onClick={reactToPrintFn} className="mt-4" variant="primary">
              Imprimer PDF
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FichePersonnel;
