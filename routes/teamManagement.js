const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const { authorisation } = require("../middleware/authorisation")
const validInfo = require("../middleware/validInfo")

//Routes 

//get all team members
router.get("/", async(req, res) => {
    try {
        const team = await pool.query("SELECT * FROM app_user WHERE active = 'true'");
        res.json(team.rows)
    } catch (err) {
        console.error(err.message)
    }
});

//get all team members who are not admin
router.get("/users", async(req, res) => {
    try {
        const team = await pool.query("SELECT user_id, user_name FROM app_user WHERE role NOT IN ('Admin') AND active ='true'");
        res.json(team.rows)
    } catch (err) {
        console.error(err.message)
    }
});


//add a user
router.post("/add", validInfo, async(req, res) => {
    try {

        //1. destructure the req.body (name, email, password)

        const { name, email, password, role } = req.body;

        //2. check if user exists (if user exists then throw error)

        const user = await pool.query("SELECT * FROM app_user WHERE user_email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists");
        }

        //3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter the ner user ino the database

        const newUser = await pool.query("INSERT INTO app_user (user_name, user_email, user_password, role) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, bcryptPassword, role]);


        //5. generating our jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json(newUser.rows[0]);

       return res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("HERE Server Error");
    }
});

//update a user
router.put("/update/:id", authorisation, async(req, res) => {
    try {
        const { id } = req.params;

        //destructure the body of the request
        const { name, email } = req.body;

        const updateTeamMember = await pool.query(
            "UPDATE app_user SET user_name = $1, user_email = $2 WHERE  user_id = $3 RETURNING *", [name, email, id]
        );

        res.json("User updated successfully")
        res.json(updateTeamMember);

    } catch (err) {
        console.error(err.message);
    }
})

//delete a team member
router.put("/delete/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteTeamMember = await pool.query(
           "UPDATE app_user SET active = 'false' WHERE user_id = $1 RETURNING *",
           [id]
        )

        res.json(deleteTeamMember);
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;