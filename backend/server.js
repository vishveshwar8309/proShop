const path = require('path');
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes")
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

//connecting to database
mongoDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))     //serving   uploads/  folder as the static folder

if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  // any route that is not api will be redirected to indesx.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
} else {
  app.get("/", (req, res) => {
    res.send("api successful...");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is listening to port ${port}`));
