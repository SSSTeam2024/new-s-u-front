import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import { useAddNewVaribaleGlobaleMutation } from "features/variableGlobale/variableGlobaleSlice";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(","); // Extract only the Base64 data
      const extension = file.name.split(".").pop() ?? ""; // Get the file extension
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const AjouterVariablesGlobales = () => {
  document.title = "Variables Globales | Smart Institute";
  const navigate = useNavigate();
  const [newVariableGlobale] = useAddNewVaribaleGlobaleMutation();
  const initialVariableGlobale = {
    directeur_ar: "",
    directeur_fr: "",
    secretaire_ar: "",
    secretaire_fr: "",
    signature_directeur_base64: "",
    signature_directeur_extension: "",
    signature_secretaire_base64: "",
    signature_secretaire_extension: "",
    etablissement_ar: "",
    etablissement_fr: "",
    logo_etablissement_base64: "",
    logo_etablissement_extension: "",
    logo_universite_base64: "",
    logo_universite_extension: "",
    logo_republique_base64: "",
    logo_republique_extension: "",
    universite_ar: "",
    universite_fr: "",
    address_ar: "",
    address_fr: "",
    gouvernorat_ar: "",
    gouvernorat_fr: "",
    code_postal: "",
    phone: "",
    fax: "",
    website: "",
    signature_directeur: "",
    signature_secretaire: "",
    logo_etablissement: "",
    logo_universite: "",
    logo_republique: "",
  };

  const [variableGlobale, setVariableGlobale] = useState(
    initialVariableGlobale
  );
  const {
    directeur_ar,
    directeur_fr,
    secretaire_ar,
    secretaire_fr,
    signature_directeur_base64,
    signature_directeur_extension,
    signature_secretaire_base64,
    signature_secretaire_extension,
    etablissement_ar,
    etablissement_fr,
    logo_etablissement_base64,
    logo_etablissement_extension,
    logo_universite_base64,
    logo_universite_extension,
    logo_republique_base64,
    logo_republique_extension,
    universite_ar,
    universite_fr,
    address_ar,
    address_fr,
    gouvernorat_ar,
    gouvernorat_fr,
    code_postal,
    phone,
    fax,
    website,
    signature_directeur,
    signature_secretaire,
    logo_etablissement,
    logo_universite,
    logo_republique,
  } = variableGlobale;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVariableGlobale((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUploadSignatureDirecteur = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("signature_directeur_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setVariableGlobale({
        ...variableGlobale,
        signature_directeur: profileImage,
        signature_directeur_base64: base64Data,
        signature_directeur_extension: extension,
      });
    }
  };

  const handleFileUploadSignatureSecretaire = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("signature_secretaire_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setVariableGlobale({
        ...variableGlobale,
        signature_secretaire: profileImage,
        signature_secretaire_base64: base64Data,
        signature_secretaire_extension: extension,
      });
    }
  };

  const handleFileUploadLogoEtablissement = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("logo_etablissement_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setVariableGlobale({
        ...variableGlobale,
        logo_etablissement: profileImage,
        logo_etablissement_base64: base64Data,
        logo_etablissement_extension: extension,
      });
    }
  };

  const handleFileUploadLogoUniversite = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("logo_universite_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setVariableGlobale({
        ...variableGlobale,
        logo_universite: profileImage,
        logo_universite_base64: base64Data,
        logo_universite_extension: extension,
      });
    }
  };

  const handleFileUploadLogoEepublique = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("logo_republique_base64") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setVariableGlobale({
        ...variableGlobale,
        logo_republique: profileImage,
        logo_republique_base64: base64Data,
        logo_republique_extension: extension,
      });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newVariableGlobale(variableGlobale).then(() =>
      setVariableGlobale(initialVariableGlobale)
    );
    notify();
    navigate("/template/liste-template-body");
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Variable Globale has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                {/* <Card.Header>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-sm">
                        <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                          <i className="bi bi-person-workspace"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">Employee's Account</h5>
                    </div>
                  </div>
                </Card.Header> */}
                <Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmit}>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Directeur</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="directeur_ar">
                              <h4 className="card-title mb-0">
                                Nom du directeur (ar)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="directeur_ar"
                              id="directeur_ar"
                              placeholder="Nom du directeur (ar)"
                              value={variableGlobale.directeur_ar}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        {/* nom directeur fr*/}
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="directeur_fr">
                              <h4 className="card-title mb-0">
                                Nom du directeur (fr)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="directeur_fr"
                              id="directeur_fr"
                              placeholder="Nom du directeur (fr)"
                              value={variableGlobale.directeur_fr}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="signature_directeur_base64">
                              <h4 className="card-title mb-0">
                                Signature du directeur
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="signature_directeur_base64"
                              type="file"
                              id="signature_directeur_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadSignatureDirecteur}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Secrétaire Général</h5>
                            </div>
                          </div>
                        </Card.Header>
                        {/* nom directeur ar*/}
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="secretaire_ar">
                              <h4 className="card-title mb-0">
                                Nom du secrétaire général (ar)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="secretaire_ar"
                              id="secretaire_ar"
                              placeholder="Nom du secrétaire général (ar)"
                              value={variableGlobale.secretaire_ar}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        {/* nom directeur fr*/}
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="secretaire_fr">
                              <h4 className="card-title mb-0">
                                Nom du secrétaire général (fr)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="secretaire_fr"
                              id="secretaire_fr"
                              placeholder="Nom du secrétaire général (fr)"
                              value={variableGlobale.secretaire_fr}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="signature_secretaire_base64">
                              <h4 className="card-title mb-0">
                                Signature du secrétaire général
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="signature_secretaire_base64"
                              type="file"
                              id="signature_secretaire_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadSignatureSecretaire}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Université</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="universite_fr">
                              <h4 className="card-title mb-0">
                                Nom de l'université (fr)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="universite_fr"
                              id="universite_fr"
                              placeholder="Nom de l'université (fr)"
                              value={variableGlobale.universite_fr}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="universite_ar">
                              <h4 className="card-title mb-0">
                                Nom de l'université (Ar)
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="universite_ar"
                              id="universite_ar"
                              placeholder="Nom de l'université (Ar)"
                              value={variableGlobale.universite_ar}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Row>
                          <Card.Header className="mb-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-person-lines-fill"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">Etablissement </h5>
                              </div>
                            </div>
                          </Card.Header>

                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="etablissement_fr">
                                <h4 className="card-title mb-0">
                                  Nom de l'établissement (fr)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="etablissement_fr"
                                id="etablissement_fr"
                                placeholder="Nom de l'établissement (fr)"
                                value={variableGlobale.etablissement_fr}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="etablissement_ar">
                                <h4 className="card-title mb-0">
                                  Nom de l'établissement (Ar)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="etablissement_ar"
                                id="etablissement_ar"
                                placeholder="Nom de l'établissement (Ar)"
                                value={variableGlobale.etablissement_ar}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Adresse</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address_fr">
                                <h4 className="card-title mb-0">
                                  Adresse (fr)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="address_fr"
                                id="address_fr"
                                placeholder="Adresse (fr)"
                                value={variableGlobale.address_fr}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address_ar">
                                <h4 className="card-title mb-0">
                                  gouvernorat (fr)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="gouvernorat_fr"
                                id="gouvernorat_fr"
                                placeholder="gouvernorat"
                                value={variableGlobale.gouvernorat_fr}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address_ar">
                                <h4 className="card-title mb-0">Code postal</h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="code_postal"
                                id="code_postal"
                                placeholder="code postal"
                                value={variableGlobale.code_postal}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="address_fr"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                <h4 className="card-title mb-0">العنوان </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="address_ar"
                                id="address_ar"
                                placeholder="العنوان"
                                value={variableGlobale.address_ar}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div
                              className="mb-3"
                              style={{ direction: "rtl", textAlign: "right" }}
                            >
                              <Form.Label
                                htmlFor="address_ar"
                                style={{ direction: "rtl", textAlign: "right" }}
                              >
                                <h4 className="card-title mb-0">الولاية </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="gouvernorat_ar"
                                id="gouvernorat_ar"
                                placeholder="الولاية"
                                value={variableGlobale.gouvernorat_ar}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Info</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="phone">
                              <h4 className="card-title mb-0">
                                Numéro téléphone
                              </h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="phone"
                              name="phone"
                              placeholder="Numéro téléphone"
                              value={variableGlobale.phone}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="fax">
                              <h4 className="card-title mb-0">Numéro Fax</h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="fax"
                              name="fax"
                              placeholder="Numéro fax"
                              value={variableGlobale.fax}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="website">
                              <h4 className="card-title mb-0">Site Web</h4>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="website"
                              name="website"
                              placeholder="Site Web"
                              value={variableGlobale.website}
                              onChange={onChange}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Card.Header className="mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-person-lines-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title">Fichiers</h5>
                            </div>
                          </div>
                        </Card.Header>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="logo_etablissement_base64">
                              <h4 className="card-title mb-0">
                                Logo de l'établissement
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="logo_etablissement_base64"
                              type="file"
                              id="logo_etablissement_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadLogoEtablissement}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="logo_universite_base64">
                              <h4 className="card-title mb-0">
                                Logo de l'université
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="logo_universite_base64"
                              type="file"
                              id="logo_universite_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadLogoUniversite}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Form.Label htmlFor="logo_republique_base64">
                              <h4 className="card-title mb-0">
                                Logo de la république
                              </h4>
                            </Form.Label>
                            <Form.Control
                              name="logo_republique_base64"
                              type="file"
                              id="logo_republique_base64"
                              accept="*"
                              placeholder="Choose File"
                              className="text-muted"
                              onChange={handleFileUploadLogoEepublique}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <Button variant="primary" id="add-btn" type="submit">
                            Enregister les variables
                          </Button>
                        </div>
                      </Col>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterVariablesGlobales;
