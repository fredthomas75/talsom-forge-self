import type Anthropic from "@anthropic-ai/sdk";
import ExcelJS from "exceljs";

// ── Anthropic tool definition for file generation ──

export const FILE_GENERATION_TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "generate_excel",
    description:
      "Generate an Excel (.xlsx) spreadsheet file with structured data. " +
      "Use this tool when the user asks for a deliverable, assessment, matrix, " +
      "roadmap, plan, scoring grid, RACI, backlog, or any structured output " +
      "that would benefit from being in spreadsheet format. " +
      "Always provide meaningful data — never leave sheets empty.",
    input_schema: {
      type: "object" as const,
      properties: {
        file_name: {
          type: "string",
          description: "File name without extension (e.g. 'RACI_Matrix', 'Copilot_Deployment_Plan')",
        },
        sheets: {
          type: "array",
          description: "Array of worksheet tabs to create",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Sheet/tab name (max 31 chars)",
              },
              columns: {
                type: "array",
                items: { type: "string" },
                description: "Column header labels",
              },
              rows: {
                type: "array",
                items: {
                  type: "array",
                  items: {},
                },
                description: "Data rows — each row is an array of cell values matching the columns order",
              },
            },
            required: ["name", "columns", "rows"],
          },
        },
      },
      required: ["file_name", "sheets"],
    },
  },
];

// ── Excel generation logic ──

interface SheetData {
  name: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
}

interface GenerateExcelInput {
  file_name: string;
  sheets: SheetData[];
}

export async function generateExcel(input: GenerateExcelInput): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Talsom Forge";
  workbook.created = new Date();

  for (const sheet of input.sheets) {
    // Sanitize sheet name (max 31 chars, no special chars)
    const safeName = sheet.name.replace(/[\\/*?:\[\]]/g, "").slice(0, 31) || "Sheet";
    const ws = workbook.addWorksheet(safeName);

    // ── Header row ──
    ws.addRow(sheet.columns);
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF003533" }, // C.green
    };
    headerRow.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 28;

    // ── Data rows ──
    for (const row of sheet.rows) {
      ws.addRow(row);
    }

    // ── Auto-size columns (approximate) ──
    for (let i = 0; i < sheet.columns.length; i++) {
      const col = ws.getColumn(i + 1);
      let maxLen = sheet.columns[i].length;
      for (const row of sheet.rows) {
        const val = row[i];
        if (val != null) {
          const len = String(val).length;
          if (len > maxLen) maxLen = len;
        }
      }
      col.width = Math.min(Math.max(maxLen + 4, 12), 60);
    }

    // ── Freeze header row ──
    ws.views = [{ state: "frozen", ySplit: 1, xSplit: 0, activeCell: "A2" }];

    // ── Alternating row colors ──
    for (let r = 2; r <= sheet.rows.length + 1; r++) {
      if (r % 2 === 0) {
        const row = ws.getRow(r);
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F5F5" },
        };
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
