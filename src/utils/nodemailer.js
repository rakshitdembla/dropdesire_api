import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"DropDesire" <dropdesireteam@gmail.com>`,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transpoter.sendMail(mailOptions);
    return true;
  } catch (e) {
    return false;
  }
};

export default sendEmail;
