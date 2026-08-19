"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { siteConfig } from "@/content/site-config";
import { SignaturePad } from "@/components/ui/SignaturePad";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  Shield,
  FileCheck,
  User,
  MapPin,
  FileText,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  Share2,
  Send,
  Building2,
  Lock,
  ArrowRight,
  Info,
  Mail,
  MessageSquare,
} from "lucide-react";

import { ShareEmailModal } from "@/components/ui/ShareEmailModal";

export default function CorporateSavingsFormPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [referenceTag, setReferenceTag] = useState<string>("");
  const [signatureData, setSignatureData] = useState<string>("");
  const [consentSignatureData, setConsentSignatureData] = useState<string>("");
  const [passportPhotoData, setPassportPhotoData] = useState<string>("");
  const [addressProofData, setAddressProofData] = useState<string>("");
  const [identityProofData, setIdentityProofData] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [pdfData, setPdfData] = useState<{ url: string; filename: string } | null>(null);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      // Section A: Identity
      titleSurname: "",
      otherName: "",
      maidenName: "",
      gender: "Male",
      maritalStatus: "Single",
      dob: "",
      nationality: "Nigerian",
      residentialStatus: "Resident Individual",
      idType: "National ID",
      idNumber: "",
      idIssueDate: "",
      idExpiryDate: "",
      bvn: "",
      nin: "",

      // Section B: Address
      streetAddress: "",
      cityTown: "",
      state: "",
      country: "Nigeria",
      homeTel: "",
      homeMobile: "",
      email: "",
      addressProofDoc: "Tenancy Agreement",
      permAddress: "",

      // Section C: Policy Details
      commencementDate: "",
      contributionAmount: "",
      riskPremiumAmount: "",
      sourceOfFund: "",
      durationOfPlan: "",
      paymentFrequency: "Monthly",
      paymentMode: "Direct Debit",
      paymentModeOther: "",

      // Section D: Other Details
      grossAnnualIncome: "N2-5m",
      netWorthAmount: "",
      netWorthAsOfDate: "",
      occupation: "Private Sector",
      occupationOther: "",
      employerName: "",
      designation: "",
      employmentDuration: "",
      isPEP: "No",
      relatedToPEP: "No",
      additionalInfo: "",
      depositPremium: "",
      employmentStatus: "Employed",
      employerAddress: "",
      bankName: "",
      accountNumber: "",
      accountType: "Savings",

      // Section E: Beneficiaries
      primaryBeneficiaries: [
        { name: "", share: "100", relationship: "" }
      ],
      contingentBeneficiaries: [
        { name: "", share: "", relationship: "" }
      ],

      // Section F: References
      ref1Name: "",
      ref1Occupation: "",
      ref1Address: "",
      ref1Mobile: "",
      ref2Name: "",
      ref2Occupation: "",
      ref2Address: "",
      ref2Mobile: "",

      // Section G: Declaration
      declarationAgreed: false,
      declarationDate: new Date().toISOString().split("T")[0],

      // Section H: Consent
      consentFullName: "",
      consentAddress: "",
      consentAgreed: false,
      consentDate: new Date().toISOString().split("T")[0],
    }
  });

  const {
    fields: primaryFields,
    append: appendPrimary,
    remove: removePrimary,
  } = useFieldArray({ control, name: "primaryBeneficiaries" });

  const {
    fields: contingentFields,
    append: appendContingent,
    remove: removeContingent,
  } = useFieldArray({ control, name: "contingentBeneficiaries" });

  const applicantName = `${watch("titleSurname")} ${watch("otherName")}`.trim();

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleEmailShare = () => {
    setIsEmailModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    if (!signatureData) {
      alert("Please draw or upload your signature in Section G before submitting.");
      return;
    }

    if (!data.declarationAgreed || !data.consentAgreed) {
      alert("Please accept the terms declaration and data privacy consent form.");
      return;
    }

    setStatus("submitting");

    const payload = {
      formType: "AIICO Corporate Savings Plan Proposal Form (Ver 12 - 2019)",
      applicantName,
      email: data.email,
      formData: data,
      signature: signatureData,
      consentSignature: consentSignatureData || signatureData,
      passportPhoto: passportPhotoData,
      addressProof: addressProofData,
      identityProof: identityProofData,
    };

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        setReferenceTag(resData.referenceTag);
        if (resData.pdfBase64) {
          setPdfData({ url: resData.pdfBase64, filename: resData.pdfFilename });
          // Auto download PDF
          const a = document.createElement("a");
          a.href = resData.pdfBase64;
          a.download = resData.pdfFilename || `AIICO_Proposal_${resData.referenceTag}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setStatus("success");
      } else {
        throw new Error(resData.message);
      }
    } catch (err: any) {
      setStatus("error");
    }
  };

  const [isAgentSession, setIsAgentSession] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAgentSession(sessionStorage.getItem("aiico_agent_authenticated") === "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header bar */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AIICO Insurance PLC</h1>
            <p className="text-xs text-slate-400">Official Digital Proposal Form Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAgentSession && (
            <>
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <Share2 className="h-3.5 w-3.5 text-blue-400" />
                <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleEmailShare}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-sky-400 hover:text-white hover:bg-sky-950/40 transition-all"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Form</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl">
        {/* Document Official Banner Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
                <span>Version: 12 - 2019</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AIICO CORPORATE SAVINGS PLAN PROPOSAL FORM
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                AIICO Plaza, Plot No. 1-2, Churchgate Street, Victoria Island, P.O. Box 2577, Lagos, Nigeria<br />
                Tel: 0700 AIICOntact (0700 2442 6882) | Web: www.aiicopc.com | Email: aiicontact@aiicopc.com
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 shrink-0">
              <Building2 className="h-8 w-8 text-blue-400" />
              <div className="text-xs">
                <span className="text-slate-400 block">Regulated by NAICOM</span>
                <span className="font-bold text-white font-mono">RIC No. 004</span>
              </div>
            </div>
          </div>
        </div>

        {status === "success" ? (
          <div className="p-10 text-center space-y-6">
            <div className="h-20 w-20 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-900/40">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-white">Proposal Form Submitted & E-Signed!</h3>
              <p className="text-xs text-slate-300">
                Your AIICO Corporate Savings Plan proposal form and signature have been recorded. A complete copy has also been dispatched to <strong className="text-white">{siteConfig.contact.email}</strong>.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm">
              <span className="text-slate-400">Submission Reference Tag:</span>
              <span className="font-mono font-bold text-blue-400 text-base">{referenceTag}</span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const message = encodeURIComponent(
                    `Hello! I have completed and signed my official AIICO Corporate Savings Plan Proposal Form online.\n\n📌 Reference Tag: ${referenceTag}\n👤 Applicant: ${applicantName}\n📞 Phone: ${watch("homeMobile") || watch("homeTel") || "N/A"}\n📧 Email: ${watch("email")}\n💰 Contribution: ₦${watch("contributionAmount") || "N/A"}\n✍️ E-Signature & Passport: Attached & Verified`
                  );
                  window.open(`https://api.whatsapp.com/send?phone=${siteConfig.contact.whatsapp}&text=${message}`, "_blank");
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare className="h-4 w-4" /> Send Summary to Agent on WhatsApp
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
              >
                <Printer className="h-4 w-4" /> Download / Print Official PDF
              </button>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Submit Another Form
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 space-y-12">
            
            {/* SECTION A: IDENTITY DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  A
                </div>
                <h3 className="text-lg font-bold text-white">IDENTITY DETAILS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Title / Surname <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("titleSurname", { required: true })}
                    placeholder="e.g. Mr. / Okonkwo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Other Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("otherName", { required: true })}
                    placeholder="e.g. Emmanuel Chukwu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Maiden Name (if applicable)
                  </label>
                  <input
                    type="text"
                    {...register("maidenName")}
                    placeholder="e.g. Adebayo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                  <select
                    {...register("gender")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Marital Status</label>
                  <select
                    {...register("maritalStatus")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    {...register("dob")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nationality</label>
                  <select
                    {...register("nationality")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Nigerian">Nigerian</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Residential Status</label>
                  <select
                    {...register("residentialStatus")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Resident Individual">Resident Individual</option>
                    <option value="Non Resident">Non Resident</option>
                    <option value="Foreign National">Foreign National</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Proof of Identity Type</label>
                  <select
                    {...register("idType")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="National ID">National ID</option>
                    <option value="Int'l Passport">Int'l Passport</option>
                    <option value="Voter Card">Voter Card</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Identification No.</label>
                  <input
                    type="text"
                    {...register("idNumber")}
                    placeholder="e.g. A01234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ID Date of Issue</label>
                  <input
                    type="date"
                    {...register("idIssueDate")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ID Date of Expiry</label>
                  <input
                    type="date"
                    {...register("idExpiryDate")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">BVN (Bank Verification No)</label>
                  <input
                    type="text"
                    {...register("bvn")}
                    placeholder="11 digits BVN"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">NIN (National ID No)</label>
                  <input
                    type="text"
                    {...register("nin")}
                    placeholder="11 digits NIN"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Passport photo upload */}
              <div className="pt-2">
                <ImageUploader
                  label="Affix Recent Passport Size Photograph"
                  sublabel="Please upload a clear passport photo of the applicant"
                  value={passportPhotoData}
                  onChange={setPassportPhotoData}
                />
              </div>
            </div>

            {/* SECTION B: ADDRESS DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  B
                </div>
                <h3 className="text-lg font-bold text-white">ADDRESS DETAILS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Street Address for Correspondence
                  </label>
                  <input
                    type="text"
                    {...register("streetAddress")}
                    placeholder="No. 12 Admiralty Way, Lekki Phase 1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">City / Town</label>
                    <input
                      type="text"
                      {...register("cityTown")}
                      placeholder="Lagos"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      {...register("state")}
                      placeholder="Lagos State"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (Home)</label>
                  <input
                    type="tel"
                    {...register("homeMobile")}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Home Telephone</label>
                  <input
                    type="tel"
                    {...register("homeTel")}
                    placeholder="01 234 5678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="applicant@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Proof of Address Document Attached</label>
                <select
                  {...register("addressProofDoc")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
                >
                  <option value="Tenancy Agreement">Tenancy Agreement</option>
                  <option value="Registered Lease / Purchase Agreement">Registered Lease / Purchase Agreement</option>
                  <option value="Latest Bank Account Statement">Latest Bank Account Statement / Passbook</option>
                  <option value="Latest Electricity Bill">Latest Electricity Bill</option>
                  <option value="Latest Water Bill/Waste Bill">Latest Water Bill / Waste Bill (&lt; 3 months old)</option>
                  <option value="Latest Telephone Bill">Latest Telephone Bill</option>
                </select>

                <ImageUploader
                  label="Upload Proof of Address Document Image/PDF"
                  value={addressProofData}
                  onChange={setAddressProofData}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Permanent / Overseas Address (Mandatory for Non-Resident Applicant)
                </label>
                <textarea
                  rows={2}
                  {...register("permAddress")}
                  placeholder="Enter permanent address if different from above..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* SECTION C: POLICY DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  C
                </div>
                <h3 className="text-lg font-bold text-white">POLICY DETAILS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Proposed Commencement Date</label>
                  <input
                    type="date"
                    {...register("commencementDate")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contribution Amount (₦)</label>
                  <input
                    type="text"
                    {...register("contributionAmount")}
                    placeholder="e.g. 100,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Risk Premium Amount (₦)</label>
                  <input
                    type="text"
                    {...register("riskPremiumAmount")}
                    placeholder="e.g. 5,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Source of Fund</label>
                  <input
                    type="text"
                    {...register("sourceOfFund")}
                    placeholder="e.g. Salary / Business"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Duration of Plan</label>
                  <input
                    type="text"
                    {...register("durationOfPlan")}
                    placeholder="e.g. 5 Years"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Frequency of Payment</label>
                  <select
                    {...register("paymentFrequency")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half Yearly">Half Yearly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mode of Payment</label>
                  <select
                    {...register("paymentMode")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Cheque">Cheque</option>
                    <option value="Direct Debit">Direct Debit</option>
                    <option value="E-Payment">E-Payment</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION D: OTHER DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  D
                </div>
                <h3 className="text-lg font-bold text-white">OTHER DETAILS & FINANCIAL INFO</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gross Annual Income</label>
                  <select
                    {...register("grossAnnualIncome")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Below N1m">Below ₦1m</option>
                    <option value="N2-5m">₦2m - ₦5m</option>
                    <option value="N6-10m">₦6m - ₦10m</option>
                    <option value="N11-20m">₦11m - ₦20m</option>
                    <option value="N20m-above">₦20m & Above</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Occupation Sector</label>
                  <select
                    {...register("occupation")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Private Sector">Private Sector</option>
                    <option value="Public Sector">Public Sector</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Employer / Business Name</label>
                  <input
                    type="text"
                    {...register("employerName")}
                    placeholder="Company Name Ltd."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Politically Exposed Person (PEP)?</label>
                  <select
                    {...register("isPEP")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (I am a Politically Exposed Person)</option>
                    <option value="Related">Related to a Politically Exposed Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Deposit Premium Made (₦)</label>
                  <input
                    type="text"
                    {...register("depositPremium")}
                    placeholder="Amount paid"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Bank details */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Bank Details (Required for Policy Payouts & Maturity Returns)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Bank Name</label>
                    <input
                      type="text"
                      {...register("bankName")}
                      placeholder="e.g. Zenith Bank"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Account Number</label>
                    <input
                      type="text"
                      {...register("accountNumber")}
                      placeholder="10 digit NUBAN"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Account Type</label>
                    <select
                      {...register("accountType")}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION E: BENEFICIARY DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                    E
                  </div>
                  <h3 className="text-lg font-bold text-white">BENEFICIARY DETAILS</h3>
                </div>
              </div>

              {/* Primary Beneficiaries Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Primary Beneficiaries
                  </h4>
                  <button
                    type="button"
                    onClick={() => appendPrimary({ name: "", share: "", relationship: "" })}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Beneficiary
                  </button>
                </div>

                <div className="space-y-2">
                  {primaryFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="col-span-6 sm:col-span-5">
                        <input
                          type="text"
                          {...register(`primaryBeneficiaries.${idx}.name` as const)}
                          placeholder="Full Name"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <input
                          type="text"
                          {...register(`primaryBeneficiaries.${idx}.relationship` as const)}
                          placeholder="Relationship"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <input
                          type="text"
                          {...register(`primaryBeneficiaries.${idx}.share` as const)}
                          placeholder="% Share"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        {primaryFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePrimary(idx)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contingent Beneficiaries Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Contingent Beneficiaries (Optional)
                  </h4>
                  <button
                    type="button"
                    onClick={() => appendContingent({ name: "", share: "", relationship: "" })}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Contingent
                  </button>
                </div>

                <div className="space-y-2">
                  {contingentFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="col-span-6 sm:col-span-5">
                        <input
                          type="text"
                          {...register(`contingentBeneficiaries.${idx}.name` as const)}
                          placeholder="Full Name"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <input
                          type="text"
                          {...register(`contingentBeneficiaries.${idx}.relationship` as const)}
                          placeholder="Relationship"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <input
                          type="text"
                          {...register(`contingentBeneficiaries.${idx}.share` as const)}
                          placeholder="% Share"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeContingent(idx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION F: REFERENCES */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  F
                </div>
                <h3 className="text-lg font-bold text-white">NAMES OF REFERENCES</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-blue-400 uppercase">Reference 1</h4>
                  <input
                    type="text"
                    {...register("ref1Name")}
                    placeholder="Full Name"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    {...register("ref1Occupation")}
                    placeholder="Occupation"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    {...register("ref1Address")}
                    placeholder="Address"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="tel"
                    {...register("ref1Mobile")}
                    placeholder="Mobile Number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-blue-400 uppercase">Reference 2</h4>
                  <input
                    type="text"
                    {...register("ref2Name")}
                    placeholder="Full Name"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    {...register("ref2Occupation")}
                    placeholder="Occupation"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    {...register("ref2Address")}
                    placeholder="Address"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="tel"
                    {...register("ref2Mobile")}
                    placeholder="Mobile Number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION G: DECLARATION & E-SIGNATURE */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  G
                </div>
                <h3 className="text-lg font-bold text-white">APPLICANT DECLARATION & E-SIGNATURE</h3>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  I <strong className="text-white">{applicantName || "__________________"}</strong> do hereby declare that I am at present in good health and all the foregoing answers are true. I have not concealed or withheld with this proposal any fact which may be relevant. I agree that if any statement made in this proposal shall be untrue, the Company is not bound to give effect to the proposal. I agree that no cash payment shall be made by me in respect of premiums and other transactions on this policy and that all payments shall be made in cheques or electronic transfers in the name of AIICO Insurance Plc.
                </p>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="declarationAgreed"
                    {...register("declarationAgreed", { required: true })}
                    className="mt-0.5 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="declarationAgreed" className="text-slate-200 font-medium cursor-pointer">
                    I confirm and agree to all terms stated in this proposal declaration. <span className="text-blue-400">*</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="md:col-span-2">
                  <SignaturePad
                    label="Applicant E-Signature"
                    value={signatureData}
                    onChange={setSignatureData}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Signing</label>
                  <input
                    type="date"
                    {...register("declarationDate")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION H: CUSTOMER PERSONAL DATA CONSENT FORM */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  H
                </div>
                <h3 className="text-lg font-bold text-white">CUSTOMER PERSONAL DATA CONSENT FORM (NDPR 2019)</h3>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  As a customer of AIICO Insurance Plc, I understand that AIICO may collect, process, store and use my personal data for the performance of policy contracts and in compliance with Nigerian Data Protection Regulations 2019 (NDPR).
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Right to request access, correction, deletion, or processing restriction of personal data.</li>
                  <li>Entitled to provide consent prior to processing sensitive personal data.</li>
                </ul>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="consentAgreed"
                    {...register("consentAgreed", { required: true })}
                    className="mt-0.5 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="consentAgreed" className="text-slate-200 font-medium cursor-pointer">
                    I hereby consent to the collection, processing, use, and transfer of my personal data. <span className="text-blue-400">*</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Consent Full Name</label>
                  <input
                    type="text"
                    {...register("consentFullName")}
                    placeholder="Full Name as appearing on ID"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Consent Date</label>
                  <input
                    type="date"
                    {...register("consentDate")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {status === "error" && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to submit proposal form. Please review all fields and try again.</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span>Encrypted 256-bit Secure E-Signature Submission</span>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl shadow-blue-600/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                {status === "submitting" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit & Sign Proposal Online</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <ShareEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        formTitle="AIICO Corporate Savings Plan Proposal Form"
        formUrl={typeof window !== "undefined" ? window.location.href : "/forms/corporate-savings"}
      />
    </div>
  );
}
