import { NextResponse } from "next/server";
import { runAutoBackup } from "@/lib/backup/service";

export async function GET(request: Request) {
  // Verify Vercel Cron signature
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const result = await runAutoBackup();
    return NextResponse.json({
      message: "Backup job completed",
      ...result,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

