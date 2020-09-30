const jwt = require("jsonwebtoken");
require("dotenv").config();

// method to generate a JWT token 
const jwtGenerator = (user_id, user_role) => {
  const payload = {
    user: {
      id: user_id,
      role: user_role,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
};

module.exports = jwtGenerator;
