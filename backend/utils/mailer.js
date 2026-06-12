const axios = require('axios')

const getAccessToken = async () => {
  const { data } = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  })
  return data.access_token
}

const sendOTPEmail = async (email, otp) => {
  const accessToken = await getAccessToken()

  const emailLines = [
    `From: "ShopEasy" <${process.env.EMAIL_USER}>`,
    `To: ${email}`,
    `Subject: Your ShopEasy Verification Code`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">`,
    `<h2 style="color: #1d4ed8;">ShopEasy</h2>`,
    `<p>Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>`,
    `<div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8; margin: 24px 0;">${otp}</div>`,
    `<p style="color: #6b7280; font-size: 14px;">If you did not create a ShopEasy account, ignore this email.</p>`,
    `</div>`
  ].join('\n')

  const encodedEmail = Buffer.from(emailLines)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  await axios.post(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
    { raw: encodedEmail },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

module.exports = { sendOTPEmail }