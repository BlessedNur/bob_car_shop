import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, formData } = body;

    let emailContent = "";
    let subject = "";

    if (type === "contact") {
      subject = `New Contact Form Submission: ${formData.subject}`;
      emailContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        <p><strong>Preferred Contact Method:</strong> ${
          formData.preferredContact
        }</p>
        <p><strong>Newsletter Subscription:</strong> ${
          formData.subscribe ? "Yes" : "No"
        }</p>
      `;
    } else if (type === "order") {
      subject = `New Order Inquiry: ${formData.vehicleName}`;
      emailContent = `
        <h2>New Order Inquiry</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Vehicle:</strong> ${formData.vehicleName}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        <p><strong>Preferred Contact Method:</strong> ${formData.preferredContact}</p>
      `;
    }

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT,
      subject: subject,
      html: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
