import React, { Fragment, useState, useEffect } from "react";
import InventoryBreakdown from "./InventoryBreakdown";
import _ from "lodash";
import PdfGenerator from "../PdfGenerator";

const Inventory = (props) => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");

  //get the latest inventory ID from the params
  const id = props.match.params.id;

  const getInventory = async () => {
    const response = await fetch(
      `/routes/inventory/stocktake/${id}`,
      {
        method: "GET",
        headers: { token: localStorage.token },
      }
    );
    const parseData = await response.json();
    setInventory(parseData);
  };

  const filteredInventory = inventory.filter((item) => {
    return item.product_name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <Fragment>
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">Stocktake : {id}</h1>
            <div>
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <table className="table text-center">
            <thead>
              <tr>
                <th>Product</th>
                <th>Inventory</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>{item.sum}</td>
                  <td>
                    <InventoryBreakdown
                      product_id={item.product_id}
                      id={id}
                      name={item.product_name}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {console.log(inventory)}
        {!_.isEmpty(inventory) ? <PdfGenerator inventory={inventory} /> : null}
      </main>
    </Fragment>
  );
};

export default Inventory;
