import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import {
  useDeleteManyAvisEtudiantMutation,
  useFetchAvisEtudiantQuery,
} from "features/avisEtudiant/avisEtudiantSlice";
import {
  useDeleteManyAvisPersonnelMutation,
  useFetchAvisPersonnelQuery,
} from "features/avisPersonnel/avisPersonnelSlice";
import {
  useDeleteManyAvisEnseignantsMutation,
  useFetchAvisEnseignantQuery,
} from "features/avisEnseignant/avisEnseignantSlice";

interface AvisProps {
  today: string;
}

const AvisComponent: React.FC<AvisProps> = ({ today }) => {
  //! Avis Etudiants
  const { data: avisEtudiants = [] } = useFetchAvisEtudiantQuery({
    useNewDb: "true",
  });
  const [deleteAvisEtudiant] = useDeleteManyAvisEtudiantMutation();
  const [dateAvisEtudiants, setDateAvisEtudiants] = useState(today);
  const [isClickedAvisEtudiants, setIsClickedAvisEtudiants] =
    useState<boolean>(false);
  const [avisEtudiantsArray, setAvisEtudiantsArray] = useState<string[]>([]);

  const handleSelectDateAvisEtudiants = (e: any) => {
    setDateAvisEtudiants(e.target.value);
    const filtredData = avisEtudiants.filter(
      (avis) => avis.createdAt.split("T")[0] < dateAvisEtudiants
    );
    let ids = [];
    for (const avis of filtredData) {
      ids.push(avis?._id!);
    }
    setAvisEtudiantsArray(ids);
    setIsClickedAvisEtudiants(true);
  };

  const AlertDeleteAvisEtudiants = async () => {
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
          deleteAvisEtudiant({
            ids: avisEtudiantsArray,
            useNewDb: true,
          });
          setIsClickedAvisEtudiants(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Avis Etudiants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Avis Etudiants sont en sécurité :)",
            "error"
          );
        }
      });
  };

  //! Avis Enseignants
  const { data: avisEnseignants = [] } = useFetchAvisEnseignantQuery({
    useNewDb: "true",
  });
  const [deleteAvisEnseignants] = useDeleteManyAvisEnseignantsMutation();
  const [dateAvisEnseignants, setDateAvisEnseignants] = useState(today);
  const [isClickedAvisEnseignants, setIsClickedAvisEnseignants] =
    useState<boolean>(false);
  const [avisEnseignantsArray, setAvisEnseignantsArray] = useState<string[]>(
    []
  );
  const handleSelectDateAvisEnseignants = (e: any) => {
    setDateAvisEnseignants(e.target.value);
    const filtredData = avisEnseignants.filter(
      (avis) => avis.createdAt.split("T")[0] < dateAvisEnseignants
    );
    let ids = [];
    for (const avis of filtredData) {
      ids.push(avis?._id!);
    }
    setAvisEnseignantsArray(ids);
    setIsClickedAvisEnseignants(true);
  };

  const alertDeleteAvisEnseignant = async () => {
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
          deleteAvisEnseignants({
            ids: avisEnseignantsArray,
            useNewDb: true,
          });
          setIsClickedAvisEnseignants(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Avis Enseignants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Avis Enseignants sont en sécurité :)",
            "error"
          );
        }
      });
  };

  //! Avis Personnels
  const { data: avisPeronnels = [] } = useFetchAvisPersonnelQuery({
    useNewDb: "true",
  });
  const [dateAvisPersonnels, setDateAvisPersonnels] = useState(today);
  const [deleteAvisPersonnel] = useDeleteManyAvisPersonnelMutation();
  const [avisPersonnelsArray, setAvisPersonnelsArray] = useState<string[]>([]);
  const [isClickedAvisPersonnels, setIsClickedAvisPersonnels] =
    useState<boolean>(false);

  const handleSelectDateAvisPersonnels = (e: any) => {
    setDateAvisPersonnels(e.target.value);
    const filtredData = avisPeronnels.filter(
      (avis) => avis.createdAt.split("T")[0] < dateAvisPersonnels
    );
    let ids = [];
    for (const avis of filtredData) {
      ids.push(avis?._id!);
    }
    setAvisPersonnelsArray(ids);
    setIsClickedAvisPersonnels(true);
  };

  const AlertDeletePersonnels = async () => {
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
          deleteAvisPersonnel({
            ids: avisPersonnelsArray,
            useNewDb: true,
          });
          setIsClickedAvisPersonnels(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Avis Personnels ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Avis Personnels sont en sécurité :)",
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
            {avisEtudiants.length === 0 ? (
              <div className="hstack gap-2">
                <span>Avis Etudiants</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>Avis Etudiants ({avisEtudiants.length})</span>
            )}
            {avisEtudiants.length !== 0 && (
              <Form.Control
                type="date"
                value={dateAvisEtudiants}
                onChange={handleSelectDateAvisEtudiants}
                className="w-50 text-center"
                max={today}
              />
            )}
            {avisEtudiants.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeleteAvisEtudiants}
              >
                Nettoyer
              </span>
            )}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {avisPeronnels.length === 0 ? (
              <div className="hstack gap-2">
                <span>Avis Personnels</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>Avis Personnels ({avisPeronnels.length})</span>
            )}
            {avisPeronnels.length !== 0 && (
              <Form.Control
                type="date"
                value={dateAvisPersonnels}
                onChange={handleSelectDateAvisPersonnels}
                className="w-50 text-center"
                min={today}
              />
            )}
            {avisPeronnels.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeletePersonnels}
              >
                Nettoyer
              </span>
            )}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {avisEnseignants.length === 0 ? (
              <div className="hstack gap-2">
                <span>Avis Enseignants</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>Avis Enseignants ({avisEnseignants.length})</span>
            )}
            {avisEnseignants.length !== 0 && (
              <Form.Control
                type="date"
                value={dateAvisEnseignants}
                onChange={handleSelectDateAvisEnseignants}
                className="w-50 text-center"
                max={today}
              />
            )}
            {avisEnseignants.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={alertDeleteAvisEnseignant}
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

export default AvisComponent;
