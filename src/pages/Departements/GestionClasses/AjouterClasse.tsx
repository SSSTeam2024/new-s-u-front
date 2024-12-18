import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useFetchDepartementsQuery } from "features/departement/departement";
import {
  Niveau,
  useFetchNiveauxQuery,
  useFetchSectionsByNiveauIdQuery,
} from "features/niveau/niveau";
import { useAddClasseMutation } from "features/classe/classe";

interface Section {
  _id: string;
  name_section_fr: string;
  name_section_ar: string;
  abreviation: string;
  departements: string[]
}

interface FormData {
  _id: string;
  nom_classe_fr: string;
  nom_classe_ar: string;
  departement: {
    _id: string;
    description: string;
    volume_horaire: string;
    nom_chef_dep: string;
    name_ar: string;
    name_fr: string;
    SignatureFileExtension: string;
    SignatureFileBase64String: string;
    signature: string;
  };
  niveau_classe: {
    _id: string;
    name_niveau_ar: string;
    name_niveau_fr: string;
    abreviation: string;
    sections: Section[];
  };
  matieres: any[];
}

const AddClasse = () => {
  document.title = " Ajouter Classe | Application Smart Institute";
  const navigate = useNavigate();

  function tog_retourParametres() {
    navigate("/departement/gestion-classes/liste-classes");
  }

  const [createClasse] = useAddClasseMutation();
  const { data: departements = [] } = useFetchDepartementsQuery();
  const [selectedNiveauId, setSelectedNiveauId] = useState<string | null>(null);
  const { data: niveaux = [] } = useFetchNiveauxQuery();
  const { data: sectionsData = [], isLoading: sectionsLoading } =
    useFetchSectionsByNiveauIdQuery(selectedNiveauId ?? "", {
      skip: !selectedNiveauId,
    });
  console.log("sections", sectionsData);

  const [formData, setFormData] = useState<FormData>({
    _id: "",
    nom_classe_fr: "",
    nom_classe_ar: "",
    departement: {
      _id: "",
      description: "",
      volume_horaire: "",
      nom_chef_dep: "",
      name_ar: "",
      name_fr: "",
      SignatureFileExtension: "",
      SignatureFileBase64String: "",
      signature: "",
    },
    niveau_classe: {
      _id: "",
      name_niveau_ar: "",
      name_niveau_fr: "",
      abreviation: "",
      sections: [],
    },

    matieres: [],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedNiveauId(value);
    setFormData((prevState) => ({
      ...prevState,
      niveau_classe: {
        ...prevState.niveau_classe,
        _id: value,
      },
    }));
  };

  useEffect(() => {
    if (selectedNiveauId && sectionsData && "sections" in sectionsData) {
      const { sections } = sectionsData as Niveau;
      setFormData((prevState) => ({
        ...prevState,
        niveau_classe: {
          ...prevState.niveau_classe,
          sections,
        },
      }));
    }
  }, [sectionsData, selectedNiveauId]);

  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const onSubmitClasse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createClasse(formData).unwrap();
      notify();
      navigate("/departement/gestion-classes/liste-classes");
    } catch (error: any) {
      console.log(error);
    }
  };


  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Classe a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation classe échoué ${error}`,
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
            <Form className="tablelist-form" onSubmit={onSubmitClasse}>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="nom_classe_fr">Nom Classe (FR)</Form.Label>
                    <Form.Control
                      type="text"
                      id="nom_classe_fr"
                      placeholder=""
                      required
                      onChange={(e) => setFormData({ ...formData, nom_classe_fr: e.target.value })}
                      value={formData.nom_classe_fr}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="departement">Departement</Form.Label>
                    <select
                      className="form-select text-muted"
                      name="departement"
                      id="departement"
                      onChange={(e) => setFormData({
                        ...formData,
                        departement: departements.find(d => d._id === e.target.value) || formData.departement,
                      })}
                    >
                      <option value="">Sélectionner Département</option>
                      {departements.map((departement) => (
                        <option key={departement._id} value={departement._id}>
                          {departement.name_fr}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="niveau_classe">Niveau</Form.Label>
                    <select
                      className="form-select text-muted"
                      name="niveau_classe"
                      id="niveau_classe"
                      value={formData.niveau_classe._id}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner Niveau</option>
                      {niveaux.map((niveau) => (
                        <option key={niveau._id} value={niveau._id}>
                          {niveau.name_niveau_fr}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="section_classe">Section</Form.Label>
                    <select
                      className="form-select text-muted"
                      name="section_classe"
                      id="section_classe"
                      value={formData.niveau_classe.sections.map((section) => section._id)}
                      onChange={(e) => {
                        const selectedSectionIds = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        const selectedSections = (sectionsData && 'sections' in sectionsData && sectionsData.sections) 
                          ? sectionsData.sections.filter((section) => selectedSectionIds.includes(section._id)) 
                          : [];
                        setFormData((prevState) => ({
                          ...prevState,
                          niveau_classe: {
                            ...prevState.niveau_classe,
                            sections: selectedSections,
                          },
                        }));
                      }}
                      multiple
                    >
                      {(sectionsData && 'sections' in sectionsData && sectionsData.sections) 
                        ? sectionsData.sections.map((section: Section) => (
                          <option key={section._id} value={section._id}>
                            {section.name_section_fr}
                          </option>
                        )) 
                        : null}
                    </select>
                  </div>
                </Col>
              </Row>

              <div className="modal-footer">
                <div className="hstack gap-2 justify-content-end">
                  <Button className="btn-ghost-danger" onClick={tog_retourParametres}>
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

export default AddClasse;