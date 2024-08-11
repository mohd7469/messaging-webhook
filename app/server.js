require("dotenv").config(); // load .env  globally i.e: use process.env

const PORT = process.env.PORT || 3000;

const axios = require("axios");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {
  requestInterface,
  responseInterface,
  jsonBodyParser,
  urlencodedBodyParser,
} = require("./middleware.js");
const routes = require("./routes/_index.js");
const twilioRoutes = require("./twilio/_index.js");

// middleware
app.use(jsonBodyParser); // for dialogflow
app.use(urlencodedBodyParser); // for twilio
app.use(requestInterface); // request logger
app.use(responseInterface); // response logger + formatter
app.use(express.static("public")); // view static html online

app.get("/", function (req, res) {
  res.send("Server is up and running ...");
});

app.use(routes); // centralized dialogflow webhook routes for business logic
app.use(twilioRoutes); // twilio routes

const { calculateIntervalTime } = require("./helper/functions.js");
const listener = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT || listener.address().port}`);

  const pingServer = async () => {
    try {
      const res = await axios.get("https://messaging-webhook.glitch.me");
      console.log(`Ping server: ${res.status} - ${res.statusText}`);
    } catch (err) {
      console.error(`Error ping server: ${err.message}`);
    }
  }

  const afterEvery = calculateIntervalTime(0, 0, 1); // seconds, minutes, hours
  setInterval(pingServer, afterEvery); // to keep server awake
});
