import React, { Fragment, useState } from "react";

const EditQuantity = ({ product }) => {
  const [quantity, setQuantity] = useState(product.quantity);

  // update quantity function

  const updateQuantity = async (e) => {
    e.preventDefault();
    try {
      const body = { quantity };
      await fetch(`/products/${product.product_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target={`#id${product.product_id}`}
      >
        Update Quantity
      </button>

      <div class="modal" id={`id${product.product_id}`}>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Update Quantity</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                onClick={() => setQuantity(product.quantity)}
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                max="100"
              ></input>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={(e) => updateQuantity(e)}
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                onClick={() => setQuantity(product.quantity)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditQuantity;
