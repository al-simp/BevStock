const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation")

//Routes 

//get all products 
router.get("/", async(req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM product");
        res.json(allProducts.rows)
    } catch (err) {
        console.error(err.message);
    }
})

router.get("/:id", async(req,res) => {
    try {
        const { id } = req.params;
        const selectProduct = await pool.query("SELECT * FROM product WHERE product_id = $1", [id]) 
        res.json(selectProduct.rows);
    } catch (err) {

        console.error(err.message)
        
    }
})


router.get("/distinct", async(req, res) => {
    try {
        const allProducts = await pool.query("SELECT DISTINCT FROM product");
        res.json(allProducts.rows)
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;