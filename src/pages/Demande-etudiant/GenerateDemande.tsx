import React, { useRef, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import FooterPDF from "Common/FooterPDF";
import TitlePDF from "Common/TitlePDF";
import BodyPDF from "Common/BodyPDF";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import HeaderPDF from "Common/HeaderPDF";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";


const GenerateDemande = () => {
  document.title = "Demande Etudiant | Smart University";
  const location = useLocation();
  const demandeLocation = location.state;
  const { data: AllVariablesGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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


  const extractTableData = (tableElement:any) => {
    if (!tableElement) {
      console.error("Invalid table element");
      return [];
    }
  
    const rows = tableElement.querySelectorAll("tr");
    const data:any = [];
  
    rows.forEach((row:any) => {
      const rowData:any = [];
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell:any) => {
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
            halign: 'center', // Center align the text in the cells
            valign: 'middle', // Vertically align the text in the middle
          },
          headStyles: {
            fillColor: [200, 200, 200], // Light gray header background
            textColor: [0, 0, 0], // Black text
            fontStyle: 'bold', // Bold header text
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
          <div
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
          >
            <Row>
              <HeaderPDF
                logo_etablissement={
                  AllVariablesGlobales[2]?.logo_etablissement!
                }
                logo_republique={AllVariablesGlobales[2]?.logo_republique!}
                logo_universite={AllVariablesGlobales[2]?.logo_universite!}
              />
            </Row>
            <Row>
              <TitlePDF piece_demande={demandeLocation?.piece_demande!} />
            </Row>
            <Row>
              <BodyPDF
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
              />
            </Row>
            <Row className="mt-auto">
           

                <FooterPDF 
                  address_fr={AllVariablesGlobales[2]?.address_fr!}
                  code={AllVariablesGlobales[2]?.code_postal!}
                  fax={AllVariablesGlobales[2]?.fax!}
                  phone={AllVariablesGlobales[2]?.phone!}
                  website={AllVariablesGlobales[2]?.website!}
                />
              
            </Row>
          </div>
          <div className="hstack gap-2 justify-content-end d-print-none mt-4">
            <Button onClick={generatePDF}>Download as PDF</Button>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GenerateDemande;
