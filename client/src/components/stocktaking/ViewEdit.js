import React, { Fragment, useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import Product from "./Product";
import "../../../src/App.css";
import { toast } from "react-toastify";

// component that allows user to edit sotcklists/ stock areas. 
const ViewEdit = (props) => {
  const [name, setName] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsChange, setProductsChange] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [stocktake, setStocktake] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const [dragMode, setDragMode] = useState(false);

  //if stock ID exists, set stocktake to true.
  const checkStocktake = () => {
    if (localStorage.getItem("stocktake") !== null) {
      setStocktake(true);
    }
  };

  //handle drag start
  const handleDragStart = (e, params) => {
    // set current item being dragged
    dragItem.current = params;
    dragNode.current = e.target;
    //Initialise drag end listener
    dragNode.current.addEventListener("dragend", handleDragEnd);
    // Intialise drag enter listener
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, params) => {
    //check that index of current item is not the same as target location.
    if (dragItem.current !== params.productI) {
      // use setProducts hook to set state to newly arranged array.
      setProducts((oldProducts) => {
        let newList = JSON.parse(JSON.stringify(oldProducts));
        newList.splice(
          params.productI,
          0,
          newList.splice(dragItem.current.productI, 1)[0]
        );
        dragItem.current = params;
        return newList;
      });
    }
  };

  //the handle drag end listener.
  const handleDragEnd = () => {
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  //set the positions in the DB
  const setPosition = async (id, productI) => {
    try {
      const body = { id, productI };
      const response = await fetch(`/routes/stocklists/savepositions`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json;
    } catch (error) {
      console.error(error.message);
    }
  };

  //set the positions of each element in the database under index column
  const setPositions = async () => {
    if (dragMode) {
      products.map((product, productI) => {
        setPosition(product.product_stocklist_id, productI);
        return null;
      });
      setDragMode(false);
      toast.success("Positions updated");
    } else {
      setDragMode(true);
    }
  };

  // get styles fir when item is being drageed. 
  const getStyles = (params) => {
    const currentItem = dragItem.current;
    if (currentItem.productI === params) {
      return "current dnd-item";
    }
    return "dnd-item";
  };

  //get list name
  const getName = async (id) => {
    try {
      const response = await fetch(`/routes/stocklists/get/${id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setName(parseRes.rows[0].stocklist_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  //get products on list
  const getProducts = async (id) => {
    try {
      const response = await fetch(`/routes/stocklists/list/${id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setProducts(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  //delete a product from list
  const deleteProduct = async (id) => {
    try {
      await fetch(`/routes/stocklists/deleteproduct/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.token },
      });
    } catch (err) {
      console.error(err.message);
    }

    setProductsChange(true);
  };

  useEffect(() => {
    checkStocktake();
    getName(props.match.params.id);
    getProducts(props.match.params.id);
    setProductsChange(false);
  }, [productsChange, props.match.params.id]);

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div className="jumbotron">
              <div className="container">
                <h1 className="display-3">{name}</h1>
                {!stocktake ? (
                  <Fragment>
                    <button
                      className="btn btn-primary float-right"
                      onClick={setPositions}
                    >
                      {dragMode ? "Save Positions" : "Change List Order"}
                    </button>
                    <div>
                      <Dropdown
                        listId={props.match.params.id}
                        setProductsChange={setProductsChange}
                      />
                    </div>
                  </Fragment>
                ) : (
                  <h6>
                    Cannot edit stock areas when a stocktake is in progress
                  </h6>
                )}
              </div>
            </div>
            {!stocktake ? (
              <table className="table mt-5 text-center">
                <thead>
                  <tr>
                    <th>Product</th>
                    {dragMode ? null : <th>Delete</th>}
                  </tr>
                </thead>
                {dragMode ? (
                  <tbody>
                    {products.map((product, productI) => (
                      <tr
                        draggable
                        onDragStart={(e) => {
                          handleDragStart(e, { productI });
                        }}
                        onDragEnter={
                          dragging
                            ? (e) => {
                                handleDragEnter(e, { productI });
                              }
                            : null
                        }
                        key={product.product_stocklist_id}
                        className={dragging ? getStyles(productI) : "dnd-item"}
                      >
                        <Product
                          key={product.product_stocklist_id}
                          name={product.product_name}
                          id={product.product_stocklist_id}
                        />
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.product_stocklist_id}>
                        <td>{product.product_name}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) =>
                              deleteProduct(product.product_stocklist_id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            ) : null}
          </main>
        </div>
      </div>
    </Fragment>
  );
};

export default ViewEdit;
