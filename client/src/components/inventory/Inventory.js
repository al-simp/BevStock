import React, { Fragment, useState, useEffect } from "react";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const getInventory = async () => {
    const response = await fetch("http://localhost:5000/inventory/", {
      method: "GET",
      headers: { token: localStorage.token },
    });
    const parseData = await response.json();
    setInventory(parseData);
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <Fragment>
      <main role="main">
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">Inventory</h1>
            <div></div>
          </div>
        </div>
        <div>
          <table className="table text-center">
            <thead>
              <tr>
                <th>Product</th>
                <th>Inventory</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>{item.sum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Fragment>
  );
};

export default Inventory;
