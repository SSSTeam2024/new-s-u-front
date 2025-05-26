import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import * as XLSX from "xlsx";
import {
  Resultat,
  useAddResultatMutation,
} from "features/resultats/resultatsSlice";
import { useFetchEtudiantByCinMutation } from "features/etudiant/etudiantSlice";
import Swal from "sweetalert2";
import FileSaver from "file-saver";

export interface ResultatFileEXEL {
  etudiant: string;
  Cin: string;
  MoyenneS1: string;
  MoyenneS2: string;
  MoyenneRattrapage: string;
  MoyenneGenerale: string;
  Avis: string;
}

const AddResultat = () => {
  const [resultatFile, setResultatFile] = useState<ResultatFileEXEL[]>();
  const [modal_ImportModals, setmodal_ImportModals] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  function tog_ImportModals() {
    setmodal_ImportModals(!modal_ImportModals);
  }

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Resultat a été créée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [newResultat, { isLoading: loadingCreate }] = useAddResultatMutation();
  const [etudiantByCin] = useFetchEtudiantByCinMutation();
  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: ResultatFileEXEL[] = XLSX.utils.sheet_to_json(
          worksheet
        ) as ResultatFileEXEL[];

        const etudiantsArray = await Promise.all(
          jsonData.map(async (items) => {
            try {
              const etudiant = await etudiantByCin(items.Cin).unwrap();
              return {
                moyenne_sem1: items.MoyenneS1 || "",
                moyenne_sem2: items.MoyenneS2 || "",
                moyenne_rattrapage: items.MoyenneRattrapage || "",
                avis: items.Avis || "",
                moyenne_generale: items.MoyenneGenerale || "",
                etudiant: etudiant._id,
              };
            } catch (err) {
              console.error(
                `Error fetching student with CIN ${items.Cin}`,
                err
              );
              return null;
            }
          })
        );
        const validEtudiants = etudiantsArray.filter((e) => e !== null);

        const resultatData: Resultat = {
          etudiants: validEtudiants as Resultat["etudiants"],
        };
        await newResultat(resultatData).unwrap();
        setResultatFile(jsonData);
        tog_ImportModals();
        notifySuccess();
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };
    reader.onerror = () => {
      console.error("File could not be read.");
    };

    reader.readAsArrayBuffer(file);
  };

  const createAndDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [
      [
        "Cin",
        "MoyenneS1",
        "MoyenneS2",
        "MoyenneRattrapage",
        "MoyenneGenerale",
        "Avis",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Résultat");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, "template_resultat.xlsx");
  };

  return (
    <React.Fragment>
      {loadingCreate ? (
        <button type="button" className="btn btn-outline-secondary btn-load">
          <span className="d-flex align-items-center">
            <span className="spinner-grow flex-shrink-0" role="status">
              <span className="visually-hidden">Loading...</span>
            </span>
            <span className="flex-grow-1 ms-2">Loading...</span>
          </span>
        </button>
      ) : (
        <Button
          variant="success"
          className="add-btn"
          onClick={tog_ImportModals}
        >
          Ajouter Depuis Excel
        </Button>
      )}

      <Modal
        className="fade modal-fullscreen"
        show={modal_ImportModals}
        onHide={tog_ImportModals}
        centered
      >
        <Modal.Header className="px-4 pt-4" closeButton>
          <h5 className="modal-title" id="exampleModalLabel">
            Importer Resultat
          </h5>
        </Modal.Header>
        <Form className="tablelist-form">
          <Modal.Body className="p-4">
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Téléchargement...</span>
                </Spinner>
              </div>
            ) : (
              <>
                Vous pouvez importer le resultat à partir de ce template{" "}
                <a href="#" onClick={createAndDownloadExcel}>
                  Cliquer ici pour télécharger
                </a>
                <Form.Group controlId="formFile" className="mt-3">
                  <Form.Label>Télécharger un fichier Excel</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AddResultat;
