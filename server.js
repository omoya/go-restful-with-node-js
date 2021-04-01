/**
 * Summary. Node Express based server
 *
 * Description. A Node Express based server to create a Restful API.
 *
 * @author Oscar Moya.
 */

// ###################
// Required packages
// ###################

const express = require("express"); // Node framework to write request handlers
const cors = require("cors"); // easily solves cross origin resource sharing errors

// ###################
// Create express App
// ###################
const app = express();

// ####################################
// Configure requests/endpoints/routers
// ####################################

// requests
app.get("/", (req, res) => {
  res.send("Good request!");
});

// ###################
// Start server
// ###################
app.listen(2000, () => {
  console.log(`Server active at http://localhost:2000`);
});