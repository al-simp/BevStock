const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation");

// get product quantities. 
router.get("/records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productquantities = await pool.query(
      "SELECT p.product_id, p.product_name, p.product_size, p.product_category, SUM (sq.quantity) FROM stocktake_quantity sq JOIN product_stocklist ps ON (sq.product_stocklist_id = ps.product_stocklist_id) JOIN product p ON (ps.product_id = p.product_id) WHERE stocktake = $1 GROUP BY p.product_name, p.product_id",
      [id]
    );
    res.json(productquantities.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get previous stocktake records, so not including new stock
router.get("/stocktake/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productquantities = await pool.query(
      "SELECT p.product_id, p.product_name, p.product_size, p.product_category, SUM (sq.quantity) FROM stocktake_quantity sq JOIN product_stocklist ps ON (sq.product_stocklist_id = ps.product_stocklist_id) JOIN product p ON (ps.product_id = p.product_id) WHERE stocktake = $1 AND ps.stocklist_id != 59 GROUP BY p.product_name, p.product_id",
      [id]
    );
    res.json(productquantities.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get inventory breakdown
router.post("/breakdown", async (req, res) => {
  try {
    const { id, product } = req.body;
    const breakdown = await pool.query(
      "SELECT s.stocklist_name, p.product_id, SUM (sq.quantity) FROM stocktake_quantity sq JOIN product_stocklist ps ON (sq.product_stocklist_id = ps.product_stocklist_id) JOIN product p ON (ps.product_id = p.product_id) JOIN stocklist s ON (ps.stocklist_id = s.stocklist_id) WHERE stocktake = $1 AND p.product_id = $2 GROUP BY s.stocklist_name, p.product_name, p.product_id, ps.stocklist_id",
      [id, product]
    );
    res.json(breakdown.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//find last completed stocktake for most update inventory records
router.get("/latest", async (req, res) => {
  try {
    const latestStocktake = await pool.query(
      "SELECT * FROM stocktake WHERE active = 'f' ORDER BY stocktake_id DESC LIMIT 2"
    );
    res.json(latestStocktake.rows);
  } catch (error) {
    console.error(err.message);
  }
});

//get sales difference from last stocktake to current stocktake
router.post("/sales", async (req, res) => {
  try {
    const { prevStocktake, currentStocktake, product } = req.body;
    const sales = await pool.query(
      "SELECT product_id, (SELECT SUM (sq.quantity) FROM stocktake_quantity sq JOIN product_stocklist ps ON (sq.product_stocklist_id = ps.product_stocklist_id) JOIN product p ON (ps.product_id = p.product_id) WHERE stocktake = $1 AND p.product_id = $3) - (SELECT SUM (sq.quantity) FROM stocktake_quantity sq JOIN product_stocklist ps ON (sq.product_stocklist_id = ps.product_stocklist_id) JOIN product p ON (ps.product_id = p.product_id) WHERE stocktake = $2 AND p.product_id = $3) AS SALES FROM product WHERE product_id = $3",
      [prevStocktake, currentStocktake, product]
    );
    res.json(sales.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get the top sellers for the stock period.
router.get("/topsellers/all/:stocktake", async (req, res) => {
  try {
    const { stocktake } = req.params;
    const getTopSellers = await pool.query(
      "SELECT p.product_name, s.sales FROM sales_record s JOIN product p ON (s.product_id = p.product_id) WHERE s.stocktake = $1 ORDER BY s.sales DESC",
      [stocktake]
    );
    res.json(getTopSellers.rows);
  } catch (error) {}
});

//get the top 5 sellers for the stock period.
router.get("/topsellers/:stocktake", async (req, res) => {
  try {
    const { stocktake } = req.params;
    const getTopSellers = await pool.query(
      "SELECT p.product_name, s.sales FROM sales_record s JOIN product p ON (s.product_id = p.product_id) WHERE s.stocktake = $1 ORDER BY s.sales DESC LIMIT 5",
      [stocktake]
    );
    res.json(getTopSellers.rows);
  } catch (error) {}
});

//get the top sellers of all time.
router.get("/alltimetopsellers/all", async (req, res) => {
  try {
    const getTopSellers = await pool.query(
      "SELECT SUM (s.sales), p.product_name from sales_record s JOIN product p ON (p.product_id = s.product_id) GROUP BY p.product_id ORDER BY SUM DESC"
    );
    res.json(getTopSellers.rows);
  } catch (error) {}
});

//get the top 5 sellers of all time.
router.get("/alltimetopsellers/", async (req, res) => {
  try {
    const getTopSellers = await pool.query(
      "SELECT SUM (s.sales), p.product_name from sales_record s JOIN product p ON (p.product_id = s.product_id) GROUP BY p.product_id ORDER BY SUM DESC LIMIT 5"
    );
    res.json(getTopSellers.rows);
  } catch (error) {}
});

//write sales to the db
router.post("/writesales", async (req, res) => {
  try {
    const { product_id, sales, stocktake } = req.body;
    const writesales = await pool.query(
      "INSERT INTO sales_record (product_id, sales, stocktake) VALUES ($1, $2, $3)",
      [product_id, sales, stocktake]
    );
    res.json(writesales);
  } catch (error) {
    console.error(error.message);
  }
});

//get list of products and quantities and par-levels
router.get("/levels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const levels = await pool.query(
      "SELECT s.product_id, p.par_level, p.product_category, p.product_size, SUM (s.sales / (select count (stocktake_id) -2 from stocktake group by s.product_id)) AS avg_weekly_sales, (SELECT SUM (sq.quantity) FROM stocktake_quantity sq JOIN product_stocklist ps ON (sq.product_stocklist_id = ps.product_stocklist_id) WHERE stocktake = $1 AND ps.product_id = s.product_id GROUP BY ps.product_id), p.product_name from sales_record s JOIN product p ON (p.product_id = s.product_id) group by s.product_id, p.par_level, p.product_name, p.product_category, p.product_size;",
      [id]
    );
    res.json(levels.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get all of the previous stocktake records
router.get("/stocktakes", async (req, res) => {
  try {
    const getStocktakes = await pool.query(
      "SELECT * FROM stocktake WHERE active = 'f' ORDER BY stocktake_id DESC LIMIT 7"
    );
    res.json(getStocktakes.rows);
  } catch (error) {
    console.error(error.messsage);
  }
});
module.exports = router;
