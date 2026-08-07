import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) {
        return NextResponse.json({
            message: "Unauthorized"
        }, { status: 401 })
    }

    const userEmail = session.user.email;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
            );

            const interval = setInterval(async () => {
                try {
                    const unreadCount = await redis.get(`unread-notification:${userEmail}`);

                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: "heartbeat",
                                unreadCount: parseInt((unreadCount as string) || "0", 10),
                                timestamp: Date.now(),
                            })}\n\n`
                        )
                    )
                } catch (error) {

                }

            }, 5000);

            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                controller.close();
            })
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}