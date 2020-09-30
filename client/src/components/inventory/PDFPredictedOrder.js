import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

//component placed within preidcted order modal, will create a PDF report
const PDFPredictedOrder = ({ levels }) => {
  // jspdf generator function
  const jsPdfGenerator = () => {
    //new document in jspdf

    var doc = new jsPDF("p", "pt");

    doc.autoTable({
      head: [["Product", "Size", "Category", "Quantity"]],
      body: levels.map((item) => {
        return [item.name, item.size, item.category, item.quantity];
      }),
    });

    doc.save("generated.pdf");
  };

  return (
    <button className="btn btn-info" onClick={jsPdfGenerator}>
      Generate PDF Report
    </button>
  );
};

export default PDFPredictedOrder;
