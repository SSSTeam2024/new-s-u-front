import React, { ChangeEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomLoaderForButton from "Common/CustomLoaderForButton/CustomLoaderForButton";
import Flatpickr from "react-flatpickr";
import { useGetDisponibiliteMutation, useUpdateStagePfeMutation } from "features/stagesPfe/stagesPfeSlice";
import { useFetchSallesQuery } from "features/salles/salles";

function convertDateFormat(dateStr: string) {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return dateStr;
}

const parseTimeStringToDate = (timeStr: string | undefined): Date | undefined => {
    if (!timeStr) return undefined;
    const [hours, minutes] = timeStr.split(":");
    const now = new Date();
    now.setHours(Number(hours), Number(minutes), 0, 0);
    return now;
};



interface SoutenanceProps {
    setShowSoutenanceDateModal: React.Dispatch<React.SetStateAction<boolean>>;
    showSoutenanceDateModal: boolean;
    stage: any;
}

const DisponibiliteSoutenance: React.FC<SoutenanceProps> = ({
    setShowSoutenanceDateModal,
    showSoutenanceDateModal,
    stage
}) => {
    const { data: getAllSalles = [] } = useFetchSallesQuery()
    const [updateStage] = useUpdateStagePfeMutation();

    const [disponibiliteSalles, setDisponibiliteSalles] = useState<any[]>([]);
    const notifySuccess = () => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Stage a été modifiée avec succès",
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

    const [formData, setFormData] = useState({
        dateDebut: convertDateFormat(stage.date_debut) || "",
        dateFin: convertDateFormat(stage.date_fin) || "",
        dateSoutenance: convertDateFormat(stage.date_soutenance) || "",
        status: stage.status_stage || "En Attente",
        selectedSociete: stage.societe?.nom || "",
        sujet: stage.sujet || "",
        description: stage.description || "",
        encadrantSociete1: stage.encadrant_societe1 || "",
        encadrantSociete2: stage.encadrant_societe2 || "",
        encadrantUniv1: stage.encadrant_univ1?._id || null,
        encadrantUniv2: stage.encadrant_univ2?._id || null,
        avis: stage.avis || "",
        note: stage.note || "",
        mention: stage.mention || "",
        salle: stage.salle || "",
        remarque: stage.remarque || "",
        bibliographie: stage.biblio || "",
        motCle: stage.mot_cle || "",
        rapporteur1: stage.rapporteur1?._id || null,
        rapporteur2: stage.rapporteur2?._id || null,
        examinateur1: stage.examinateur1?._id || null,
        examinateur2: stage.examinateur2?._id || null,
        invite1: stage.invite1?._id || null,
        invite2: stage.invite2?._id || null,
        chef_jury: stage.chef_jury?._id || null,
        heureDebut: stage.heure_debut || "",
        heureFin: stage.heure_fin || "",
        file_proposition_signe: stage?.file_proposition_signe! || "",
        file_proposition_signe_base64: "",
        file_proposition_signe_extension: "",
        file_attestation_base64: "",
        file_attestation_extension: "",
        file_attestation: stage?.file_attestation! || "",
        file_rapport: stage?.file_rapport! || "",
        file_rapport_base64: "",
        file_rapport_extension: "",
    });


    const handleChange =
        (key: keyof typeof formData) =>
            (
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
            ) => {
                setFormData((prev) => ({ ...prev, [key]: e.target.value }));
            };
    const [getDisponibilite, { isLoading, isSuccess }] = useGetDisponibiliteMutation();

    const handleFetchDisponibiliteSalles = async () => {
        try {
            const response = await getDisponibilite({
                date: formData.dateSoutenance,
                heureDebut: formData.heureDebut,
                heureFin: formData.heureFin,
                avecSoutenance: "Oui"
            }).unwrap();

            const availableSalles = getAllSalles.filter(
                (salle) => !response.salles.includes(salle.salle)
            );

            setDisponibiliteSalles(availableSalles);
        } catch (error) {
            console.error("Erreur lors de la récupération des disponibilités:", error);
            notifyError(error);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stage?._id) {
            console.error("Stage ID is missing. Cannot update stage.");
            return;
        }
        try {
            const updateData = {
                _id: stage._id,
                sujet: formData.sujet,
                description: formData.description,
                mot_cle: formData.motCle,
                biblio: formData.bibliographie,
                salle: formData.salle,
                remarque: formData.remarque,
                mention: formData.mention,
                note: formData.note,
                heure_debut: formData.heureDebut,
                heure_fin: formData.heureFin,
                date_debut: formData.dateDebut,
                date_fin: formData.dateFin,
                date_soutenance: formData.dateSoutenance,
                status_stage: formData.status,
                encadrant_univ1: formData.encadrantUniv1,
                encadrant_univ2: formData.encadrantUniv2,
                encadrant_societe1: formData.encadrantSociete1,
                encadrant_societe2: formData.encadrantSociete2,
                societe: stage.societe?._id,
                avis: formData.avis,
                chef_jury: formData.chef_jury,
                rapporteur1: formData.rapporteur1,
                rapporteur2: formData.rapporteur2,
                examinateur1: formData.examinateur1,
                examinateur2: formData.examinateur2,
                invite1: formData.invite1,
                invite2: formData.invite2,
                file_proposition_signe: formData.file_proposition_signe,
                file_proposition_signe_base64: formData.file_proposition_signe_base64,
                file_proposition_signe_extension:
                    formData.file_proposition_signe_extension,
                file_rapport: formData.file_rapport,
                file_rapport_base64: formData.file_rapport_base64,
                file_rapport_extension: formData.file_rapport_extension,
                file_attestation: formData.file_attestation,
                file_attestation_base64: formData.file_attestation_base64,
                file_attestation_extension: formData.file_attestation_extension,
            };
            await updateStage(updateData);
            notifySuccess();
            setShowSoutenanceDateModal(!showSoutenanceDateModal);
        } catch (error) {
            notifyError(error);
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={4}>
                    <div className="mb-3">
                        <Form.Label htmlFor="jour">Jour</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.dateSoutenance}
                            onChange={handleChange("dateSoutenance")}
                            className="text-center"
                        />
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="mb-3">
                        <Form.Label htmlFor="heureDebut">
                            Heure début
                        </Form.Label>
                        <Flatpickr
                            className="form-control"
                            id="heureDebut"
                            placeholder="--:--"
                            options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                time_24hr: true,
                            }}
                            value={parseTimeStringToDate(formData.heureDebut)}
                            onChange={(dates) => {
                                if (dates.length > 0) {
                                    const date = dates[0];
                                    const formatted = date.toTimeString().slice(0, 5);
                                    setFormData(prev => ({
                                        ...prev, heureDebut: formatted,
                                        heureFin: ""
                                    }));
                                    setDisponibiliteSalles([]);
                                }
                            }}
                        />
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="mb-3">
                        <Form.Label htmlFor="heureFin">
                            Heure fin
                        </Form.Label>
                        <Flatpickr
                            className="form-control"
                            id="heureFin"
                            placeholder="--:--"
                            options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                time_24hr: true,
                            }}
                            value={parseTimeStringToDate(formData.heureFin)}
                            onChange={(dates) => {
                                if (dates.length > 0) {
                                    const date = dates[0];
                                    const formatted = date.toTimeString().slice(0, 5);
                                    setFormData(prev => ({ ...prev, heureFin: formatted }));
                                    setDisponibiliteSalles([]);
                                }
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col lg={6}>
                    {disponibiliteSalles.length === 0 ?
                        <div className="d-flex flex-column">
                            <Button
                                variant="secondary"
                                onClick={handleFetchDisponibiliteSalles}
                                disabled={formData.heureFin === ""}
                            >
                                {isLoading ? (
                                    <CustomLoaderForButton></CustomLoaderForButton>
                                ) : (
                                    <>Salles disponibles?</>
                                )}
                            </Button>
                        </div>
                        :
                        <div className="d-flex flex-column">
                            <Form.Label>Salles Disponibles</Form.Label>
                            <select
                                className="form-select"
                                name="salle"
                                id="salle"
                                value={formData.salle}
                                onChange={handleChange("salle")}
                            >
                                <option value="">Sélectionner une salle</option>
                                {disponibiliteSalles.map((salle: any) => (
                                    <option key={salle._id} value={salle.salle}>
                                        {salle.salle}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                </Col>
            </Row>
            <Row className="mt-3 text-center d-flex justify-content-end">
                <Col lg={2}>
                    <Button variant="danger" onClick={() => setShowSoutenanceDateModal(false)}>
                        Annuler
                    </Button>
                </Col>
                <Col lg={2}>
                    {formData.salle !== "" ?
                        <Button variant="primary" onClick={handleSubmit}>
                            Enregistrer
                        </Button>
                        :
                        <Button variant="primary" disabled>
                            Enregistrer
                        </Button>
                    }
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default DisponibiliteSoutenance;