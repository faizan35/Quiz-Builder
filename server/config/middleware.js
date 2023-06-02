const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const setMiddleware = (app) => {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
};

module.exports = setMiddleware;
