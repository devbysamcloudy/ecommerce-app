const nodemailer = require('nodemailer')

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    }
  })
  return transporter
}

const sendOTPEmail = async (email, otp) => {
  const transporter = await createTransporter()
  await transporter.sendMail({
    from: `"ShopEasy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your ShopEasy Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1d4ed8;">ShopEasy</h2>
        <p>Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you did not create a ShopEasy account, ignore this email.</p>
      </div>
    `
  })
}

module.exports = { sendOTPEmail }