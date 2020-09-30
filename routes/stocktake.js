const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation");

var timestamp = new Date();
//routes

//select the active stocktake for the user side.
router.get("/activestocktake", async (req, res) => {
  try {
    const activeStockatake = await pool.query(
      "SELECT * FROM stocktake WHERE active = 't'"
    );
    res.json(activeStockatake.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//create a new stocktake
router.post("/new", async (req, res) => {
  try {
    const addStocktake = await pool.query(
      "INSERT INTO stocktake (stocktake_date) VALUES (TIMESTAMP '2020-09-24 10:00:00') RETURNING *"
    );
    res.json(addStocktake);
  } catch (err) {
    console.error(err.message);
  }
});

//set the current stocktake as inactive
router.post("/inactive", async (req, res) => {
  try {
    const { stocktake_id } = req.body;
    const setAsInactive = await pool.query(
      "UPDATE stocktake SET active = 'false' WHERE stocktake_id = $1",
      [stocktake_id]
    );
    res.json(setAsInactive);
  } catch (error) {
    console.error(error.message);
  }
});

// get a specific stocktake by it's id. 
router.get("/getstocktake/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getStocktake = await pool.query(
      "SELECT * FROM stocktake WHERE stocktake_id = $1",
      [id]
    );
    res.json(getStocktake.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update product quantity
router.put("/count", async (req, res) => {
  try {
    const { item, stocktake, tempQuantity } = req.body;
    const addQuantity = await pool.query(
      "UPDATE stocktake_quantity SET quantity = quantity + $1 WHERE product_stocklist_id = $2 AND stocktake = $3",
      [tempQuantity, item, stocktake]
    );
    res.json(addQuantity);
  } catch (error) {}
});

// process delivery route for adding on new stock. 
router.get("/processdelivery/:stocktake", async (req, res) => {
  try {
    const { stocktake } = req.params;
    const getList = await pool.query(
      "SELECT ps.product_stocklist_id, p.product_name, p.product_category, p.product_size, sq.quantity FROM product p join product_stocklist ps ON (p.product_id = ps.product_id) JOIN stocktake_quantity sq ON (sq.product_stocklist_id = ps.product_stocklist_id) WHERE sq.stocktake = $1 AND ps.stocklist_id = 1",
      [stocktake]
    );
    res.json(getList.rows);
  } catch (error) {}
});

// get all products from product stocklist
router.get("/", async (req, res) => {
  try {
    const getAllProducts = await pool.query("SELECT * from product_stocklist");
    res.json(getAllProducts);
  } catch (error) {
    console.error(error.message);
  }
});

// generate a new stocktake record. 
router.post("/generate", async (req, res) => {
  try {
    const { id, stockId } = req.body;
    const generate = await pool.query(
      "INSERT INTO stocktake_quantity (product_stocklist_id, quantity, stocktake) VALUES ($1, $2, $3) RETURNING *",
      [id, 0, stockId]
    );
    res.json(generate);
  } catch (error) {
    console.error(error.message);
  }
});

// show all the products on a specified list for a stocktake. 
router.post("/liststocktake/", async (req, res) => {
  try {
    const { id, stocktake } = req.body;
    const listProductsCount = await pool.query(
      "SELECT ps.product_stocklist_id, p.product_name, sq.quantity, index FROM product p join product_stocklist ps ON (p.product_id = ps.product_id) JOIN stocktake_quantity sq ON (sq.product_stocklist_id = ps.product_stocklist_id) WHERE sq.stocktake = $1 AND ps.stocklist_id = $2 ORDER BY index ASC",
      [stocktake, id]
    );
    res.json(listProductsCount.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// slect a product with quantity. 
router.post("/productfromid/", async (req, res) => {
  try {
    const { result, stocktake } = req.body;
    const productFromId = await pool.query(
      "SELECT ps.product_stocklist_id, p.product_name, sq.quantity FROM product p join product_stocklist ps ON (p.product_id = ps.product_id) JOIN stocktake_quantity sq ON (sq.product_stocklist_id = ps.product_stocklist_id) WHERE sq.stocktake = $1 AND ps.product_stocklist_id = $2",
      [stocktake, result]
    );
    res.json(productFromId.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// mark a stocklist as complete. 
router.post("/markascomplete", async (req, res) => {
  try {
    const { id, stocktakeInstance, message } = req.body;
    const marksascomplete = await pool.query(
      "UPDATE stocklist_stocktake_user SET completed = true, completed_message = $3 WHERE stocklist_id = $1 AND stocktake_id = $2",
      [id, stocktakeInstance, message]
    );
    res.json(marksascomplete);
  } catch {
    console.error(error.message);
  }
});

module.exports = router;
