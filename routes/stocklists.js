const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation");

//Routes

//get all stocklists
router.get("/", authorisation, async (req, res) => {
  try {
    const allStocklists = await pool.query(
      "SELECT * FROM stocklist WHERE stocklist_id != 1;"
    );
    res.json(allStocklists.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//create a stocklist
router.post("/add", authorisation, async (req, res) => {
  try {
    const { stocklist_name } = req.body;
    const newList = await pool.query(
      "INSERT INTO stocklist (stocklist_name) VALUES ($1)",
      [stocklist_name]
    );

    res.json(newList);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a stocklist
router.delete("/delete/:id", authorisation, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteList = await pool.query(
      "DELETE FROM stocklist WHERE stocklist_id = $1 RETURNING *",
      [id]
    );

    res.json(deleteList);
  } catch (err) {
    console.error(err.message);
  }
});

//get stocklist name
router.get("/get/:id", authorisation, async (req, res) => {
  try {
    const { id } = req.params;
    const getListName = await pool.query(
      "SELECT * FROM stocklist WHERE stocklist_id = $1",
      [id]
    );
    res.json(getListName);
  } catch (err) {
    console.error(err.message);
  }
});

//get all products listed on a stocklist
router.get("/list/:id", authorisation, async (req, res) => {
  try {
    const { id } = req.params;
    const getListProducts = await pool.query(
      "SELECT * from product INNER JOIN product_stocklist ON product.product_id = product_stocklist.product_id WHERE stocklist_id =$1 ORDER BY product_stocklist.index",
      [id]
    );
    res.json(getListProducts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//add a product to a specific list
router.post("/addproduct", async (req, res) => {
  try {
    const { productId, listId } = req.body;
    const addProduct = await pool.query(
      "INSERT INTO product_stocklist (product_id, stocklist_id) VALUES ($1, $2) RETURNING *",
      [productId, listId]
    );
    res.json(addProduct);
  } catch (err) {
    console.error(err.message);
  }
});

//add a product to a list while in stocktake mode.
router.post("/addproductstocktake", async (req, res) => {
  try {
    const { productId, listId, stockId } = req.body;
    await pool.query("BEGIN");
    const addProduct = await pool.query(
      "INSERT INTO product_stocklist (product_id, stocklist_id) VALUES ($1, $2)",
      [productId, listId]
    );
    const insert = await pool.query(
      "INSERT INTO stocktake_quantity (product_stocklist_id, quantity, stocktake) VALUES (currval('product_stocklist_product_stocklist_id_seq'), 0, $1)",
      [stockId]
    );
    await pool.query("END");
    res.json(addProduct);
    res.json(insert);
  } catch (error) {
    console.error(error.message);
  }
});

//delete a product from a specific list
router.delete("/deleteproduct/:id", authorisation, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await pool.query(
      "DELETE from product_stocklist WHERE product_stocklist_id = $1 RETURNING *",
      [id]
    );
    res.json(deleteProduct);
  } catch (err) {
    console.error(err.message);
  }
});

//add a full bottle to a product
router.put("/addonebottle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const addOne = await pool.query(
      "UPDATE product_stocklist SET quantity = quantity+1 WHERE product_stocklist_id = $1 RETURNING *",
      [id]
    );
    res.json(addOne);
  } catch (err) {
    console.error(err.message);
  }
});

//remove a full bottle from a product
router.put("/removeonebottle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const addOne = await pool.query(
      "UPDATE product_stocklist SET quantity = quantity-1 WHERE product_stocklist_id = $1 RETURNING *",
      [id]
    );
    res.json(addOne);
  } catch (err) {
    console.error(err.message);
  }
});

//add a partial amount to a product
router.post("/addpartial/", async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const addPartial = await pool.query(
      "UPDATE product_stocklist SET quantity = quantity+$1 WHERE product_stocklist_id = $2 RETURNING *",
      [quantity, id]
    );
    res.json(addPartial);
  } catch (err) {
    console.error(err.message);
  }
});

//get a product quantity for a product that has already been counted as part of the stocktake.
router.post("/productquantity/", async (req, res) => {
  try {
    const { id, stocktake } = req.body;
    const getQuantity = await pool.query(
      "SELECT quantity FROM stocktake_quantity WHERE product_stocklist_id = $1 AND stocktake = $2",
      [id, stocktake]
    );
    res.json(getQuantity);
  } catch (error) {
    console.error(error.message);
  }
});

//select all of the assigned stocklists
router.post("/assignedlists", async (req, res) => {
  try {
    const { stocktake_id } = req.body;
    const getAssigned = await pool.query(
      "SELECT a.user_name, s.stocklist_name, s.stocklist_id, ss.completed, ss.user_message FROM stocklist s RIGHT JOIN stocklist_stocktake_user ss ON s.stocklist_id = ss.stocklist_id JOIN app_user a ON ss.user_id = a.user_id WHERE ss.stocktake_id = $1",
      [stocktake_id]
    );
    res.json(getAssigned.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//select all of the unassigned stocklists
router.post("/unassignedlists", async (req, res) => {
  try {
    const { stocktake_id } = req.body;
    const getUnassigned = await pool.query(
      "SELECT * FROM stocklist s WHERE stocklist_id NOT IN (SELECT stocklist_id FROM stocklist_stocktake_user WHERE stocktake_id = $1) AND stocklist_id != 1",
      [stocktake_id]
    );
    res.json(getUnassigned.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//assign a stocklist to a user
router.post("/assignlist", async (req, res) => {
  try {
    const { stocklist_id, stocktake_id, id, userMessage } = req.body;
    const assignlist = await pool.query(
      "INSERT INTO stocklist_stocktake_user (stocklist_id, stocktake_id, user_id, user_message) VALUES ($1, $2, $3, $4)",
      [stocklist_id, stocktake_id, id, userMessage]
    );
    res.json(assignlist);
  } catch (error) {
    console.error(error.message);
  }
});

//unassign a stocklist
router.post("/unassignuser", async (req, res) => {
  try {
    const { id, stocktake_id } = req.body;
    const unassignuser = await pool.query(
      "DELETE FROM stocklist_stocktake_user WHERE stocklist_id = $1 AND stocktake_id = $2",
      [id, stocktake_id]
    );
    res.json(unassignuser);
  } catch (error) {
    console.error(error.message);
  }
});

//checked for assigned stocklists from user side
router.post("/userassignedlists", async (req, res) => {
  try {
    const { id, stocktake_id } = req.body;
    const assignedlists = await pool.query(
      "SELECT s.stocklist_id, s.stocklist_name, ss.completed, ss.user_message, ss.completed_message FROM stocklist s JOIN stocklist_stocktake_user ss ON s.stocklist_id = ss.stocklist_id WHERE user_id = $1 AND stocktake_id = $2",
      [id, stocktake_id]
    );
    res.json(assignedlists.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//check all assigned lists have been marked as complete
router.get("/inprogress", async (req, res) => {
  try {
    const inprogress = await pool.query(
      "SELECT * FROM stocklist_stocktake_user WHERE completed = 'false'"
    );
    res.json(inprogress.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//reset the index of all the items on a stocklist
router.post("/savepositions", async (req, res) => {
  try {
    const { id, productI } = req.body;
    const savepositions = await pool.query(
      "UPDATE product_stocklist SET index = $1 WHERE product_stocklist_id = $2 RETURNING *",
      [productI, id]
    );
    res.json(savepositions);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
