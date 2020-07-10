const jwt = require("jsonwebtoken");
require("dotenv").config()

// middleware to check if the token in storage is valid. Using this in any private routes

async function authorisation(req, res, next) {
    try {

        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json("Not Authorised");

        }

        //verify token 

        const verify = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = verify.user;

        console.log(verify);
        
        next();

    } catch (err) {
        console.error(err.message)
        return res.status(401).json("Token is invalid");
    }

};

// middleware to check if user is an admin user. 

function adminAuth(req, res, next) {
    
    try {
        
        const userRole = req.user.role;

        if(!userRole) {
            return res.status(403).json("User role not defined")
        }

        if (userRole !== "Admin") {
            return res.status(401).json("Not authorised")
        }

        next();


    } catch (err) {
        console.error(err.message)
        return res.status(401).json("User role is invalid")
    }

}

module.exports = {
    authorisation, 
    adminAuth
}