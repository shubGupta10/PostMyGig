import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import ratelimiter from './lib/ratelimit';

export default withAuth(
    async function middleware(req) {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/api") || pathname.startsWith("/auth")) {
            const forwardedFor = req.headers.get("x-forwarded-for");
            const realIp = req.headers.get("x-real-ip");
            const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;
            const ip = clientIp || "anonymous";
            const { success, reset } = await ratelimiter.limit(ip);

            if (!success) {
                if (pathname.startsWith("/api")) {
                    return NextResponse.json({ message: `Rate limit exceeded, Try again later` }, { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } })
                }
                return new NextResponse("Rate limit exceeded, Please slow down", { status: 429 });
            }
        }

        const isAuth = !!req.nextauth.token;

        const authRoutes = ["/auth/login", "/auth/register", "/"];

        if (isAuth && authRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                const publicRoutes = [
                    "/",
                    "/auth/login",
                    "/auth/register",
                    "/view-gigs",
                    "/api/gigs/fetch-gigs",
                    "/auth/verify-code/[userId]",
                    "/activity"
                ];

                if (publicRoutes.some(route => pathname.startsWith(route))) {
                    return true;
                }

                return !!token;
            }
        }
    }
)

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};