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
  HeartPulse,
  Activity,
  AlertTriangle,
  Mail,
  MessageSquare,
} from "lucide-react";

import { ShareEmailModal } from "@/components/ui/ShareEmailModal";

export default function FlexibleEndowmentFormPage() {
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

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      // Section A: Identity
      titleSurname: "",
      otherName: "",
      maidenName: "",
      gender: "Male",
      maritalStatus: "Single",
      dob: "",
      nationality: "Nigerian",
      stateOfOrigin: "",
      residentialStatus: "Resident Individual",
      idType: "National ID",
      idNumber: "",
      idIssueDate: "",
      idExpiryDate: "",
      bvn: "",
      tin: "",
      nin: "",
      taxJurisdiction: "Nigeria",

      // Section B: Address
      streetAddress: "",
      cityTown: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      homeMobile1: "",
      homeMobile2: "",
      email: "",
      addressProofDoc: "Tenancy Agreement",
      permAddress: "",

      // Section C: Other & Policy Details
      grossAnnualIncome: "N2-5m",
      netWorthAmount: "",
      netWorthAsOfDate: "",
      occupation: "Private Sector Service",
      occupationOther: "",
      principal: "",
      natureOfBusiness: "",
      employmentDuration: "",
      isPEP: "No",
      relatedToPEP: "No",
      additionalInfo: "",
      commencementDate: "",
      sumAssured: "",
      riderWP: false,
      riderAX: false,
      sourceOfFund: "",
      durationOfPlan: "9 Years",
      paymentFrequency: "Monthly",
      paymentMode: "Direct Debit",
      depositPremium: "",
      employmentStatus: "Employed",
      employerName: "",
      employerAddress: "",
      bankName: "",
      accountNumber: "",
      accountType: "Savings",

      // Section D: Medical & Insurance History
      insuranceModified: "No",
      insuranceModifiedDetails: "",
      existingInsuranceForce: "",
      existingYearIssued: "",
      existingCompany: "",
      existingAmount: "",
      presentStateOfHealth: "Good",
      hasDeformity: "No",
      height: "",
      weight: "",
      beenIll: "No",
      consultedPhysician: "No",
      underMedicalObservation: "No",
      medicalConditionDetails: "",

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
      declarationPlace: "Lagos",
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
      formType: "AIICO Flexible Endowment Plan Proposal Form (Ver 07-2020)",
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
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AIICO Insurance PLC</h1>
            <p className="text-xs text-slate-400">Official Digital Proposal Form Portal</p>
          </div>
        </div>

        {isAgentSession && (
          <div className="flex items-center gap-2">
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
              <span>Send via Email</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
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
        {/* Official Banner Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 p-6 sm:p-8 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <span>Version: 07-2020</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AIICO FLEXIBLE ENDOWMENT PLAN PROPOSAL FORM
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                AIICO Plaza, Plot No. 1-2, Churchgate Street, Victoria Island, P.O. Box 2577, Lagos, Nigeria<br />
                Tel: (0700) AIICOntact (0700 2442 6882 28) | Web: www.aiicopc.com | Email: aiicontact@aiicopc.com
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 shrink-0">
              <Building2 className="h-8 w-8 text-indigo-400" />
              <div className="text-xs">
                <span className="text-slate-400 block">Regulated by NAICOM</span>
                <span className="font-bold text-white font-mono">RIC No. 004</span>
              </div>
            </div>
          </div>

          {/* Section 54 (2) Advisory Note */}
          <div className="mt-6 p-3 rounded-xl bg-slate-950/70 border border-indigo-500/20 text-[11px] text-slate-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Notice:</strong> An Insurance Agent who assists an applicant to complete this application/proposal for insurance shall be deemed to have done so as the agent of the applicant in accordance with Section 54 (2) Insurance Act 2003.
            </span>
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
                Your AIICO Flexible Endowment Plan proposal form and signature have been recorded. A complete copy has also been dispatched to <strong className="text-white">{siteConfig.contact.email}</strong>.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm">
              <span className="text-slate-400">Submission Reference Tag:</span>
              <span className="font-mono font-bold text-indigo-400 text-base">{referenceTag}</span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const message = encodeURIComponent(
                    `Hello! I have completed and signed my official AIICO Flexible Endowment Plan Proposal Form online.\n\n📌 Reference Tag: ${referenceTag}\n👤 Applicant: ${applicantName}\n📞 Phone: ${watch("homeMobile1") || "N/A"}\n📧 Email: ${watch("email")}\n💰 Sum Assured: ₦${watch("sumAssured") || "N/A"}\n✍️ E-Signature & Passport: Attached & Verified`
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
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
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  A
                </div>
                <h3 className="text-lg font-bold text-white">IDENTITY DETAILS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Title / Surname <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("titleSurname", { required: true })}
                    placeholder="e.g. Mr. / Balogun"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Other Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("otherName", { required: true })}
                    placeholder="e.g. Segun Adewale"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Maiden Name</label>
                  <input
                    type="text"
                    {...register("maidenName")}
                    placeholder="e.g. Williams"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                  <select
                    {...register("gender")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Marital Status</label>
                  <select
                    {...register("maritalStatus")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nationality</label>
                  <select
                    {...register("nationality")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Nigerian">Nigerian</option>
                    <option value="Non-Nigerian">Non-Nigerian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State of Origin</label>
                  <input
                    type="text"
                    {...register("stateOfOrigin")}
                    placeholder="e.g. Ogun State"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Residential Status</label>
                  <select
                    {...register("residentialStatus")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                    placeholder="e.g. B98765432"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">BVN Number</label>
                  <input
                    type="text"
                    {...register("bvn")}
                    placeholder="11 digits BVN"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">NIN Number</label>
                  <input
                    type="text"
                    {...register("nin")}
                    placeholder="11 digits NIN"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tax ID Number (TIN)</label>
                  <input
                    type="text"
                    {...register("tin")}
                    placeholder="TIN Number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Jurisdiction of Tax</label>
                  <input
                    type="text"
                    {...register("taxJurisdiction")}
                    placeholder="Nigeria"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

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
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  B
                </div>
                <h3 className="text-lg font-bold text-white">ADDRESS DETAILS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Residential Street Address</label>
                  <input
                    type="text"
                    {...register("streetAddress")}
                    placeholder="No. 45 Allen Avenue, Ikeja"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    {...register("postalCode")}
                    placeholder="100001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (Primary)</label>
                  <input
                    type="tel"
                    {...register("homeMobile1")}
                    placeholder="+234 802 000 0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (Secondary)</label>
                  <input
                    type="tel"
                    {...register("homeMobile2")}
                    placeholder="+234 818 000 0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="applicant@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Proof of Address Document Attached</label>
                <select
                  {...register("addressProofDoc")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
                >
                  <option value="Tenancy Agreement">Tenancy Agreement</option>
                  <option value="Registered Lease / Purchase Agreement">Registered Lease / Purchase Agreement</option>
                  <option value="Latest Bank Account Statement">Latest Bank Account Statement / Passbook</option>
                  <option value="Latest Gas / Water / Electricity Bill">Latest Gas / Water / Electricity Bill (&lt; 3 months old)</option>
                  <option value="Latest Telephone Bill">Latest Telephone Bill</option>
                </select>

                <ImageUploader
                  label="Upload Proof of Address Document Image/PDF"
                  value={addressProofData}
                  onChange={setAddressProofData}
                />
              </div>
            </div>

            {/* SECTION C: OTHER DETAILS & POLICY TERMS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  C
                </div>
                <h3 className="text-lg font-bold text-white">POLICY & FINANCIAL DETAILS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gross Annual Income</label>
                  <select
                    {...register("grossAnnualIncome")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Private Sector Service">Private Sector Service</option>
                    <option value="Public Sector">Public Sector</option>
                    <option value="Government Service">Government Service</option>
                    <option value="Business">Business</option>
                    <option value="Professional">Professional</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Retired">Retired</option>
                    <option value="Housewife">Housewife</option>
                    <option value="Student">Student</option>
                    <option value="Forex Dealer">Forex Dealer</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sum Assured (₦)</label>
                  <input
                    type="text"
                    {...register("sumAssured")}
                    placeholder="e.g. 5,000,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Riders Selection */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Select Policy Riders (Optional Coverage)
                </label>
                <div className="flex flex-wrap gap-6 text-xs text-slate-200 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("riderWP")}
                      className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Waiver of Premium (WP)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("riderAX")}
                      className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Accidental Death & Dismemberment (AX)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Duration of Plan</label>
                  <select
                    {...register("durationOfPlan")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="6 Years">6 Years</option>
                    <option value="9 Years">9 Years</option>
                    <option value="12 Years">12 Years</option>
                    <option value="15 Years">15 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Frequency of Payment</label>
                  <select
                    {...register("paymentFrequency")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Cheque">Cheque</option>
                    <option value="Direct Debit">Direct Debit</option>
                  </select>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Bank Details (For Policy Maturity & Claim Payments)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Bank Name</label>
                    <input
                      type="text"
                      {...register("bankName")}
                      placeholder="e.g. First Bank"
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

            {/* SECTION D: MEDICAL & EXISTING INSURANCE HISTORY */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  D
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-rose-400" />
                  <span>MEDICAL & INSURANCE HISTORY</span>
                </h3>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="sm:col-span-2 text-xs text-slate-300">
                    Has any application for life, accident or health insurance ever been declined, postponed, rated or modified?
                  </label>
                  <select
                    {...register("insuranceModified")}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {watch("insuranceModified") === "Yes" && (
                  <input
                    type="text"
                    {...register("insuranceModifiedDetails")}
                    placeholder="Specify details of previous insurance modification..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                )}
              </div>

              {/* Health Evaluation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Present State of Health</label>
                  <input
                    type="text"
                    {...register("presentStateOfHealth")}
                    placeholder="Good / Excellent"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Any Physical Deformity?</label>
                  <select
                    {...register("hasDeformity")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Height (cm or ft/in)</label>
                  <input
                    type="text"
                    {...register("height")}
                    placeholder="e.g. 175 cm"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Weight (kg or lbs)</label>
                  <input
                    type="text"
                    {...register("weight")}
                    placeholder="e.g. 72 kg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <span className="sm:col-span-2 text-slate-300">Have you been ill or under medical treatment in the last 5 years?</span>
                  <select {...register("beenIll")} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <span className="sm:col-span-2 text-slate-300">Have you consulted a physician for any chronic medical condition?</span>
                  <select {...register("consultedPhysician")} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {(watch("beenIll") === "Yes" || watch("consultedPhysician") === "Yes") && (
                  <textarea
                    rows={2}
                    {...register("medicalConditionDetails")}
                    placeholder="Please state illness, physician name, dates and treatment details..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  />
                )}
              </div>
            </div>

            {/* SECTION E: BENEFICIARY DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    E
                  </div>
                  <h3 className="text-lg font-bold text-white">BENEFICIARY DETAILS</h3>
                </div>
              </div>

              {/* Primary Beneficiaries Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Primary Beneficiaries</h4>
                  <button
                    type="button"
                    onClick={() => appendPrimary({ name: "", share: "", relationship: "" })}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Contingent Beneficiaries (Optional)</h4>
                  <button
                    type="button"
                    onClick={() => appendContingent({ name: "", share: "", relationship: "" })}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
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
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  F
                </div>
                <h3 className="text-lg font-bold text-white">NAMES OF REFERENCES</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Reference 1</h4>
                  <input type="text" {...register("ref1Name")} placeholder="Full Name" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  <input type="text" {...register("ref1Occupation")} placeholder="Occupation" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  <input type="text" {...register("ref1Address")} placeholder="Address" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  <input type="tel" {...register("ref1Mobile")} placeholder="Mobile Number" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Reference 2</h4>
                  <input type="text" {...register("ref2Name")} placeholder="Full Name" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  <input type="text" {...register("ref2Occupation")} placeholder="Occupation" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  <input type="text" {...register("ref2Address")} placeholder="Address" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  <input type="tel" {...register("ref2Mobile")} placeholder="Mobile Number" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                </div>
              </div>
            </div>

            {/* SECTION G: DECLARATION & SIGNATURE */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  G
                </div>
                <h3 className="text-lg font-bold text-white">APPLICANT DECLARATION & SIGNATURE</h3>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  I <strong className="text-white">{applicantName || "__________________"}</strong> do hereby declare that I am at present in good health and all the foregoing answers are true. I agree that this and all statements made in connection with this proposal shall be the basis of this contract. I irrevocably authorize any medical practitioner or institution to disclose medical information to AIICO Insurance Plc.
                </p>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="declarationAgreed"
                    {...register("declarationAgreed", { required: true })}
                    className="mt-0.5 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="declarationAgreed" className="text-slate-200 font-medium cursor-pointer">
                    I confirm and agree to all terms stated in this flexible endowment proposal declaration. <span className="text-indigo-400">*</span>
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

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Place of Signing</label>
                    <input
                      type="text"
                      {...register("declarationPlace")}
                      placeholder="e.g. Lagos"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date of Signing</label>
                    <input
                      type="date"
                      {...register("declarationDate")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION H: CUSTOMER PERSONAL DATA CONSENT FORM */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  H
                </div>
                <h3 className="text-lg font-bold text-white">CUSTOMER PERSONAL DATA CONSENT FORM (NDPR 2019)</h3>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  As a customer of AIICO Insurance Plc, I understand that AIICO may collect, process, store and use my personal data in accordance with Nigerian Data Protection Regulations 2019 (NDPR).
                </p>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="consentAgreed"
                    {...register("consentAgreed", { required: true })}
                    className="mt-0.5 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="consentAgreed" className="text-slate-200 font-medium cursor-pointer">
                    I hereby consent to the collection, processing, use and transfer of my personal data. <span className="text-indigo-400">*</span>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Consent Date</label>
                  <input
                    type="date"
                    {...register("consentDate")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {status === "error" && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to submit flexible endowment proposal form. Please try again.</span>
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl shadow-indigo-600/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                {status === "submitting" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit & Sign Endowment Plan</span>
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
        formTitle="AIICO Flexible Endowment Plan Proposal Form"
        formUrl={typeof window !== "undefined" ? window.location.href : "/forms/flexible-endowment"}
      />
    </div>
  );
}
