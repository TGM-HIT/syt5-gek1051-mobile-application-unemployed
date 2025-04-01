import { List } from "@/types/shoppinglist";
import { jsPDF } from "jspdf";

// Function to retrieve page width dynamically
function getPageWidth(doc: jsPDF): number {
    return doc.internal.pageSize.width;
}

// Function to generate PDF with improved formatting
export function generatePdf(list: List) {
    const doc = new jsPDF();
    const margin = 10;
    let y = margin * 1.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFillColor(240, 240, 240);
    const pageWidth = getPageWidth(doc);
    doc.text(list.name, margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(list.description, margin, y);
    y += 8;
    if (list.address) {
        const streetText = list.address.street || 'No street';
        doc.setFontSize(10);
        doc.text(streetText, margin, y);
        y += 6
        const countryText = `${list.address.country || 'No country'}, ${list.address.city || 'No city'} ${list.address.postcode || 'No postcode'}`;
        doc.setFontSize(10);
        doc.text(countryText, margin, y);
        y += 20;
    }

    doc.setFontSize(14);
    doc.text("Items", margin, y);
    y += 10;

    const items = Object.values(list.entries)

    items.forEach((item) => {
        const itemHeader = `${item.name || 'No name'} (${item.category || 'No category'}) - ${item.amount || '?'} pcs`;
        const itemDescription = item.description || 'No description';
        const itemEditor = item.editor || 'No editor';
        const itemStatus = item.checked ? 'Done' : 'Pending';

        doc.setFontSize(12);
        doc.text(itemHeader, margin, y);
        y += 8;

        const descriptionLines = doc.splitTextToSize(itemDescription, pageWidth - 30);
        doc.text(descriptionLines, margin, y);
        y += descriptionLines.length * 6;
        y += 2;
        doc.text(itemEditor, margin, y)
        y += 8

        doc.text(`Status: ${itemStatus}`, margin, y); // Status text
        y += 15

        if (y > 270) {
            doc.addPage();
            y = margin;
        }
    });

    doc.save(`${list.name}.pdf`);
}

