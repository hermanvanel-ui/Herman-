import type { QuoteExample } from "@/types";
import { TVA_RATE } from "@/content/site";
import { formatEuro } from "@/lib/utils";

export async function generateQuotePdf(quote: QuoteExample): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const marginX = 48;
  let cursorY = 64;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(10, 10, 11);
  doc.text("a.SYNC", marginX, cursorY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Agence digitale — Nice (06)", marginX, cursorY + 16);
  doc.text("asyncagency@gmail.com — 06 61 21 91 68", marginX, cursorY + 30);

  doc.setFontSize(10);
  doc.setTextColor(10, 10, 11);
  doc.text(`Devis ${quote.reference}`, 400, cursorY);
  doc.text(`Date : ${quote.date}`, 400, cursorY + 16);
  doc.text(`Client : ${quote.clientLabel}`, 400, cursorY + 32);

  cursorY += 70;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, cursorY, 547, cursorY);

  cursorY += 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Désignation", marginX, cursorY);
  doc.text("Qté", 380, cursorY);
  doc.text("PU HT", 430, cursorY);
  doc.text("Total HT", 500, cursorY);

  cursorY += 10;
  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, cursorY, 547, cursorY);

  doc.setFont("helvetica", "normal");
  let subtotal = 0;

  for (const line of quote.lines) {
    cursorY += 26;
    const lineTotal = line.qty * line.unitPrice;
    subtotal += lineTotal;

    const wrapped = doc.splitTextToSize(line.label, 310);
    doc.text(wrapped, marginX, cursorY);
    doc.text(String(line.qty), 380, cursorY);
    doc.text(formatEuro(line.unitPrice), 430, cursorY);
    doc.text(formatEuro(lineTotal), 500, cursorY);

    if (wrapped.length > 1) {
      cursorY += (wrapped.length - 1) * 12;
    }
  }

  const tva = subtotal * TVA_RATE;
  const total = subtotal + tva;

  cursorY += 24;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, cursorY, 547, cursorY);

  cursorY += 24;
  doc.text("Sous-total HT", 430, cursorY);
  doc.text(formatEuro(subtotal), 500, cursorY);

  cursorY += 18;
  doc.text(`TVA (${Math.round(TVA_RATE * 100)}%)`, 430, cursorY);
  doc.text(formatEuro(tva), 500, cursorY);

  cursorY += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total TTC", 430, cursorY);
  doc.text(formatEuro(total), 500, cursorY);

  cursorY += 60;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Devis type à visée illustrative — un devis personnalisé vous sera adressé après échange avec notre équipe.",
    marginX,
    cursorY,
    { maxWidth: 500 }
  );

  doc.save(`asyncagency-devis-${quote.id}.pdf`);
}
