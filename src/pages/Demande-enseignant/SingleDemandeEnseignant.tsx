import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Page, View, Document, StyleSheet, Font, Text } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";

// Import images
import img1 from "assets/images/small/img-1.jpg";
import img2 from "assets/images/small/img-2.jpg";
import img3 from "assets/images/small/img-3.jpg";
import img4 from "assets/images/small/img-4.jpg";
import img5 from "assets/images/small/img-5.jpg";
import img6 from "assets/images/small/img-6.jpg";
import avatar1 from "assets/images/users/avatar-1.jpg";
import student from "assets/images/etudiant.png"
import file from "assets/images/demande.png"
// import HeaderPDF from "Common/HeaderPDF";
import FooterPDF from "Common/FooterPDF";
import TitlePDF from "Common/TitlePDF";
import BodyPDF from "Common/BodyPDF";
import SignaturePDF from "Common/SignaturePDF";

import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import ArFooterPDF from "Common/ArFooterPDF";
import ArSignaturePDF from "Common/ArSignaturePDF";

Font.register({
  family: "Amiri",
  src: "/assets/fonts/Amiri-Regular.ttf",
});

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#ffffff",
    fontFamiy: "Source Sans",
    fontSize: 12,
    lineHeight: 1.4,
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 32,
    height: "100vh",
  },
  top: {
    flex: 1,
  },
  page: {
    fontFamily: "Amiri",
  },
  logo: {
    width: 100,  // Set the width to a small value
    height: 50,  // Set the height to a small value
    resizeMode: 'contain', // Maintain aspect ratio
    alignSelf: 'center', // Center the image horizontally
    marginTop: 10, // Add some space at the top
  },
});



const PDF_REPORT = (props: any) => {


  const {
    address_fr,
    phone,
    fax,
    website,
    formattedDate,
    piece_demande,
    studentId,
    enseignantId,
    personnelId,
    signature_directeur,
    langue,
    address_ar,
    gouvernorat_ar,
    gouvernorat_fr,
    code_postal,
    allVariables,
    raison,
    departement,
    logo_etablissement,
    logo_universite,
    logo_republique,
   
  } = props;

 

  return (
    <Document>
      <Page size="A4" style={[styles.body, styles.page]} wrap>
        {/* <View>
        <HeaderPDF
          logo_etablissement={logo_etablissement}
          logo_republique={logo_republique}
          logo_universite={logo_universite}
        />
        </View> */}
  
        <TitlePDF piece_demande={piece_demande} /> 
        <View style={{ flex: 2 }}>
          <BodyPDF
            piece_demande={piece_demande}
            studentId={studentId}
            enseignantId= {enseignantId}
            personnelId={personnelId}
            allVariables={allVariables}
            raison={raison}
            formattedDate={formattedDate}
            departement= {departement}

          />
        </View>
        <View>
          {langue === "french" ? (
            <SignaturePDF
              formattedDate={formattedDate}
              signature_directeur={signature_directeur}
              gouvernorat_fr={gouvernorat_fr}
            />
          ) : (
            <ArSignaturePDF
              formattedDate={formattedDate}
              signature_directeur={signature_directeur}
              gouvernorat_ar={gouvernorat_ar}
            />
          )}
        </View>
        <View fixed>
          {langue === "french" ? (
            <FooterPDF
              address_fr={address_fr}
              code={code_postal}
              phone={phone}
              fax={fax}
              website={website}
            />
          ) : (
            <ArFooterPDF
              address_ar={address_ar}
              code={code_postal}
              phone={phone}
              fax={fax}
              website={website}
            />
          )}
        </View>
      </Page>
    </Document>
  );
};

const SingleDemandeEnseignant = () => {
  document.title = "Demande Enseignant | Smart University";
 
       

  

  const location = useLocation();
    const navigate = useNavigate();

  const currentStatus = location.state.status;
  const getBadgeClasses = (statusValue: string) => {
    switch (statusValue) {
        case 'en attente':
            return 'badge bg-warning-subtle text-warning';
        case 'traité':
            return 'badge bg-primary-subtle text-primary';
        case 'rejeté':
            return 'badge bg-danger-subtle text-danger';
        default:
            return 'badge';
    }
  }
  const { data: AllVariablesGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
console.log(location.state?.enseignantId)
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Demande enseignant "
            pageTitle="Modifier La Demande"
          />
          <Row>
            <Col lg={12}>
              <Card>
                {/* <Card.Header>
                                <h5 className="card-title mb-0">Basic Example</h5>
                            </Card.Header> */}
                <Card.Body>
                  <Card className="border-0 shadow-none mb-0">
                    <Card.Body
                      className="rounded profile-basic mb-n5"
                      style={{
                        backgroundImage: `url(${img4})`,
                        backgroundSize: "cover",
                      }}
                    ></Card.Body>
                    <Card.Body>
                      <div className="mt-n5">
                        <Image
                           src={`${process.env.REACT_APP_API_URL}/files/enseignantFiles/PhotoProfil/${location.state?.enseignantId.photo_profil}`}
                          alt=""
                          className="avatar-xxl rounded-circle p-1 bg-body mt-n5"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xxl={6} lg={6}>
              <Card className="categrory-widgets overflow-hidden">
                <div className="card-header d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">
                    Détails de l'enseignant{" "}
                    {/* <i className="bi bi-mortarboard-fill"></i> */}
                  </h5>
                  <div className="flex-shrink-0">
                  <Button
                    onClick={() =>
                      navigate(`/gestion-enseignant/compte-enseignant`, {
                        state: { _id: location.state?.enseignantId._id },
                      })
                    }
                      type="button"
                      className="btn btn-info btn-label m-1"
                    >
                      <i className="bi bi-eye label-icon align-middle fs-16 me-2"></i>
                      Voir enseignant{" "}
                    </Button>
                    
                  </div>
                </div>
                <div className="card-body">
                <div className="text-center">
                    <i className="bi bi-mortarboard fs-1 text-muted"></i>
                    </div>
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless align-middle description-table mb-0">
                      <tbody>
                        <tr>
                          <td className="fs-5">Nom et prénom:</td>
                          <td>
                            <span className="mb-1 fs-5">
                            {location.state?.enseignantId?.nom_fr!} {location.state?.enseignantId?.prenom_fr!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">CIN:</td>
                          <td>
                            <span className="mb-1 fs-5">
                            {location.state?.enseignantId?.num_CIN!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="">E-mail:</td>
                          <td>
                            <span className="mb-1 ">
                            {location.state?.enseignantId?.email!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="">Téléphone:</td>
                          <td>
                            <span className="mb-1 ">{location.state?.enseignantId?.num_phone!}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <img src={student} alt="" className="img-fluid category-img object-fit-cover" />
              </Card>
            </Col>
            <Col xxl={6} lg={6}>
              <Card className="categrory-widgets overflow-hidden">
                <div className="card-header d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">
                    Détails de la demande
                  </h5>
                  <div className="flex-shrink-0">
                    {AllVariablesGlobales?.length > 0 ? (
                      <PDFDownloadLink
                        document={
                          <PDF_REPORT
                              logo_etablissement={
                              AllVariablesGlobales[2]?.logo_etablissement!
                            }
                            logo_republique={
                              AllVariablesGlobales[2]?.logo_republique!
                            }
                            logo_universite={
                              AllVariablesGlobales[2]?.logo_universite!
                            }
                            address_fr={AllVariablesGlobales[2]?.address_fr!}
                            phone={AllVariablesGlobales[2]?.phone!}
                            fax={AllVariablesGlobales[2]?.fax!}
                            website={AllVariablesGlobales[2]?.website!}
                            formattedDate={formattedDate}
                            piece_demande={location?.state?.piece_demande!}
                        
                            enseignantId={location?.state?.enseignantId!}
                            signature_directeur={
                              AllVariablesGlobales[2]?.signature_directeur!
                            }
                            langue={location?.state?.langue!}
                            address_ar={AllVariablesGlobales[2]?.address_ar!}
                            gouvernorat_ar={
                              AllVariablesGlobales[2]?.gouvernorat_ar!
                            }
                            gouvernorat_fr={
                              AllVariablesGlobales[2]?.gouvernorat_fr!
                            }
                            code_postal={AllVariablesGlobales[2]?.code_postal!}
                            allVariables={AllVariablesGlobales[2]}
                            raison={location?.state?.description!}
                            //departement={location?.state?.studentId?.groupe_classe?.departement!}
                          />
                      
                        }
                        fileName={location?.state?.piece_demande?.title!}
                      >
                        <Button
                          type="button"
                          className="btn btn-primary btn-label m-1"
                        >
                          <i className="bi bi-file-earmark-arrow-down label-icon align-middle fs-16 me-2"></i>
                          Générer
                        </Button>
                      </PDFDownloadLink>
                    ) : (
                      <div>No data available</div>
                    )}
                  <Button type="button" className="btn btn-success btn-label"><i className="bi bi-postcard label-icon align-middle fs-16 me-2"></i> Notifier l'enseignant</Button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="text-center">
                    <i className="bi bi-card-list fs-1 text-muted"></i>
                   
                  </div>
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless align-middle description-table mb-0">
                      <tbody>
                        <tr>
                          <td className="fs-5">Pièce demandée:</td>
                          <td>
                            <span className="mb-1 fs-5">
                            {location.state.piece_demande.title}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Langue:</td>
                          <td>
                            {location.state?.langue! === "frech" ? (
                              <span className="badge bg-info-subtle text-info">
                                Français
                              </span>
                            ) : (
                              <span className="badge bg-primary-subtle text-primary">
                                Arabe
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Nombre de copie:</td>
                          <td>
                          <span className="badge bg-secondary-subtle text-secondary">
                          {location.state.nombre_copie}
                      </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Etat de la demande:</td>
                          <td>
                          <span className="badge bg-danger-subtle text-danger">
                     {location.state?.status!}
                      </span> 
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <img src={file} alt="" className="img-fluid category-img object-fit-cover" />
              </Card>
            </Col>
          </Row>
          {/* <Row>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button variant="primary" id="add-btn" type="submit">
                  Modifer la Demande
                </Button>
              </div>
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleDemandeEnseignant;
