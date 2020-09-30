import React, { Fragment, useState, useEffect } from "react";
import InventoryBreakdown from "./InventoryBreakdown";
import _ from "lodash";
import PdfGenerator from "../PdfGenerator";

// Basiclly a repitition of the inventory component, but this takes in a specific stocktake instance as params, for stocktake records in the past
const Inventory = (props) => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");

  //get the stocktake ID from the params
  const id = props.match.params.id;

  // get the inventory records for the specified stocktake. 
  const getInventory = async () => {
    const response = await fetch(`/routes/inventory/records/${id}`, {
      method: "GET",
      headers: { token: localStorage.token },
    });
    const parseData = await response.json();
    setInventory(parseData);
  };

  //filter to allow user to search for a specific product. 
  const filteredInventory = inventory.filter((item) => {
    return item.product_name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    getInventory();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
        <h1>
          Inventory
          {!_.isEmpty(inventory) ? (
            <PdfGenerator inventory={inventory} />
          ) : null}
        </h1>
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
            <th>Product</th>
            <th>Inventory</th>
            <th>Breakdown</th>
          </thead>
          <tbody>
            {filteredInventory.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_name}</td>
                <td>{product.sum}</td>
                <td>
                  {" "}
                  <InventoryBreakdown
                    product_id={product.product_id}
                    id={id}
                    name={product.product_name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      );
    </Fragment>
  );
};

export default Inventory;
