import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import ratelimiter from "@/lib/ratelimit";


export async function POST(req: NextRequest) {

    const ip = req.headers.get("x-forwarded-for") || "anonymous";
      const { success, limit, reset, remaining } = await ratelimiter.limit(ip);
    
      if (!success) {
        return NextResponse.json(
          {
            message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s.`,
          },
          { status: 429 }
        );
      }
      
    try {
        await ConnectoDatabase();
        const { name, email, role, password } = await req.json();
        if ( !name || !email || !role || !password) {
            return NextResponse.json({
                message: "Please fill all the details",
                status: 400
            })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                message: "Invalid email address",
                status: 400
            });
        }

        //duplicate email check
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                message: "Email already registered",
                status: 400
            })
        }


        //hash the password
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        const newUser = {
            name,
            email,
            role,
            password: hashedPassword,
            provider: "credentials",
        }

        await userModel.create(newUser);

        return NextResponse.json({
            message: "User created successfully",
            status: 201
        })

    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            status: 500
        })
    }
}