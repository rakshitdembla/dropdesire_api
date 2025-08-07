import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const sendSMS = async (to, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return true;
  } catch (e) {
    return false;
  }
};

export default sendSMS;
