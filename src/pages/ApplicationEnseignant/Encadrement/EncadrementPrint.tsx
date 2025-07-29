import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Table, Button, Col, Row, Image } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";



const EncadrementPrintPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();
  const lastVariable =
    Variables.length > 0 ? Variables[Variables.length - 1] : null;
   
  const { etudiant, encadrements, stage } = state || {};
  const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
  
 useEffect(() => {
    if (!state) {
      navigate("/application-enseignant/encadrement"); // Redirect back if no data
    }
  }, [state, navigate]);
  if (!etudiant || !encadrements || !stage) return null;
  return (
      <React.Fragment>
              <div className="page-content">
    <Container className="mt-4">
      <Col xxl={12}>
       <div
  ref={contentRef}
  className="p-4 border position-relative"
  style={{
    maxWidth: "794px",
  
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
                                                 <h4 className="fw-bold text-uppercase"> Fiche d'encadrement </h4>

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

<Card className=" mb-4 align-items-start">
  <Card.Body>
    <Row className="d-flex flex-row flex-wrap">
      <Col style={{ flex: "1 0 50%", maxWidth: "50%" }}>
        <h5 className="fw-bold border-bottom pb-2 mb-3">Informations sur l’étudiant</h5>
        <p><strong>Nom:</strong> {etudiant.nom_fr} {etudiant.prenom_fr}</p>
        <p><strong>Email:</strong> {etudiant.email}</p>
        <p><strong>Matricule:</strong> {etudiant.matricule_number || "-"}</p>
        <p><strong>Classe:</strong> {etudiant.Groupe}</p>
        <p><strong>Filière:</strong> {etudiant.filiere}</p>
      </Col>

      <Col style={{ flex: "1 0 50%", maxWidth: "50%" }}>
        <h5 className="fw-bold border-bottom pb-2 mb-3">Informations sur l’encadrant</h5>
        <p><strong>Nom:</strong> {stage?.encadrant_univ1?.nom_fr} {stage?.encadrant_univ1?.prenom_fr}</p>
        <p><strong>Email:</strong> {stage?.encadrant_univ1?.email}</p>
        {/* Optional if available */}
        {/* <p><strong>Grade:</strong> {stage?.encadrant_univ1?.grade}</p>
        <p><strong>Département:</strong> {stage?.encadrant_univ1?.departement}</p> */}
      </Col>
    </Row>
  </Card.Body>
</Card>
<Card className="mb-4 shadow">
  <Card.Body>
    <h5 className="fw-bold border-bottom pb-2 mb-3">Informations sur le stage</h5>
    <Row className="d-flex flex-row flex-wrap">
      <Col style={{ flex: "1 0 50%", maxWidth: "50%" }}>
        <p><strong>Sujet:</strong> {stage?.sujet || "-"}</p>
        <p><strong>Entreprise:</strong> {stage?.societe || "-"}</p>
        <p><strong>Encadrant externe:</strong> {stage?.encadrant_societe1 || "-"}</p>
      </Col>
      <Col style={{ flex: "1 0 50%", maxWidth: "50%" }}>
        <p><strong>Période:</strong> {stage?.date_debut} - {stage?.date_fin}</p>
        <p><strong>Type de stage:</strong> {stage?.type || "-"}</p>
        <p><strong>Statut:</strong> {stage?.status_stage}</p>
      </Col>
    </Row>
  </Card.Body>
</Card>
      <h5>Historique des séances</h5>
      <Table bordered striped>
        <thead>
          <tr>
            <th>Séance</th>
            <th>Date</th>
            <th>Heure début</th>
            <th>Heure fin</th>
            <th>Mode</th>
            <th>Avancement</th>
            <th>Remarque</th>
          </tr>
        </thead>
        <tbody>
          {encadrements.map((enc:any, idx:any) => (
            <tr key={idx}>
              <td>{enc.seance}</td>
              <td>{new Date(enc.date).toLocaleDateString()}</td>
              <td>{enc.heure_debut}</td>
              <td>{enc.heure_fin}</td>
              <td>{enc.mode}</td>
              <td>{enc.avancement}</td>
              <td>{enc.remarque}</td>
            </tr>
          ))}
        </tbody>
      </Table>

              

</div>
      </Col>

      
      <div className="d-print-none mt-3">
        <Button variant="primary"   onClick={() => reactToPrintFn()}>Imprimer</Button>{" "}
        <Button variant="secondary" onClick={() => navigate(-1)}>Retour</Button>
      </div>
    </Container>
              </div>
        </React.Fragment>
  );
};

export default EncadrementPrintPage;
