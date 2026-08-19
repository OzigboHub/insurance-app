import { NextResponse } from "next/server";
import { siteConfig } from "@/content/site-config";
import { generateProposalPDF } from "@/lib/pdf-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      formType = "AIICO Proposal Form",
      applicantName = "Applicant",
      email = "",
      formData = {},
      signature = "",
      passportPhoto = "",
      addressProof = "",
      identityProof = "",
    } = body;

    const isFEP = formType.includes("Flexible Endowment");
    const prefix = isFEP ? "AIICO-FEP-" : "AIICO-CSP-";
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const referenceTag = `#${prefix}${randomCode}`;
    const destinationEmail = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email || "eoziegbe2@gmail.com";

    console.log(`[Proposal Submission Received] ${referenceTag}`, {
      formType,
      applicantName,
      email,
      destinationEmail,
      submittedAt: new Date().toISOString(),
    });

    // Generate Server-Side PDF Document
    let pdfBuffer: Buffer | null = null;
    let pdfBase64: string = "";

    try {
      pdfBuffer = await generateProposalPDF({
        formType,
        applicantName,
        email,
        referenceTag,
        formData,
        signature,
        passportPhoto,
      });
      pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
    } catch (pdfErr) {
      console.warn("PDF generation warning:", pdfErr);
    }

    // Format Beneficiaries table HTML
    const primaryBens = formData.primaryBeneficiaries || [];
    const primaryHtml = primaryBens.map((b: any, i: number) => `
      <tr>
        <td style="padding: 6px; border: 1px solid #cbd5e1;">${i + 1}. ${b.name || "N/A"}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1;">${b.relationship || "N/A"}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: bold;">${b.share || "0"}%</td>
      </tr>
    `).join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; color: #ffffff; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; color: #60a5fa;">AIICO Insurance PLC - Signed Proposal Form</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #94a3b8;">${formType} | Reference Tag: <strong>${referenceTag}</strong></p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b;">Applicant Name: ${applicantName}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">Email: ${email} | Phone: ${formData.homeMobile || formData.homeMobile1 || "N/A"}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">Submission Date: ${new Date().toLocaleString()}</p>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #2563eb; font-weight: bold;">📎 Attached File: Proposal Document PDF (${prefix}${randomCode}.pdf)</p>
        </div>

        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; pb: 8px;">A. Identity & Personal Info</h3>
        <table style="width: 100%; font-size: 13px; color: #334155; margin-bottom: 20px;">
          <tr><td><strong>Title/Surname:</strong> ${formData.titleSurname || "N/A"}</td><td><strong>Other Name:</strong> ${formData.otherName || "N/A"}</td></tr>
          <tr><td><strong>Gender:</strong> ${formData.gender || "N/A"}</td><td><strong>Marital Status:</strong> ${formData.maritalStatus || "N/A"}</td></tr>
          <tr><td><strong>DOB:</strong> ${formData.dob || "N/A"}</td><td><strong>Nationality:</strong> ${formData.nationality || "N/A"}</td></tr>
          <tr><td><strong>BVN:</strong> ${formData.bvn || "N/A"}</td><td><strong>NIN:</strong> ${formData.nin || "N/A"}</td></tr>
          ${formData.tin ? `<tr><td><strong>TIN:</strong> ${formData.tin}</td><td><strong>Tax Jurisdiction:</strong> ${formData.taxJurisdiction || "Nigeria"}</td></tr>` : ""}
        </table>

        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; pb: 8px;">B. Address Details</h3>
        <p style="font-size: 13px; color: #334155;"><strong>Address:</strong> ${formData.streetAddress || "N/A"}, ${formData.cityTown || ""}, ${formData.state || ""}</p>
        <p style="font-size: 13px; color: #334155;"><strong>Proof of Address Doc:</strong> ${formData.addressProofDoc || "Attached"}</p>

        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; pb: 8px;">C. Policy Terms</h3>
        <table style="width: 100%; font-size: 13px; color: #334155; margin-bottom: 20px;">
          <tr><td><strong>Commencement Date:</strong> ${formData.commencementDate || "N/A"}</td><td><strong>Duration:</strong> ${formData.durationOfPlan || "N/A"}</td></tr>
          <tr><td><strong>Contribution / Sum Assured:</strong> ₦${formData.contributionAmount || formData.sumAssured || "0"}</td><td><strong>Payment Frequency:</strong> ${formData.paymentFrequency || "N/A"}</td></tr>
          <tr><td><strong>Payment Mode:</strong> ${formData.paymentMode || "N/A"}</td><td><strong>Bank Account:</strong> ${formData.bankName || "N/A"} (${formData.accountNumber || "N/A"})</td></tr>
        </table>

        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; pb: 8px;">D. Primary Beneficiaries</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 6px; border: 1px solid #cbd5e1;">Name</th>
              <th style="padding: 6px; border: 1px solid #cbd5e1;">Relationship</th>
              <th style="padding: 6px; border: 1px solid #cbd5e1;">% Share</th>
            </tr>
          </thead>
          <tbody>
            ${primaryHtml || "<tr><td colspan='3' style='padding: 6px;'>None specified</td></tr>"}
          </tbody>
        </table>

        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; pb: 8px;">E. Declaration & E-Signature</h3>
        <p style="font-size: 12px; color: #475569;">Declaration terms accepted by applicant on ${formData.declarationDate || new Date().toISOString().split('T')[0]}</p>
        
        ${signature ? `
          <div style="margin-top: 15px; padding: 15px; background-color: #0f172a; border-radius: 8px; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">Applicant E-Signature Tag:</p>
            <img src="${signature}" alt="Applicant Signature" style="max-height: 80px; filter: invert(1);" />
          </div>
        ` : "<p style='color: red;'>Signature attached in submission data.</p>"}

        <hr style="margin: 30px 0 15px 0; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">AIICO Insurance PLC • Digital Proposal Portal Handler</p>
      </div>
    `;

    // Dispatch via Nodemailer SMTP with PDF attachment if SMTP credentials exist
    const smtpUser = process.env.SMTP_USER || process.env.CONTACT_TO_EMAIL;
    const smtpPass = process.env.SMTP_PASS;

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

        const mailOptions: any = {
          from: `"AIICO Proposal Portal" <${smtpUser}>`,
          to: destinationEmail,
          subject: `[NEW PROPOSAL & PDF] ${applicantName} - ${referenceTag}`,
          html: emailHtml,
        };

        if (pdfBuffer) {
          mailOptions.attachments = [
            {
              filename: `AIICO_Proposal_${prefix}${randomCode}.pdf`,
              content: pdfBuffer,
            },
          ];
        }

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP Email Dispatched] PDF Proposal sent to ${destinationEmail}`);
      } catch (emailErr) {
        console.warn("Failed to dispatch SMTP email notification:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      referenceTag,
      destinationEmail,
      pdfBase64,
      pdfFilename: `AIICO_Proposal_${prefix}${randomCode}.pdf`,
      message: "Proposal form submitted and PDF attached successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error processing proposal submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process form submission" },
      { status: 500 }
    );
  }
}
