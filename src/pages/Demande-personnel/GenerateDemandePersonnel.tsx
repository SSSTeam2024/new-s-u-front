
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

// import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { replaceShortCodes } from "helpers/GlobalFunctions/administrative_demand_helper";
import { generateQRCode } from "helpers/GlobalFunctions/administrative_demand_helper";
import { useGetGeneratedDocNextNumberByModelIdQuery, useSaveGeneratedDocMutation } from "features/generatedDoc/generatedDocSlice";
import { useUpdateDemandePersonnelMutation } from "features/demandePersonnel/demandePersonnelSlice";
import Swal from "sweetalert2";

const GenerateDemandePersonnel = () => {
  document.title = "Demande Personnel | ENIGA";
  const location = useLocation();
  const demandeLocation = location.state;

  // console.log(demandeLocation?.piece_demande);
  console.log(demandeLocation);

  const [newUpdateBody, setNewUpdateBody] = useState("");
  const [hasProcessed, setHasProcessed] = useState(false);

  const navigate = useNavigate();

  const { data: AllVariablesGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: number, isSuccess: nextNumberLoaded } = useGetGeneratedDocNextNumberByModelIdQuery(
    demandeLocation?.piece_demande?._id!
  );

  const [saveGeneratedDoc] = useSaveGeneratedDocMutation();

  const [updateDemande] = useUpdateDemandePersonnelMutation();

  const [generatedDocData, setGeneratedDocData] = useState({
    personnel: "",
    model: "",
    body: "",
    date_generation: "",
    num_ordre: "",
    num_qr_code: ""
  })

  useEffect(() => {
    if (!hasProcessed && nextNumberLoaded) {
      const qrCodeQndOrderNumber = getCryptedQrCodeAndOrderNumber();
      console.log(qrCodeQndOrderNumber);
      let generatedDocument = replaceShortCodes(
        demandeLocation,
        AllVariablesGlobales,
        qrCodeQndOrderNumber.orderNumber,
        qrCodeQndOrderNumber.cryptedQrCode
      );
      setNewUpdateBody(generatedDocument);

      let allVariables = AllVariablesGlobales[AllVariablesGlobales.length - 1];
      console.log("allVariables ligne 100", allVariables)

      const [an1, an2] = allVariables?.annee_universitaire!.split('/');

      const [part1an1, part2an1] = an1.split('0');
      const [part1an2, part2an2] = an2.split('0');

      let qr = "";
      let num = "";

      const d = new Date();
      const formattedDate =
        d.getDate().toString().padStart(2, "0") +
        "-" +
        (d.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        d.getFullYear().toString();

      if (demandeLocation?.piece_demande?.has_number! === '1') {
        num = number.value + "/" + part2an1 + part2an2;
      }

      if (demandeLocation?.piece_demande?.has_code! === '1') {
        qr = qrCodeQndOrderNumber.cryptedQrCode;
      }
      //TODO : CODE YABDA 8ALET KEN FI AWEL TELECHARGEMENT
      setGeneratedDocData((prevState) => ({
        ...prevState,
        personnel: demandeLocation?.personnelId?._id!,
        model: demandeLocation?.piece_demande?._id!,
        date_generation: formattedDate,
        num_ordre: num,
        num_qr_code: qr
      }));

      setHasProcessed(true);
    }
  }, [newUpdateBody, hasProcessed, nextNumberLoaded]);

  const getCryptedQrCodeAndOrderNumber = () => {
    let cryptedCode = "";
    let order_number = "";
    if (demandeLocation?.status! !== 'traité' && demandeLocation?.generated_doc === null) {
      let allVariables = AllVariablesGlobales[AllVariablesGlobales.length - 1];


      const [an1, an2] = allVariables?.annee_universitaire!.split('/');

      const [part1an1, part2an1] = an1.split('0');
      const [part1an2, part2an2] = an2.split('0');
      order_number = number.value + "/" + part2an1 + part2an2;
      cryptedCode = generateQRCode(demandeLocation._id, order_number);
    } else {
      console.log(demandeLocation?.generated_doc);
      cryptedCode = demandeLocation?.generated_doc?.num_qr_code!;
      order_number = demandeLocation?.generated_doc?.num_ordre!;
    }
    return {
      cryptedQrCode: cryptedCode,
      orderNumber: order_number
    }
  }

  const extractTableData = (tableElement: any) => {
    if (!tableElement) {
      console.error("Invalid table element");
      return [];
    }

    const rows = tableElement.querySelectorAll("tr");
    const data: any = [];

    rows.forEach((row: any) => {
      const rowData: any = [];
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell: any) => {
        // You can choose to extract more than just innerText, like attributes if needed
        rowData.push(cell.innerText.trim());
      });
      // Only add rowData if it has content
      if (rowData.length > 0) {
        data.push(rowData);
      }
    });

    return data;
  };

  const handleSaveAsPDF = async () => {
    const qrCodeQndOrderNumber = getCryptedQrCodeAndOrderNumber();
    let generatedDocument = replaceShortCodes(demandeLocation, AllVariablesGlobales, qrCodeQndOrderNumber.orderNumber, qrCodeQndOrderNumber.cryptedQrCode);

    if (generatedDocument) {
      // Create a temporary DOM element to manipulate styles safely
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generatedDocument;

      // Remove unwanted styles from `.docx-wrapper`
      const docxWrapper: any = tempDiv.querySelector(".docx-wrapper");
      if (docxWrapper) {
        docxWrapper.style.background = "transparent"; // Remove gray background
        docxWrapper.style.padding = "0"; // Remove padding
        docxWrapper.style.display = "block"; // Reset display to normal flow
        docxWrapper.style.flexFlow = "unset";
        docxWrapper.style.alignItems = "unset";
      }

      // Create a temporary container for the sanitized document
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "fit-content";
      tempContainer.style.background = "#fff";
      tempContainer.innerHTML = tempDiv.innerHTML; // Use modified content

      document.body.appendChild(tempContainer);

      // Generate PDF
      const canvas = await html2canvas(tempContainer, { scale: 2, useCORS: true });
      // const imgData = canvas.toDataURL("image/png");
      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [tempContainer.offsetWidth, tempContainer.offsetHeight],
      });

      pdf.addImage(
        imgData,
        // "PNG",
        "JPEG",
        0,
        0,
        tempContainer.offsetWidth,
        tempContainer.offsetHeight
      );
      pdf.save("document.pdf");

      document.body.removeChild(tempContainer);

      if (demandeLocation?.status! !== 'traité' && demandeLocation?.generated_doc === null) {
        let generatedDocDataRef = { ...generatedDocData };

        generatedDocDataRef.body = generatedDocument;

        console.log(generatedDocDataRef);
        await saveDocmentAndUpdateDemand(generatedDocDataRef);
      }

    } else {
      alert("No content available to save as PDF.");
    }
    //*****

  };

  const saveDocmentAndUpdateDemand = async (generatedDocData: any) => {
    let savedDocument = await saveGeneratedDoc(generatedDocData).unwrap();

    await updateDemande({
      _id: demandeLocation._id,
      generated_doc: savedDocument._id,
      status: "traité"
    }).unwrap();

    notify();

  }

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Document généré avec succès",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      navigate("/demandes-personnel/liste-demande-personnel");
    });
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="hstack gap-2 justify-content-end d-print-none mt-4 mb-4">
            <Button onClick={handleSaveAsPDF}>
              {demandeLocation.status === 'traité' && demandeLocation.generated_doc !== null ? (<>Télécharger</>) : (<>Enregistrer et Télécharger</>)}
            </Button>
          </div>

          <Row>

            <div
              dangerouslySetInnerHTML={{
                __html: /* JSON.parse(newUpdateBody) */ newUpdateBody,
              }}
            />
            {/* </div> */}
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default GenerateDemandePersonnel;
