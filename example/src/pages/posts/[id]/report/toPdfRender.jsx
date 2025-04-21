import { dataAdminProvider, i18nProvider } from "_client/provider";
import { generatePdf, ReportBody, waitForRender } from "_client/ui/report";
import { useContext } from "react";
import {
  AdminContext,
  defaultLightTheme,
  RecordContextProvider,
} from "react-admin";
import "react-alice-carousel/lib/alice-carousel.css";
import { createRoot } from "react-dom/client";
import { StyleSheetContext, StyleSheetManager } from "styled-components";
import { ReportContent } from "./report";

const InlineStyle = () => {
  var styleSheet = useContext(StyleSheetContext);
  const __html = styleSheet.styleSheet.toString();
  return <style dangerouslySetInnerHTML={{ __html }} />;
};

export const SnapshotContext = ({ record, children }) => {
  return (
    <AdminContext
      locale="es"
      theme={defaultLightTheme}
      i18nProvider={i18nProvider}
      dataProvider={dataAdminProvider}
    >
      <StyleSheetManager>
        <RecordContextProvider value={record}>{children}</RecordContextProvider>
        <InlineStyle />
      </StyleSheetManager>
    </AdminContext>
  );
};

export const onPdfRender = async () => {
  const report = document.createElement("body");
  const a = (
    <ReportBody>
      <ReportContent />
    </ReportBody>
  );
  createRoot(report).render(
    <SnapshotContext record={record}>
      <ReportContent />
    </SnapshotContext>
  );
  waitForRender(report, () => {
    console.log("✅ Render completo:", report.innerHTML);
    const htmlContent = `
      <html>
        <head>
          <style>
            body > * {
              page-break-inside: auto;
              width: 100%;
            }
          </style>
        </head>
        ${report.innerHTML}
      </html>
    `;

    // const blob = new Blob([htmlContent], { type: "text/html" });
    // const url = URL.createObjectURL(blob);
    // window.open(url, "_blank");

    generatePdf(htmlContent, { filename: "accionista.pdf" });
  });

  // const html1 = renderToString(
  //   <RecordContextProvider value={record}>
  //     <h1>EEEEEEEEEEEEE</h1>
  //     <ReportContent />
  //   </RecordContextProvider>
  // );
  // console.log("22>>>>>>>>>>", html1);
  // const html = renderToString(
  //   <ReportContext record={record}>
  //     <h1>EEEEEEEEEEEEE</h1>
  //   </ReportContext>
  // );
  // console.log(">>>>>>>>>>", html);
  //generatePdf(html, { filename: "accionista.pdf" });
};
