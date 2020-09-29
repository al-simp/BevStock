const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const { authorisation, adminAuth } = require("../middleware/authorisation");

// verification
router.get("/is-verify", authorisation, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/is-admin", adminAuth, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body

    const { email, password } = req.body;

    //2. check if user doesn't exist, if not then throw error

    const user = await pool.query(
      "SELECT * FROM app_user WHERE user_email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    //3. check if incoming password == database password

    {
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );

      if (!validPassword) {
        return res.status(401).json("Password or email is incorrect");
      }
    }

    //4. give jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    const role = user.rows[0].role;
    const name = user.rows[0].user_name;
    console.log(user.rows[0]);
    res.json({ token, role, name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
