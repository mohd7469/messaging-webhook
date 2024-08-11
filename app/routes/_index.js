const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

// dynamic include all routes except directory and the file itself (e.g: _index.js)
fs.readdirSync(__dirname).forEach((file) => {
  const filePath = path.join(__dirname, file);
  const isDirectory =  fs.statSync(filePath).isDirectory();
  if (file !== "_index.js" && !isDirectory) {
    const url = "/" + path.basename(filePath).split(".")[0];
    const method = require(path.join(__dirname, file));
    router.post(url, method);
  }
});

module.exports = router;