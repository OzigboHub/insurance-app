import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { clientEmail, clientName = "Valued Client", formTitle, formUrl } = await req.json();

    if (!clientEmail || !clientEmail.includes("@")) {
      return NextResponse.json({ success: false, message: "Valid client email is required" }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER || process.env.CONTACT_TO_EMAIL || "eoziegbe2@gmail.com";
    const smtpPass = process.env.SMTP_PASS;

    const emailSubject = `Official Insurance Proposal Form: ${formTitle}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #1e3a8a; margin-top: 0;">AIICO Insurance PLC</h2>
        <p style="font-size: 15px; color: #334155;">Dear ${clientName},</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6;">You have been invited to fill out and e-sign your official <strong>${formTitle}</strong> online.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${formUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Open & Sign Form Online
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b;">Or copy and paste this link into your web browser:<br/><a href="${formUrl}" style="color: #2563eb;">${formUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">AIICO Insurance PLC • Accredited Agent Proposal Portal</p>
      </div>
    `;

    // Send via Nodemailer SMTP if credentials are provided in .env.local
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"AIICO Proposal Portal" <${smtpUser}>`,
          to: clientEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        return NextResponse.json({
          success: true,
          message: `Proposal invitation email sent directly to ${clientEmail}!`,
        });
      } catch (smtpErr: any) {
        console.warn("Nodemailer SMTP dispatch error:", smtpErr);
        return NextResponse.json(
          { success: false, message: smtpErr.message || "Failed to dispatch email via SMTP." },
          { status: 400 }
        );
      }
    }

    // Fallback response when SMTP password is not set yet in .env.local
    return NextResponse.json(
      {
        success: false,
        message: "Server SMTP is not configured yet. Please use 'Open Mail App' or set SMTP_PASS in .env.local.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to dispatch email" }, { status: 500 });
  }
}
