import React from "react";
import { View, Text } from "@react-pdf/renderer";

interface PDFTableProps {
  data: string;
}

const PDFTable: React.FC<PDFTableProps> = ({ data }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  const elements = Array.from(doc.body.childNodes);

  return (
    <View style={{ margin: 10 }}>
      {elements.map((element, index) => {
        if (element.nodeType === 1 && element.nodeName === "P") {
          let paragraphText =
            element.textContent?.replace(/\u00A0/g, " ") || "";
          let nextElement = element.nextSibling;
          while (
            nextElement &&
            nextElement.nodeType === 1 &&
            nextElement.nodeName === "P"
          ) {
            paragraphText += ` ${
              nextElement.textContent?.replace(/\u00A0/g, " ") || ""
            }`;
            nextElement = nextElement.nextSibling;
          }
          return (
            <Text key={`paragraph-${index}`} style={{ marginBottom: 5 }}>
              {paragraphText}
            </Text>
          );
        } else if (
          element.nodeType === 1 &&
          element.nodeName === "FIGURE" &&
          (element as HTMLElement).classList.contains("table")
        ) {
          const tableElement = element as Element;
          const rows = Array.from(tableElement.querySelectorAll("tr")).map(
            (row) => {
              const cells = Array.from(row.querySelectorAll("td")).map(
                (cell) => {
                  // Replace <br> or <br /> with a newline character to maintain line breaks in the text
                  const cellContent = cell.innerHTML.replace(
                    /<br\s*\/?>/gi,
                    "\n"
                  );

                  // Create a temporary DOM element to strip any remaining HTML tags and extract plain text
                  const tempElement = document.createElement("div");
                  tempElement.innerHTML = cellContent;
                  const plainText =
                    tempElement.textContent || tempElement.innerText || "";

                  return plainText;
                }
              );
              return cells;
            }
          );

          return (
            <View key={`table-${index}`} style={{ marginBottom: 10 }}>
              {rows.map((row, rowIndex) => {
                const cellWidth = `${100 / row.length}%`;
                return (
                  <View
                    key={`row-${rowIndex}`}
                    style={{
                      flexDirection: "row",
                      borderBottom: "1pt solid black",
                      backgroundColor: "#f0f0f0",
                      marginBottom: 2,
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <Text
                        key={`cell-${cellIndex}`}
                        style={{
                          width: cellWidth,
                          padding: 5,
                          fontWeight: "bold",
                        }}
                      >
                        {cell}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        } else {
          return null;
        }
      })}
    </View>
  );
};

export default PDFTable;
