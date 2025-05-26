import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchAllStagePfeQuery } from "features/stagesPfe/stagesPfeSlice";

const Encadrement = () => {
  document.title = "Encadrement PFE | ENIGA";

  const { data = [] } = useFetchAllStagePfeQuery();

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Encadrant</span>,
      selector: (row: any) => (
        <span>
          {row?.encadrant_univ?.prenom_fr!}
          {row?.encadrant_univ?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etudiant</span>,
      selector: (row: any) => (
        <span>
          {row?.etudiant?.prenom_fr!}
          {row?.etudiant?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Groupe</span>,
      selector: (row: any) => <span>{row?.etudiant?.Groupe!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type Stage</span>,
      selector: (row: any) => row?.type_stage!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Binôme</span>,
      selector: (row: any) => (
        <span>
          {row?.etudiant?.prenom_fr!}
          {row?.etudiant?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Sociéte</span>,
      selector: (row: any) => <span>{row?.societe?.nom!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Soutenance</span>,
      selector: (row: any) => row?.date_soutenance!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Sujet</span>,
      selector: (row: any) => row?.sujet!,
      sortable: true,
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Encadrement PFE" pageTitle="Gestion des stages" />
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Encadrement;
