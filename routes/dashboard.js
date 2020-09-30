const router = require("express").Router();
const pool = require("../db");
const { authorisation } = require("../middleware/authorisation");

// get any assigned stocktaking duties a user has.
router.get("/duties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const duties = await pool.query(
      "SELECT * FROM stocklist_stocktake_user WHERE user_id = $1 AND completed = 'false'",
      [id]
    );
    res.json(duties.rows);
    console.log(req.user.id);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
