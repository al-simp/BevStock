import React, { Fragment, useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import CountModal from "./CountModal";
import _ from "lodash";

const Count = (props) => {
  const [name, setName] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsChange, setProductsChange] = useState(false);

  // get the list id from the url params
  const id = props.match.params.id;

  //get stocktake id from the url params
  const stocktake = props.match.params.stocktakeid;

  console.log(stocktake);

  //get list name using list id
  const getName = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/stocklists/get/${id}`,
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

  //get products on list
  const getProducts = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/stocklists/list/${id}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();

      console.log(parseRes);
      setProducts(parseRes)

      console.log(products);
    } catch (err) {
      console.error(err.message);
    }
  };

  //delete a product from list
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/stocklists/deleteproduct/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.token },
      });
    } catch (err) {
      console.error(err.message);
    }

    setProductsChange(true);
  };

  useEffect(() => {
    getName(id);
    getProducts(id);
  }, [productsChange]);

  return (
    <Fragment>
      <main role="main">
        <div className="jumbotron">
          <h1 className="display-3">{name}</h1>
          <div>
            <Dropdown listId={id} setProductsChange={setProductsChange} />
          </div>
        </div>
        <table className="table mt-5 text-center">
          <thead>
            <tr>
              <th>Product</th>
              <th>Delete</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_stocklist_id}>
                <td>{product.product_name}</td>

                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <CountModal
                    product={product}
                    setProductsChange={setProductsChange}
                    stocktakeid={stocktake}
                  
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Fragment>
  );
};
export default Count;
