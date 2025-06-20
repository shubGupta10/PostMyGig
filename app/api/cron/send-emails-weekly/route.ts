import { NextResponse } from "next/server";
import resend from "@/lib/resend";
import { EmailSender } from "@/lib/email/send";
import redis from "@/lib/redis";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";
import { postMyGigNewGigsTemplate } from "@/lib/email/templates";

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
            name: user.name
        }));

        return { success: true, data: userData };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, data: [] };
    }
};

//wait function
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const sendEmailsInBatches = async (users: { email: string, name: string }[], batchSize = 2, delayMs = 1000) => {
    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);

        await Promise.all(batch.map(async (user) => {
            try {
                if (NODE_ENV === 'production') {
                    const { error } = await resend.emails.send({
                        from: 'PostMyGig <hello@postmygig.xyz>',
                        to: user.email,
                        subject: 'New Gigs on PostMyGig!',
                        html: postMyGigNewGigsTemplate(user.name)
                    });

                    if (error) {
                        console.warn('[Resend Failed] Falling back to Nodemailer:', error);

                        await EmailSender({
                            to: user.email,
                            subject: 'New Gigs on PostMyGig!',
                            html: postMyGigNewGigsTemplate(user.name)
                        });
                    }
                } else {
                    await EmailSender({
                        to: user.email,
                        subject: 'New Gigs on PostMyGig!',
                        html: postMyGigNewGigsTemplate(user.name)
                    });
                }
            } catch (err) {
                console.error('Error sending email:', err);
            }
        }));

        // Wait 1 second between each batch to respect Resend's rate limit
        await wait(delayMs);
    }
};


export async function POST() {
    const redisKey = 'postmygig:last-email-sent';
    const isCoolDown = await redis.get(redisKey);

    // If cooldown exists, skip sending
    if (isCoolDown) {
        return NextResponse.json({ message: 'Email cooldown active, skipping send.' });
    }

    const { success, data: users } = await getAllUsers();

    if (!success || users.length === 0) {
        return NextResponse.json({ message: 'No users found.' }, { status: 404 });
    }

    // batch send emails safely
    await sendEmailsInBatches(users);

    // Set cooldown TTL for 7 days (1 week)
    await redis.set(redisKey, 'sent', { ex: 60 * 60 * 24 * 7 });

    return NextResponse.json({ message: 'Emails sent successfully.' });
}
