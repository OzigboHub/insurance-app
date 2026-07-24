import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/content/site-config";

// Note: To make this work in production, ensure RESEND_API_KEY is set in Vercel.
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Honeypot check (reject silently if bot filled the honeypot)
    if (data.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 }); // fake success for bots
    }

    // 2. Validate payload roughly (schema validation already handled client-side)
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Send Email via Resend
    // We send TO the agent's email. 
    // FROM must be a verified domain on Resend (e.g. Acme <onboarding@resend.dev> for testing).
    const { error } = await resend.emails.send({
      from: "AIICO Website Lead <onboarding@resend.dev>", // Change this to your verified domain in production
      to: [siteConfig.contact.email],
      replyTo: data.email,
      subject: `New Lead: ${data.service} - ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}

Message:
${data.message}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
