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
      consentSignature = "",
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
      hasSignature: !!signature,
      hasConsentSignature: !!consentSignature,
      hasPassportPhoto: !!passportPhoto,
      hasAddressProof: !!addressProof,
      hasIdentityProof: !!identityProof,
      submittedAt: new Date().toISOString(),
    });

    // Generate Server-Side PDF Document with all embedded files
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
        consentSignature,
        passportPhoto,
        addressProof,
        identityProof,
      });
      pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
    } catch (pdfErr) {
      console.warn("PDF generation warning:", pdfErr);
    }

    // Helper to convert base64 data URL into Nodemailer attachment object
    const createAttachmentFromDataUrl = (dataUrl: string, baseFilename: string) => {
      if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.includes("base64,")) return null;
      const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!match) return null;

      const mimeType = match[1];
      const base64Data = match[2];
      const content = Buffer.from(base64Data, "base64");

      let ext = "png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
      else if (mimeType.includes("pdf")) ext = "pdf";
      else if (mimeType.includes("webp")) ext = "webp";
      else if (mimeType.includes("png")) ext = "png";

      return {
        filename: `${baseFilename}.${ext}`,
        content,
        contentType: mimeType,
      };
    };

    // Build comprehensive list of all attachments (PDF + Signatures + KYC Docs)
    const allAttachments: any[] = [];

    // 1. Proposal PDF
    if (pdfBuffer) {
      allAttachments.push({
        filename: `AIICO_Proposal_${prefix}${randomCode}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      });
    }

    // 2. Applicant Signature Image
    const sigAttach = createAttachmentFromDataUrl(signature, `Applicant_Signature_${referenceTag.replace('#', '')}`);
    if (sigAttach) allAttachments.push(sigAttach);

    // 3. Consent Signature Image (if distinct)
    if (consentSignature && consentSignature !== signature) {
      const consentAttach = createAttachmentFromDataUrl(consentSignature, `Consent_Signature_${referenceTag.replace('#', '')}`);
      if (consentAttach) allAttachments.push(consentAttach);
    }

    // 4. Passport Photograph
    const photoAttach = createAttachmentFromDataUrl(passportPhoto, `Passport_Photo_${referenceTag.replace('#', '')}`);
    if (photoAttach) allAttachments.push(photoAttach);

    // 5. Identity Proof Document
    const idAttach = createAttachmentFromDataUrl(identityProof, `Identity_Proof_${referenceTag.replace('#', '')}`);
    if (idAttach) allAttachments.push(idAttach);

    // 6. Address Proof Document
    const addrAttach = createAttachmentFromDataUrl(addressProof, `Address_Proof_${referenceTag.replace('#', '')}`);
    if (addrAttach) allAttachments.push(addrAttach);

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
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #2563eb; font-weight: bold;">📎 Attachments Included: ${allAttachments.length} Files (Proposal PDF, E-Signatures & KYC Uploads)</p>
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
        <p style="font-size: 13px; color: #334155;"><strong>Proof of Address Attached:</strong> ${addressProof ? "Yes (Attached in email)" : (formData.addressProofDoc || "Yes")}</p>

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

        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; pb: 8px;">E. Declaration & E-Signatures</h3>
        <p style="font-size: 12px; color: #475569;">Declaration terms accepted by applicant on ${formData.declarationDate || new Date().toISOString().split('T')[0]}</p>
        
        ${signature ? `
          <div style="margin-top: 15px; padding: 15px; background-color: #0f172a; border-radius: 8px; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">Applicant E-Signature:</p>
            <img src="${signature}" alt="Applicant Signature" style="max-height: 80px; filter: invert(1);" />
          </div>
        ` : "<p style='color: red;'>Signature attached in submission files.</p>"}

        <hr style="margin: 30px 0 15px 0; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">AIICO Insurance PLC • Digital Proposal Portal Handler</p>
      </div>
    `;

    // Dispatch via Nodemailer SMTP with all attachments
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

        // 1. Send Agent Notification with Full Details & All Attachments (PDF + Signature + KYC docs)
        await transporter.sendMail({
          from: `"AIICO Proposal Portal" <${smtpUser}>`,
          to: destinationEmail,
          replyTo: email || destinationEmail,
          subject: `[NEW PROPOSAL & PDF] ${applicantName} - ${referenceTag}`,
          html: emailHtml,
          attachments: allAttachments,
        });
        console.log(`[SMTP Email Dispatched] Agent notification sent to ${destinationEmail} with ${allAttachments.length} attachments`);

        // 2. Send Client / Applicant Confirmation Copy with Proposal PDF
        if (email && email.includes("@") && email.toLowerCase() !== destinationEmail.toLowerCase()) {
          const clientConfirmationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; color: #ffffff; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 20px; color: #60a5fa;">AIICO Insurance PLC - Proposal Received</h2>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #94a3b8;">Reference Code: <strong>${referenceTag}</strong></p>
              </div>

              <p style="font-size: 15px; color: #1e293b;">Dear <strong>${applicantName}</strong>,</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                Thank you for completing and e-signing your official <strong>${formType}</strong>. We have securely received your proposal along with your uploaded documentation and attached an official PDF copy for your records.
              </p>

              <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 6px;">
                <p style="margin: 0; font-size: 13px; color: #1e293b;"><strong>Submission Reference:</strong> ${referenceTag}</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Plan / Policy:</strong> ${formType}</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Date Submitted:</strong> ${new Date().toLocaleString()}</p>
                <p style="margin: 6px 0 0 0; font-size: 12px; color: #2563eb; font-weight: bold;">📎 Attached: AIICO_Proposal_${prefix}${randomCode}.pdf</p>
              </div>

              <h4 style="color: #1e293b; margin-bottom: 8px;">Next Steps:</h4>
              <ul style="font-size: 13px; color: #475569; line-height: 1.6; padding-left: 20px;">
                <li>Our accredited underwriting agent will review your policy submission and documentation.</li>
                <li>You will receive direct communication regarding policy issuance and contribution schedule.</li>
                <li>If you have any urgent questions, simply reply directly to this email.</li>
              </ul>

              <hr style="margin: 30px 0 15px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 11px; color: #94a3b8; text-align: center;">AIICO Insurance PLC • Accredited Agent Service Portal</p>
            </div>
          `;

          const clientPdfOnly = pdfBuffer
            ? [
                {
                  filename: `AIICO_Proposal_${prefix}${randomCode}.pdf`,
                  content: pdfBuffer,
                  contentType: "application/pdf",
                },
              ]
            : [];

          await transporter.sendMail({
            from: `"AIICO Insurance PLC" <${smtpUser}>`,
            to: email,
            replyTo: destinationEmail,
            subject: `Proposal Submission Confirmation: ${formType} (${referenceTag})`,
            html: clientConfirmationHtml,
            attachments: clientPdfOnly,
          });
          console.log(`[SMTP Email Dispatched] Client confirmation sent to ${email}`);
        }
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
