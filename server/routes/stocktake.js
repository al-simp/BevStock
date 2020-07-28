const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation")

var timestamp = new Date();
//routes

//create a new stocktake
router.post("/new", async (req,res) => {
    try {
        const addStocktake = await pool.query("INSERT INTO stocktake (stocktake_date) VALUES ($1) RETURNING *", [timestamp]);
        res.json(addStocktake);
    } catch (err) {
        console.error(err.message);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getStocktake = await pool.query("SELECT * FROM stocktake WHERE stocktake_id = $1", [id]);
        res.json(getStocktake.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

router.post("/count", async (req, res) => {
    try {
        const { item, stocktake, quantity } = req.body;
        const addQuantity = await pool.query("INSERT INTO stocktake_quantity (product_stocklist_id, quantity, stocktake) VALUES ($1, $2, $3) RETURNING *", [item, quantity, stocktake]);
        res.json(addQuantity);
    } catch (error) {
        
    }
})

module.exports = router;