/**
 * Summary. Node Express sequences router.
 *
 * Description. A Node Express router that allows GET, POST, PATCH and DELETE operrations
 * on DNA sequence resources. These resources are stored in MongoDB and have four properties:
 *  * pubmed_id (string)
 *  * sequence_name (string)
 *  * length (int)
 *  * last_update_datetime (Datetime)
 *
 * @author Oscar Moya.
 */

var express = require("express");
var sequences_router = express.Router();

// middleware that prints a timestamp
sequences_router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// GET. Get all sequences
sequences_router.get("/", function (req, res) {
  return res.send("Got all sequences");
});

// GET. Get a sequence by id
sequences_router.get("/:_id", function (req, res) {
  return res.send(`Got the sequence with the id: ${req.params._id}`);
});

// POST. Create a new sequence.
sequences_router.post("/:_id", function (req, res) {
  return res.status(200).json({ ok: "OK post" });
});

// PUT. Create a new sequence or update an existing one. Replace the whole sequence.
sequences_router.put("/:_id", function (req, res) {
  return res.status(200).json({ ok: "OK put" });
});

// PATCH. Update an existing sequence. Change one or some properties of the sequence object.
sequences_router.patch("/:_id", function (req, res) {
  return res.status(200).json({ ok: "OK patch" });
});

// DELETE. Delete an existing sequence
sequences_router.delete("/:_id", function (req, res) {
  return res.status(200).json({ ok: "OK delete" });
});

module.exports = sequences_router;
