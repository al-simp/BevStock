import React, { Fragment, useState } from "react";

const AddList = ({ setListsChange }) => {
    const [stocklist_name, setStocklistName] = useState("");
  
    const onSubmitForm = async e => {
      e.preventDefault();
      try {
        const myHeaders = new Headers();
  
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);
  
        const body = { stocklist_name };
        const response = await fetch("/stocklists/add", {
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
  