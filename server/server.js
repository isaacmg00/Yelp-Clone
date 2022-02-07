require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const { db } = require("./db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./utils/jwtGenerator");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

//get all restaurants
app.get("/api/v1/restaurants/home", async (req, res) => {
  try {
    const restaurantsRatingData = await db.query(
      "SELECT * FROM restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );
    res.status(200).json({
      status: "success",
      results: restaurantsRatingData.rows.length,
      data: {
        restaurants: restaurantsRatingData.rows,
      },
    });
  } catch (err) {
    console.error(err);
  }
});

//get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const restaurant = await db.query(
      "SELECT * FROM restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1;",
      [req.params.id]
    );

    const reviews = await db.query(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {}
});

//create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  console.log(req.body);

  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1,$2,$3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    console.log(results);
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//update restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = db.query("DELETE FROM restaurants where id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

//add a review on a restaurant
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1,$2,$3,$4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.use((req, res, next) => {
  const { email, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/api/v1/restaurants/register") {
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/api/v1/restaurants/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
});

app.post("/api/v1/restaurants/register", async (req, res) => {
  try {
    //destructure req.body to obtain name, email, pw
    const { name, email, password } = req.body;
    //check if user exists
    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
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
    const newUser = await db.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    //generate a jwt token
    const token = jwtGenerator(newUser.rows[0].id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//login route
app.post("/api/v1/restaurants/login", async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user doesn't exist (if not then we throw error)
    const user = await db.query("SELECT * from users where user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    //3. check if incoming password is the same as the database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    //4. give them the jwt token
    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.log(err.message);
  }
});

app.use((req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload.user;
  } catch (err) {
    console.log(err.message);
    return res.status(403).json("Not Authorized");
  }
  next();
});

app.post("/api/v1/restaurants/is-verify", async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/v1/restaurants/home", async (req, res) => {
  try {
    const user = await db.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
