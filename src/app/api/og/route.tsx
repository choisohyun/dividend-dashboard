import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get params
    const username = searchParams.get("username")?.slice(0, 100);
    const displayName = searchParams.get("displayName")?.slice(0, 100);
    const monthly = searchParams.get("monthly");
    const progress = searchParams.get("progress");

    const name = displayName || username || "User";

    // Colors
    const primaryColor = "#2563EB"; // blue-600
    const secondaryColor = "#4F46E5"; // indigo-600

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(37, 99, 235, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(79, 70, 229, 0.1) 2%, transparent 0%)",
              backgroundSize: "100px 100px",
            }}
          />

          {/* Main Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              width: "90%",
              height: "80%",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: primaryColor,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Dividend Dashboard
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#111827",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {name}님의 배당 포트폴리오
              </div>
            </div>

            {/* Stats Grid */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              {/* Monthly Dividend */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: "#6B7280",
                    marginBottom: 8,
                  }}
                >
                  이번 달 예상 배당
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: primaryColor,
                  }}
                >
                  {monthly || "₩0"}
                </div>
              </div>

              {/* Goal Progress */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderLeft: "2px solid #F3F4F6",
                  paddingLeft: 60,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: "#6B7280",
                    marginBottom: 8,
                  }}
                >
                  목표 달성률
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: secondaryColor,
                  }}
                >
                  {progress || "0"}%
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                color: "#9CA3AF",
              }}
            >
              나만의 배당 캘린더를 만들어보세요
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

