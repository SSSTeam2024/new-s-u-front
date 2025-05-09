import React, { useRef, useState, useEffect } from "react";
import * as docx from "docx-preview";

const DocxPreviewer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
      /* Base RTL direction for the container */
      .docx-wrapper {
        
        unicode-bidi: isolate;
      }
      
      /* Paragraph styling */
      .docx p {
        text-align: right;
        margin: 0;
        unicode-bidi: plaintext;
      }
      
      /* Special handling for mixed content */
      .docx .mixed-content {
        unicode-bidi: plaintext;
        direction: rtl;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !previewRef.current) return;

        setIsLoading(true);

        try {
            previewRef.current.innerHTML = "";
            const arrayBuffer = await readFileAsArrayBuffer(file);

            if (previewRef.current) {
                await docx.renderAsync(arrayBuffer, previewRef.current, undefined, {
                    className: "docx",
                    inWrapper: true,
                    ignoreFonts: false,
                });

                // Apply our text direction fixes
                fixTextDirection(previewRef.current);
            }
        } catch (error) {
            console.error("Error rendering document:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fixTextDirection = (container: HTMLElement) => {
        // Process all paragraphs
        const paragraphs = container.getElementsByTagName("p");
        Array.from(paragraphs).forEach((p) => {
            // Mark paragraph as mixed content container
            p.classList.add("mixed-content");

            // Find and wrap text nodes that need special handling
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);

            let node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue?.match(/[()]/)) {
                    const span = document.createElement("span");
                    span.style.unicodeBidi = "plaintext";
                    node.parentNode?.replaceChild(span, node);
                    span.appendChild(node);
                }
            }
        });
    };

    const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <h2>Word Document Previewer</h2>
            <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                disabled={isLoading}
            />

            {isLoading && <p>Loading document...</p>}

            <div
                ref={previewRef}
                contentEditable={true}
                style={{
                    marginTop: "20px",
                    border: "1px solid #ddd",
                    padding: "20px",
                    minHeight: "500px",
                }}
            />
        </div>
    );
};

export default DocxPreviewer;