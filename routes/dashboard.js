const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation")

router.get("/", authorisation, async(req, res) => {
    try {

        const user = await pool.query("SELECT user_name, user_id FROM app_user WHERE user_id = $1", [req.user.id])

        res.json(user.rows[0]);


    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

router.get("/duties", authorisation, async(req, res) => {
    try {
        const duties = await pool.query("SELECT * FROM stocklist_stocktake_user WHERE user_id = $1 AND completed = 'false'", [req.user.id])
        res.json(duties.rows);
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = router;