import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// component to save new stock that has arrived on site. 
const ProcessDelivery = () => {
  //declare products as an empty array
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const stocktake = localStorage.getItem("laststocktake");

  // add the item to stock. 
  const addNewStock = async (event, product) => {
    event.preventDefault();
    const item = product.product_stocklist_id;
    const quantityInput = document.getElementById(product.product_stocklist_id);
    const tempQuantity = quantityInput.value;
    try {
      const body = { item, stocktake, tempQuantity };
      const response = await fetch("/stocktake/count", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await response.json();
      toast.success("Added Succesfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  //get the products that are under the new stock list
  const getProducts = async () => {
    try {
      const response = await fetch(
        `/stocktake/processdelivery/${localStorage.getItem("laststocktake")}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setProducts(parseRes);
    } catch (error) {}
  };

  // a filter to let the user search for a specific
  const filteredProducts = products.filter((item) => {
    return item.product_name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <h1>Process Delivery</h1>
      <div className="row">
        <div className="col-9">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-2"></div>
      </div>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.product_stocklist_id}>
              <td>{product.product_name}</td>
              <td>{product.product_size}</td>

              <td className="float-right">
                <form
                  onSubmit={(e) => {
                    addNewStock(e, product);
                  }}
                >
                  <input
                    id={`${product.product_stocklist_id}`}
                    type="number"
                    className="form"
                  ></input>
                  <button className="btn btn-success">Add</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default ProcessDelivery;
