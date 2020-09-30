import React from "react";

// component is necessary for drag and drop functionality, a component that renders a table row for a product.
const Product = (props) => {
  //render the product name
  return (
    <td data-testid="product" className="table-light">
      {props.name}
    </td>
  );
};

export default Product;
