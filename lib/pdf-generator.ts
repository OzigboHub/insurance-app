import PDFDocument from "pdfkit";

export async function generateProposalPDF(data: {
  formType: string;
  applicantName: string;
  email: string;
  referenceTag: string;
  formData: any;
  signature?: string;
  passportPhoto?: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Header Branding
      doc.fillColor("#0f172a").rect(0, 0, 595.28, 90).fill();
      doc.font("Helvetica-Bold").fillColor("#60a5fa").fontSize(18).text("AIICO INSURANCE PLC", 40, 20);
      doc.font("Helvetica").fillColor("#ffffff").fontSize(12).text(data.formType, 40, 45);
      doc.font("Helvetica").fillColor("#94a3b8").fontSize(10).text(`Reference Tag: ${data.referenceTag}  |  Date: ${new Date().toLocaleDateString()}`, 40, 63);

      doc.moveDown(3);
      doc.fillColor("#0f172a");

      // Section A: Identity
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a8a").text("A. IDENTITY DETAILS", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10).fillColor("#334155");
      doc.text(`Full Name: ${data.applicantName}`);
      doc.text(`Gender: ${data.formData.gender || "N/A"}  |  Marital Status: ${data.formData.maritalStatus || "N/A"}  |  DOB: ${data.formData.dob || "N/A"}`);
      doc.text(`Nationality: ${data.formData.nationality || "Nigerian"}  |  Residential Status: ${data.formData.residentialStatus || "Resident"}`);
      doc.text(`Proof of Identity: ${data.formData.idType || "N/A"} (No: ${data.formData.idNumber || "N/A"})`);
      doc.text(`BVN: ${data.formData.bvn || "N/A"}  |  NIN: ${data.formData.nin || "N/A"}`);
      if (data.formData.tin) doc.text(`Tax ID (TIN): ${data.formData.tin}`);

      doc.moveDown(1);

      // Section B: Address Details
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a8a").text("B. ADDRESS & CONTACT DETAILS", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10).fillColor("#334155");
      doc.text(`Address: ${data.formData.streetAddress || "N/A"}, ${data.formData.cityTown || ""}, ${data.formData.state || ""}`);
      doc.text(`Email: ${data.email}  |  Mobile: ${data.formData.homeMobile || data.formData.homeMobile1 || "N/A"}`);
      doc.text(`Proof of Address Attached: ${data.formData.addressProofDoc || "Yes"}`);

      doc.moveDown(1);

      // Section C: Policy & Financials
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a8a").text("C. POLICY TERMS & FINANCIALS", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10).fillColor("#334155");
      doc.text(`Proposed Commencement Date: ${data.formData.commencementDate || "N/A"}`);
      doc.text(`Contribution Amount / Sum Assured: NGN ${data.formData.contributionAmount || data.formData.sumAssured || "0"}`);
      doc.text(`Duration: ${data.formData.durationOfPlan || "N/A"}  |  Frequency: ${data.formData.paymentFrequency || "Monthly"}`);
      doc.text(`Payment Mode: ${data.formData.paymentMode || "Direct Debit"}`);
      doc.text(`Bank Payout Account: ${data.formData.bankName || "N/A"} - ${data.formData.accountNumber || "N/A"} (${data.formData.accountType || "Savings"})`);

      doc.moveDown(1);

      // Section D: Beneficiaries
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a8a").text("D. PRIMARY BENEFICIARIES", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10).fillColor("#334155");
      const primaryBens = data.formData.primaryBeneficiaries || [];
      if (primaryBens.length > 0) {
        primaryBens.forEach((b: any, idx: number) => {
          doc.text(`${idx + 1}. ${b.name || "N/A"}  -  Relationship: ${b.relationship || "N/A"}  -  Share: ${b.share || 0}%`);
        });
      } else {
        doc.text("None specified");
      }

      doc.moveDown(1);

      // Section E: Declaration & E-Signature
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a8a").text("E. APPLICANT DECLARATION & E-SIGNATURE", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(9).fillColor("#475569");
      doc.text("I hereby declare that all answers provided in this proposal form are true and accurate to the best of my knowledge, and agree that this statement forms the basis of the insurance contract.");

      doc.moveDown(1);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(`Signed by: ${data.applicantName}`);

      // Embed Base64 Signature Image if available
      if (data.signature && data.signature.startsWith("data:image")) {
        try {
          const base64Data = data.signature.replace(/^data:image\/\w+;base64,/, "");
          const imgBuffer = Buffer.from(base64Data, "base64");
          doc.image(imgBuffer, { width: 140, height: 50 });
        } catch (imgErr) {
          console.warn("Failed to render signature image in PDF:", imgErr);
        }
      }

      doc.moveDown(1);
      doc.font("Helvetica").fontSize(8).fillColor("#94a3b8").text("Generated via AIICO Insurance Accredited Agent Online Proposal Portal", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
