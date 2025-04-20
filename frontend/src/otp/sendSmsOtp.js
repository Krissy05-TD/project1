const twilio = require('twilio');
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, client }) => {
  const { phoneNumber } = JSON.parse(req.body);
  if (!phoneNumber) {
    return res.json({ error: 'Phone number is required' }, 400);
  }

  const accountSid = 'ACa16615287456e85f2dd665a618d5daef';
  const authToken = 'b37f7fd8a89166711d8977780f1004d3';
  const twilioClient = new twilio(accountSid, authToken);

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: '+747253625', // Replace with your Twilio phone number
      to: phoneNumber,
    });

    // Store OTP in Appwrite Database
    const database = new sdk.Databases(client);
    const databaseId = '6803ec16001c90f3cfa0';
    const collectionId = '6804bc8600236a091ea7';
    const key = `sms:${phoneNumber}`; // Use a prefix to distinguish SMS OTPs
    try {
      await database.createDocument(databaseId, collectionId, key, {
        otp: otp.toString(), // Store OTP as string
        createdAt: Date.now(),
        method: 'sms', // Indicate the OTP method
      });
      log(`OTP sent successfully via SMS to ${phoneNumber}. OTP stored in DB.`);
    } catch (dbError) {
      log('Error storing OTP in database:', dbError);
      return res.json({ error: 'Failed to store OTP' }, 500);
    }

    return res.json({ success: true });
  } catch (error) {
    log('Error sending SMS:', error);
    return res.json({ error: 'Failed to send SMS' }, 500);
  }
};