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
// Create a MongoDB connection pool and start the application
// after the database connection is ready.
//
// The server is started within the connection function. This way it is possible to use it
// in all Mongo queries (More performant than opening one each query).
// https://github.com/vercel/next.js/discussions/12294

// URI used in a composed Docker container: https://stackoverflow.com/questions/54911021/unable-to-start-docker-mongo-image-on-windows

mongodb.MongoClient.connect(
  "mongodb://mongo:27017/",
  { useUnifiedTopology: true },

  (err, database) => {
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
