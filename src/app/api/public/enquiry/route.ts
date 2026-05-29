import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { sendEmail } from "@/lib/email";

// Simple in-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // Max 3 enquiry submissions per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps older than the window
  const activeTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW);
  
  if (activeTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    // Get IP address from headers
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again after a minute." },
        { status: 429 }
      );
    }

    const data = await request.json();
    const {
      fullName,
      companyName,
      email,
      phoneNumber,
      city,
      country,
      product,
      productId,
      message,
    } = data;

    if (!fullName || !email || !product || !message) {
      return NextResponse.json(
        { error: "Missing required fields (fullName, email, product, message)" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Store in MongoDB
    const newEnquiry = await Enquiry.create({
      fullName,
      companyName: companyName || "",
      email,
      phoneNumber: phoneNumber || "",
      city: city || "",
      country: country || "",
      product,
      productId: productId || null,
      message,
      status: "pending",
    });

    // Format HTML and text bodies for Nodemailer
    const emailSubject = `New Product Enquiry: ${product} from ${fullName}`;
    const emailText = `
      Name: ${fullName}
      Company: ${companyName || "N/A"}
      Email: ${email}
      Phone: ${phoneNumber || "N/A"}
      Location: ${city || "N/A"}, ${country || "N/A"}
      Product: ${product}
      Message: ${message}
    `;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0A2540; border-bottom: 2px solid #00D2C4; padding-bottom: 10px; margin-top: 0;">New Product Enquiry</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 150px;">Full Name:</td>
            <td style="padding: 8px 0; color: #1a202c;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Company Name:</td>
            <td style="padding: 8px 0; color: #1a202c;">${companyName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
            <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Phone Number:</td>
            <td style="padding: 8px 0; color: #1a202c;">${phoneNumber || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Location:</td>
            <td style="padding: 8px 0; color: #1a202c;">${city || "N/A"}, ${country || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Product Enquired:</td>
            <td style="padding: 8px 0; color: #0080ff; font-weight: bold;">${product}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-radius: 6px; border-left: 4px solid #0A2540;">
          <h4 style="margin: 0 0 8px 0; color: #4a5568;">Message:</h4>
          <p style="margin: 0; color: #2d3748; line-height: 1.5; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 25px; font-size: 12px; color: #a0aec0; text-align: center;">This email was generated automatically by the Reckron Pharma portal.</p>
      </div>
    `;

    // Attempt to send email
    const companyEmail = process.env.SMTP_TO || "enquiries@reckronpharma.com";
    await sendEmail({
      to: companyEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully!",
      enquiryId: newEnquiry._id,
    });
  } catch (error) {
    console.error("POST Enquiry API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
