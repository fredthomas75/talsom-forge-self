import type Anthropic from "@anthropic-ai/sdk";
import ExcelJS from "exceljs";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, Footer, PageNumber,
} from "docx";
import PptxGenJS from "pptxgenjs";

// ── Branding constants ──
const GREEN = "003533";
const YELLOW = "FDF100";
const LIGHT_GRAY = "F5F5F5";

/** Tenant branding context — passed from tool-chat handler */
export interface BrandContext {
  companyName?: string;
  industry?: string;
}

// ══════════════════════════════════════════════════════════
// Anthropic tool definitions for file generation
// ══════════════════════════════════════════════════════════

export const FILE_GENERATION_TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "generate_excel",
    description:
      "Generate an Excel (.xlsx) spreadsheet file with structured tabular data. " +
      "Use for: RACI matrices, backlogs, vendor assessments, scoring grids, " +
      "impact analysis matrices, project trackers, portfolio dashboards, " +
      "comparison tables, and any data that benefits from rows/columns format. " +
      "Always provide meaningful data — never leave sheets empty.",
    input_schema: {
      type: "object" as const,
      properties: {
        file_name: {
          type: "string",
          description: "File name without extension (e.g. 'RACI_Matrix', 'AI_Backlog')",
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
                items: { type: "array", items: {} },
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
  {
    name: "generate_word",
    description:
      "Generate a Word (.docx) document with structured narrative content. " +
      "Use for: governance frameworks, committee charters, change management plans, " +
      "training plans, business cases, privacy impact assessments (EFVP), " +
      "deployment guides, resistance management plans, process redesign documents, " +
      "and any deliverable requiring headings, paragraphs, bullet lists, and tables. " +
      "Always provide meaningful content — never leave sections empty.",
    input_schema: {
      type: "object" as const,
      properties: {
        file_name: {
          type: "string",
          description: "File name without extension (e.g. 'Governance_Framework', 'Change_Plan')",
        },
        sections: {
          type: "array",
          description: "Document sections in order",
          items: {
            type: "object",
            properties: {
              heading: {
                type: "string",
                description: "Section title",
              },
              level: {
                type: "number",
                description: "Heading level: 1 (main), 2 (sub), 3 (sub-sub). Default: 1",
              },
              content: {
                type: "array",
                description: "Content blocks within this section, in order",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["paragraph", "bullets", "table", "numbered_list"],
                      description: "Type of content block",
                    },
                    text: {
                      type: "string",
                      description: "Text content (for paragraph type)",
                    },
                    items: {
                      type: "array",
                      items: { type: "string" },
                      description: "List items (for bullets or numbered_list type)",
                    },
                    columns: {
                      type: "array",
                      items: { type: "string" },
                      description: "Column headers (for table type)",
                    },
                    rows: {
                      type: "array",
                      items: { type: "array", items: {} },
                      description: "Table data rows (for table type)",
                    },
                  },
                  required: ["type"],
                },
              },
            },
            required: ["heading", "content"],
          },
        },
      },
      required: ["file_name", "sections"],
    },
  },
  {
    name: "generate_pptx",
    description:
      "Generate a PowerPoint (.pptx) presentation with slides. " +
      "Use for: maturity assessments, operating model overviews, AI roadmaps, " +
      "talent roadmaps, strategic overviews, executive summaries, " +
      "status reports, and any deliverable that benefits from a visual slide format. " +
      "Always provide meaningful content — never leave slides empty.",
    input_schema: {
      type: "object" as const,
      properties: {
        file_name: {
          type: "string",
          description: "File name without extension (e.g. 'AI_Maturity_Assessment', 'Roadmap')",
        },
        slides: {
          type: "array",
          description: "Array of slides to create",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Slide title",
              },
              subtitle: {
                type: "string",
                description: "Subtitle text (mainly for title slide layout)",
              },
              layout: {
                type: "string",
                enum: ["title", "content", "two_column", "table"],
                description: "Slide layout type. Default: content",
              },
              bullets: {
                type: "array",
                items: { type: "string" },
                description: "Bullet points (for content layout)",
              },
              left_bullets: {
                type: "array",
                items: { type: "string" },
                description: "Left column bullets (for two_column layout)",
              },
              right_bullets: {
                type: "array",
                items: { type: "string" },
                description: "Right column bullets (for two_column layout)",
              },
              table: {
                type: "object",
                properties: {
                  columns: { type: "array", items: { type: "string" } },
                  rows: { type: "array", items: { type: "array", items: {} } },
                },
                description: "Table data (for table layout)",
              },
              notes: {
                type: "string",
                description: "Speaker notes for this slide",
              },
            },
            required: ["title"],
          },
        },
      },
      required: ["file_name", "slides"],
    },
  },
];

// ══════════════════════════════════════════════════════════
// Excel generation
// ══════════════════════════════════════════════════════════

interface SheetData {
  name: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
}

export interface GenerateExcelInput {
  file_name: string;
  sheets: SheetData[];
}

export async function generateExcel(input: GenerateExcelInput, brand?: BrandContext): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Talsom Forge";
  workbook.company = brand?.companyName ?? "";
  workbook.created = new Date();

  for (const sheet of input.sheets) {
    const safeName = sheet.name.replace(/[\\/*?:\[\]]/g, "").slice(0, 31) || "Sheet";
    const ws = workbook.addWorksheet(safeName);

    // Header row
    ws.addRow(sheet.columns);
    const headerRow = ws.getRow(1);
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${GREEN}` },
    };
    headerRow.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 28;

    // Data rows
    for (const row of sheet.rows) {
      ws.addRow(row);
    }

    // Auto-size columns
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

    // Freeze header row
    ws.views = [{ state: "frozen", ySplit: 1, xSplit: 0, activeCell: "A2" }];

    // Alternating row colors
    for (let r = 2; r <= sheet.rows.length + 1; r++) {
      if (r % 2 === 0) {
        ws.getRow(r).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${LIGHT_GRAY}` },
        };
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ══════════════════════════════════════════════════════════
// Word generation
// ══════════════════════════════════════════════════════════

interface ContentBlock {
  type: "paragraph" | "bullets" | "table" | "numbered_list";
  text?: string;
  items?: string[];
  columns?: string[];
  rows?: (string | number | boolean | null)[][];
}

interface SectionData {
  heading: string;
  level?: number;
  content: ContentBlock[];
}

export interface GenerateWordInput {
  file_name: string;
  sections: SectionData[];
}

function headingLevelFromNumber(n?: number): (typeof HeadingLevel)[keyof typeof HeadingLevel] {
  if (n === 2) return HeadingLevel.HEADING_2;
  if (n === 3) return HeadingLevel.HEADING_3;
  return HeadingLevel.HEADING_1;
}

function buildWordTable(columns: string[], rows: (string | number | boolean | null)[][]): Table {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: "CCCCCC",
  };
  const borders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

  // Header row
  const headerCells = columns.map(
    (col) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: col, bold: true, color: "FFFFFF", size: 20, font: "Calibri" })],
            alignment: AlignmentType.CENTER,
          }),
        ],
        shading: { type: ShadingType.SOLID, color: GREEN },
        borders,
        width: { size: Math.floor(9000 / columns.length), type: WidthType.DXA },
      })
  );

  // Data rows
  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: String(cell ?? ""), size: 20, font: "Calibri" })],
                }),
              ],
              shading: ri % 2 === 1 ? { type: ShadingType.SOLID, color: LIGHT_GRAY } : undefined,
              borders,
            })
        ),
      })
  );

  return new Table({
    rows: [new TableRow({ children: headerCells }), ...dataRows],
    width: { size: 9000, type: WidthType.DXA },
  });
}

export async function generateWord(input: GenerateWordInput, brand?: BrandContext): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];
  const companyLabel = brand?.companyName ?? "";

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: input.file_name.replace(/_/g, " "),
          bold: true,
          size: 48,
          color: GREEN,
          font: "Calibri",
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Company name (if available)
  if (companyLabel) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Préparé pour / Prepared for: ${companyLabel}`,
            size: 22,
            color: GREEN,
            font: "Calibri",
          }),
          ...(brand?.industry
            ? [new TextRun({ text: `  —  ${brand.industry}`, size: 20, color: "888888", font: "Calibri" })]
            : []),
        ],
        spacing: { after: 100 },
      })
    );
  }

  // Subtitle line
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Talsom Forge — ${new Date().toLocaleDateString("fr-CA")}`,
          size: 20,
          color: "888888",
          font: "Calibri",
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Sections
  for (const section of input.sections) {
    // Section heading
    children.push(
      new Paragraph({
        text: section.heading,
        heading: headingLevelFromNumber(section.level),
        spacing: { before: 300, after: 100 },
        style: undefined,
      })
    );

    // Content blocks
    for (const block of section.content) {
      switch (block.type) {
        case "paragraph":
          if (block.text) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: block.text, size: 22, font: "Calibri" })],
                spacing: { after: 120 },
              })
            );
          }
          break;

        case "bullets":
          if (block.items) {
            for (const item of block.items) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: item, size: 22, font: "Calibri" })],
                  bullet: { level: 0 },
                  spacing: { after: 60 },
                })
              );
            }
          }
          break;

        case "numbered_list":
          if (block.items) {
            for (let i = 0; i < block.items.length; i++) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: `${i + 1}. ${block.items[i]}`, size: 22, font: "Calibri" })],
                  spacing: { after: 60 },
                })
              );
            }
          }
          break;

        case "table":
          if (block.columns && block.rows) {
            children.push(buildWordTable(block.columns, block.rows));
            children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
          }
          break;
      }
    }
  }

  const footerLabel = companyLabel
    ? `Talsom Forge — ${companyLabel} — Confidentiel / Confidential  •  Page `
    : "Talsom Forge — Confidentiel / Confidential  •  Page ";

  const doc = new Document({
    creator: "Talsom Forge",
    title: input.file_name.replace(/_/g, " "),
    description: `Generated by Talsom Forge${companyLabel ? ` for ${companyLabel}` : ""}`,
    sections: [
      {
        children,
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: footerLabel, size: 16, color: "999999", font: "Calibri" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "999999", font: "Calibri" }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// ══════════════════════════════════════════════════════════
// PowerPoint generation
// ══════════════════════════════════════════════════════════

interface SlideTableData {
  columns: string[];
  rows: (string | number | boolean | null)[][];
}

interface SlideData {
  title: string;
  subtitle?: string;
  layout?: "title" | "content" | "two_column" | "table";
  bullets?: string[];
  left_bullets?: string[];
  right_bullets?: string[];
  table?: SlideTableData;
  notes?: string;
}

export interface GeneratePptxInput {
  file_name: string;
  slides: SlideData[];
}

export async function generatePptx(input: GeneratePptxInput, brand?: BrandContext): Promise<Buffer> {
  const pres = new PptxGenJS();
  pres.author = "Talsom Forge";
  pres.company = brand?.companyName ?? "";
  pres.title = input.file_name.replace(/_/g, " ");
  pres.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 inches

  const footerText = brand?.companyName
    ? `Talsom Forge — ${brand.companyName}`
    : "Talsom Forge";

  // Define master slide
  pres.defineSlideMaster({
    title: "TALSOM",
    background: { color: "FFFFFF" },
    objects: [
      // Top accent bar
      { rect: { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } } },
      // Footer bar
      { rect: { x: 0, y: 7.1, w: "100%", h: 0.4, fill: { color: GREEN } } },
      // Footer text
      {
        text: {
          text: footerText,
          options: { x: 0.5, y: 7.15, w: 6, h: 0.3, fontSize: 9, color: YELLOW, fontFace: "Calibri" },
        },
      },
      // Slide number
      {
        text: {
          text: "Slide ",
          options: { x: 11.5, y: 7.15, w: 1.5, h: 0.3, fontSize: 9, color: "FFFFFF", fontFace: "Calibri", align: "right" },
        },
      },
    ],
    slideNumber: { x: 12.6, y: 7.15, w: 0.5, h: 0.3, fontSize: 9, color: "FFFFFF", fontFace: "Calibri" },
  });

  for (const slideData of input.slides) {
    const slide = pres.addSlide({ masterName: "TALSOM" });
    const layout = slideData.layout ?? "content";

    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }

    if (layout === "title") {
      // Title slide
      slide.addText(slideData.title, {
        x: 1, y: 1.8, w: 11.33, h: 1.5,
        fontSize: 36, bold: true, color: GREEN,
        fontFace: "Calibri", align: "center", valign: "bottom",
      });
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 1, y: 3.6, w: 11.33, h: 0.8,
          fontSize: 18, color: "666666",
          fontFace: "Calibri", align: "center", valign: "top",
        });
      }
      // Company name + date
      const titleMeta = brand?.companyName
        ? `${brand.companyName}  •  ${new Date().toLocaleDateString("fr-CA")}`
        : new Date().toLocaleDateString("fr-CA");
      slide.addText(titleMeta, {
        x: 1, y: 4.8, w: 11.33, h: 0.5,
        fontSize: 14, color: "999999",
        fontFace: "Calibri", align: "center",
      });
    } else if (layout === "content") {
      // Title + bullets
      slide.addText(slideData.title, {
        x: 0.7, y: 0.3, w: 12, h: 0.8,
        fontSize: 24, bold: true, color: GREEN,
        fontFace: "Calibri", valign: "bottom",
      });
      // Accent line under title
      slide.addShape(pres.ShapeType.rect, {
        x: 0.7, y: 1.15, w: 2, h: 0.04, fill: { color: YELLOW },
      });
      if (slideData.bullets && slideData.bullets.length > 0) {
        const bulletObjs = slideData.bullets.map((b) => ({
          text: b,
          options: { fontSize: 14, color: "333333", fontFace: "Calibri" as const, bullet: { type: "bullet" as const }, paraSpaceAfter: 6 },
        }));
        slide.addText(bulletObjs, {
          x: 0.7, y: 1.4, w: 11.9, h: 5.4,
          valign: "top",
        });
      }
    } else if (layout === "two_column") {
      // Title + two columns
      slide.addText(slideData.title, {
        x: 0.7, y: 0.3, w: 12, h: 0.8,
        fontSize: 24, bold: true, color: GREEN,
        fontFace: "Calibri", valign: "bottom",
      });
      slide.addShape(pres.ShapeType.rect, {
        x: 0.7, y: 1.15, w: 2, h: 0.04, fill: { color: YELLOW },
      });

      // Left column
      if (slideData.left_bullets && slideData.left_bullets.length > 0) {
        const leftObjs = slideData.left_bullets.map((b) => ({
          text: b,
          options: { fontSize: 13, color: "333333", fontFace: "Calibri" as const, bullet: { type: "bullet" as const }, paraSpaceAfter: 6 },
        }));
        slide.addText(leftObjs, {
          x: 0.7, y: 1.4, w: 5.7, h: 5.4,
          valign: "top",
        });
      }

      // Right column
      if (slideData.right_bullets && slideData.right_bullets.length > 0) {
        const rightObjs = slideData.right_bullets.map((b) => ({
          text: b,
          options: { fontSize: 13, color: "333333", fontFace: "Calibri" as const, bullet: { type: "bullet" as const }, paraSpaceAfter: 6 },
        }));
        slide.addText(rightObjs, {
          x: 6.9, y: 1.4, w: 5.7, h: 5.4,
          valign: "top",
        });
      }

      // Vertical divider
      slide.addShape(pres.ShapeType.rect, {
        x: 6.6, y: 1.4, w: 0.02, h: 5.4, fill: { color: "DDDDDD" },
      });
    } else if (layout === "table" && slideData.table) {
      // Title + table
      slide.addText(slideData.title, {
        x: 0.7, y: 0.3, w: 12, h: 0.8,
        fontSize: 24, bold: true, color: GREEN,
        fontFace: "Calibri", valign: "bottom",
      });
      slide.addShape(pres.ShapeType.rect, {
        x: 0.7, y: 1.15, w: 2, h: 0.04, fill: { color: YELLOW },
      });

      const tableRows: PptxGenJS.TableRow[] = [];

      // Header row
      tableRows.push(
        slideData.table.columns.map((col) => ({
          text: col,
          options: {
            bold: true, fontSize: 11, color: "FFFFFF", fontFace: "Calibri",
            fill: { color: GREEN }, align: "center" as const, valign: "middle" as const,
          },
        }))
      );

      // Data rows
      for (let ri = 0; ri < slideData.table.rows.length; ri++) {
        tableRows.push(
          slideData.table.rows[ri].map((cell) => ({
            text: String(cell ?? ""),
            options: {
              fontSize: 10, color: "333333", fontFace: "Calibri",
              fill: { color: ri % 2 === 1 ? LIGHT_GRAY : "FFFFFF" },
              valign: "middle" as const,
            },
          }))
        );
      }

      slide.addTable(tableRows, {
        x: 0.7, y: 1.4, w: 11.9,
        border: { type: "solid", pt: 0.5, color: "CCCCCC" },
        colW: slideData.table.columns.map(() => 11.9 / slideData.table!.columns.length),
        rowH: slideData.table.rows.map(() => 0.4),
        autoPage: true,
        autoPageRepeatHeader: true,
      });
    }
  }

  const buffer = await pres.write({ outputType: "nodebuffer" });
  return Buffer.from(buffer as ArrayBuffer);
}
