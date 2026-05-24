import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { AiReport, Lead } from "@prisma/client";

export async function buildReportPdf(lead: Lead, report: AiReport): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595, 842]);
  let y = 800;
  const margin = 50;
  const lineHeight = 16;
  const maxWidth = 495;

  const addText = (text: string, size = 11, isBold = false) => {
    const words = text.split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      const width = (isBold ? bold : font).widthOfTextAtSize(test, size);
      if (width > maxWidth && line) {
        if (y < 60) {
          page = doc.addPage([595, 842]);
          y = 800;
        }
        page.drawText(line, { x: margin, y, size, font: isBold ? bold : font, color: rgb(0.1, 0.1, 0.15) });
        y -= lineHeight;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      if (y < 60) {
        page = doc.addPage([595, 842]);
        y = 800;
      }
      page.drawText(line, { x: margin, y, size, font: isBold ? bold : font, color: rgb(0.1, 0.1, 0.15) });
      y -= lineHeight;
    }
  };

  addText("Финансовая диагностика Алексея Шаргатова", 18, true);
  y -= 8;
  addText(`${lead.fullName} · ${new Date(report.generatedAt).toLocaleDateString("ru-RU")}`, 10);
  y -= 12;

  addText("Резюме", 14, true);
  addText(report.summary);
  y -= 8;

  const sections: [string, string[]][] = [
    ["Сильные стороны", report.strengths],
    ["Зоны роста", report.growthZones],
    ["Риски", report.risks],
    ["Быстрые шаги на неделю", report.quickWins],
  ];

  for (const [title, items] of sections) {
    addText(title, 13, true);
    for (const item of items) addText(`• ${item}`);
    y -= 8;
  }

  addText("Приоритетный фокус", 13, true);
  addText(report.priorityFocus);
  y -= 8;
  addText("Рекомендация", 13, true);
  addText(report.consultationRecommendation);

  return doc.save();
}
