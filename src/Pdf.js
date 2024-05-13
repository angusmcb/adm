import React from "react";
import "./Pdf.css";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import ticketTemplate from "./qrticket_template.pdf";
import fontfile from "./calibrib.ttf";

function Pdf({ hour, minute, traveller, cabinNumber, date }) {
  const [docUrl, setDocUrl] = React.useState(null);

  React.useEffect(() => {
    setDocUrl(null);
    createPdf();
  }, [hour, minute, traveller, cabinNumber, date]);

  async function createPdf() {
    const existingPdfBytes = await fetch(ticketTemplate).then((res) =>
      res.arrayBuffer()
    );

    const fontBytes = await fetch(fontfile).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const sansserifFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const page = pages[0];

    const { width, height } = page.getSize();
    const textcolor = rgb(0.0, 0.58, 0.67);

    page.drawText(hour + ":" + minute, {
      x: width * 0.04,
      y: height - height * 0.2603 - 26 + 5,
      size: 26,
      font: sansserifFont,
      color: textcolor,
      lineHeight: 26,
    });
    page.drawText(traveller, {
      x: width * 0.4556,
      y: height - height * 0.1284 - 22 + 5,
      size: 22,
      font: sansserifFont,
      color: textcolor,
      lineHeight: 22,
    });

    page.drawText("N° " + cabinNumber, {
      x: width * 0.0371,
      y: height - height * 0.1893 - 28 + 5,
      size: 28,
      font: sansserifFont,
      color: textcolor,
      lineHeight: 28,
    });

    page.drawText(date ? date : "", {
      x: width * 0.039,
      y: height - height * 0.1282 - 24 + 5,
      size: 24,
      font: sansserifFont,
      color: textcolor,
      lineHeight: 24,
    });

    const pdfBytes = await pdfDoc.save();

    const bytes = new Uint8Array(pdfBytes);
    const blob = new Blob([bytes], { type: "application/pdf" });
    setDocUrl(URL.createObjectURL(blob));
  }

  if (docUrl) {
    return (
      <>
        <iframe
          className="pdf-iframe"
          title="test-frame"
          src={docUrl}
          type="application/pdf"
        />
        <div>
          <a className="pdf-viewbutton" href={docUrl}>
            View
          </a>
          <a
            className="pdf-downloadbutton"
            href={docUrl}
            download="qrticket_152745687.pdf"
          >
            Download
          </a>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>Nothing to download yet</div>
      </>
    );
  }
}

export default Pdf;
