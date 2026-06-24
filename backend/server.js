const express = require("express");
const cors = require("cors");

const bfhlRoute = require("./routes/bfhl.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});