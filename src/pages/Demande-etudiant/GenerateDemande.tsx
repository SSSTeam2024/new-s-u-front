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
import { useUpdateDemandeEtudiantMutation } from "features/demandeEtudiant/demandeEtudiantSlice";
import Swal from "sweetalert2";

const GenerateDemande = () => {
  document.title = "Demande Etudiant | ENIGA";
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

  const [updateDemande] = useUpdateDemandeEtudiantMutation();

  const [generatedDocData, setGeneratedDocData] = useState({
    etudiant: "",
    model: "",
    body: "",
    date_generation: "",
    num_ordre: "",
    num_qr_code: ""
  })

  // const generatePDF = async () => {
  //   try {
  //     setIsGenerating(true);
  //     if (!bodyRef.current) {
  //       console.error("bodyRef is not set.");
  //       setIsGenerating(false);
  //       return;
  //     }

  //     const doc = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     doc.setFontSize(10);

  //     const options = {
  //       // margin: [0, 0, 30, 0],
  //       html2canvas: { scale: 0.28, useCORS: true },
  //       callback: (pdf: any) => {
  //         pdf.save("document.pdf");
  //         setIsGenerating(false);
  //       },
  //     };

  //     await doc.html(bodyRef.current, options);

  //   } catch (error) {
  //     console.error("Error generating PDF: ", error);
  //     setIsGenerating(false);
  //   }
  // };

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

      if(demandeLocation?.piece_demande?.has_number! === '1'){
        num = number.value + "/" + part2an1 + part2an2;
      }

      if(demandeLocation?.piece_demande?.has_code! === '1'){
        qr = qrCodeQndOrderNumber.cryptedQrCode;
      }
      //TODO : CODE YABDA 8ALET KEN FI AWEL TELECHARGEMENT
      setGeneratedDocData((prevState) => ({
        ...prevState,
        etudiant: demandeLocation?.studentId?._id!,
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
    if(demandeLocation?.status! !== 'traité' && demandeLocation?.generated_doc === null){
      let allVariables = AllVariablesGlobales[AllVariablesGlobales.length - 1];

      const [an1, an2] = allVariables?.annee_universitaire!.split('/');

      const [part1an1, part2an1] = an1.split('0');
      const [part1an2, part2an2] = an2.split('0');
      order_number = number.value + "/" + part2an1 + part2an2;
      cryptedCode = generateQRCode(demandeLocation._id, order_number);
    }else{
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
  // const generatePDF = async () => {
  //   try {
  //     setIsGenerating(true);
  //     if (!bodyRef.current) {
  //       console.error("bodyRef is not set.");
  //       setIsGenerating(false);
  //       return;
  //     }

  //     const doc = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     // Render entire body using html2pdf to preserve image and text formatting
  //     const html2pdfOptions = {
  //       html2canvas: { scale: 0.28, useCORS: true },
  //       callback: (pdf: any) => {
  //         setIsGenerating(false);
  //         pdf.save("document.pdf");
  //       },
  //     };

  //     // Render the header using html2pdf (handles images automatically)
  //     if (bodyRef.current) {
  //       // Temporarily create a div with only the header content for rendering
  //       const headerDiv = document.createElement("div");
  //       headerDiv.style.padding = "10mm"; // Optional styling
  //       headerDiv.innerHTML = `
  //         <img src="${AllVariablesGlobales[2]?.logo_universite}" alt="Université Logo" style="width: 30mm; height: 15mm;" />
  //         <h2 style="text-align: center;">Université XYZ</h2>
  //         <h3 style="text-align: center;">Demande Document</h3>
  //         <hr style="border: 1px solid #000;">
  //       `;

  //       // Add header to the PDF document using `html` method
  //       await doc.html(headerDiv, {
  //         x: 10,
  //         y: 10,
  //         html2canvas: { scale: 0.28 },
  //       });
  //     }

  //     // Manually add tables using autoTable
  //     const tables = bodyRef.current.querySelectorAll("table");
  //     let startY = 50; // Adjust starting position after header

  //     tables.forEach((table) => {
  //       autoTable(doc, {
  //         html: table,
  //         startY: startY,
  //         margin: { horizontal: 10 },
  //         styles: {
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0], // Black lines for borders
  //           fillColor: [255, 255, 255], // White background for cells
  //           textColor: [0, 0, 0],
  //           fontSize: 10,
  //           halign: 'center', // Align text to center
  //           valign: 'middle', // Align text to middle
  //         },
  //         headStyles: {
  //           fillColor: [200, 200, 200], // Optional: header background color
  //           textColor: [0, 0, 0],
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0],
  //         },
  //         bodyStyles: {
  //           fillColor: [255, 255, 255], // Optional: body background color
  //           textColor: [0, 0, 0],
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0],
  //         },
  //       });
  //       const finalY = (doc as any).autoTable.previous?.finalY || startY;
  //       startY = finalY + 10; // Add some space between tables
  //     });

  //     // Add footer using html2pdf if needed
  //     if (bodyRef.current) {
  //       const footerDiv = document.createElement("div");
  //       footerDiv.style.padding = "10mm";
  //       footerDiv.style.position = "absolute";
  //       footerDiv.style.bottom = "10mm";
  //       footerDiv.style.width = "100%";
  //       footerDiv.innerHTML = `
  //         <hr style="border: 1px solid #000;">
  //         <p style="font-size: 10px; text-align: center;">
  //           Address: ${AllVariablesGlobales[2]?.address_fr} | Phone: ${AllVariablesGlobales[2]?.phone} | Website: ${AllVariablesGlobales[2]?.website}
  //         </p>
  //       `;

  //       await doc.html(footerDiv, {
  //         x: 0,
  //         y: doc.internal.pageSize.height - 30, // Position footer at the bottom
  //         html2canvas: { scale: 0.28 },
  //       });
  //     }

  //     // Render full content with html2pdf to finalize image loading
  //     await doc.html(bodyRef.current, html2pdfOptions);
  //   } catch (error) {
  //     console.error("Error generating PDF: ", error);
  //     setIsGenerating(false);
  //   }
  // };

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

    if(demandeLocation?.status! !== 'traité' && demandeLocation?.generated_doc === null){
      let generatedDocDataRef = {...generatedDocData};

      generatedDocDataRef.body = generatedDocument;

      console.log(generatedDocDataRef);
      await saveDocmentAndUpdateDemand(generatedDocDataRef);
    }

  } else {
    alert("No content available to save as PDF.");
  }
  //*****
    // let generatedDocument = replaceShortCodes(
    //   demandeLocation,
    //   AllVariablesGlobales
    // );

    // if (generatedDocument) {
    //   const tempContainer = document.createElement("div");
    //   tempContainer.style.position = "absolute";
    //   tempContainer.style.left = "-9999px";
    //   tempContainer.style.width = "fit-content";
    //   tempContainer.style.background = "#fff";
    //   tempContainer.innerHTML = generatedDocument;

    //   document.body.appendChild(tempContainer);

    //   const canvas = await html2canvas(tempContainer, { scale: 2, useCORS: true });
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF({
    //     orientation: "portrait",
    //     unit: "px",
    //     format: [tempContainer.offsetWidth, tempContainer.offsetHeight],
    //   });
    //   pdf.addImage(
    //     imgData,
    //     "PNG",
    //     0,
    //     0,
    //     tempContainer.offsetWidth,
    //     tempContainer.offsetHeight
    //   );
    //   pdf.save("document.pdf");

    //   document.body.removeChild(tempContainer);
    // } else {
    //   alert("No content available to save as PDF.");
    // }
    //*********
  //   let generatedDocument = replaceShortCodes(demandeLocation, AllVariablesGlobales);

  // if (!generatedDocument) {
  //   alert("No content available to save as PDF.");
  //   return;
  // }

  // // Create a temporary container for rendering the content
  // const tempContainer = document.createElement("div");
  // tempContainer.style.position = "absolute";
  // tempContainer.style.left = "-9999px";
  // tempContainer.style.width = "fit-content";
  // tempContainer.style.background = "#fff";
  // tempContainer.innerHTML = generatedDocument;
  // document.body.appendChild(tempContainer);

  // try {
  //   // Ensure all images are loaded before capturing
  //   const images: any = tempContainer.querySelectorAll("img");
  //   await Promise.all([...images].map((img) => new Promise((resolve) => {
  //     if (img.complete) {
  //       resolve(true);
  //     } else {
  //       img.onload = () => resolve(true);
  //       img.onerror = () => resolve(true); // Prevent failure on broken images
  //     }
  //   })));

  //   // Capture the content as a high-resolution image
  //   const canvas = await html2canvas(tempContainer, { scale: 2, useCORS: true });
  //   const imgData = canvas.toDataURL("image/png");

  //   // Define PDF format (A4 size in px: 595x842)
  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "px",
  //     format: [tempContainer.offsetWidth, tempContainer.offsetHeight],
  //   });

  //   // Calculate scaled height to maintain aspect ratio
  //   const imgWidth = 595; // A4 width in pixels
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save("document.pdf");
  // } catch (error) {
  //   console.error("Error generating PDF:", error);
  //   alert("Failed to generate PDF.");
  // } finally {
  //   document.body.removeChild(tempContainer); // Clean up after rendering
  // }
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
    }).then(()=>{
      navigate("/demandes-etudiant/Liste-demandes-etudiant");
    });
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      if (!bodyRef.current) {
        console.error("bodyRef is not set.");
        setIsGenerating(false);
        return;
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Render header as before
      const headerDiv = document.createElement("div");
      headerDiv.style.padding = "10mm";
      headerDiv.innerHTML = `
        <img src="${AllVariablesGlobales[2]?.logo_universite}" alt="Université Logo" style="width: 30mm; height: 15mm;" />
        <h2 style="text-align: center;">Université XYZ</h2>
        <h3 style="text-align: center;">Demande Document</h3>
        <hr style="border: 1px solid #000;">
      `;
      await doc.html(headerDiv, {
        x: 10,
        y: 10,
        html2canvas: { scale: 0.28 },
      });

      // Process tables
      const tables = bodyRef.current.querySelectorAll("table");
      let startY = 50;

      tables.forEach((table) => {
        const tableData = extractTableData(table);
        autoTable(doc, {
          head: [tableData[0]], // Assuming first row as header
          body: tableData.slice(1), // Remaining as body
          startY: startY,
          margin: { horizontal: 10 },
          styles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            halign: "center", // Center align the text in the cells
            valign: "middle", // Vertically align the text in the middle
          },
          headStyles: {
            fillColor: [200, 200, 200], // Light gray header background
            textColor: [0, 0, 0], // Black text
            fontStyle: "bold", // Bold header text
          },
          didParseCell: (data) => {
            // Additional styling for each cell if needed
            if (data.row.index === 0) {
              data.cell.styles.fillColor = [220, 220, 220]; // Slightly darker for header
            }
          },
        });

        const finalY = (doc as any).autoTable.previous.finalY || startY;
        startY = finalY + 10; // Space between tables
      });

      // Render footer as before
      const footerDiv = document.createElement("div");
      footerDiv.style.padding = "10mm";
      footerDiv.innerHTML = `
        <hr style="border: 1px solid #000;">
        <p style="font-size: 10px; text-align: center;">
          Address: ${AllVariablesGlobales[2]?.address_fr} | Phone: ${AllVariablesGlobales[2]?.phone} | Website: ${AllVariablesGlobales[2]?.website}
        </p>
      `;
      await doc.html(footerDiv, {
        x: 0,
        y: doc.internal.pageSize.height - 30,
        html2canvas: { scale: 0.28 },
      });

      // Finalize PDF
      await doc.html(bodyRef.current, {
        html2canvas: { scale: 0.28, useCORS: true },
        callback: (pdf: any) => {
          setIsGenerating(false);
          pdf.save("document.pdf");
        },
      });
    } catch (error) {
      console.error("Error generating PDF: ", error);
      setIsGenerating(false);
    }
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
          {/* <div
            ref={bodyRef}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "200mm",
              minHeight: "280mm",
              padding: "10mm",
              margin: "0",
              backgroundColor: "#ffffff",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid #ddd",
            }}
          > */}
            {/* <Row>
              <HeaderPDF
                logo_etablissement={
                  AllVariablesGlobales[2]?.logo_etablissement!
                }
                logo_republique={AllVariablesGlobales[2]?.logo_republique!}
                logo_universite={AllVariablesGlobales[2]?.logo_universite!}
              />
            </Row> */}
            {/* <Row>
              <TitlePDF piece_demande={demandeLocation?.piece_demande!} />
            </Row> */}
            <Row>
              {/* <BodyPDF
                piece_demande={demandeLocation?.piece_demande!}
                studentId={demandeLocation?.studentId!}
                enseignantId={demandeLocation?.enseignantId!}
                personnelId={demandeLocation?.personnelId!}
                raison={demandeLocation?.raison!}
                formattedDate={new Date(
                  demandeLocation?.createdAt
                ).toLocaleDateString("fr-FR")}
                departement={
                  demandeLocation.studentId.groupe_classe.departement
                }
                allVariables={AllVariablesGlobales[2]}
              /> */}
              {/* <div
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginTop: "20px",
                  minHeight: "300px",
                  background: "#f9f9f9",
                }}
              > */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: /* JSON.parse(newUpdateBody) */ newUpdateBody,
                  }}
                />
              {/* </div> */}
            </Row>
            {/* <Row className="mt-auto">
              <FooterPDF
                address_fr={AllVariablesGlobales[2]?.address_fr!}
                code={AllVariablesGlobales[2]?.code_postal!}
                fax={AllVariablesGlobales[2]?.fax!}
                phone={AllVariablesGlobales[2]?.phone!}
                website={AllVariablesGlobales[2]?.website!}
              />
            </Row> */}
          {/* </div> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GenerateDemande;
