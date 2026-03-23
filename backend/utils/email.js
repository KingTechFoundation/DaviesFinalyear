const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: `"AgriGuide AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🌱 Verify Your AgriGuide AI Account',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f0fdf4; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.08);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%); padding:40px 40px 30px; text-align:center;">
              <div style="width:70px; height:70px; background:rgba(255,255,255,0.2); border-radius:16px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
                <span style="font-size:36px;">🌱</span>
              </div>
              <h1 style="color:#ffffff; font-size:28px; font-weight:700; margin:0 0 8px;">AgriGuide AI</h1>
              <p style="color:rgba(255,255,255,0.85); font-size:14px; margin:0; letter-spacing:0.5px;">Smart Farming for Rwanda's Future</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#14532d; font-size:22px; font-weight:600; margin:0 0 8px;">Welcome, ${userName}! 👋</h2>
              <p style="color:#6b7280; font-size:15px; line-height:1.6; margin:0 0 30px;">
                Thank you for joining AgriGuide AI. To complete your registration and start your smart farming journey, please use the verification code below:
              </p>

              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius:12px; padding:30px; text-align:center; margin:0 0 30px;">
                <p style="color:#6b7280; font-size:13px; text-transform:uppercase; letter-spacing:2px; margin:0 0 12px; font-weight:600;">Your Verification Code</p>
                <div style="font-size:40px; font-weight:800; color:#15803d; letter-spacing:12px; font-family:'Courier New',monospace; margin:0 0 12px;">
                  ${otp}
                </div>
                <p style="color:#9ca3af; font-size:12px; margin:0;">This code expires in <strong style="color:#dc2626;">10 minutes</strong></p>
              </div>

              <!-- Warning -->
              <div style="background:#fffbeb; border-left:4px solid #f59e0b; border-radius:0 8px 8px 0; padding:14px 16px; margin:0 0 30px;">
                <p style="color:#92400e; font-size:13px; margin:0; line-height:1.5;">
                  🔒 <strong>Security Notice:</strong> Never share this code with anyone. AgriGuide AI will never ask for your password or OTP via phone or message.
                </p>
              </div>

              <!-- Features preview -->
              <p style="color:#374151; font-size:14px; font-weight:600; margin:0 0 12px;">Once verified, you'll access:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px;">
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">🤖 AI-Powered Crop Recommendations</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">🌤️ Real-Time Weather Monitoring</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">🐛 Smart Pest Detection & Treatment</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">📊 Yield Analytics & Farm Insights</td>
                </tr>
              </table>

              <p style="color:#9ca3af; font-size:13px; line-height:1.5; margin:0;">
                If you didn't create an account with AgriGuide AI, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb; text-align:center;">
              <p style="color:#9ca3af; font-size:12px; margin:0 0 4px;">© 2026 AgriGuide AI — Smart Farming Platform</p>
              <p style="color:#d1d5db; font-size:11px; margin:0;">Musanze District, Northern Province, Rwanda</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: `"AgriGuide AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Reset Your AgriGuide AI Password',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding:40px; text-align:center;">
              <div style="width:70px; height:70px; background:rgba(255,255,255,0.1); border-radius:16px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; border:1px solid rgba(255,255,255,0.2);">
                <span style="font-size:32px;">🔐</span>
              </div>
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0; letter-spacing:-0.5px;">Password Reset Request</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#475569; font-size:16px; line-height:1.6; margin:0 0 24px;">
                Hello <strong>${userName}</strong>,
              </p>
              <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 32px;">
                Constructing a more secure future for your farm. We received a request to reset your password. Use the code below to proceed:
              </p>

              <!-- OTP Box -->
              <div style="background:#f1f5f9; border-radius:12px; padding:32px; text-align:center; margin-bottom:32px; border:1px dashed #cbd5e1;">
                <p style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:2px; margin:0 0- 12px; font-weight:700;">Reset Verification Code</p>
                <div style="font-size:42px; font-weight:800; color:#0f172a; letter-spacing:10px; font-family:'Courier New',monospace;">
                  ${otp}
                </div>
                <p style="color:#ef4444; font-size:12px; margin:12px 0 0; font-weight:600;">Expires in 10 minutes</p>
              </div>

              <!-- Security Warning -->
              <div style="padding:20px; background:#fff1f2; border-radius:12px; margin-bottom:32px;">
                <p style="color:#9f1239; font-size:13px; margin:0; line-height:1.6;">
                  <strong>Important:</strong> If you did not request this reset, please ignore this email or contact support if you have concerns about your account security.
                </p>
              </div>

              <p style="color:#94a3b8; font-size:13px; line-height:1.5; margin:0; text-align:center;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; padding:32px 40px; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="color:#64748b; font-size:13px; font-weight:600; margin:0 0 4px;">AgriGuide AI</p>
              <p style="color:#94a3b8; font-size:12px; margin:0;">Smart Agriculture Platform for Rwanda</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail, sendResetOTPEmail };
