import User from "../../../Models/User";
require("../../../database/connection");
var jwt = require("jsonwebtoken");
var authenticate = require("./authentication");

var CryptoJS = require("crypto-js");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { id } = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(500).json({ results: "Something Went Wrong" });
      }
      let results = user.tests;
      res.status(200).send(results);
    } catch (e) {
      res.status(500).json({ results: "Something Went Wrong" });
    }
  }
}
