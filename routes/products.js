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

router.get("/get/distinct", async(req, res) => {
    try {
        const allProducts = await pool.query("SELECT DISTINCT product_id FROM product");
        res.json(allProducts.rows)
    } catch (err) {
        console.error(err.message);
    }
})


//add a new product
router.post("/new", async(req, res) => {
    try {
        const { name, size, par, category } = req.body;
        const addProduct = await pool.query("INSERT INTO product (product_name, product_size, product_category, par_level) VALUES ($1, $2, $3, $4)", [name, size, category, par]);
        res.json(addProduct);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;