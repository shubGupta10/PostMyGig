import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "PostMyGig";
  const description =
    searchParams.get("description") ||
    "Find & share freelance gigs with zero middlemen.";
  const badge = searchParams.get("badge") || "Open Gig";
  const type = searchParams.get("type") || "gig";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          background: "#0c0c0e",
          color: "#f4f4f5",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Inner Card Framing */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1.5px solid #26262a",
            borderRadius: "24px",
            background: "linear-gradient(180deg, rgba(26,26,30,0.7) 0%, rgba(16,16,18,0.9) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 48px",
          }}
        >
          {/* Top Bar: Brand & Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#ffe0c2",
                  color: "#2a150c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                PostMyGig
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: 999,
                background: type === "profile" ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 224, 194, 0.12)",
                border: type === "profile" ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(255, 224, 194, 0.25)",
                color: type === "profile" ? "#93c5fd" : "#ffe0c2",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          </div>

          {/* Center Content: Title and Meta */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 960,
            }}
          >
            <div
              style={{
                fontSize: 54,
                lineHeight: 1.15,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.035em",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: "#a1a1aa",
                fontWeight: 500,
              }}
            >
              {description}
            </div>
          </div>

          {/* Bottom Bar: URL & CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: 24,
              borderTop: "1px solid #232328",
            }}
          >
            <span
              style={{
                fontSize: 18,
                color: "#71717a",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              postmygig.vercel.app
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                borderRadius: 14,
                background: "#ffe0c2",
                color: "#2a150c",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              <span>Direct Chat & Apply</span>
              <span style={{ fontSize: 18 }}>→</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
