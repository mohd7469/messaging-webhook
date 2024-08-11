module.exports = { sendMessage, sendVoiceMessage };

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const clientTwilio = require("twilio")(accountSid, authToken);

async function sendMessage(from, to, reply) {
  try {
    await clientTwilio.messages.create({
      from: from,
      body: reply,
      to: to,
    });
  } catch (err) {
    console.log(`Error sending whatsapp message`);
  }
}

async function sendVoiceMessage(from, to, mediaUrl) {
  try {
    await clientTwilio.messages.create({
      from: from,
      to: to,
      mediaUrl: [mediaUrl],
    });
  } catch (err) {
    console.log(`Error sending voice message`);
  }
}
