const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoute = require("./routes/users"); // Import the users route
const authRoute = require("./routes/auth"); // Import the auth route
const postRoute = require("./routes/posts"); // Import the posts route

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the run function
run();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Define routes
app.use("/api/users", userRoute); // Use the users route for /api/users
app.use("/api/auth", authRoute); // Use the auth route for /api/auth
app.use("/api/posts", postRoute); // Use the post route for /api/post

app.listen(8800, () => {
    console.log("Port started on 8800!");
});
