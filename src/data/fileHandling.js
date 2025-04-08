const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "store.json");

function readStore() {
  const oData = fs.readFileSync(storePath, "utf-8");
  return JSON.parse(oData);
}

function writeStore(oData) {
  fs.writeFileSync(storePath, JSON.stringify(oData, null, 2));
}

module.exports = {
  readStore,
  writeStore,
};
