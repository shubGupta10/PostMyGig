import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";

enum roleWeTake {
  freelancer = "freelancer",
  client = "client"
}


export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { name, email, role, password } = await req.json();
        if (!name || !email || !role || !password) {
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

        //validate role
        if (!Object.values(roleWeTake).includes(role)) {
            return NextResponse.json({
                message: "Invalid role provided",
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