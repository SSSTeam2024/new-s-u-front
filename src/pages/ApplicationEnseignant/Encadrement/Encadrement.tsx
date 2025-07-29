import React, { useEffect, useState } from "react";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useFetchGroupedByEnseignantQuery } from "features/encadrement/encadrementSlice";
import { Form, Table, Spinner, Card, Container, Button, Modal, Row, Col } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Navigate, useNavigate } from "react-router-dom";

const EncadrementRecapitulatif = () => {
const navigate = useNavigate();
  const { data: enseignants = [], isLoading: loadingEns } = useFetchEnseignantsQuery();
  const [selectedId, setSelectedId] = useState<string>("");

  const {
    data: groupedEncadrements = [],
    isLoading: loadingEncadrements,
  } = useFetchGroupedByEnseignantQuery( { enseignantId: selectedId }, {
    skip: !selectedId,
  });

  const [openEtudiantId, setOpenEtudiantId] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    setOpenEtudiantId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
  if (selectedId && groupedEncadrements.length > 0) {
    console.log("Grouped Encadrements:", groupedEncadrements);
  }
}, [groupedEncadrements, selectedId]);

  return (
     <React.Fragment>
          <div className="page-content">
            <Container fluid={true}>
              <Breadcrumb title="Liste des Encadrement" pageTitle="Encadrement" />
    
    <div className="container mt-4">
      <h4>Sélectionner un enseignant</h4>

      <Form.Select
        className="mb-3"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Choisir un enseignant --</option>
        {enseignants.map((ens) => (
          <option key={ens._id} value={ens._id}>
            {ens.nom_fr} {ens.prenom_fr}
          </option>
        ))}
      </Form.Select>

      {loadingEns && <Spinner animation="border" variant="primary" />}

      {selectedId && loadingEncadrements && (
        <Spinner animation="border" variant="secondary" />
      )}

      {selectedId && groupedEncadrements.length > 0 && (
        <>
          <h5>Étudiants encadrés</h5>
          <Table striped bordered responsive hover>
            <thead className="table-light">
              <tr>
                <th>Étudiant</th>
                <th>Classe</th>
                <th>Sujet</th>
                <th>Nombre de séances</th>
                <th>Dernier avancement</th>
              </tr>
            </thead>
            <tbody>
              {groupedEncadrements.map(({ etudiant, encadrements, stage }) => (
                <tr
                  key={etudiant._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(etudiant?._id!)}
                >
                  <td> 
                    {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                    </td>
                  <td>{etudiant.Groupe|| "-"}</td>
                  <td>{stage?.sujet || "-"}</td>
                  <td>{encadrements.length}</td>
                  <td>{encadrements.at(-1)?.avancement || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {openEtudiantId && (
            <Card className="mt-4 border-primary">
              <Card.Header className="bg-primary text-white">
                Détail des séances d'encadrement
              </Card.Header>
              <Card.Body>
                     <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Séances</h5>
        <Button
          variant="outline-success"
          onClick={() => {
            const selected = groupedEncadrements.find(
              (g) => g.etudiant._id === openEtudiantId
            );
            if (selected) {
              navigate("/application-enseignant/print-encadrement", {
                state: {
                  etudiant: selected.etudiant,
                  encadrements: selected.encadrements,
                  stage: selected.stage || null, // optional
                },
              });
            }
          }}
        >
          Imprimer l'historique
        </Button>
      </div>
                <Table striped bordered>
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
                    {groupedEncadrements
                      .find((g) => g.etudiant._id === openEtudiantId)
                      ?.encadrements.map((enc, index) => (
                        <tr key={index}>
                          <td>
                            {/* {enc.seance}  */}
                            Séance {index+1}</td>
                          <td>{new Date(enc.date).toLocaleDateString()}</td>
                          <td>{enc.heure_debut}</td>
                          <td>{enc.heure_fin}</td>
                          <td>{enc.mode}</td>
                          <td>{enc.avancement}%</td>
                          <td>{enc.remarque}</td>
                        </tr>
                        
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </div>
     </Container>
          </div>
    </React.Fragment>
  );
};

export default EncadrementRecapitulatif;
