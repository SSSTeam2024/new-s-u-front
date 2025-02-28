import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateSectionMutation } from "features/section/section";
import { useFetchDepartementsQuery } from "features/departement/departement";
import { useFetchMentionsClasseQuery } from "features/mentionClasse/mentionClasse";

const EditSection = () => {
  document.title = "Modifier Spécialités | Application Smart Institute";
  const navigate = useNavigate();
  const { state: section } = useLocation();

  const [editSection] = useUpdateSectionMutation();
  const { data: departements = [] } = useFetchDepartementsQuery();
  const { data: mentionsClasse = [] } = useFetchMentionsClasseQuery();

  const [formData, setFormData] = useState({
    _id: "",
    name_section_ar: "",
    name_section_fr: "",
    abreviation: "",
    departements: [] as string[],
    mention_classe: "",
  });

  useEffect(() => {
    if (section) {
      setFormData({
        _id: section._id,
        name_section_ar: section.name_section_ar,
        name_section_fr: section.name_section_fr,
        mention_classe: section.mention_classe,
        abreviation: section.abreviation,
        departements: section.departements.map((dep: any) => dep._id) || [],
      });
    }
  }, [section]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const value: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      departements: value,
    }));
  };

  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const onSubmitSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editSection(formData).unwrap();
      notify();
      navigate("/departement/gestion-classes/liste-section");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Spécialités a été modifiée avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Filter departments to show only those that are assigned to the section
  const existingDepartements = departements.filter((departement) =>
    formData.departements.includes(departement._id)
  );

  const handleDepartementsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { options } = e.target;
    const value: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      departements: value,
    }));
  };

  const handleMentionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      mention_classe: value,
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitSection}>
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_section_fr">
                        Nom Section (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_section_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_section_fr}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_section_ar">
                        Nom Section (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_section_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_section_ar}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="abreviation">Abréviation</Form.Label>
                      <Form.Control
                        type="text"
                        id="abreviation"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.abreviation}
                      />
                    </div>
                  </Col>

                  {/* <Col lg={5}>
                    <div className="mb-3">
                      <Form.Label htmlFor="departements">
                        Départements
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="departements"
                        id="departements"
                        multiple
                        value={formData.departements}
                        onChange={handleDepartementsChange}
                      >
                        <option value="" disabled>
                          Sélectionner Départements
                        </option>
                        {departements.map((departement) => (
                          <option key={departement._id} value={departement._id}>
                            {departement.name_fr}
                          </option>
                        ))}
                      </select>
                   
                      <div className="mt-3">
                        <h5>Départements Assignés</h5>
                        {existingDepartements.length > 0 ? (
                          existingDepartements.map((departement) => (
                            <Badge
                              key={departement._id}
                              bg="primary"
                              className="me-2"
                            >
                              {departement.name_fr}
                            </Badge>
                          ))
                        ) : (
                          <p>Aucun département assigné</p>
                        )}
                      </div>
                    </div>
                  </Col> */}
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="mention_classe">
                        Mention Classe
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="mention_classe"
                        id="mention_classe"
                        value={formData.mention_classe}
                        onChange={handleMentionChange}
                      >
                        <option value="">Sélectionner Mention Classe</option>
                        {mentionsClasse.map((mentionClasse) => (
                          <option
                            key={mentionClasse._id}
                            value={mentionClasse._id}
                          >
                            {mentionClasse.name_mention_fr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/departement/gestion-classes/liste-section");
                      }}
                    >
                      Retour
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditSection;
