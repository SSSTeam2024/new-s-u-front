import React from "react";
import { Col, Image, Row } from "react-bootstrap";

interface HeaderPDFProps {
  logo_etablissement: string;
  logo_republique: string;
  logo_universite: string;
}

const HeaderPDF: React.FC<HeaderPDFProps> = ({
  logo_etablissement,
  logo_republique,
  logo_universite,
}) => {
  return (
    <Row className="text-center mb-3">
      <Col>
        <Image
          style={{
            width: 100,
          }}
          src={`http://localhost:5000/files/variableGlobaleFiles/logoEtablissementFiles/${logo_etablissement}`}
        />
      </Col>
      <Col>
        <Image
          style={{
            width: 50,
          }}
          src={`http://localhost:5000/files/variableGlobaleFiles/logoRepubliqueFiles/${logo_republique}`}
        />
      </Col>
      <Col>
        <Image
          style={{
            width: 100,
          }}
          src={`http://localhost:5000/files/variableGlobaleFiles/logoUniversiteFiles/${logo_universite}`}
        />
      </Col>
    </Row>
  );
};

export default HeaderPDF;