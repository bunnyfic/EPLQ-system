import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("email_service")

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
FROM_EMAIL = os.getenv("BREVO_FROM_EMAIL", "eplq.noreply@gmail.com")
FROM_NAME = "EPLQ"

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"


def _send_email(to_email: str, subject: str, html_body: str):
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }
    payload = {
        "sender": {"name": FROM_NAME, "email": FROM_EMAIL},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_body,
    }

    try:
        response = requests.post(BREVO_ENDPOINT, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception:
        # Don't let a Brevo failure blow up as an unhandled exception
        # in a background task — log it and move on.
        logger.exception("Failed to send email to %s", to_email)


def send_reset_email(to_email: str, reset_link: str):
    subject = "Reset Your Password — EPLQ"

    html_body = f"""
    <html>
      <body style="margin:0; padding:0; background-color:#1a1519; font-family: Georgia, 'Times New Roman', serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1519; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="420" cellpadding="0" cellspacing="0" style="background-color:#2B3138; border-radius: 10px; border: 1px solid #9B7E8550; padding: 36px;">
                <tr>
                  <td align="center" style="padding-bottom: 4px;">
                    <span style="color:#9B7E85; font-size: 24px; letter-spacing: 3px;">Lost Something?</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <span style="color:#8B9A7C; font-size: 13px; letter-spacing: 1px;">we'll guide you back through the fog</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 24px;">
                    <span style="color:#e8e2dc; font-size: 14px; line-height: 1.6;">
                      A request was made to reset the password on this account. If this was you, follow the path below. This link fades in 30 minutes.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="{reset_link}" style="display:inline-block; background-color:#5C0A0A; color:#e8e2dc; text-decoration:none; padding: 12px 32px; letter-spacing: 2px; font-size: 13px; border-radius: 4px;">
                      RESET PASSWORD
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 4px;">
                    <span style="color:#8B9A7C; font-size: 11px; word-break: break-all;">
                      Or copy this link: {reset_link}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; border-top: 1px solid #9B7E8530;">
                    <span style="color:#6b6560; font-size: 11px;">
                      If you didn't request this, you can safely ignore this email — nothing will change.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """

    _send_email(to_email, subject, html_body)


def send_activation_email(to_email: str, activation_link: str):
    subject = "Activate Your Account — EPLQ"

    html_body = f"""
    <html>
      <body style="margin:0; padding:0; background-color:#1a1519; font-family: Georgia, 'Times New Roman', serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1519; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="420" cellpadding="0" cellspacing="0" style="background-color:#2B3138; border-radius: 10px; border: 1px solid #8B9A7C50; padding: 36px;">
                <tr>
                  <td align="center" style="padding-bottom: 4px;">
                    <span style="color:#8B9A7C; font-size: 24px; letter-spacing: 3px;">Begin Again</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <span style="color:#9B7E85; font-size: 13px; letter-spacing: 1px;">one step left before you cross over</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 24px;">
                    <span style="color:#e8e2dc; font-size: 14px; line-height: 1.6;">
                      Thanks for signing up. Confirm this is you and activate your account below. This link fades in 24 hours.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="{activation_link}" style="display:inline-block; background-color:#5C0A0A; color:#e8e2dc; text-decoration:none; padding: 12px 32px; letter-spacing: 2px; font-size: 13px; border-radius: 4px;">
                      ACTIVATE ACCOUNT
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 4px;">
                    <span style="color:#8B9A7C; font-size: 11px; word-break: break-all;">
                      Or copy this link: {activation_link}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; border-top: 1px solid #9B7E8530;">
                    <span style="color:#6b6560; font-size: 11px;">
                      If you didn't create this account, you can safely ignore this email.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """

    _send_email(to_email, subject, html_body)
