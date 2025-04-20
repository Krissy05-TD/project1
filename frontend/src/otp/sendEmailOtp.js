const mailgun = require('mailgun-js');
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, client }) => {
  const { email } = JSON.parse(req.body);
  if (!email) {
    return res.json({ error: 'Email address is required' }, 400);
  }

  const mg = mailgun({ apiKey: '80622d0d77def87c069477da1da6eeaa-17c877d7-0697a95e', domain: 'sandbox6106d0f1318a4606b39f57d39995540f.mailgun.org' });

  const otp = Math.floor(100000 + Math.random() * 900000);

  const data = {
    from: 'krisdavids2005@gmail.com', // Replace with your "from" email address
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await mg.messages().send(data);

    // Store OTP in Appwrite Database
    const database = new sdk.Databases(client);
    const databaseId = '6803ec16001c90f3cfa0';
    const collectionId = '6804bc8600236a091ea7';
    const key = `email:${email}`; // Use a prefix to distinguish Email OTPs
    try {
      await database.createDocument(databaseId, collectionId, key, {
        otp: otp.toString(), // Store OTP as string
        createdAt: Date.now(),
        method: 'email', // Indicate the OTP method
      });
      log(`OTP sent successfully via email to ${email}. OTP stored in DB.`);
    } catch (dbError) {
      log('Error storing OTP in database:', dbError);
      return res.json({ error: 'Failed to store OTP' }, 500);
    }

    return res.json({ success: true });
  } catch (error) {
    log('Error sending email:', error);
    return res.json({ error: 'Failed to send email' }, 500);
  }
};