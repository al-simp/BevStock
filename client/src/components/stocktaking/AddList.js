import React, { Fragment, useState } from "react";

// component for creating a new stocklist/stock area
const AddList = ({ setListsChange }) => {
    const [stocklist_name, setStocklistName] = useState("");
  
    // fire API call on form submission to add new record to DB
    const onSubmitForm = async e => {
      e.preventDefault();
      try {
        const myHeaders = new Headers();
  
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);
  
        const body = { stocklist_name };
        const response = await fetch("/routes/stocklists/add", {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(body)
        });
  
        await response.json();
      
        setListsChange(true);
        setStocklistName("");
      } catch (err) {
        console.error(err.message);
      }
    };
    return (
      <Fragment>       
       <form className="d-flex" onSubmit={onSubmitForm}>
          <input
            type="text"
            placeholder="add new stock area"
            className="form-control"
            value={stocklist_name}
            onChange={e => setStocklistName(e.target.value)}
          />
          <button className="btn btn-success ">Add</button>
        </form>
        </Fragment>

    );
  };
  
  export default AddList;
  