import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import Select, { MultiValue } from "react-select";

import { useUpdateNiveauMutation } from "features/niveau/niveau";
import { Section, useFetchSectionsQuery } from "features/section/section";
import { Cycle, useFetchAllCycleQuery } from "features/cycle/cycle";
interface SectionsOption {
  _id: string;
  name_section_fr: string;
  name_section_ar: string;
  abreviation: string;
  mention_classe: any;
}
const EditNiveau = () => {
  document.title = " Modifier Niveau | ENIGA";
  const navigate = useNavigate();
  const { state: niveau } = useLocation();
  const [editNiveau] = useUpdateNiveauMutation();

  const [formData, setFormData] = useState<{
    _id: string;
    name_niveau_ar: string;
    name_niveau_fr: string;
    abreviation: string;
    sections: Section[];
    cycles: Cycle[];
  }>({
    _id: "",
    name_niveau_ar: "",
    name_niveau_fr: "",
    abreviation: "",
    sections: [],
    cycles: [],
  });

  const [options, setOptions] = useState<SectionsOption[]>([]);

  const { data: sections = [] } = useFetchSectionsQuery();
  const { data: cycles = [] } = useFetchAllCycleQuery();
  useEffect(() => {
    if (niveau) {
      setFormData({
        _id: niveau._id,
        name_niveau_ar: niveau.name_niveau_ar,
        name_niveau_fr: niveau.name_niveau_fr,
        abreviation: niveau.abreviation,
        sections: niveau.sections,
        cycles: niveau.cycles,
      });
    }
  }, [niveau]);

  useEffect(() => {
    if (sections.length > 0) {
      const options = sections.map((sections) => ({
        _id: sections._id,
        name_section_fr: sections.name_section_fr,
        name_section_ar: sections.name_section_ar,
        abreviation: sections.abreviation,
        mention_classe: sections.mention_classe,
      }));
      setOptions(options);
    }
  }, [sections]);

  const handleSelectChange = (selectedOptions: MultiValue<SectionsOption>) => {
    const selectedSectionIds: string[] = selectedOptions.map(
      (option) => option._id
    );
    setSelectedSections(selectedSectionIds); // Update selectedSections with string array of IDs
  };

  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const getOptionLabel = (option: SectionsOption) =>
    `${option.name_section_fr} (${option.abreviation})`;

  const customStyles = {
    multiValue: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
    }),
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
      color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "white",
      backgroundColor: "#4b93ff",
      ":hover": {
        backgroundColor: "#4b93ff",
        color: "white",
      },
    }),
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
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

  const handleChangeCycle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCycle = cycles.find((cycle) => cycle._id === e.target.value);

    setFormData({
      ...formData,
      cycles: selectedCycle ? [selectedCycle] : [], // ✅ Always store as an array
    });
  };
  const onSubmitNiveau = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const selectedSectionsData: Section[] = selectedSections.map(
        (sectionId) => ({
          _id: sectionId,
          name_section_fr: "", // Fill in appropriate values if needed
          name_section_ar: "",
          abreviation: "",
          departements: [""],
          mention_classe: "",
        })
      );

      // Update formData to include transformed sections
      const formDataWithSections = {
        ...formData,
        sections: selectedSectionsData,
      };
      await editNiveau(formDataWithSections).unwrap();
      notify();
      navigate("/departement/gestion-classes/liste-niveau");
    } catch (error: any) {
      console.log(error);
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Niveau a été modifié avec succès",
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
              <Form className="tablelist-form" onSubmit={onSubmitNiveau}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_niveau_fr">
                        Niveau Classe
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_niveau_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_niveau_fr}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-3">
                      <Form.Label htmlFor="name_niveau_ar">
                        المستوى التعليمي
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name_niveau_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.name_niveau_ar}
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
                </Row>

                <Row className="d-flex align-items-start gap-3">
                  {/* Left Column (Sections Select) */}
                  <Col lg={6} style={{ maxHeight: "calc(100vh - 150px)" }}>
                    <div className="mb-3">
                      <Form.Label
                        htmlFor="choices-multiple-remove-button"
                        className="text-muted"
                      >
                        Sélectionner Section
                      </Form.Label>

                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={options}
                        styles={customStyles}
                        onChange={handleSelectChange}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option._id}
                        className="w-100" // Ensures full width
                      />
                    </div>
                  </Col>

                  {/* Right Column (Cycle Dropdown) */}
                  <Col lg={5}>
                    <Form.Label htmlFor="nom_parcours">Cycle</Form.Label>
                    <select
                      className="form-select text-muted"
                      name="cycles"
                      id="cycles"
                      value={
                        formData.cycles.length > 0 ? formData.cycles[0]._id : ""
                      }
                      onChange={handleChangeCycle}
                      disabled={!cycles || cycles.length === 0}
                    >
                      <option value="">Sélectionner Cycle</option>
                      {cycles.length > 0 ? (
                        cycles.map((cycle) => (
                          <option key={cycle._id} value={cycle._id}>
                            {cycle.cycle_fr}
                          </option>
                        ))
                      ) : (
                        <option value="">No cycles available</option>
                      )}
                    </select>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/departement/gestion-classes/liste-niveau");
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

export default EditNiveau;
