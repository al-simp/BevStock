import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// pdf generator for inventory PDFs. 
const PdfGenerator = ({ inventory }) => {
  // jspdf generator function
  const jsPdfGenerator = () => {
    //new document in jspdf

    var doc = new jsPDF("p", "pt");

    doc.autoTable({
      head: [["Product", "Size", "Category", "Quantity"]],
      body: inventory.map((item) => {
        return [
          item.product_name,
          item.product_size,
          item.product_category,
          item.sum,
        ];
      }),
    });

    doc.save("generated.pdf");
  };

  return (
    <button
      className="btn btn-success btn-sm float-right"
      onClick={jsPdfGenerator}
    >
      Generate PDF Report
    </button>
  );
};

export default PdfGenerator;
