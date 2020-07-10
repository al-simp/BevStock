const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation");

router.get("/", authorisation, async(req, res) => {
    try {
        const { id } = req.params;
        const productquantities = await pool.query("SELECT p.product_id, p.product_name, SUM (ps.quantity) FROM product_stocklist ps JOIN product p ON (ps.product_id = p.product_id) GROUP BY p.product_name, p.product_id");
        res.json(productquantities.rows);
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;