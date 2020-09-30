import React, { useState, useEffect } from "react";
import MultiSelect from "react-multi-select-component";
import { toast } from "react-toastify";

// drop multiple select list with filter that is displayed when adding products to an existing stock list / area. 
const Dropdown = ({ listId, setQuantityChange, setProductsChange }) => {
  const [products, setProducts] = useState([]);
  const [stocktakeBoo, setStocktakeBoo] = useState(false);

  // get stocktake id from local storage, only relevant of a stocktake is progress.
  const stockId = Number(localStorage.getItem("stocktake"));

  // check if a stocktake is in progress. 
  const checkStocktake = () => {
    if (localStorage.getItem("stocktake") !== 0) {
      setStocktakeBoo(true);
    }
  };

  // get all the products from the DB
  const getProducts = async () => {
    try {
      const response = await fetch("/routes/products");
      const jsonData = await response.json();

      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // format products in a way that suits the dropdown add-on
  const options = products.map((product) => ({
    label: product.product_name,
    value: product.product_id,
  }));
  const [selected, setSelected] = useState([]);

  // special method to add items if we are in a stocktake, needs to be initialised as well, given a value of zero.
  const addItemStocktake = async (item) => {
    let productId = item.value;
    try {
      const body = { productId, listId, stockId };
      const response = await fetch("/routes/stocklists/addproductstocktake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json();
      setQuantityChange(true);
      toast.success("Products added succesfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  // method to add items if not in stocktake. 
  const addItem = async (item) => {
    let productId = item.value;
    try {
      const body = { productId, listId };
      const response = await fetch("/routes/stocklists/addproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json();

      toast.success("Products Added Successfully!");
      setProductsChange(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  // method to fire once add button is clicked, runs addItem for each selected product in dropdown. 
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (stocktakeBoo) {
      selected.forEach(addItemStocktake);
    } else {
      selected.forEach(addItem);
    }
  };

  useEffect(() => {
    checkStocktake();
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <form onSubmit={onSubmitForm}>
        <div className="row">
          <div className="col-8">
            <MultiSelect
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy={"Select"}
            />
          </div>
          <div className="col-4">
            <button className="btn btn-success">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Dropdown;
