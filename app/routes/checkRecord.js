const moment = require("moment");
const {
  getFirstName,
  validateCNIC,
  formatCNIC,
} = require("../helper/functions.js");

module.exports = (req, res) => {
  const parameters = req.body.sessionInfo.parameters;
  const name = parameters?.username?.name;
  const cnic = parameters.cnic;

  let formattedCNIC;

  if (!validateCNIC(cnic)) {
    formattedCNIC = formatCNIC(cnic); // convert it cnic format e.g: xxxxx-xxxxxxx-x
  } else {
    formattedCNIC = cnic;
  }

  let message = "";

  message += `Sorry ${getFirstName(name)}!`;
  message += `\n\n`;
  message += `We didn't find any record against cnic ${formattedCNIC}, kindly register yourself. Thank you.`;

  res.sendFormatted(message);
};
