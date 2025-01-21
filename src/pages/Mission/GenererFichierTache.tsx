import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { replaceShortCodes } from "helpers/GlobalFunctions/mission_file_helper";
import { te } from "date-fns/locale";

const GenerateFicheTache = () => {
  document.title = "Generer fiche de tache| ENIGA";
  const location = useLocation();
  const { cellProps, templateBody } = location.state || {}; // Destructure the state if it exists

  console.log("state", location.state);

  const [newUpdateBody, setNewUpdateBody] = useState("");
  const [hasProcessed, setHasProcessed] = useState(false);

  const { data: AllVariablesGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!hasProcessed) {
      let generatedDocument = replaceShortCodes(
        location.state.templateBody,
        location.state.cellProps,
        AllVariablesGlobales
      );
      setNewUpdateBody(generatedDocument);

      setHasProcessed(true);
    }
  }, [newUpdateBody, hasProcessed]);

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
    let generatedDocument = replaceShortCodes(
      location.state.templateBody,
      location.state.cellProps,
      AllVariablesGlobales
    );

    if (generatedDocument) {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "fit-content";
      tempContainer.style.background = "#fff";
      tempContainer.innerHTML = generatedDocument;

      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [tempContainer.offsetWidth, tempContainer.offsetHeight],
      });
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        tempContainer.offsetWidth,
        tempContainer.offsetHeight
      );
      pdf.save("document.pdf");

      document.body.removeChild(tempContainer);
    } else {
      alert("No content available to save as PDF.");
    }
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
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginTop: "20px",
                  minHeight: "300px",
                  background: "#f9f9f9",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: /* JSON.parse(newUpdateBody) */ newUpdateBody,
                  }}
                />
              </div>
            </Row>
          </div>
          <div className="hstack gap-2 justify-content-end d-print-none mt-4">
            <Button onClick={/* generatePDF */ handleSaveAsPDF}>
              Télécharger
            </Button>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GenerateFicheTache;
