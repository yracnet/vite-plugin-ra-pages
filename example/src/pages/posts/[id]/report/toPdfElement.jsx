import { generatePdf } from "_client/ui/report";
//@ts-ignore
import html2pdf from "html2pdf.js";

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body > * {
        page-break-inside: avoid;
        width: 100%;
      }
    </style>
  </head>
  <body></body>
</html>
`;

export const onPdfElement = async () => {
  const content = document.querySelector("#pdf-export");
  const maxHeight = 792;
  const { pages } = Array.from(content.children)
    .map((el) => ({ el, height: el.offsetHeight || 0 }))
    .reduce(
      ({ pages, height }, item) => {
        if (height + item.height <= maxHeight) {
          pages[0].push(item.el);
          height += item.height;
        } else {
          pages.unshift([item.el]);
          height = 0;
        }
        return { pages, height };
      },
      {
        height: 0,
        pages: [[]],
      }
    );
  const pageTotal = pages.length;
  const mainContent = content.cloneNode(true);
  mainContent.classList.add("container");
  mainContent.innerHTML = "";
  pages
    .reverse()
    .filter((els) => els.length > 0)
    .forEach((els, pageIndex) => {
      const page = document.createElement("div");
      page.className = "page-item";
      els.forEach((el) => page.appendChild(el.cloneNode(true)));

      const index = document.createElement("div");
      index.className = "page-index";
      index.innerText = `${pageIndex + 1} / ${pageTotal}`;
      page.appendChild(index);
      mainContent.appendChild(page);
    });

  // const blob = new Blob([mainContent.outerHTML], { type: "text/html" });
  // const url = URL.createObjectURL(blob);
  // window.open(url, "_blank");

  generatePdf(mainContent, { filename: "accionista.pdf" });
};

export const onPdfElement2 = async () => {
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlContent, "text/html").documentElement;
  const body = html.querySelector("body");
  const content = document.querySelector("#pdf-export");
  Array.from(content.children)
    .flat(100)
    .forEach((it) => {
      const item = it.cloneNode(true);
      body.appendChild(item);
    });

  // const blob = new Blob([html.outerHTML], { type: "text/html" });
  // const url = URL.createObjectURL(blob);
  // window.open(url, "_blank");

  // generatePdf(html, { filename: "accionista.pdf" });

  const opt = {
    margin: 10,
    filename: "form.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    enableLinks: false,
    jsPDF: {
      unit: "mm",
      format: "letter",
      orientation: "portrait",
    },
    pagebreak: { mode: ["css", "legacy"] },
  };
  const pdfBlob = await html2pdf().from(html).set(opt).outputPdf("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
};
