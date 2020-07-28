import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ShowLists = ({ allLists, setListsChange, stocktake, stocktakeData }) => {
  console.log(stocktake);
  const [lists, setLists] = useState([]); //assigned to an empty array
  const [stocktakeInstance, setStocktakeInstance] = useState([]);

  //delete list function
  const deleteList = async (id) => {
    try {
      await fetch(`http://localhost:5000/stocklists/delete/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.token },
      });

      setLists(lists.filter((stocklist) => stocklist.stocklist_id !== id));
    } catch (err) {
      console.error(err.message);
    }

    setListsChange(true);
  };


  useEffect(() => {
    setStocktakeInstance(stocktakeData);
    setLists(allLists);
  }, [allLists, stocktakeData]);

  console.log(stocktakeData);
  

  return !stocktake  ?
    <table className="table text-center">
      <thead>
        <tr>
          <th>Stock Area</th>
          <th>Delete</th>
          <th>View/Edit Products</th>
        </tr>
      </thead>
      <tbody>
        {allLists.map((stocklist) => (
          <tr key={stocklist.stocklist_id}>
            <td>{stocklist.stocklist_name}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => deleteList(stocklist.stocklist_id)}
              >
                Delete
              </button>
            </td>
            <td>
              <Link
                to={`viewedit/${stocklist.stocklist_id}`}
                className="btn btn-primary"
              >
                View/Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
   : 
    <table className="table text-center">
      <thead>
        <tr>
          <th>Stock Area</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {allLists.map((stocklist) => (
          <tr key={stocklist.stocklist_id}>
            <td>{stocklist.stocklist_name}</td>
            <td>
              <Link
                to={`count/${stocklist.stocklist_id}/${stocktakeData}`}
                className="btn btn-primary"
              >
                Count
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  
};

export default ShowLists;
