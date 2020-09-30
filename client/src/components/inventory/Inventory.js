import React, { Fragment, useState, useEffect } from "react";
import InventoryBreakdown from "./InventoryBreakdown";
import _ from "lodash";
import PdfGenerator from "../PdfGenerator";

// Component to display inventory information from the latest stocktake.
const Inventory = (props) => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");

  //get theinventory ID from the params (will be set from the laststocktake var in local storage. )
  const id = props.match.params.id;

  //get the inventory records
  const getInventory = async () => {
    const response = await fetch(`/routes/inventory/records/${id}`, {
      method: "GET",
      headers: { token: localStorage.token },
    });
    const parseData = await response.json();
    setInventory(parseData);
  };

  //search filter to search for products individually
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
            <tr>
              <th>Product</th>
              <th>Inventory</th>
              <th>Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_name}</td>
                <td>{product.sum}</td>
                <td>
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
