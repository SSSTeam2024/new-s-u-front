import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useAddSocieteMutation } from "features/societe/societeSlice";

interface SocieteProps {
  setmodal_AddNew: React.Dispatch<React.SetStateAction<boolean>>;
  modal_AddNew: boolean;
}

const AddNewSociete: React.FC<SocieteProps> = ({
  setmodal_AddNew,
  modal_AddNew,
}) => {
  const [newSociete] = useAddSocieteMutation();

  const initialSociete = {
    nom: "",
    encadrant: [""],
    infos: "",
  };
  const [societe, setSociete] = useState(initialSociete);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSociete((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Sociéte a été ajoutée avec succès",
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

  const onSubmitNewSociete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      newSociete(societe)
        .then(() => notifySuccess())
        .then(() => setmodal_AddNew(!modal_AddNew));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitNewSociete}>
        <Row>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Label htmlFor="nom">Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                id="nom"
                onChange={onChange}
                value={societe.nom}
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label htmlFor="encadrant">Encadrant</Form.Label>
            <Form.Control
              type="text"
              name="encadrant"
              id="encadrant"
              onChange={onChange}
              value={societe.encadrant}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label htmlFor="infos">Informations</Form.Label>
            <textarea
              className="form-control"
              rows={3}
              value={societe.infos}
              onChange={onChange}
              name="infos"
              id="infos"
            />
          </Col>
        </Row>
        <Col lg={12}>
          <div className="hstack gap-2 justify-content-end">
            <Button variant="primary" id="add-btn" type="submit">
              Ajouter
            </Button>
          </div>
        </Col>
      </Form>
    </React.Fragment>
  );
};

export default AddNewSociete;
