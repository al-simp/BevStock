const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation")


//Routes 


//get all stocklists
router.get("/", authorisation, async(req, res) => {
    try {
        const allStocklists = await pool.query("SELECT * FROM stocklist");
        res.json(allStocklists.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create a stocklist
router.post("/add", authorisation, async(req, res) => {
    try {
        const { stocklist_name } = req.body;
        const newList = await pool.query("INSERT INTO stocklist (stocklist_name) VALUES ($1)", [stocklist_name]);

        res.json(newList);
    } catch (err) {
        console.error(err.message)
    }
})


//delete a stocklist
router.delete("/delete/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteList = await pool.query("DELETE FROM stocklist WHERE stocklist_id = $1 RETURNING *",
        [id])

        res.json(deleteList);
    } catch (err) {
        console.error(err.message);
    }
})

//get stocklist name
router.get("/get/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params;
        const getListName = await pool.query("SELECT * FROM stocklist WHERE stocklist_id = $1", [id])
        res.json(getListName);
    } catch (err) {
        console.error(err.message);
    }
})

//get all products listed on a stocklist
router.get("/list/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params;
        const getListProducts = await pool.query("SELECT * from product INNER JOIN product_stocklist ON product.product_id = product_stocklist.product_id WHERE stocklist_id =$1", [id])
        res.json(getListProducts.rows);
    } catch (err) {
        console.error(err.message)
    }
})

//add a product to a specific list
router.post("/addproduct", async (req,res) => {
    try {
        const { productId, listId } = req.body;
        const addProduct = await pool.query("INSERT INTO product_stocklist (product_id, stocklist_id) VALUES ($1, $2) RETURNING *", [productId, listId]);
        res.json(addProduct);
    } catch (err) {
        console.error(err.message);
    }
})

//delete a product from a specific list
router.delete("/deleteproduct/:id", authorisation, async (req,res) => {
    try {
        const { id } = req.params;
        const deleteProduct = await pool.query("DELETE from product_stocklist WHERE product_stocklist_id = $1 RETURNING *", [id]);
        res.json(deleteProduct);
    } catch (err) {
        console.error(err.message);
    }
})

//add a full bottle to a product
router.put("/addonebottle/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const addOne = await pool.query("UPDATE product_stocklist SET quantity = quantity+1 WHERE product_stocklist_id = $1 RETURNING *", [id]);
        res.json(addOne);
    } catch (err) {
        console.error(err.message);
    }
})

//remove a full bottle from a product
router.put("/removeonebottle/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const addOne = await pool.query("UPDATE product_stocklist SET quantity = quantity-1 WHERE product_stocklist_id = $1 RETURNING *", [id]);
        res.json(addOne);
    } catch (err) {
        console.error(err.message);
    }
})

//add a partial amount to a product 
router.post("/addpartial/", async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const addPartial = await pool.query("UPDATE product_stocklist SET quantity = quantity+$1 WHERE product_stocklist_id = $2 RETURNING *", [quantity, id]);
        res.json(addPartial);
    } catch (err) {
        console.error(err.message);
    }
})

//get a product quantity for a product that has already been counted as part of the stocktake. 
router.post("/productquantity/", async (req, res) => {
    try {
        const {id, stocktake } = req.body;
        const getQuantity = await pool.query("SELECT quantity FROM stocktake_quantity WHERE product_stocklist_id = $1 AND stocktake = $2", [id, stocktake]);
        res.json(getQuantity);
    } catch (error) {
        console.error(error.message);
    }
})


module.exports = router;