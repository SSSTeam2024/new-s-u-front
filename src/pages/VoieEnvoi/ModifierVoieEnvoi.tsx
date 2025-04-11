import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useAddVoieEnvoiMutation,
  useUpdateVoieEnvoiMutation,
  VoieEnvoiModel,
} from "features/voieEnvoi/voieEnvoiSlice";
import { useLocation } from "react-router-dom";

interface VoieProps {
  setmodal_UpdateVoieEnvoi: React.Dispatch<React.SetStateAction<boolean>>;
  modal_UpdateVoieEnvoi: boolean;
}

const ModifierVoieEnvoi: React.FC<VoieProps> = ({
  setmodal_UpdateVoieEnvoi,
  modal_UpdateVoieEnvoi,
}) => {
  const [updateVoie] = useUpdateVoieEnvoiMutation();

  const [titre, setTitre] = useState<string>("");

  const voieLocation = useLocation();

  useEffect(() => {
    if (voieLocation?.state) {
      setTitre(voieLocation.state.titre || "");
    }
  }, [voieLocation]);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Voie d'envoi a été modifié avec succès",
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
  const handleTitre = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitre(e.target.value);
  };
  const onSubmitUpdateHourBand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const voieEnvoi = {
        _id: voieLocation.state._id,
        titre: titre || voieLocation.state.titre,
      };

      updateVoie(voieEnvoi)
        .then(() => notifySuccess())
        .then(() => setmodal_UpdateVoieEnvoi(!modal_UpdateVoieEnvoi));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form className="tablelist-form" onSubmit={onSubmitUpdateHourBand}>
        <Row>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Label htmlFor="titre">Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                id="titre"
                onChange={handleTitre}
                value={titre}
              />
            </div>
          </Col>

          <Col lg={12}>
            <div className="hstack gap-2 justify-content-end">
              <Button variant="primary" id="add-btn" type="submit">
                Modifier
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default ModifierVoieEnvoi;
