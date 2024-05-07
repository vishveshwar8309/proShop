const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const productRoutes = require("./routes/productRoutes");
const port = process.env.PORT || 5000;

mongoDB();

app.get("/", (req, res) => {
  res.send("api successful...");
});

app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is listening to port ${port}`));
