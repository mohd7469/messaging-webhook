module.exports = { detectIntent };

const dialogflow = require("@google-cloud/dialogflow-cx");

const languageCode = process.env.languageCode;
const projectId = process.env.projectId;
const agentId = process.env.agentId;
const location = process.env.location;

const path = require("path");
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, "./serviceAccount.json"),
  apiEndpoint: `${location}-dialogflow.googleapis.com`,
});

async function detectIntent(query, sessionId, contexts = []) {
  try {
    const sessionPath = sessionClient.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
        },
        languageCode,
      },
      queryParams: {
        parameters: contexts,
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    return {
      responseMessages: result.responseMessages,
      followUpContexts: result.parameters?.fields || {}, // Handle follow-up contexts
    };
  } catch (err) {
    console.log(`Error detecting Intent`);
  }
}
