const moment = require("moment");
const { getFirstName } = require("../helper/functions.js");

module.exports = async (req, res) => {
  const parameters = req.body.sessionInfo.parameters;
  const name = parameters?.username?.name;

  let message = '';

  const currentHour = moment().hour();
  if (currentHour >= 5 && currentHour < 12) {
    message = "Good Morning,";
  } else if (currentHour >= 12 && currentHour < 17) {
    message = "Good Afternoon,";
  } else if (currentHour >= 17 && currentHour < 21) {
    message = "Good Evening,";
  } else {
    message = "Greetings,"; // ensure there's always a message
  }

  if (name) { // append greeting
    message += ` ${getFirstName(name)}!`;
  }
  
  await new Promise((resolve) => setTimeout(resolve, 4000));
  
  res.sendFormatted(message, { userNameResolved: true });
};
