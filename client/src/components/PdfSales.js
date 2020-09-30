import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Pdf component for sales pdf reports. 
const PdfSales = ({ sales, isAllTime }) => {
  // jspdf generator function
  const jsPdfGenerator = () => {
    //new document in jspdf

    var doc = new jsPDF("p", "pt");

    doc.autoTable({
      head: [["Product", "Sales (Units)"]],
      body: sales.map((item) => {
        return isAllTime ? [item.product_name, item.sum] : [item.product_name, item.sales];
      }),
    });

    doc.save("generated.pdf");
  };

  return (
      <button className="btn btn-secondary" onClick={jsPdfGenerator}>
        Generate PDF Report
      </button>
  );
};

export default PdfSales;
