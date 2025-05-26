import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";

const AddNewStagePfe = () => {
  document.title = "Ajouter Nouveau Stage PFE | ENIGA";

  const { data: allClasses = [] } = useFetchClassesQuery();

  //useFetchEtudiantsByIdClasseQuery

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const filtredClasses = allClasses.filter((classe) =>
    classe.nom_classe_fr.startsWith("3")
  );
  const handleSelectedClasse = (e: any) => {
    setSelectedClasse(e.target.value);
  };

  const { data: EtudiantsByClasseID = [], isSuccess: studentsLoaded } =
    useFetchEtudiantsByIdClasseQuery(selectedClasse);

  console.log("all classes", EtudiantsByClasseID);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nouveau Stage PFE"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Label>Classe :</Form.Label>
                  <select
                    className="form-select"
                    onChange={handleSelectedClasse}
                  >
                    <option value="">Choisir ...</option>
                    {filtredClasses.map((classe) => (
                      <option value={classe?._id!} key={classe?._id!}>
                        {classe?.nom_classe_fr}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col>
                  <Form.Label>Etudiant :</Form.Label>
                  <select className="form-select">
                    <option value="">Choisir ...</option>
                    {EtudiantsByClasseID.map((etudiant) => (
                      <option value={etudiant?._id!} key={etudiant?._id!}>
                        {etudiant?.prenom_fr!} {etudiant?.nom_fr!}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddNewStagePfe;
