import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import ratelimiter from './lib/ratelimit';

export default withAuth(
    async function middleware(req) {
        const { pathname } = req.nextUrl;

        if (
            (pathname.startsWith("/api") || pathname.startsWith("/auth")) &&
            !pathname.startsWith("/api/auth") &&
            !pathname.startsWith("/api/cron") &&
            !pathname.startsWith("/api/uploadthing")
        ) {
            const realIp = req.headers.get("x-real-ip");
            const forwardedFor = req.headers.get("x-forwarded-for");
            const ip = realIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous");
            const { success, reset } = await ratelimiter.limit(ip);

            if (!success) {
                if (pathname.startsWith("/api")) {
                    return NextResponse.json(
                        { message: `Rate limit exceeded, Try again later` },
                        { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
                    );
                }
                return new NextResponse("Rate limit exceeded, Please slow down", { status: 429 });
            }
        }

        const isAuth = !!req.nextauth.token;

        const authRoutes = ["/auth/login", "/auth/register", "/"];

        if (isAuth && authRoutes.includes(pathname)) {
            const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || req.nextUrl.searchParams.get("callback");
            const destination = callbackUrl || "/view-gigs";
            return NextResponse.redirect(new URL(destination, req.url));
        }

        if (isAuth && !pathname.startsWith("/api")) {
            const onboardingCompleted = req.nextauth.token?.onboardingCompleted;

            if (!onboardingCompleted && pathname !== "/onboarding") {
                const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || req.nextUrl.searchParams.get("callback") || pathname;
                const url = new URL("/onboarding", req.url);
                url.searchParams.set("callbackUrl", callbackUrl);
                return NextResponse.redirect(url);
            }

            if (onboardingCompleted && pathname === "/onboarding") {
                const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || req.nextUrl.searchParams.get("callback");
                const destination = callbackUrl || "/view-gigs";
                return NextResponse.redirect(new URL(destination, req.url));
            }
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
                    "/auth/forgot-password",
                    "/view-gigs",
                    "/api/gigs/fetch-gigs",
                    "/auth/verify-code",
                    "/activity",
                    "/api/activity",
                    "/open-gig",
                    "/api/gigs/open-gigs",
                    "/api/cron",
                    "/api/uploadthing"
                ];

                const isPublic = publicRoutes.some(route =>
                    route === "/" ? pathname === "/" : pathname.startsWith(route)
                );

                if (isPublic) {
                    return true;
                }

                return !!token;
            }
        }
    }
)

export const config = {
    matcher: [
        "/((?!api/auth|api/uploadthing|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};