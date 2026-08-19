import { NextRequest, NextResponse } from "next/server";
import resend from "@/lib/resend";
import { EmailSender } from "@/lib/email/send";
import redis from "@/lib/redis";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";
import { postMyGigWelcomeBackTemplate } from "@/lib/email/templates";

const NODE_ENV = process.env.NODE_ENV;

const getAllUsers = async () => {
    try {
        await ConnectoDatabase();

        const fetchAllUsers = await userModel.find({}).lean();

        if (!fetchAllUsers || fetchAllUsers.length === 0) {
            return { success: false, data: [] };
        }

        const userData = fetchAllUsers.map(user => ({
            email: user.email,
            name: user.name || "there"
        }));

        return { success: true, data: userData };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, data: [] };
    }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailsInBatches = async (users: { email: string, name: string }[], batchSize = 2, delayMs = 1000) => {
    let sentCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);

        await Promise.all(batch.map(async (user) => {
            try {
                // Check if user already received the welcome back email
                const alreadySent = await redis.sismember("postmygig:welcome-back-sent", user.email);
                if (alreadySent) {
                    return;
                }

                const emailHtml = postMyGigWelcomeBackTemplate(user.name);
                const subject = "PostMyGig Platform Update: Welcome Back";

                if (NODE_ENV === 'production') {
                    const { error } = await resend.emails.send({
                        from: 'PostMyGig <hello@postmygig.vercel.app>',
                        to: user.email,
                        subject,
                        html: emailHtml
                    });

                    if (error) {
                        console.warn('[Resend Failed] Falling back to Nodemailer:', error);
                        await EmailSender({
                            to: user.email,
                            subject,
                            html: emailHtml
                        });
                    }
                } else {
                    await EmailSender({
                        to: user.email,
                        subject,
                        html: emailHtml
                    });
                }

                // Mark user as sent in Redis set
                await redis.sadd("postmygig:welcome-back-sent", user.email);
                sentCount++;
            } catch (err) {
                console.error(`Error sending welcome email to ${user.email}:`, err);
            }
        }));

        await wait(delayMs);
    }

    return sentCount;
};

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { success, data: users } = await getAllUsers();

        if (!success || users.length === 0) {
            return NextResponse.json({ message: 'No users found.' }, { status: 404 });
        }

        const sentCount = await sendEmailsInBatches(users);

        return NextResponse.json({
            message: 'Welcome back broadcast completed successfully.',
            totalUsers: users.length,
            sentCount
        }, { status: 200 });

    } catch (error: any) {
        console.error("Welcome back broadcast error:", error);
        return NextResponse.json({
            message: "Broadcast failed",
            error: error.message
        }, { status: 500 });
    }
}
