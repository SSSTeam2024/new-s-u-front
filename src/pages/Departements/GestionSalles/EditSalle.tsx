import React, {useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import {useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useUpdateSalleMutation } from "features/salles/salles";
import { useFetchDepartementsQuery } from "features/departement/departement";

const EditSalle = () => {
  document.title = " Modifier Salle | Application Smart Institute";
  const navigate = useNavigate();
  const { state: salle } = useLocation();
  const [editsalle] = useUpdateSalleMutation();
  const { data: departements = [] } = useFetchDepartementsQuery();

  const [formData, setFormData] = useState({
    _id: "",
    salle: "",
    emplacement: "",
    type_salle: "",
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
  });

  useEffect(() => {
    if (salle) {
      setFormData({
        _id: salle._id,
        salle: salle.salle,
        emplacement: salle.emplacement,
        type_salle: salle.type_salle,
        departement: {
          _id: salle.departement._id,
          description: salle.departement.description,
          volume_horaire: salle.departement.volume_horaire,
          nom_chef_dep: salle.departement.nom_chef_dep,
          name_ar: salle.departement.name_ar,
          name_fr: salle.departement.name_fr,
          SignatureFileExtension: salle.departement.SignatureFileExtension,
          SignatureFileBase64String: salle.departement.SignatureFileBase64String,
          signature: salle.departement.signature,
        },
      });
    }
  }, [salle]);

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
  const onSubmitSalle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editsalle(formData).unwrap();
      notify();
      navigate("/departement/gestion-salles/liste-salles");
    } catch (error: any) {
      if (error.status === 400) {
        errorAlert("La valeur doit être unique.");
      } else {
        errorAlert("La valeur doit être unique. Veuillez réessayer.");
      }
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Matière a été modifié avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form" onSubmit={onSubmitSalle}>
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="salle">Salle</Form.Label>
                      <Form.Control
                        type="text"
                        id="salle"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.salle}
                      />
                    </div>
                  </Col>

                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="emplacement">Emplacement</Form.Label>
                      <Form.Control
                        type="text"
                        id="emplacement"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.emplacement}
                      />
                    </div>
                  </Col>

                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="typeSalle">Type Salle</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="typeSalle"
                        id="typeSalle"
                        value={formData.type_salle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type_salle: e.target.value,
                          })
                        }
                      >
                        <option value="Salle Cours">Salle Cours</option>
                        <option value="Labo">Labo</option>
                        <option value="Salle TD">Salle TD</option>
                        <option value="Amphi">Amphi</option>
                        <option value="Atelier">Atelier</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="departement">Departement</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="departement"
                        id="departement"
                        value={formData.departement.name_fr}
                        onChange={handleChange}
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
             
                </Row>

                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        navigate("/departement/gestion-salles/liste-salles")
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

export default EditSalle;