import transporter from "@/lib/mailer";
import type { LeadInput } from "@/lib/leads";
import type { RxSubmissionInput } from "@/lib/rx-submissions";

const BARRY_EMAIL = "barry@dentalconceptssf.com";
const FROM = `"Dental Concepts SF" <${process.env.GMAIL_USER || BARRY_EMAIL}>`;

async function sendMail(opts: { to: string; subject: string; text: string }) {
  await transporter.sendMail({ from: FROM, to: opts.to, subject: opts.subject, text: opts.text });
}

async function notifyBoth(userEmail: string, userSubject: string, userText: string, staffSubject: string, staffText: string) {
  await Promise.all([
    sendMail({ to: userEmail, subject: userSubject, text: userText }),
    sendMail({ to: BARRY_EMAIL, subject: staffSubject, text: staffText }),
  ]);
}

export async function sendContactInquiryEmails(input: LeadInput): Promise<void> {
  const name = `${input.firstName} ${input.lastName}`;
  await notifyBoth(
    input.email,
    "We've received your inquiry — Dental Concepts SF",
    `Hi ${input.firstName},\n\nThank you for reaching out to Dental Concepts SF. We've received your inquiry and a member of our team will be in touch shortly.\n\nYour message:\n${input.message}\n\nBest,\nDental Concepts SF`,
    `New contact inquiry: ${name}`,
    `New contact inquiry received.\n\nName: ${name}\nPractice: ${input.practice}\nEmail: ${input.email}\nPhone: ${input.phone || "Not provided"}\nTopic: ${input.topic}\nPreferred contact method: ${input.preference || "Email"}\nHeard about us: ${input.source || "Not provided"}\n\nMessage:\n${input.message}`
  );
}

export async function sendUploadCaseEmails(record: { caseId: string; doctor: string; practice: string; email: string; phone: string; patient: string; type: string }): Promise<void> {
  await notifyBoth(
    record.email,
    "We've received your case — Dental Concepts SF",
    `Hi ${record.doctor || "there"},\n\nThank you for uploading a case to Dental Concepts SF. We've received your files and our lab will be in touch to confirm the details.\n\nCase reference: ${record.caseId}\n\nBest,\nDental Concepts SF`,
    `New case upload: ${record.practice || record.doctor || record.caseId}`,
    `New case uploaded.\n\nCase ID: ${record.caseId}\nDoctor: ${record.doctor}\nPractice: ${record.practice}\nEmail: ${record.email}\nPhone: ${record.phone || "Not provided"}\nPatient: ${record.patient}\nType: ${record.type}`
  );
}

export async function sendRxFormEmails(input: RxSubmissionInput): Promise<void> {
  await notifyBoth(
    input.practiceEmail,
    "We've received your RX form — Dental Concepts SF",
    `Hi ${input.doctorName},\n\nThank you for submitting a laboratory prescription (RX) form to Dental Concepts SF. We've received it and our technician will be in touch if anything further is needed.\n\nPatient: ${input.patientName}\nDue date: ${input.dueDate}\n\nBest,\nDental Concepts SF`,
    `New RX form: ${input.doctorName} / ${input.patientName}`,
    `New RX form submitted.\n\nDoctor: ${input.doctorName}\nLicense #: ${input.licenseNumber}\nDoctor phone: ${input.doctorPhone}\nPractice email: ${input.practiceEmail}\nPatient: ${input.patientName}\nPatient phone: ${input.patientPhone}\nAppointment date: ${input.appointmentDate}\nCategory: ${input.category}\nDue date: ${input.dueDate}\nDelivery: ${input.delivery}\n\nInstructions:\n${input.instructions}`
  );
}
