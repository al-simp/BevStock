import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import CountModal from "./CountModal";
import QrCodeReader from "./QrScan";

// component displayed within stocktaking mode when a list is selected, displays a list of products with the options to count.
const Count = (props) => {
  const [name, setName] = useState([]);
  const [products, setProducts] = useState([]);
  const [setQuantity] = useState(0);
  const [scanner, setScanner] = useState(false);
  const [quantityChange, setQuantityChange] = useState(false);

  // get the list id from the url params
  const id = props.match.params.id;

  //get stocktake id from the url params
  const stocktake = props.match.params.stocktakeid;

  //get list name using list id
  const getName = async (id) => {
    try {
      const response = await fetch(`/routes/stocklists/get/${id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();

      // API call returns an array of length 1,so get 1st value
      setName(parseRes.rows[0].stocklist_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  //get products on list and for stocktake
  const getCountProducts = async (id, stocktake) => {
    try {
      const body = { id, stocktake };
      const response = await fetch(`/stocktake/liststocktake`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      setProducts(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getName(id);
    getCountProducts(id, stocktake);
    setQuantityChange(false);
  }, [quantityChange, stocktake, id]);

  return (
    <main
      role="main"
      className={
        localStorage.getItem("role") === "Admin"
          ? "col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"
          : null
      }
    >
      <div className="jumbotron">
        <h1 className="display-3">{name}</h1>
        <div>
          <button
            className="btn btn-primary float-right"
            onClick={() => (scanner ? setScanner(false) : setScanner(true))}
          >
            QrScan
          </button>
          <Dropdown listId={id} setQuantityChange={setQuantityChange} />
        </div>
      </div>
      <div className="d-flex justify-content-center"></div>
      {localStorage.getItem("role") === "User" && scanner === true ? (
        <QrCodeReader />
      ) : null}

      <div>
        <table className="table text-center">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_stocklist_id}>
                <td>{product.product_name}</td>
                <td>{product.quantity}</td>
                <td>
                  <CountModal
                    product={product}
                    stocktakeid={stocktake}
                    setQuantity={setQuantity}
                    setQuantityChange={setQuantityChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default Count;
