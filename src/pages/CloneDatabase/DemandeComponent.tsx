import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useDeleteManyDemandePersonnelMutation,
  useFetchDemandePersonnelQuery,
} from "features/demandePersonnel/demandePersonnelSlice";
import {
  useDeleteManyDemandeEnseignantMutation,
  useFetchDemandeEnseignantQuery,
} from "features/demandeEnseignant/demandeEnseignantSlice";
import {
  useDeleteManyDemandeEtudiantMutation,
  useFetchDemandeEtudiantQuery,
} from "features/demandeEtudiant/demandeEtudiantSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";

interface DemandeProps {
  today: string;
}

const DemandeComponent: React.FC<DemandeProps> = ({ today }) => {
  //! Demande Etudiant
  const [deleteDemandesEtudiants] = useDeleteManyDemandeEtudiantMutation();
  const [dateDemandesEtudiants, setDateDemandesEtudiants] = useState(today);
  const [demandesEtudiantArray, setDemandesEtudiantsArray] = useState<string[]>(
    []
  );
  const [isClickedDemandesEtudiants, setIsClickedDemandesEtudiants] =
    useState<boolean>(false);
  const { data: AllDemandesEtudiants = [] } = useFetchDemandeEtudiantQuery({
    useNewDb: "true",
  });
  const { data: AllDemancesEtudiantsFromOldDatabase = [] } =
    useFetchDemandeEtudiantQuery();
  const filtredDemandeEtudiants = AllDemandesEtudiants.filter(
    (demande) => demande.status === "traité"
  );
  // const filtredDemandeEtudiantsFromOldDatabase =
  //   AllDemancesEtudiantsFromOldDatabase.filter(
  //     (demande) => demande.status === "traité"
  //   );
  const handleSelectDateDemandesEtudiants = (e: any) => {
    setDateDemandesEtudiants(e.target.value);
    const filtredData = filtredDemandeEtudiants.filter(
      (demande) =>
        demande.createdAt.toString().split("T")[0] < dateDemandesEtudiants
    );
    let ids = [];
    for (const demande of filtredData) {
      ids.push(demande?._id!);
    }
    setDemandesEtudiantsArray(ids);
    setIsClickedDemandesEtudiants(true);
  };
  const AlertDeleteDemandesEtudiants = async () => {
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
          deleteDemandesEtudiants({
            ids: demandesEtudiantArray,
            useNewDb: true,
          });
          setIsClickedDemandesEtudiants(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Demandes Etudiants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Demandes Etudiants sont en sécurité :)",
            "error"
          );
        }
      });
  };
  //! Demande Personnel
  const [deleteDemandesPersonnels] = useDeleteManyDemandePersonnelMutation();
  const [dateDemandesPersonnels, setDateDemandesPersonnels] = useState(today);
  const [demandesPersonnelArray, setDemandesPersonnelsArray] = useState<
    string[]
  >([]);
  const [isClickedDemandesPersonnels, setIsClickedDemandesPersonnels] =
    useState<boolean>(false);
  const { data: AllDemandesPersonnel = [] } = useFetchDemandePersonnelQuery({
    useNewDb: "true",
  });
  const { data: AllDemancesPersonnelFromOldDatabase = [] } =
    useFetchDemandePersonnelQuery();
  const filtredDemandePersonnels = AllDemandesPersonnel.filter(
    (demande) => demande.status === "traité"
  );
  // const filtredDemandePersonnelsFromOldDatabase =
  //   AllDemancesPersonnelFromOldDatabase.filter(
  //     (demande) => demande.status === "traité"
  //   );
  const handleSelectDateDemandesPersonnels = (e: any) => {
    setDateDemandesPersonnels(e.target.value);
    const filtredData = filtredDemandePersonnels.filter(
      (demande) =>
        demande.createdAt.toString().split("T")[0] < dateDemandesPersonnels
    );
    let ids = [];
    for (const demande of filtredData) {
      ids.push(demande?._id!);
    }
    setDemandesPersonnelsArray(ids);
    setIsClickedDemandesPersonnels(true);
  };
  const AlertDeleteDemandesPersonnels = async () => {
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
          deleteDemandesPersonnels({
            ids: demandesPersonnelArray,
            useNewDb: true,
          });
          setIsClickedDemandesPersonnels(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Demandes Personnels ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Demandes Personnels sont en sécurité :)",
            "error"
          );
        }
      });
  };
  //! Demande Enseignant
  const [deleteDemandesEnseignant] = useDeleteManyDemandeEnseignantMutation();
  const [dateDemandesEnseignants, setDateDemandesEnseignants] = useState(today);
  const [demandesEnseignantArray, setDemandesEnseignantsArray] = useState<
    string[]
  >([]);
  const [isClickedDemandesEnseignants, setIsClickedDemandesEnseignants] =
    useState<boolean>(false);
  const { data: AllDemandesEnseignants = [] } = useFetchDemandeEnseignantQuery({
    useNewDb: "true",
  });
  const { data: AllDemancesEnseignantsFromOldDatabase = [] } =
    useFetchDemandeEnseignantQuery();
  const filtredDemandeEnseignants = AllDemandesEnseignants.filter(
    (demande) => demande.status === "traité"
  );
  // const filtredDemandeEnseignantsFromOldDatabase =
  //   AllDemancesEnseignantsFromOldDatabase.filter(
  //     (demande) => demande.status === "traité"
  //   );

  const handleSelectDateDemandesEnseignants = (e: any) => {
    setDateDemandesEnseignants(e.target.value);
    const filtredData = filtredDemandeEnseignants.filter(
      (demande) =>
        demande.createdAt.toString().split("T")[0] < dateDemandesEnseignants
    );
    let ids = [];
    for (const demande of filtredData) {
      ids.push(demande?._id!);
    }
    setDemandesEnseignantsArray(ids);
    setIsClickedDemandesEnseignants(true);
  };

  const AlertDeleteDemandesEnseignants = async () => {
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
          deleteDemandesEnseignant({
            ids: demandesEnseignantArray,
            useNewDb: true,
          });
          setIsClickedDemandesEnseignants(false);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Demandes Ensignants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Demandes Ensignants sont en sécurité :)",
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
            {filtredDemandeEtudiants.length === 0 ? (
              <div className="hstack gap-2">
                <span>Demandes Etudiants</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>Demandes Etudiants ({filtredDemandeEtudiants.length})</span>
            )}
            {filtredDemandeEtudiants.length !== 0 && (
              <Form.Control
                type="date"
                value={dateDemandesEtudiants}
                onChange={handleSelectDateDemandesEtudiants}
                className="w-50 text-center"
                max={today}
              />
            )}
            {filtredDemandeEtudiants.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeleteDemandesEtudiants}
              >
                Nettoyer
              </span>
            )}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {filtredDemandeEnseignants.length === 0 ? (
              <div className="hstack gap-2">
                <span>Demandes Enseignants</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>
                Demandes Enseignants ({filtredDemandeEnseignants.length})
              </span>
            )}
            {filtredDemandeEnseignants.length !== 0 && (
              <Form.Control
                type="date"
                value={dateDemandesEnseignants}
                onChange={handleSelectDateDemandesEnseignants}
                className="w-50 text-center"
                max={today}
              />
            )}
            {filtredDemandeEnseignants.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeleteDemandesEnseignants}
              >
                Nettoyer
              </span>
            )}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            {filtredDemandePersonnels.length === 0 ? (
              <div className="hstack gap-2">
                <span>Demandes Personnels</span>
                <span className="badge bg-success">
                  <i className="ph ph-check fs-16"></i>
                </span>
              </div>
            ) : (
              <span>
                Demandes Personnels ({filtredDemandePersonnels.length})
              </span>
            )}
            {filtredDemandePersonnels.length !== 0 && (
              <Form.Control
                type="date"
                value={dateDemandesPersonnels}
                onChange={handleSelectDateDemandesPersonnels}
                className="w-50 text-center"
                // max={today}
              />
            )}
            {filtredDemandePersonnels.length !== 0 && (
              <span
                className="badge bg-success"
                style={{ cursor: "pointer" }}
                onClick={AlertDeleteDemandesPersonnels}
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

export default DemandeComponent;
