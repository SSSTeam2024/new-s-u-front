import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import {
  useDeleteManyReclamationEtudiantsMutation,
  useFetchReclamationsQuery,
} from "features/reclamationEtudiant/recalamationEtudiantSlice";
import {
  useDeleteManyReclamationPersonnelMutation,
  useFetchReclamationsPersonnelQuery,
} from "features/reclamationPersonnel/reclamationPersonnelSlice";
import {
  useDeleteManyReclamationEnseignantMutation,
  useFetchReclamationsEnseignantQuery,
} from "features/reclamationEnseignant/reclamationEnseignantSlice";

interface ReclamationProps {
  today: string;
}

const ReclamationComponent: React.FC<ReclamationProps> = ({ today }) => {
  //! Réclamation Etudiants
  const { data: AllReclamationEtudiant = [] } = useFetchReclamationsQuery({
    useNewDb: "true",
  });
  const [deleteReclamationEtudiant] =
    useDeleteManyReclamationEtudiantsMutation();
  const [dateReclamationEtudiants, setDateReclamationEtudiants] =
    useState(today);
  const [isClickedReclamationEtudiants, setIsClickedReclamationEtudiants] =
    useState<boolean>(false);
  const [reclamationEtudiantsArray, setReclamationEtudiantsArray] = useState<
    string[]
  >([]);

  const handleSelectDateReclamationEtudiants = (e: any) => {
    setDateReclamationEtudiants(e.target.value);
    const filtredData = AllReclamationEtudiant.filter(
      (reclamation: any) =>
        reclamation.createdAt.split("T")[0] < dateReclamationEtudiants
    );
    let ids = [];
    for (const reclamation of filtredData) {
      ids.push(reclamation?._id!);
    }
    setReclamationEtudiantsArray(ids);
    setIsClickedReclamationEtudiants(true);
  };

  const AlertDeleteReclamationEtudiants = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReclamationEtudiant({
            ids: reclamationEtudiantsArray,
            useNewDb: true,
          });
          setIsClickedReclamationEtudiants(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Réclamation Etudiants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Réclamation Etudiants sont en sécurité :)",
            "error"
          );
        }
      });
  };

  //! Réclamation Enseignants
  const { data: AllReclamationEnseignant = [] } =
    useFetchReclamationsEnseignantQuery({
      useNewDb: "true",
    });
  const [deleteReclamationEnseignant] =
    useDeleteManyReclamationEnseignantMutation();
  const [dateReclamationEnseignants, setDateReclamationEnseignants] =
    useState(today);
  const [isClickedReclamationEnseignants, setIsClickedReclamationEnseignants] =
    useState<boolean>(false);
  const [reclamationEnseignantsArray, setReclamationEnseignantsArray] =
    useState<string[]>([]);
  const handleSelectDateReclamationEnseignants = (e: any) => {
    setDateReclamationEnseignants(e.target.value);
    const filtredData = AllReclamationEnseignant.filter(
      (reclamation) =>
        reclamation.createdAt.split("T")[0] < dateReclamationEnseignants
    );
    let ids = [];
    for (const reclamation of filtredData) {
      ids.push(reclamation?._id!);
    }
    setReclamationEnseignantsArray(ids);
    setIsClickedReclamationEnseignants(true);
  };

  const alertDeleteReclamationEnseignant = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReclamationEnseignant({
            ids: reclamationEnseignantsArray,
            useNewDb: true,
          });
          setIsClickedReclamationEnseignants(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Réclamation Enseignants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Réclamation Enseignants sont en sécurité :)",
            "error"
          );
        }
      });
  };

  //! Réclamation Personnels
  const { data: AllReclamationPersonnel = [] } =
    useFetchReclamationsPersonnelQuery({
      useNewDb: "true",
    });
  const [deleteReclamationPersonnel] =
    useDeleteManyReclamationPersonnelMutation();
  const [dateReclamationPersonnels, setDateReclamationPersonnels] =
    useState(today);
  const [ReclamationPersonnelsArray, setReclamationPersonnelsArray] = useState<
    string[]
  >([]);
  const [isClickedReclamationPersonnels, setIsClickedReclamationPersonnels] =
    useState<boolean>(false);

  const handleSelectDateReclamationPersonnels = (e: any) => {
    setDateReclamationPersonnels(e.target.value);
    const filtredData = AllReclamationPersonnel.filter(
      (reclamation: any) =>
        reclamation.createdAt.split("T")[0] < dateReclamationPersonnels
    );
    let ids = [];
    for (const reclamation of filtredData) {
      ids.push(reclamation?._id!);
    }
    setReclamationPersonnelsArray(ids);
    setIsClickedReclamationPersonnels(true);
  };

  const AlertDeleteReclamationPersonnels = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReclamationPersonnel({
            ids: ReclamationPersonnelsArray,
            useNewDb: true,
          });
          setIsClickedReclamationPersonnels(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Réclamation Personnels ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Réclamation Personnels sont en sécurité :)",
            "error"
          );
        }
      });
  };

  return (
    <React.Fragment>
      <Card>
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {AllReclamationEtudiant.length === 0 ? (
              <div className="hstack gap-2">
                <span>Réclamations Etudiants</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>
                Réclamations Etudiants ({AllReclamationEtudiant.length})
              </span>
            )}
            {AllReclamationEtudiant.length !== 0 && (
              <Form.Control
                type="date"
                value={dateReclamationEtudiants}
                onChange={handleSelectDateReclamationEtudiants}
                className="w-50 text-center"
                max={today}
              />
            )}
            {AllReclamationEtudiant.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeleteReclamationEtudiants}
              >
                Nettoyer
              </span>
            )}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {AllReclamationPersonnel.length === 0 ? (
              <div className="hstack gap-2">
                <span>Réclamations Personnels</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>
                Réclamations Personnels ({AllReclamationPersonnel.length})
              </span>
            )}
            {AllReclamationPersonnel.length !== 0 && (
              <Form.Control
                type="date"
                value={dateReclamationPersonnels}
                onChange={handleSelectDateReclamationPersonnels}
                className="w-50 text-center"
                // max={today}
              />
            )}
            {AllReclamationPersonnel.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeleteReclamationPersonnels}
              >
                Nettoyer
              </span>
            )}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {AllReclamationEnseignant.length === 0 ? (
              <div className="hstack gap-2">
                <span>Réclamations Enseignants</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>
                Réclamations Enseignants ({AllReclamationEnseignant.length})
              </span>
            )}
            {AllReclamationEnseignant.length !== 0 && (
              <Form.Control
                type="date"
                value={dateReclamationEnseignants}
                onChange={handleSelectDateReclamationEnseignants}
                className="w-50 text-center"
                max={today}
              />
            )}
            {AllReclamationEnseignant.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={alertDeleteReclamationEnseignant}
              >
                Nettoyer
              </span>
            )}
          </li>
        </ul>
      </Card>
    </React.Fragment>
  );
};

export default ReclamationComponent;
