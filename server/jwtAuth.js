const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("./db");
const jwtGenerator = require("./utils/jwtGenerator");

router.post("/register", async (req, res) => {
  try {
    //destructure req.body to obtain name, email, pw
    const { name, email, password } = req.body;
    //check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }
    //Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);
    //enter the user inside our db
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    //generate a jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
