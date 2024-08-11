module.exports = {
  requestInterface,
  responseInterface,
  jsonBodyParser,
  urlencodedBodyParser,
};

const logRequest = 1;
const logResponse = 0;
const bodyParser = require("body-parser");

const originalLog = console.log;
console.log = (...args) => {
  // extend console.log to stringify object (i.e: to see nested objects)
  const newArgs = args.map((arg) =>
    typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
  );
  originalLog.apply(console, newArgs);
};

function requestInterface(req, res, next) {
  console.log(`\n* Incoming request: ${req.method} ${req.url}\n`);

  if (logRequest) {
    if (req.method === "POST") {
      console.log("* Request body:", req.body, `\n`);
    }
  }

  next();
}

function responseInterface(req, res, next) {
  res.sendFormatted = (data, sessionParams) => {
    // send formatted dialogflow response as the way it accept
    const formattedResponse = {
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [data],
            },
          },
        ],
        // "mergeBehavior": enum (MergeBehavior)
      },
      sessionInfo: {
        ...req.body.sessionInfo,
        parameters: sessionParams
      },
      // pageInfo: req.body.pageInfo,
      // "payload": {
      //   object
      // },
      // "targetPage": string,
      // "targetFlow": string
    };
    if (logResponse) {
      console.log(`* Outgoing response:`, formattedResponse, `\n`);
    }
    res.json(formattedResponse);
  };
  next();
}

function jsonBodyParser(req, res, next) {
  // for parsing dialogflow request body
  if (req.is("application/json")) {
    bodyParser.json()(req, res, next);
  } else {
    next();
  }
}

function urlencodedBodyParser(req, res, next) {
  // for parsing twilio encoded request body
  if (req.is("application/x-www-form-urlencoded")) {
    bodyParser.urlencoded({ extended: true })(req, res, next);
  } else {
    next();
  }
}
