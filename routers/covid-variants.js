/**
 * Summary. Node Express sequences router.
 *
 * Description. A Node Express router that allows GET, POST, PATCH and DELETE operations
 * on coronavirus variants describing object. These objects are stored in MongoDB as documents with
 * two attributes
 *  * variant_id (string)
 *  * name (string)
 *
 * i.e.
 * { "variant_id": "B.1.1.7",
 * "name":"UK variant",
 * }
 *
 * @author Oscar Moya.
 */

const express = require("express");
const redis = require("redis"); // Redis client. Used to cache data in memory to ensure high performant data acceses.
const redisClient = redis.createClient(process.env.REDIS_URL);

const getVariantsRouter = (dbConnection) => {
  const variants_router = express.Router(); // create the router
  const collection = dbConnection.collection("covid-variants");

  // middleware that prints a timestamp
  variants_router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now());
    next();
  });

  // GET. Get all variants
  variants_router.get("/", function (req, res) {
    redisClient.get("all_variants", function (redisGetErr, reply) {
      if (redisGetErr) console.dir("No cached data present", redisGetErr);
      // reply is null when the key is missing
      else if (!reply) console.dir("The key does not exist in Redis");
      else console.dir("cached data retrieved", reply);
    });

    collection.find({}).toArray((error, docs) => {
      if (error) return res.status(500).json({ error: error });
      redisClient.set(
        "all_variants",
        JSON.stringify(docs),
        function (redisError, reply) {
          if (redisError) {
            console.log(redisError);
            return res.status(200).json(docs);
          } else {
            console.log("Caching data", reply);
            return res.status(200).json(docs);
          }
        }
      );
    });
  });

  // GET. Get a sequence by variant_id
  variants_router.get("/:variant_id", (req, res) => {
    console.log(req.params.variant_id);
    collection.findOne({ variant_id: req.params.variant_id }, (error, doc) => {
      console.log("doc", doc);
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json(doc);
    });
  });

  // POST. Create a new variant.
  variants_router.post("/", (req, res) => {
    collection.insertOne(req.body, (error, insertedDoc) => {
      if (error) return res.status(500).json({ error: error });
      return res
        .status(200)
        .json({ result: "success", insertedDoc: insertedDoc });
    });
  });

  // PUT. Create a new svariant or update an existing one. Replace the whole documemt.
  variants_router.put("/:variant_id", (req, res) => {
    collection.replaceOne(
      { variant_id: req.params.variant_id },
      req.body,
      { upsert: true },
      (error, replacedDoc) => {
        if (error) return res.status(500).json({ error: error });
        return res
          .status(200)
          .json({ result: "success", replacedDoc: replacedDoc });
      }
    );
  });

  // PATCH. Update an existing variant. Change one or some attributes of the document.
  variants_router.patch("/:variant_id", (req, res) => {
    collection.updateOne(
      { variant_id: req.params.variant_id },
      { $set: req.body },
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.result.n === 0)
          return res.status(200).json({
            result: "warning",
            message: `Patch (update) operation could not be applied. The variant ${req.params.variant_id} was not found in the collection.`,
          });
        return res.status(200).json({
          result: "success",
          message: `The variant ${req.params.variant_id} has been updated`,
        });
      }
    );
  });

  // DELETE. Delete an existing variant
  variants_router.delete("/:variant_id", (req, res) => {
    collection.deleteOne(
      { variant_id: req.params.variant_id },
      (error, result) => {
        if (error) return res.status(500).json({ error: error });
        if (result.result.n === 0)
          return res.status(200).json({
            result: "warning",
            message: `Delete operation could not be applied. The variant ${req.params.variant_id} was not found in the collection.`,
          });
        return res.status(200).json({
          result: "success",
          message: `The variant ${req.params.variant_id} has been deleted`,
        });
      }
    );
  });
  return variants_router;
};

module.exports = getVariantsRouter;
