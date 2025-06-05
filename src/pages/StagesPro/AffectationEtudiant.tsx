import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import { formatDate } from "utils/formatDate";

interface AffectationProps {
  stageDetails: any;
  lastVariable: any;
  contentRef: any;
}

const AffectationEtudiant: React.FC<AffectationProps> = ({
  stageDetails,
  lastVariable,
  contentRef,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <React.Fragment>
      <div ref={contentRef} className="p-3">
        <Row className="mb-2 d-flex align-items-center text-center">
          <Col className="d-flex flex-column align-items-center justify-content-center">
            <h6>{lastVariable?.universite_fr}</h6>
            <Image
              width="100"
              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
            />
          </Col>

          <Col className="d-flex flex-column align-items-center justify-content-center">
            <Image
              width="100"
              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoRepubliqueFiles/${lastVariable?.logo_republique}`}
            />
          </Col>

          <Col className="d-flex flex-column align-items-center justify-content-center">
            <h6>{lastVariable?.etablissement_fr}</h6>
            <Image
              width="100"
              src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${lastVariable?.logo_etablissement}`}
            />
          </Col>
        </Row>

        <div className="text-center">
          <span>A Monsieur Le Directeur : </span>{" "}
          <span className="fs-14 fw-bold">{stageDetails.societe.nom}</span>
        </div>

        <div>
          <span className="fs-13 fw-medium">
            <u>Objet : </u>
          </span>
          <span> Affectation de Stagiaire</span>
        </div>

        <div>
          <p>Monsieur,</p>
          <p>
            Je vous remervie d'avoir bie, voulu accepter d'accueillir des
            stagiaires de l'{lastVariable?.abreviation!},
          </p>
          <p>et j'ai le plaisir de vous informer que : </p>
          <p className="mt-1" style={{ marginLeft: "20px" }}>
            L'étudiant(e) :{" "}
            <strong>
              {stageDetails.etudiant.prenom_fr} {stageDetails.etudiant.nom_fr}
            </strong>
          </p>
          <p style={{ marginLeft: "20px" }}>
            CIN : <strong>{stageDetails.etudiant.num_CIN}</strong>
          </p>
          <p style={{ marginLeft: "20px" }}>
            Inscrit(e) en : <strong>{stageDetails.etudiant.Groupe}</strong>
          </p>
          <p style={{ marginLeft: "20px" }}>
            Spécialité : <strong>{stageDetails.etudiant.Spécialité}</strong>
          </p>
          {stageDetails.type_stage === "Stage Technicien" ? (
            <p className="mt-1">
              est désigné(e) pour effectuer un stage :{" "}
              <strong>Technicien</strong> dans votre établissement
            </p>
          ) : (
            <p className="mt-1">
              est désigné(e) pour effectuer un stage : <strong>Ouvrier</strong>{" "}
              dans votre établissement
            </p>
          )}

          <p className="text-center mb-1">
            <strong>{stageDetails.date_debut}</strong> au{" "}
            <strong>{stageDetails.date_fin}</strong>
          </p>
          <p>
            Ce Stage est sanctionné par un visa du responsable encadreur, je
            vous prie de bien vouloir remplir le "Carnet de Stage" ci-jointe et
            de délivrer une attestation de stage à l'intéressé à la fin du
            stage.
          </p>
          <p>
            En vous remerciant de votre bienveillante collaboration , veuillez
            agréer , Monsieur le Directeur,
          </p>
          <p>l'expression de mes meilleures salutations.</p>
        </div>

        <div className="text-end mt-1 mb-2">
          <p>Gafsa le {formatDate(today)}</p>
          <p>Le Directeur</p>
          <p>{lastVariable?.directeur_fr!}</p>
          <img
            src={`${
              process.env.REACT_APP_API_URL
            }/files/variableGlobaleFiles/signatureDirecteurFiles/${lastVariable?.signature_directeur!}`}
            width="80"
          />
        </div>

        <div className="mb-1">
          <p>
            <strong>Remarques : </strong> - L'étudiant(e) est tenue de respecter
            les dates fixées pour le déroulement de son stage.
          </p>
          <p>- Les stages demandés sont obligatoires.</p>
        </div>

        <div className="mb-1">
          <p>
            <strong className="fs-14">N.B</strong> : Les stagiares sont couverts
            par une assurance contractée par l'{lastVariable?.abreviation!} :
            14785236-004 .
          </p>
        </div>

        <div className="text-center border-dark border-top">
          <p className="mt-1">Adresse : {lastVariable?.etablissement_fr!}</p>
          <p>{lastVariable?.address_fr!}</p>
          <p>
            Tél : {lastVariable?.phone!} | Fax: {lastVariable?.fax!}
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AffectationEtudiant;
