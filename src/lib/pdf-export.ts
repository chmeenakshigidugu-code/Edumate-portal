export type PdfSubject = {
  name: string;
  maxMarks: number;
  obtained: number;
};

export type PdfStudent = {
  roll: string;
  name: string;
  section: string;
  subjects: PdfSubject[];
  total: number;
  maxTotal: number;
};

export type PdfExportData = {
  institutionName: string;
  institutionType: "School" | "College";
  details: { label: string; value: string }[];
  students: PdfStudent[];
};

const DEEP: [number, number, number] = [30, 27, 75];
const INDIGO: [number, number, number] = [79, 70, 229];
const LIGHT: [number, number, number] = [224, 231, 255];
const MUTED: [number, number, number] = [100, 100, 120];

export async function exportSummaryPdf(data: PdfExportData) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableMod.default;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header band
  doc.setFillColor(...DEEP);
  doc.rect(0, 0, pageWidth, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Academic Record Report", margin, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...LIGHT);
  doc.text(
    `${data.institutionType}: ${data.institutionName || "—"}`,
    margin,
    62,
  );
  const generated = new Date().toLocaleString();
  doc.setFontSize(9);
  doc.text(`Generated: ${generated}`, margin, 78);

  let cursorY = 122;

  // Institution details
  doc.setTextColor(...DEEP);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Institution Details", margin, cursorY);
  cursorY += 10;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: "grid",
    body: data.details.map((d) => [d.label, d.value || "—"]),
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 150, fontStyle: "bold", textColor: DEEP, fillColor: [245, 246, 255] },
      1: { textColor: [40, 40, 55] },
    },
  });

  cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 30;

  // Students table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...DEEP);
  doc.text("Student Records", margin, cursorY);
  cursorY += 10;

  // Collect subject columns in order of first appearance across students
  const subjectNames: string[] = [];
  for (const s of data.students) {
    for (const sub of s.subjects) {
      if (!subjectNames.includes(sub.name)) subjectNames.push(sub.name);
    }
  }

  const head = [
    [
      "#",
      "Roll No",
      "Name",
      "Section",
      ...subjectNames,
      "Total",
      "Max",
      "%",
    ],
  ];

  const body = data.students.map((s, i) => {
    const pct = s.maxTotal > 0 ? (s.total / s.maxTotal) * 100 : 0;
    return [
      String(i + 1),
      s.roll || "—",
      s.name || "—",
      s.section || "—",
      ...subjectNames.map((name) => {
        const sub = s.subjects.find((x) => x.name === name);
        return sub ? `${sub.obtained.toFixed(2)} / ${sub.maxMarks.toFixed(0)}` : "—";
      }),
      s.total.toFixed(2),
      s.maxTotal.toFixed(0),
      `${pct.toFixed(1)}%`,
    ];
  });

  const grandTotal = data.students.reduce((acc, s) => acc + s.total, 0);
  const grandMax = data.students.reduce((acc, s) => acc + s.maxTotal, 0);
  const average = data.students.length ? grandTotal / data.students.length : 0;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head,
    body,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: INDIGO, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [247, 248, 255] },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" },
      [4 + subjectNames.length]: {
        fontStyle: "bold",
        halign: "right",
        textColor: INDIGO,
      },
    },
  });

  cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: "plain",
    body: [
      ["Total students", String(data.students.length)],
      ["Grand total marks", `${grandTotal.toFixed(2)} / ${grandMax.toFixed(0)}`],
      ["Average per student", average.toFixed(2)],
    ],
    styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 150, fontStyle: "bold", textColor: DEEP },
      1: { textColor: INDIGO, fontStyle: "bold" },
    },
  });

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...LIGHT);
    doc.line(margin, h - 42, pageWidth - margin, h - 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("Academic Record Portal", margin, h - 28);
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - margin, h - 28, {
      align: "right",
    });
  }

  const slug = (data.institutionName || "academic-record")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  doc.save(`${slug || "academic-record"}-report.pdf`);
}
