import React from "react";

const Product = (props) => {

  //render the product name
  return (
      <td data-testid="product" className="table-light">{props.name}</td>
  );
};

export default Product;
