const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, client }) => {
  const { otp, email, phoneNumber, otpMethod } = JSON.parse(req.body);

  log(`Received OTP: ${otp}, Method: ${otpMethod}, Email: ${email}, Phone: ${phoneNumber}`);

  const database = new sdk.Databases(client);
  const databaseId = '6803ec16001c90f3cfa0';
  const collectionId = '6804bc8600236a091ea7';
  let key;
  if (otpMethod === 'sms') {
    key = `sms:${phoneNumber}`;
  } else {
    key = `email:${email}`;
  }

  try {
    log(`Attempting to verify OTP for key: ${key}`);
    const documents = await database.listDocuments(databaseId, collectionId, [
      sdk.Query.equal('$id', key), // Use the key as the document ID
    ]);

    if (documents.documents.length > 0) {
      const storedOtp = documents.documents[0].data.otp;
      log(`Stored OTP for key ${key}: ${storedOtp}`);

      if (storedOtp === otp) {
        // OTP is valid, delete it from the database
        await database.deleteDocument(databaseId, collectionId, key);
        log(`OTP for key ${key} deleted from DB.`);
        return res.json({ success: true });
      } else {
        return res.json({ success: false, error: 'Invalid OTP' });
      }
    } else {
      log(`No OTP found for key: ${key}`);
      return res.json({ success: false, error: 'OTP not found' });
    }
  } catch (error) {
    log('Error verifying OTP:', error);
    return res.json({ success: false, error: 'Error verifying OTP' });
  }
};