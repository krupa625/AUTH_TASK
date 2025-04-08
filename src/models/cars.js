const { v4: uuidv4 } = require("uuid");
class Cars {
  constructor(sName, sModel, sColor, sFuel, nYear) {
    (this.iId = uuidv4()),
      (this.sName = sName),
      (this.sColor = sColor),
      (this.sFuel = sFuel),
      (this.sModel = sModel),
      (this.nYear = nYear);
  }
}
module.exports = { Cars };
