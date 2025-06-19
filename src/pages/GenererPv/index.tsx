import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAddGeneratedPvMutation } from "features/generatedPv/generatedPvSlice";
import Swal from "sweetalert2";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PdfFile from "./PdfFile";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

const GenererPv = () => {
  document.title = "Générer PV | ENIGA";

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "PV a été généré avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const location = useLocation();
  const pvDetails = location.state;

  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const lastVariable =
    variableGlobales.length > 0
      ? variableGlobales[variableGlobales.length - 1]
      : null;

  const [createNewPv] = useAddGeneratedPvMutation();

  const initialPv = {
    titre: "",
    content: "",
    commission: "",
  };

  const [generatedPv, setGeneratedPv] = useState(initialPv);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setGeneratedPv((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onContentChange = (event: any, editor: any) => {
    const data = editor.getData();
    setGeneratedPv((prevState) => ({
      ...prevState,
      content: data,
    }));
  };

  const onSubmitGeneratedPv = async (e: any) => {
    e.preventDefault();
    generatedPv["commission"] = pvDetails?.commission?._id!;
    try {
      await createNewPv(generatedPv);
      notifySuccess();

      const blob = await pdf(
        <PdfFile
          avisComm={pvDetails}
          title={generatedPv.titre}
          content={generatedPv.content}
          lastVariable={lastVariable}
        />
      ).toBlob();
      saveAs(blob, `pv_${generatedPv.titre}.pdf`);

      setGeneratedPv(initialPv);
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Générer PV" pageTitle="Gestion des stages" />
          <Card className="m-4">
            <Card.Body className="p-4">
              <Form.Group className="mb-3">
                <Form.Label>Titre: </Form.Label>
                <Form.Control
                  type="text"
                  value={generatedPv.titre}
                  onChange={onChange}
                  id="titre"
                  name="titre"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Text: </Form.Label>
                <CKEditor
                  editor={ClassicEditor}
                  data={generatedPv.content}
                  onChange={onContentChange}
                  id="content"
                />
              </Form.Group>
              <div className="table-responsive table-card m-1">
                <table className="table align-middle table-nowrap table-striped-columns mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "160px" }}>Etudiant</th>
                      <th style={{ width: "80px" }}>Groupe</th>
                      <th style={{ width: "200px" }}>Sujet</th>
                      <th style={{ width: "160px" }}>Lieu</th>
                      <th style={{ width: "100px" }}>Avis</th>
                      <th style={{ width: "220px" }}>Remarques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pvDetails.liste.map((avis_com: any) => {
                      return (
                        <tr key={avis_com._id}>
                          <td>{avis_com?.etudiant!}</td>
                          <td>{avis_com?.groupe!}</td>
                          <td>{avis_com?.sujet}</td>
                          <td>{avis_com?.lieu!}</td>
                          <td>{avis_com?.avis!}</td>
                          <td>{avis_com?.remarques}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="table-responsive table-card mt-4 p-4">
                <table className="table align-middle table-nowrap table-striped-columns mb-0">
                  <thead className="table-light">
                    <tr>
                      {pvDetails?.commission?.membres!.map(
                        (membre: any, index: number) => (
                          <th key={index}>
                            {membre.prenom_fr} {membre.nom_fr}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {pvDetails?.commission?.membres!.map(
                        (membre: any, index: number) => (
                          <td key={index} style={{ height: "50px" }}></td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <Card.Footer>
              <Row className="d-flex justify-content-end">
                <Col lg={2}>
                  <span
                    className="d-flex align-items-center justify-content-center badge bg-danger-subtle text-info view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={onSubmitGeneratedPv}
                  >
                    <i className="ph ph-file-arrow-down"></i> Télécharger
                  </span>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GenererPv;
