import React, { useState, useEffect } from "react";
import MultiSelect from "react-multi-select-component";
import { toast } from "react-toastify";

const Dropdown = ({ listId, setQuantityChange }) => {
  const [products, setProducts] = useState([]);
  const [stocktakeBoo, setStocktakeBoo] = useState(false);

  const stockId = Number(localStorage.getItem("stocktake"));

  const checkStocktake = () => {
    if (stockId !== 0) {
      setStocktakeBoo(true);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch("https://localhost:5000/products");
      const jsonData = await response.json();

      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkStocktake();
    getProducts();
  }, );

  const options = products.map((product) => ({
    label: product.product_name,
    value: product.product_id,
  }));
  const [selected, setSelected] = useState([]);

  const addItemStocktake = async (item) => {
    let productId = item.value;
    try {
      const body = { productId, listId, stockId };
      const response = await fetch(
        "https://localhost:5000/stocklists/addproductstocktake",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      await response.json();
      setQuantityChange(true);
      toast.success("Products added succesfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  const addItem = async (item) => {
    let productId = item.value;
    try {
      const body = { productId, listId };
      const response = await fetch(
        "https://localhost:5000/stocklists/addproduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      await response.json();

      toast.success("Products Added Successfully!");
      setQuantityChange(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (stocktakeBoo) {
      selected.forEach(addItemStocktake);
    } else {
      selected.forEach(addItem);
    }
  };

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
