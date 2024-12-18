import React from "react";
import { Col, Row } from "react-bootstrap";

interface ChildProps {
  address_fr: string;
  code: string;
  phone: string;
  fax: string;
  website: string;
}

const FooterPDF: React.FC<ChildProps> = ({
  address_fr,
  code,
  phone,
  fax,
  website,
}) => {
  return (
    <div
      style={{
        borderTopWidth: 1,
        borderTopColor: "#999",
        borderTopStyle: "solid",
        // marginTop: "10px", // Adds space above the footer
        padding: "1px", // Adds vertical padding
        // backgroundColor: "#f8f9fa", // Light background color
        color: "#333", // Dark text color for better contrast
        fontSize: "12px", // Slightly larger font size
      }}
    >
      <Row className="text-center pt-3">
        <Col>
          <span className=" mt-5 fw-bold">
            {address_fr}, {code}
          </span>
        </Col>
      </Row>
      <Row className="p-1 mt-1 d-flex justify-content-center">
        <Col className="text-center">
          <span className="fw-bold">Tél: </span>
          <span className="fw-medium">(+216) {phone}</span>
          <span className="mx-2">|</span>
          <span className="fw-bold">Fax: </span>
          <span className="fw-medium">(+216) {fax}</span>
          <span className="mx-2">|</span>
          <span className="fw-medium">{website}</span>
        </Col>
      </Row>
    </div>
  );
};

export default FooterPDF;
