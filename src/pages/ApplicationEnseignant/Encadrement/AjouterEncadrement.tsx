import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useFetchAllStagePfeQuery,
  StagePfeModel,
} from "features/stagesPfe/stagesPfeSlice";
import {
  useAddEncadrementMutation,
  Encadrement,
} from "features/encadrement/encadrementSlice";

type ModeType = "Présentiel" | "En ligne";

interface EncadrementFormData {
  date: string;
  heure_debut: string;
  heure_fin: string;
  mode: ModeType;
  avancement: string;
  remarque: string;
}

interface AddEncadrementPayload extends EncadrementFormData {
  stage: string;
  etudiant: string;
  enseignant: string;
  seance: string;
}

const AjouterEncadrement = () => {
  const { data: stages = [], isLoading: loadingStages } =
    useFetchAllStagePfeQuery();
  const [addEncadrement, { isLoading: adding }] = useAddEncadrementMutation();

  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<StagePfeModel | null>(
    null
  );

  const [form, setForm] = useState<EncadrementFormData>({
    date: "",
    heure_debut: "",
    heure_fin: "",
    mode: "Présentiel",
    avancement: "",
    remarque: "",
  });

  useEffect(() => {
    const stage = stages.find((s) => s._id === selectedStageId);
    setSelectedStage(stage || null);
    console.log("stage",stages)
  },
   
    [selectedStageId, stages]);
 

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedStage || !selectedStage.etudiant || !selectedStage.encadrant_univ1) {
      Swal.fire("Erreur", "Stage ou données incomplètes", "error");
      return;
    }

    const payload: AddEncadrementPayload = {
      stage: selectedStage?._id!,
      etudiant:
        typeof selectedStage?.etudiant! === "object"
          ? selectedStage?.etudiant?._id!
          : selectedStage.etudiant,
      enseignant:
        typeof selectedStage?.encadrant_univ1! === "object"
          ? selectedStage?.encadrant_univ1?._id!
          : selectedStage.encadrant_univ1,
      seance: "1", // Optional: make dynamic based on history
      ...form,
    };

    try {
      await addEncadrement(payload).unwrap();
      Swal.fire("Succès", "Séance ajoutée avec succès", "success");

      setForm({
        date: "",
        heure_debut: "",
        heure_fin: "",
        mode: "Présentiel",
        avancement: "",
        remarque: "",
      });
      setSelectedStageId("");
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Erreur lors de l’ajout", "error");
    }
  };
const generateTimeOptions = (start = "07:00", end = "22:00") => {
  const options: string[] = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    options.push(time);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }

  return options;
};
  return (
      <React.Fragment>
              <div className="page-content">
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">Ajouter une séance d'encadrement</h4>

        {loadingStages ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Stage PFE</Form.Label>
              <Form.Select value={selectedStageId} onChange={(e) => setSelectedStageId(e.target.value)}>
                <option value="">-- Sélectionner un stage --</option>
                {stages.map((stage) => (
                    
                 <option key={stage._id} value={stage._id}>
  {typeof stage.etudiant !== "string"
    ? `${stage.etudiant.nom_fr} ${stage.etudiant.prenom_fr}`
    : "Étudiant inconnu"}{" "}
  -{" "}
  {stage.encadrant_univ1
    ? `${stage.encadrant_univ1.nom_fr} ${stage.encadrant_univ1.prenom_fr}`
    : "Encadrant inconnu"}
</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={form.date} onChange={handleChange} />
            </Form.Group>

          <Form.Group className="mb-3">
  <Form.Label>Heure début</Form.Label>
  <Form.Select
    name="heure_debut"
    value={form.heure_debut}
    onChange={handleChange}
  >
    <option value="">-- Sélectionner --</option>
    {generateTimeOptions().map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
  </Form.Select>
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Heure fin</Form.Label>
  <Form.Select
    name="heure_fin"
    value={form.heure_fin}
    onChange={handleChange}
    disabled={!form.heure_debut}
  >
    <option value="">-- Sélectionner --</option>
    {form.heure_debut &&
      generateTimeOptions().filter((time) => {
        const [h1, m1] = form.heure_debut.split(":").map(Number);
        const [h2, m2] = time.split(":").map(Number);
        return h2 * 60 + m2 > h1 * 60 + m1 + 29;
      }).map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
  </Form.Select>
</Form.Group>
   <Form.Group className="mb-3">
        <Form.Label>Mode</Form.Label>
        <div className="d-flex gap-4">
          <Form.Check
            type="radio"
            label="Présentiel"
            name="mode"
            value="Présentiel"
            checked={form.mode === "Présentiel"}
            onChange={handleChange}
          />
          <Form.Check
            type="radio"
            label="En ligne"
            name="mode"
            value="En ligne"
            checked={form.mode === "En ligne"}
            onChange={handleChange}
          />
        </div>
      </Form.Group>

            <Form.Group className="mb-3">
        <Form.Label>
          Avancement: <strong>{form.avancement}%</strong>
        </Form.Label>
        <Form.Range
          name="avancement"
          min="0"
          max="100"
          step="5"
          value={form.avancement}
          onChange={(e) =>
            setForm({ ...form, avancement: parseInt(e.target.value).toString() })

          }
        />
      </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Remarque</Form.Label>
              <Form.Control as="textarea" name="remarque" value={form.remarque} onChange={handleChange} rows={3} />
            </Form.Group>

            <Button variant="primary" 
            onClick={handleSubmit} 
            disabled={adding}>
              {adding ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </>
        )}
      </Card>
    </Container>
              </div>
        </React.Fragment>
  );
};

export default AjouterEncadrement;
