import React, { PureComponent, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PdfGenerator = ({ inventory }) => {
  // jspdf generator function
  const jsPdfGenerator = () => {
    //new document in jspdf

    var doc = new jsPDF("p", "pt");

    doc.autoTable({
      head: [["Product","Size", "Category", "Quantity"]],
      body: inventory.map((item) => {
        return [item.product_name, item.product_size, item.product_category, item.sum];
      }),
    });

    doc.save("generated.pdf");
  };

  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <button className="btn btn-success" onClick={jsPdfGenerator}>
        Generate PDF Report
      </button>
    </main>
  );
};

export default PdfGenerator;
