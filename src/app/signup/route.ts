import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { verify } from "crypto";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json({
        success: false,
        message: "Username already exists",
      });
    }

    const existingVerifiedUserByEmail = await UserModel.findOne({
      email,
    });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingVerifiedUserByEmail) {
      if (existingVerifiedUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "Email already exists",
        });
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingVerifiedUserByEmail.password = hasedPassword;
        existingVerifiedUserByEmail.verifyCode = verifyCode;
        existingVerifiedUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingVerifiedUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        email,
        username,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    if (emailResponse.success) {
      return Response.json(
        {
          success: true,
          message: emailResponse.message,
        },
        { status: 201 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error creating user",
      },
      { status: 500 }
    );
  }
}
