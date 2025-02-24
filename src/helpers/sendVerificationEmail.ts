import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Anonymous Chat App - Verify your email",
      react: VerificationEmail({
        username: username,
        otp: verifyCode,
      }),
    });

    return { success: true, message: "Email send successfully" };
  } catch (error) {
    return { success: false, message: "Email not sent" };
  }
}
