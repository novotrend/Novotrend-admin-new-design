"use client";

import { ChevronDown, Copy, FileDown, FileSpreadsheet, Printer } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cleanText = value =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const escapeCsvValue = value => {
  const text = cleanText(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const downloadBlob = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getSafeFileName = filename =>
  cleanText(filename || "table-export")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "table-export";

const getRowsFromProps = ({ data = [], columns = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const usableColumns =
    columns.length > 0
      ? columns
      : Object.keys(data[0] || {}).map(key => ({
          key,
          label: key,
        }));

  const headers = usableColumns.map(column => cleanText(column.label || column.key));
  const rows = data.map(row =>
    usableColumns.map(column => {
      if (typeof column.accessor === "function") return column.accessor(row);
      return row?.[column.key] ?? "";
    })
  );

  return { headers, rows };
};

const getRowsFromDom = trigger => {
  const root = trigger?.closest("[data-table-export-root]");
  const table = root?.querySelector("table");

  if (!table) return null;

  const headers = Array.from(table.querySelectorAll("thead th")).map(cell => cleanText(cell.innerText));
  const rows = Array.from(table.querySelectorAll("tbody tr"))
    .map(row => Array.from(row.querySelectorAll("td")).map(cell => cleanText(cell.innerText)))
    .filter(row => row.length > 0 && !row.join(" ").toLowerCase().startsWith("no "));

  return {
    headers,
    rows,
    title: root?.getAttribute("data-table-title"),
  };
};

const toDelimitedText = ({ headers, rows }, delimiter) =>
  [headers, ...rows].map(row => row.map(escapeCsvValue).join(delimiter)).join("\n");

const toHtmlTable = ({ headers, rows }) => `
  <table border="1">
    <thead>
      <tr>${headers.map(header => `<th>${cleanText(header)}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${rows
        .map(row => `<tr>${row.map(cell => `<td>${cleanText(cell)}</td>`).join("")}</tr>`)
        .join("")}
    </tbody>
  </table>
`;

const escapePdfText = value =>
  cleanText(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");

const pdfText = (text, x, y, size = 8, color = "0 0 0", font = "F1") =>
  `${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;

const pdfRect = (x, y, width, height, fillColor) =>
  `${fillColor} rg ${x} ${y} ${width} ${height} re f`;

const pdfLine = (x1, y1, x2, y2, color = "0.86 0.89 0.93") =>
  `${color} RG 0.5 w ${x1} ${y1} m ${x2} ${y2} l S`;

const getMaxCharsForWidth = (width, fontSize = 7) =>
  Math.max(4, Math.floor((width - 12) / (fontSize * 0.75)));

const wrapPdfText = (value, width, fontSize = 7) => {
  const maxChars = getMaxCharsForWidth(width, fontSize);
  const words = cleanText(value).split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach(word => {
    if (word.length > maxChars) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars));
      }
      return;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxChars) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines.length ? lines : [""];
};

const createSimplePdf = ({ headers, rows }, title) => {
  const pageWidth = 842;
  const pageHeight = 612;
  const margin = 28;
  const tableWidth = pageWidth - margin * 2;
  const minRowHeight = 28;
  const headerHeight = 34;
  const titleText = title || "Table Export";
  const titleY = 560;
  const tableTop = 530;
  const footerY = 22;
  const columnCount = Math.max(headers.length, 1);
  const firstColumnWidth = columnCount > 1 ? 42 : tableWidth;
  const columnWidth = columnCount > 1 ? (tableWidth - firstColumnWidth) / (columnCount - 1) : tableWidth;
  const getColumnWidth = index => (index === 0 ? firstColumnWidth : columnWidth);

  const preparedRows = (rows.length ? rows : [[]]).map(row => {
    const wrappedCells = headers.map((_, cellIndex) =>
      wrapPdfText(row[cellIndex] ?? "", getColumnWidth(cellIndex), 7)
    );
    const lineCount = Math.max(...wrappedCells.map(lines => lines.length), 1);

    return {
      wrappedCells,
      height: Math.max(minRowHeight, 14 + lineCount * 10),
    };
  });

  const pages = [];
  let currentPage = [];
  let remainingHeight = tableTop - headerHeight - 54;

  preparedRows.forEach(row => {
    if (currentPage.length && row.height > remainingHeight) {
      pages.push(currentPage);
      currentPage = [];
      remainingHeight = tableTop - headerHeight - 54;
    }

    currentPage.push(row);
    remainingHeight -= row.height;
  });

  if (currentPage.length || pages.length === 0) pages.push(currentPage);

  const objects = ["1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj"];
  const kids = pages.map((_, index) => `${4 + index * 2} 0 R`).join(" ");

  objects.push(`2 0 obj << /Type /Pages /Kids [${kids}] /Count ${pages.length} >> endobj`);
  objects.push("3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");

  pages.forEach((pageRows, index) => {
    const pageObjectId = 4 + index * 2;
    const contentObjectId = pageObjectId + 1;
    const commands = [
      pdfText(titleText, pageWidth / 2 - cleanText(titleText).length * 2.8, titleY, 14, "0 0 0"),
      pdfRect(margin, tableTop - headerHeight, tableWidth, headerHeight, "0.16 0.25 0.35"),
    ];
    let x = margin;

    headers.forEach((header, headerIndex) => {
      const width = getColumnWidth(headerIndex);
      wrapPdfText(header, width, 7)
        .slice(0, 2)
        .forEach((line, lineIndex) => {
          commands.push(pdfText(line, x + 4, tableTop - 15 - lineIndex * 10, 7, "1 1 1"));
        });
      commands.push(pdfLine(x, tableTop - headerHeight, x, tableTop, "1 1 1"));
      x += width;
    });
    commands.push(pdfLine(margin + tableWidth, tableTop - headerHeight, margin + tableWidth, tableTop, "1 1 1"));

    let cursorY = tableTop - headerHeight;

    pageRows.forEach((row, rowIndex) => {
      const y = cursorY - row.height;
      const fill = rowIndex % 2 === 0 ? "0.97 0.97 0.97" : "1 1 1";
      let cellX = margin;

      commands.push(pdfRect(margin, y, tableWidth, row.height, fill));
      commands.push(pdfLine(margin, y, margin + tableWidth, y));
      commands.push(pdfLine(margin, y + row.height, margin + tableWidth, y + row.height));

      row.wrappedCells.forEach((lines, cellIndex) => {
        const width = getColumnWidth(cellIndex);

        commands.push(pdfLine(cellX, y, cellX, y + row.height));
        lines.forEach((line, lineIndex) => {
          commands.push(pdfText(line, cellX + 4, y + row.height - 13 - lineIndex * 10, 7, "0 0 0"));
        });
        cellX += width;
      });
      commands.push(pdfLine(margin + tableWidth, y, margin + tableWidth, y + row.height));
      cursorY = y;
    });

    commands.push(pdfText(`Page ${index + 1} of ${pages.length}`, pageWidth - 90, footerY, 8, "0.35 0.35 0.35"));

    const streamLines = commands.join("\n");

    objects.push(
      `${pageObjectId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >> endobj`
    );
    objects.push(
      `${contentObjectId} 0 obj << /Length ${streamLines.length} >> stream\n${streamLines}\nendstream endobj`
    );
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach(object => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
};

export default function ExportDropdown({ data, columns, filename }) {
  const triggerRef = useRef(null);

  const getExportData = () => {
    const propRows = getRowsFromProps({ data, columns });
    const domRows = propRows || getRowsFromDom(triggerRef.current);

    if (!domRows || domRows.rows.length === 0) {
      toast.error("No table data available to export");
      return null;
    }

    return {
      ...domRows,
      filename: getSafeFileName(filename || domRows.title),
    };
  };

  const handleCopy = async () => {
    const exportData = getExportData();
    if (!exportData) return;

    await navigator.clipboard.writeText(toDelimitedText(exportData, "\t"));
    toast.success("Table copied");
  };

  const handleCsv = () => {
    const exportData = getExportData();
    if (!exportData) return;

    downloadBlob(toDelimitedText(exportData, ","), `${exportData.filename}.csv`, "text/csv;charset=utf-8");
  };

  const handleExcel = () => {
    const exportData = getExportData();
    if (!exportData) return;

    downloadBlob(
      toHtmlTable(exportData),
      `${exportData.filename}.xls`,
      "application/vnd.ms-excel;charset=utf-8"
    );
  };

  const handlePdf = () => {
    const exportData = getExportData();
    if (!exportData) return;

    downloadBlob(createSimplePdf(exportData, exportData.filename), `${exportData.filename}.pdf`, "application/pdf");
  };

  const handlePrint = () => {
    const exportData = getExportData();
    if (!exportData) return;

    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${exportData.filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #d7dde8; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f3f6fb; }
          </style>
        </head>
        <body>
          <h2>${exportData.filename}</h2>
          ${toHtmlTable(exportData)}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          ref={triggerRef}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-all hover:bg-muted"
        >
          Export
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="z-[999] w-48 rounded-2xl border border-border bg-white p-2 shadow-2xl"
      >
        <DropdownMenuItem onSelect={handleCopy} className="rounded-xl py-2.5 text-sm font-medium">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleCsv} className="rounded-xl py-2.5 text-sm font-medium">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleExcel} className="rounded-xl py-2.5 text-sm font-medium">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handlePdf} className="rounded-xl py-2.5 text-sm font-medium">
          <FileDown className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handlePrint} className="rounded-xl py-2.5 text-sm font-medium">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
