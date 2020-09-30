import React, { Fragment, useState } from "react";
import Bottle from "../../images/bottle.png";
import { useEffect } from "react";

//Modal that opens when counting a particular product. Preoduct is passed in as props
const CountModal = ({
  product,
  stocktakeid,
  setQuantity,
  setQuantityChange,
}) => {
  const [partial, setPartial] = useState(0);
  const [tempQuantity, setTempQuantity] = useState(0);
  const stocktake = Number(stocktakeid);

  //Onchange for partial bottle form field
  const onChange = (e) => {
    setPartial(Number(e.target.value));
  };

  //Adds partial quantity to temporary quantity
  const addPartial = () => {
    setTempQuantity(Number(tempQuantity + partial));
    setPartial(0);
  };

  //Adds one full bottle to temporary quantity
  const addOne = () => {
    setTempQuantity(Number(tempQuantity + 1));
  };

  //Subtracts one ful bottle from temporary quantity
  const minusOne = () => {
    setTempQuantity(Number(tempQuantity - 1));
  };

  // Should set product.quantity to the temp quantity value and zero out temp quantity after
  const setProductQuantity = async (item) => {
    try {
      const body = { item, stocktake, tempQuantity };

      const response = await fetch("/stocktake/count", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      setQuantity(parseRes.rows[0].quantity);
    } catch (error) {
      console.error(error.message);
    }
    setTempQuantity(0);
    window.location.reload(false);
  };

  useEffect(() => {}, [tempQuantity]);

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-info"
        data-toggle="modal"
        data-target={`#id${product.product_stocklist_id}`}
      >
        Count
      </button>

      <div className="modal" id={`id${product.product_stocklist_id}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{product.product_name}</h4>
            </div>
            <div className="modal-body"></div>
            <div className="container">
              <h5>Add partial</h5>
              <div className="form-group-row">
                <form>
                  <input
                    value={partial}
                    onChange={(e) => onChange(e)}
                    name="partial"
                    className="form-control"
                    type="number"
                    placeholder="0.00"
                    step="0.05"
                    min="0"
                    max="1.0"
                  ></input>
                </form>
                <button
                  className="btn btn-info form-control mb-4"
                  onClick={addPartial}
                >
                  Add
                </button>
              </div>
              <h5 className="mb-4">Add full</h5>
              <div className="row">
                <div className="col">
                  <button className="btn btn-danger mt-5" onClick={minusOne}>
                    <h4>-</h4>
                  </button>
                </div>
                <div className="col">
                  <img src={Bottle} alt="Bottle" height="210" width="80" />
                </div>
                <div className="col">
                  <button className="btn btn-success mt-5" onClick={addOne}>
                    <h4>+</h4>
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
                  <h3 className="mt-3">{tempQuantity}</h3>
                </div>
                <div className="col-sm"></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                data-dismiss="modal"
                onClick={(e) =>
                  setProductQuantity(product.product_stocklist_id)
                }
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CountModal;
