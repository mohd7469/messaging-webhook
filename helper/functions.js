module.exports = {
  getFirstName,
  validateCNIC,
  formatCNIC,
  calculateIntervalTime,
};

function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function getFirstName(name) {
  const nameParts = name.split(" "); // split name by spaces
  return capitalizeFirstLetter(nameParts[0]);
}

function validateCNIC(cnic) {
  const cnicPattern = /^\d{5}-\d{7}-\d{1}$/; // regex to match correct CNIC format
  return cnicPattern.test(cnic);
}

function formatCNIC(cnic) {
  if (validateCNIC(cnic)) {
    return cnic;
  }

  cnic = cnic.replace(/\D/g, ""); // remove any non-digit characters

  if (cnic.length === 13) {
    return cnic.replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3"); // format cnic in correct pattern
  } else {
    return "Invalid CNIC format. It must be exactly 13 digits.";
  }
}

/**
 * To prevent glitch server going inactive we need to calculate interval time for that
 * (1) calculate Milliseconds from given time
 * (2) convert Milliseconds into readable form
 * (3) setInterval after every calculated time (server.js)
 */

const moment = require("moment");

function calculateIntervalTime(s = 0, m = 0, h = 0) {
  const ms = s * 1000 + m * 60 * 1000 + h * 60 * 60 * 1000;
  msToTime(ms); // for display ping time
  return ms;
}

const msToTime = (ms) => {
  const duration = moment.duration(ms);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let result = [];

  if (hours > 0) {
    result.push(`${hours} hr`);
  }
  if (minutes > 0) {
    result.push(`${minutes} m`);
  }
  if (seconds > 0) {
    result.push(`${seconds} s`);
  }

  const formattedResult = result.join(", ");
  console.info(`Ping set after every: ${formattedResult}`); // e.g: 10 m, 30 m, etc ..
  return result;
};
