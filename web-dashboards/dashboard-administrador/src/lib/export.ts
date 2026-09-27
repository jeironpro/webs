// Exportación de datos sin dependencias externas.
// - CSV: texto plano compatible con Excel/Sheets.
// - Excel: formato SpreadsheetML 2003 (.xls) que Excel abre de forma nativa.

export type Cell = string | number;

function escapeCsv(cell: Cell): string {
    const text = String(cell ?? "");
    if (/[",\n;]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Construye el contenido CSV de una tabla (primera fila = cabecera).
function toCsv(headers: string[], rows: Cell[][]): string {
    const lines = [headers, ...rows].map((row) => row.map(escapeCsv).join(","));
    // BOM para que Excel detecte UTF-8 correctamente.
    return `\uFEFF${lines.join("\n")}`;
}

// Construye un documento SpreadsheetML (.xls) a partir de una tabla.
function toExcelXml(sheetName: string, headers: string[], rows: Cell[][]): string {
    const headerRow = headers
        .map(
            (header) => `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`,
        )
        .join("");
    const bodyRows = rows
        .map(
            (row) =>
                `<Row>${row
                    .map(
                        (cell) =>
                            `<Cell><Data ss:Type="String">${escapeXml(String(cell ?? ""))}</Data></Cell>`,
                    )
                    .join("")}</Row>`,
        )
        .join("");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="${escapeXml(sheetName)}"><Table>${headerRow ? `<Row>${headerRow}</Row>` : ""}${bodyRows}</Table></Worksheet></Workbook>`;
}

function download(filename: string, content: string, mime: string): void {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, headers: string[], rows: Cell[][]): void {
    download(filename, toCsv(headers, rows), "text/csv;charset=utf-8;");
}

export function downloadExcel(
    filename: string,
    sheetName: string,
    headers: string[],
    rows: Cell[][],
): void {
    download(filename, toExcelXml(sheetName, headers, rows), "application/vnd.ms-excel");
}
