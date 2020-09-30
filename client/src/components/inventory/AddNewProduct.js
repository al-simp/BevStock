import React, { Fragment } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

//component to add new product to the products database
const AddNewProduct = ({ setProductsChange }) => {
  const [inputs, setInputs] = useState({
    name: "",
    size: "",
    par: "",
  });

  const { name, size, par } = inputs;
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //Method to fire once the form has been submitted
  const onSubmitForm = async (e) => {
    //find the modal and assign to a Javascript const
    const modal = document.getElementById("product-modal");
    e.preventDefault();

    //close the modal
    modal.setAttribute("style", "display: none");
    const modalBackdrops = document.getElementsByClassName("modal-backdrop");
    document.body.removeChild(modalBackdrops[0]);

    //get the value of category select input.
    const productCategory = document.getElementById("category");
    const category = productCategory.value;

    try {
      //fill the request body with the new details
      const body = { name, size, par, category };

      //make a post request through the /products/ server route
      const response = await fetch("/routes/products/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      //wait for the response from the server-side
      await response.json();

      //notifictation displayed
      toast.success("Registered Successfully!");

      setInputs({
        name: "",
        size: "",
        par: "",
      });

      //set products change in order to fire useEffect hook
      setProductsChange(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-primary btn-sm float-right"
        data-toggle="modal"
        data-target="#product-modal"
      >
        Add New Product
      </button>

      <div id="product-modal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add a new Product</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmitForm}>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  className="form-control my-3"
                  value={name}
                  onChange={(e) => onChange(e)}
                />
                <input
                  type="number"
                  name="size"
                  placeholder="Product Size"
                  className="form-control my-3"
                  value={size}
                  onChange={(e) => onChange(e)}
                />
                <input
                  type="number"
                  name="par"
                  placeholder="Par Level"
                  className="form-control my-3"
                  value={par}
                  onChange={(e) => onChange(e)}
                />
                <select className="form-control my-3" id="category">
                  <option value="Vodka">Vodka</option>
                  <option value="Rum">Rum</option>
                  <option value="Liqueur">Liqueur</option>
                  <option value="Tequila">Tequila</option>
                  <option value="Whiskey">Whiskey</option>
                  <option value="Beer">Beer</option>
                  <option value="Beer">Gin</option>
                </select>
                <button className="btn btn-success btn-block">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddNewProduct;
