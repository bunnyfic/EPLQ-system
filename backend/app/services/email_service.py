import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
def _send_email(to_email: str, subject: str, html_body: str):
    print(f"[Email] Attempting to send to {to_email} from {GMAIL_ADDRESS}")
    
    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        print("[Email] ERROR: GMAIL_ADDRESS or GMAIL_APP_PASSWORD is missing!")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())
        print(f"[Email] Successfully sent to {to_email}")
    except Exception as e:
        print(f"[Email] FAILED to send: {type(e).__name__}: {e}")

def _send_email(to_email: str, subject: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())


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
