import express from "express";
import { getDb } from "../db/conn.js";

const testRoutes = express.Router();

// This section will help you get a list of all the documents.
testRoutes.route("/test").get(async function (req, res) {
  const dbConnect = getDb();

  try {
    const result = await dbConnect
      .collection("testcollection")
      .find({})
      .limit(50)
      .toArray();

    res.json(result);
  } catch (e) {
    res.status(400).send("Error fetching listings!");
  }
});

export default testRoutes;
