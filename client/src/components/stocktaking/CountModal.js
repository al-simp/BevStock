import React, { Fragment, useState } from "react";
import Bottle from "../../images/beer-bottle.png";
import { useEffect } from "react";

//Modal that opens when counting a particular product. Preoduct is passed in as props
const CountModal = ({ product, setProductsChange, stocktakeid, setQuantity, setQuantityChange }) => {
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
      console.log(body);
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
    setProductsChange(true);
    setQuantityChange(true);
    
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
              <div className="row">
                <div className="col-sm">
                  <form>
                    <input
                      value={partial}
                      onChange={(e) => onChange(e)}
                      name="partial"
                      className="form-control mb-4"
                      type="number"
                      placeholder="0.00"
                      step="0.05"
                      min="0"
                      max="1.0"
                    ></input>
                  </form>
                </div>

                <div className="col-sm">
                  <button className="btn btn-info" onClick={addPartial}>
                    Add
                  </button>
                </div>
              </div>
              <h5>Add full</h5>
              <div className="row">
                <div className="col-sm">
                  <button className="btn btn-danger" onClick={minusOne}>
                    <h4>-</h4>
                  </button>
                </div>
                <div className="col-sm">
                  <img
                    src={Bottle}
                    alt="Bottle Image"
                    height="140"
                    width="140"
    
                />
                </div>
                <div className="col-sm">
                  <button className="btn btn-success" onClick={addOne}>
                    <h4>+</h4>
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">{tempQuantity}</div>
                <div className="col-sm"></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                data-dismiss="modal"
                onClick={(e) => setProductQuantity(product.product_stocklist_id)}
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
