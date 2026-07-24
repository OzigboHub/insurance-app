import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { siteConfig } from "@/content/site-config";

function generateLeadHtml(data: { name: string; email: string; phone: string; service: string; message: string; inquiryType?: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New AIICO Insurance Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 30px; text-align: left;">
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(59, 130, 246, 0.2); border: 1px solid rgba(147, 197, 253, 0.3); border-radius: 20px; color: #93c5fd; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                New Website Lead
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 6px 0; tracking-tight: -0.5px;">
                ${data.service} Inquiry
              </h1>
              <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                Submitted via AIICO Insurance Website Contact Portal
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Lead Details Grid -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Client Name</span>
                    <div style="font-size: 15px; color: #0f172a; font-weight: 700; margin-top: 2px;">${data.name}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Phone Number</span>
                    <div style="font-size: 15px; color: #1d4ed8; font-weight: 700; margin-top: 2px;">
                      <a href="tel:${data.phone}" style="color: #1d4ed8; text-decoration: none;">${data.phone}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Email Address</span>
                    <div style="font-size: 15px; color: #1d4ed8; font-weight: 700; margin-top: 2px;">
                      <a href="mailto:${data.email}" style="color: #1d4ed8; text-decoration: none;">${data.email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Policy Area</span>
                    <div style="font-size: 15px; color: #0f172a; font-weight: 700; margin-top: 2px;">${data.service}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Inquiry Type</span>
                    <div style="font-size: 14px; color: #0f172a; font-weight: 600; margin-top: 2px; text-transform: capitalize;">${data.inquiryType || 'Quote Request'}</div>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 28px;">
                <h3 style="font-size: 12px; color: #475569; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">
                  Message & Requirements
                </h3>
                <div style="background-color: #ffffff; border-left: 4px solid #2563eb; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 18px; border-radius: 0 12px 12px 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-line;">
                  ${data.message}
                </div>
              </div>

              <!-- Direct Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="mailto:${data.email}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 22px; border-radius: 10px; text-decoration: none; margin-right: 8px;">
                      Reply via Email
                    </a>
                    <a href="tel:${data.phone}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 22px; border-radius: 10px; text-decoration: none;">
                      Call Customer
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                AIICO Insurance Lead System • Automated Web Notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateCustomerConfirmationHtml(data: { name: string; service: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation | AIICO Insurance</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 30px; text-align: left;">
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(16, 185, 129, 0.2); border: 1px solid rgba(110, 231, 183, 0.3); border-radius: 20px; color: #6ee7b7; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                Request Confirmed
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 6px 0; tracking-tight: -0.5px;">
                We Have Received Your Inquiry
              </h1>
              <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                AIICO Insurance Direct Consultation
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 15px; color: #0f172a; font-weight: 600; margin: 0 0 16px 0;">
                Hello ${data.name},
              </p>
              <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for reaching out to <strong>AIICO Insurance Expert</strong>. Your inquiry regarding <strong>${data.service}</strong> has been received by an accredited agent.
              </p>
              
              <!-- Confirmation Details Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Selected Coverage</span>
                    <div style="font-size: 14px; color: #0f172a; font-weight: 700; margin-top: 2px;">${data.service}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Estimated Response Time</span>
                    <div style="font-size: 14px; color: #059669; font-weight: 700; margin-top: 2px;">Within 15 Minutes</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; tracking-wider: 0.5px;">Direct Contact</span>
                    <div style="font-size: 14px; color: #0f172a; font-weight: 600; margin-top: 2px;">${siteConfig.contact.phone}</div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 24px 0;">
                An accredited representative will review your message and contact you shortly. If you require immediate assistance, click below to chat on WhatsApp:
              </p>

              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="https://wa.me/${siteConfig.contact.whatsapp}?text=Hello,%20I%20just%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(data.service)}." style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 700; font-size: 14px; padding: 13px 26px; border-radius: 10px; text-decoration: none;">
                      💬 Chat with Agent on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 4px 0; font-weight: 600;">
                AIICO Insurance Expert
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Your trusted partner for life, health, motor, and travel insurance.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Honeypot check
    if (data.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 2. Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const providerSetting = (process.env.EMAIL_PROVIDER || "").toLowerCase();
    const resendKey = process.env.RESEND_API_KEY;
    const gmailUser = process.env.GMAIL_USER || siteConfig.contact.email;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    // Determine active provider based on EMAIL_PROVIDER or available credentials
    const useResend = providerSetting === "resend" || (!!resendKey && resendKey !== "re_dummy" && providerSetting !== "nodemailer");
    const useNodemailer = providerSetting === "nodemailer" || (!!gmailPass && providerSetting !== "resend");

    // 3A. Send via Resend
    if (useResend && resendKey && resendKey !== "re_dummy") {
      console.log("📨 Dispatching email via Resend...");
      const resend = new Resend(resendKey);
      
      const [agentResult, customerResult] = await Promise.allSettled([
        resend.emails.send({
          from: "AIICO Website Lead <onboarding@resend.dev>",
          to: [siteConfig.contact.email],
          replyTo: data.email,
          subject: `New Lead (${data.inquiryType || 'Quote'}): ${data.service} - ${data.name}`,
          html: generateLeadHtml(data),
          text: `New Lead: Name: ${data.name} | Phone: ${data.phone} | Email: ${data.email} | Service: ${data.service}\n\nMessage:\n${data.message}`,
        }),
        resend.emails.send({
          from: "AIICO Insurance <onboarding@resend.dev>",
          to: [data.email],
          subject: `Inquiry Received: ${data.service} - AIICO Insurance`,
          html: generateCustomerConfirmationHtml(data),
          text: `Hello ${data.name},\n\nThank you for reaching out to AIICO Insurance Expert. We have received your inquiry regarding ${data.service}. An agent will contact you shortly within 15 minutes.`,
        }),
      ]);

      if (agentResult.status === "rejected" || (agentResult.status === "fulfilled" && agentResult.value.error)) {
        const errorDetails = agentResult.status === "fulfilled" ? agentResult.value.error : agentResult.reason;
        console.error("Resend agent dispatch error:", errorDetails);
        return NextResponse.json({ error: errorDetails?.message || "Failed to send email via Resend" }, { status: 500 });
      }

      if (customerResult.status === "fulfilled" && customerResult.value.error) {
        console.warn("Resend customer confirmation note:", customerResult.value.error.message);
      }
    } 
    // 3B. Send via Nodemailer (Gmail SMTP)
    else if (useNodemailer && gmailPass) {
      console.log("📨 Dispatching email via Nodemailer (Gmail)...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const agentMailOptions = {
        from: `"${siteConfig.name}" <${gmailUser}>`,
        to: siteConfig.contact.email,
        replyTo: data.email,
        subject: `New Lead (${data.inquiryType || 'Quote'}): ${data.service} - ${data.name}`,
        html: generateLeadHtml(data),
        text: `New Lead Submission: Name: ${data.name} | Phone: ${data.phone} | Email: ${data.email} | Service: ${data.service}\n\nMessage:\n${data.message}`,
      };

      const customerMailOptions = {
        from: `"${siteConfig.name}" <${gmailUser}>`,
        to: data.email,
        subject: `Inquiry Received: ${data.service} - AIICO Insurance`,
        html: generateCustomerConfirmationHtml(data),
        text: `Hello ${data.name},\n\nThank you for reaching out to AIICO Insurance Expert. We have received your inquiry regarding ${data.service}. An agent will contact you shortly within 15 minutes.`,
      };

      await Promise.all([
        transporter.sendMail(agentMailOptions),
        transporter.sendMail(customerMailOptions),
      ]);
    } 
    // Fallback in local dev if no credentials configured
    else {
      console.log("📥 [Contact Form Lead Received (Dev Mode - No API Credentials)]");
      console.log(`Name: ${data.name} | Phone: ${data.phone} | Email: ${data.email}`);
      console.log(`Service: ${data.service} | Message: ${data.message}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}



