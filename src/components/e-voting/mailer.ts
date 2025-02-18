import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendWelcomeEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Welcome to EtherCast',
    html: `
      <h3>Welcome to EtherCast, the revolutionary blockchain-based e-voting system!</h3>
      <p>
        To get started, please click on the following link to access our login page: <a href="${link}">Login to EtherCast</a>
        and your OTP is: <b>${otp}</b>
      </p>
      <p>
      We are excited to have you join our <b>secure and transparent platform</b>, where your vote truly matters. 
      With EtherCast, you can participate in elections and make your voice heard with just a few clicks.
      </p>
      <p>
        Join us on EtherCast and be part of a new era in e-voting.
        <br> <b>Your vote matters, and we are here to make it count!</b>
      </p>
      <p>
        If you have any questions or need assistance, feel free to reach out to our support team. We are here to ensure your experience with EtherCast is seamless and enjoyable.
      </p>
      <p> Regards, <br> The EtherCast Team </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully.');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};