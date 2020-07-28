import React, { Fragment, useState, useEffect } from "react";
import Dropdown from "./Dropdown";

const ViewEdit = (props) => {
  const [name, setName] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsChange, setProductsChange] = useState(false);


  const id = props.match.params.id
  console.log(id);

  //get list name
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

      setProducts(parseRes);
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
    setProductsChange(false);
  }, [productsChange]);

  return (
    <Fragment>
      <main role="main">
          <div className="container">
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
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_stocklist_id}>
                <td>{product.product_name}</td>

                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProduct(product.product_stocklist_id)}
                  >
                    Delete
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Fragment>
  );
};
export default ViewEdit;
