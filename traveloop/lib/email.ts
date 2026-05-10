import nodemailer from "nodemailer";

// ── Transport ─────────────────────────────────────────────────────────────────

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

// ── Email Helpers ─────────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  const transporter = createTransport();

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const from = process.env.SMTP_FROM ?? "Traveloop <noreply@traveloop.com>";

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your Traveloop password",
    text: `
You requested a password reset for your Traveloop account.

Click the link below to reset your password. This link expires in 1 hour.

${resetUrl}

If you did not request this, you can safely ignore this email.
    `.trim(),
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:32px 40px;">
              <span style="color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">✈ Traveloop</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111;">Reset your password</h1>
              <p style="margin:0 0 24px;color:#555;line-height:1.6;">
                You requested a password reset. Click the button below to choose a new password.
                This link expires in <strong>1 hour</strong>.
              </p>
              <a href="${resetUrl}"
                 style="display:inline-block;padding:14px 28px;background:#0f3460;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
                Reset Password
              </a>
              <p style="margin:24px 0 0;font-size:13px;color:#999;">
                Or copy this link: <a href="${resetUrl}" style="color:#0f3460;word-break:break-all;">${resetUrl}</a>
              </p>
              <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />
              <p style="margin:0;font-size:13px;color:#aaa;">
                If you didn't request this email, you can safely ignore it. Your password won't change.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
