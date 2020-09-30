module.exports = (req, res, next) => {
    const { email, name, password } = req.body;

    const validEmail = (userEmail) => {

        //regex to make sure email address is valid

        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register") {


        //checking for empty values
        if (![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");

            //checking if email address is valid
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }

        //same process but for login route
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.json("Invalid Email");
        }
    }

    next();
};