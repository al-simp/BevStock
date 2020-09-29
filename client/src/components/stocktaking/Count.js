import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import CountModal from "./CountModal";
import QrCodeReader from "./QrScan";

const Count = (props) => {
  const [name, setName] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsChange, setProductsChange] = useState(false);
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
      const response = await fetch(
        `/routes/stocklists/get/${id}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
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
      const response = await fetch(
        `/stocktake/liststocktake`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );

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
  }, [quantityChange]);

  return !scanner ? (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <div className="jumbotron">
        <button
          className="btn btn-primary float-right"
          onClick={() => setScanner(true)}
        >
          QrScan
        </button>
        <h1 className="display-3">{name}</h1>
        <div>
          <Dropdown listId={id} setQuantityChange={setQuantityChange} />
        </div>
      </div>
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
                    setProductsChange={setProductsChange}
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
  ) : (
    <div>
      <QrCodeReader
        setProductsChange={setProductsChange}
        setQuantity={setQuantity}
      />
      <button
        className="btn btn-primary float-right"
        onClick={() => setScanner(false)}
      >
        QrScan
      </button>
    </div>
  );
};
export default Count;
