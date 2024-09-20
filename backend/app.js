const express = require("express");
require("dotenv").config();
const sanitize = require("sanitize");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
const port = process.env.PORT;
const router = require("./routes");
const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(sanitize.middleware);

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

module.exports = app;
