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

const express = require("express"); // NodeJs framework to write request handlers
const mongodb = require("mongodb"); // MongoDB NodeJS driver
const cors = require("cors"); // Express middleware that easily solves cross origin resource sharing errors

// ###################
// Create express App
// ###################
const app = express();
app.use(express.json()); // Express middleware that includes the request body into req.body

// ###################
// Connect to MongoDB
// ###################
//https://github.com/vercel/next.js/discussions/12294
// This connection used in all Mongo queries (More performant than opening one each query).

// Create a MongoDB connection pool and start the application
// after the database connection is ready
mongodb.MongoClient.connect(
  "mongodb://localhost:27017/",
  { useUnifiedTopology: true },

  function (err, database) {
    if (err) throw err;
    app.locals.db = database.db("testdb");

    // ####################################
    // Configure requests/endpoints/routers
    // ####################################

    // load router
    const getVariantsRouter = require("./routers/covid-variants");

    const db = app.locals.db;
    // requests
    app.use("/variants", getVariantsRouter(db));

    // ###################
    // Start server
    // ###################
    app.listen(2000, () => {
      console.log(`Server active at http://localhost:2000`);
    });
  }
);
