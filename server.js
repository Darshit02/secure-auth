require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const introRoute = require("./routes/intro-route");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route")
const adminRoute = require("./routes/admin-route");
const upload = require("./routes/image-route");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectToDB();

app.use("/api", introRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/image",upload)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
