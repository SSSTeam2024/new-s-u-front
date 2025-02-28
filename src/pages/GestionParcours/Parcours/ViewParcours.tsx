import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Table } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

const ViewParcours = () => {
  const location = useLocation();
  const parcours = location.state;
  console.log("parcours state", parcours);

  if (!parcours) {
    return <div className="text-center">Aucun parcours sélectionné</div>;
  }

  const uniqueSemesters: string[] = Array.from(
    new Set(parcours.semestre_parcours)
  );

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumb
          title="Visualisation Parcours"
          pageTitle="Détail du Parcours"
        />

        {/* Parcours Information */}
        <Card className="mb-4">
          <Card.Body>
            <h4 className="text-center">{parcours?.nom_parcours}</h4>
            <p>
              <strong>Type:</strong>{" "}
              {parcours?.type_parcours?.name_type_parcours_fr}
            </p>
            <p>
              <strong>Domaine:</strong> {parcours?.domaine?.name_domaine_fr}
            </p>
            <p>
              <strong>Mention:</strong> {parcours?.mention?.name_mention_fr}
            </p>
          </Card.Body>
        </Card>

        {/* Iterate over unique semesters and display grouped modules */}
        {uniqueSemesters.map((semester: string) => (
          <Card key={semester} className="mb-4">
            <Card.Body>
              {/* Semester Title */}
              <h5 className="text-center text-primary mb-3">
                Semestre {semester}
              </h5>

              <Table bordered hover responsive>
                <thead className="table-primary text-center">
                  <tr>
                    <th>Code Module</th>
                    <th>Libellé</th>
                    <th>Crédit</th>
                    <th>Coefficient</th>
                    <th>Nature</th>
                    <th>Régime</th>
                    <th>Eléments d'enseignements</th>
                  </tr>
                </thead>
                <tbody>
                  {parcours.modules
                    .filter(
                      (module: any) => module.semestre_module === semester
                    ) // Filter modules by semester
                    .map((module: any) => (
                      <React.Fragment key={module._id}>
                        <tr className="text-center">
                          <td>{module.code_Ue}</td>
                          <td>{module.libelle}</td>
                          <td>{module.credit}</td>
                          <td>{module.coef}</td>
                          <td>{module.nature}</td>
                          <td>{module.regime}</td>
                          <td>
                            <Table bordered size="sm">
                              <thead className="table-secondary">
                                <tr>
                                  <th>Code Matière</th>
                                  <th>Libellé</th>
                                  <th>Coefficient</th>
                                  <th>Crédit</th>
                                  <th>Régime</th>
                                  <th>Volume Horaire</th>
                                  <th>Nombre d'élimination</th>
                                </tr>
                              </thead>
                              <tbody>
                                {module.matiere.map((matiere: any) => (
                                  <tr key={matiere._id}>
                                    <td>{matiere.code_matiere}</td>
                                    <td>{matiere.matiere}</td>
                                    <td>{matiere.coefficient_matiere}</td>
                                    <td>{matiere.credit_matiere}</td>
                                    <td>{matiere.regime_matiere}</td>
                                    <td>
                                      {matiere.types.map((type: any) => (
                                        <div key={type.type}>
                                          <strong>{type.type}:</strong>{" "}
                                          {type.volume}h
                                        </div>
                                      ))}
                                    </td>
                                    <td>
                                      {matiere.types.map((type: any) => (
                                        <div key={type.type}>
                                          {type.nbr_elimination}
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default ViewParcours;
