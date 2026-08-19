import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message, inquiryType, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: false, message: "Bot detected" }, { status: 400 });
    }

    console.log(`[Contact Inquiry Received]`, {
      name,
      email,
      phone,
      service,
      inquiryType,
      message,
      submittedAt: new Date().toISOString(),
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER || process.env.CONTACT_TO_EMAIL;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.CONTACT_TO_EMAIL || "eoziegbe2@gmail.com";

    const inquiryHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; padding: 15px; border-radius: 8px; color: #ffffff; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #60a5fa;">New Website Inquiry Received</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #94a3b8;">${inquiryType?.toUpperCase() || "GENERAL INQUIRY"} - ${service}</p>
        </div>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
        <p><strong>Policy / Plan of Interest:</strong> ${service}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <div style="margin-top: 15px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b;">Message:</p>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #334155; white-space: pre-wrap;">${message || "No specific message provided."}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0 10px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">AIICO Insurance PLC • Customer Support Portal</p>
      </div>
    `;

    if (smtpUser && smtpPass) {
      try {
        const nodemailer = (await import("nodemailer")).default;
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
          from: `"AIICO Contact Portal" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: email,
          subject: `[NEW INQUIRY] ${name} - ${service}`,
          html: inquiryHtml,
        });
      } catch (smtpErr) {
        console.warn("Failed to dispatch SMTP email notification for contact inquiry:", smtpErr);
      }
    } else if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: "AIICO Contact Portal <noreply@aiicopc.com>",
          to: recipientEmail,
          replyTo: email,
          subject: `New ${inquiryType?.toUpperCase() || "INQUIRY"}: ${name} - ${service}`,
          html: inquiryHtml,
        });
      } catch (emailErr) {
        console.warn("Failed to dispatch Resend email notification:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
      referenceTag: `#AIC-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  } catch (error: any) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
