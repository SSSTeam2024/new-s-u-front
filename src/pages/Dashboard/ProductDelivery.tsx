import React from "react";
import SimpleBar from "simplebar-react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { productDelivery } from "../../Common/data";

const ProductDelivery = () => {
  return (
    <React.Fragment>
      <Col xxl={3} lg={6}>
        <Card>
          <Card.Header className="d-flex">
            <h5 className="card-title flex-grow-1 mb-0">Product Delivery</h5>
            <Link to="#" className="flex-shrink-0">
              View All <i className="ri-arrow-right-line align-bottom ms-1"></i>
            </Link>
          </Card.Header>
          <Card.Body className="px-0">
            <h3>Product Delivery</h3>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ProductDelivery;
