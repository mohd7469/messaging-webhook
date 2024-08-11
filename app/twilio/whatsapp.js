const { detectIntent } = require("./api/dialogflowApi.js");
const { sendMessage } = require("./api/twilioApi.js");
const sessionContexts = {}; // store session contexts in memory

module.exports = async (req, res) => {
  try {
    const whatsapp = req.body;
    console.log("\tName:", whatsapp.ProfileName);
    console.log("\tNumber:", whatsapp.WaId);

    const recipient = whatsapp.To;
    const senderId = whatsapp.From;
    const sessionId = senderId; // whatsapp.MessageSid;
    const messageType = whatsapp.MessageType;

    switch (messageType) {
      case "text": {
        const query = whatsapp.Body;
        console.log(`\tQuery: ${query}`);

        if (query) {
          let contexts = sessionContexts[sessionId] || {};
          const result = await detectIntent(query, sessionId, contexts);
          contexts = result.followUpContexts; // set contexts for the next request
          sessionContexts[sessionId] = contexts; // update context in memory

          for (const message of result.responseMessages) {
            if (message.text) {
              const reply = message.text.text;
              await sendMessage(recipient, senderId, reply);
            }
          }
        }
        break;
      }
      case "reaction": {
        console.log("\tUser just reacted with emogi.");
        break;
      }
    }

    res.status(200).send("Message Sent!");
  } catch (err) {
    console.log(`twilio webhook error: ${err}`);
    res.status(500).send("Internal Server Error");
  }
};