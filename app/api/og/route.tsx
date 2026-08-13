import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "PostMyGig";
  const description =
    searchParams.get("description") ||
    "Freelance gigs, direct chat, and fast hiring.";
  const badge = searchParams.get("badge") || "PostMyGig";
  const type = searchParams.get("type") || "gig";

  const bgStart = type === "site" ? "#f7f3ee" : "#f4efe9";
  const bgEnd = type === "site" ? "#efe7df" : "#e5ddd5";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 56px",
          background: `linear-gradient(135deg, ${bgStart} 0%, ${bgEnd} 100%)`,
          color: "#1c1917",
          fontFamily: "sans-serif",
        }}
      >
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
              gap: 12,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6b4f3a 0%, #b38b6d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              P
            </div>
            <span>{badge}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 20,
              opacity: 0.75,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#c9916e" }} />
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#d3b39d" }} />
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#e7d7c4" }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.35)",
              padding: "8px 14px",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {type === "site" ? "Freelance marketplace" : "Open gig"}
          </div>

          <div
            style={{
              fontSize: 60,
              lineHeight: 1.03,
              fontWeight: 800,
              maxWidth: 860,
              letterSpacing: "-0.06em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              maxWidth: 760,
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(28,25,23,0.8)",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 18,
            borderTop: "1px solid rgba(28,25,23,0.12)",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "rgba(28,25,23,0.7)" }}>postmygig.vercel.app</span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span>Open</span>
            <span style={{ fontSize: 18, color: "#8a5f3d" }}>→</span>
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
