import React from "react";
import { useEffect, useState } from "react";
import AddNewProduct from "./AddNewProduct";

const ProductsDb = () => {
  //declare products as an empty array
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  //boolean to indicate whether there has been a change in the products array
  const [productsChange, setProductsChange] = useState(false);

  //get the products and populate products array.
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      //use set
      setProducts(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredProducts = products.filter((item) => {
    return item.product_name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    getProducts();
  }, [productsChange]);

  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <h1>Products</h1>
      <div className="row">
        <div className="col-9">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-2">
          <AddNewProduct setProductsChange={setProductsChange} />
        </div>
      </div>
      <table className="table table-striped table-sm">
        <thead>
          <th>Product</th>
          <th>Size</th>
          <th>Category</th>
          <th>Par Level</th>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_name}</td>
              <td>{product.product_size}</td>
              <td>{product.product_category}</td>
              <td>{product.par_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default ProductsDb;
