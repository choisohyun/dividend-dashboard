import { google } from "googleapis";

/**
 * Google Sheets Integration
 * 
 * Uses Service Account for authentication.
 * Users must share their sheet with the service account email.
 */

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  range: string;
}

export interface GoogleAuthError {
  code: number;
  message: string;
  details?: any;
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    throw new Error(
      "구글 서비스 계정 설정이 누락되었습니다. .env.local을 확인해주세요."
    );
  }

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function readGoogleSheet(
  config: GoogleSheetsConfig
): Promise<string[][]> {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: config.range,
      valueRenderOption: "UNFORMATTED_VALUE", // Get raw values
      dateTimeRenderOption: "FORMATTED_STRING", // Get dates as strings
    });

    if (!response.data.values) {
      return [];
    }

    // Convert all values to strings to match CSV behavior
    return response.data.values.map((row) =>
      row.map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
    );
  } catch (error: any) {
    console.error("Google Sheets API Error:", error);

    if (error.code === 403 || error.message?.includes("permission")) {
      throw new Error(
        "스프레드시트에 접근할 수 없습니다. 서비스 계정 이메일로 시트를 공유해주세요."
      );
    }

    if (error.code === 404) {
      throw new Error("스프레드시트를 찾을 수 없습니다. ID를 확인해주세요.");
    }

    throw new Error(
      `구글 시트 읽기 실패: ${error.message || "알 수 없는 오류"}`
    );
  }
}

export async function testSheetConnection(
  spreadsheetId: string
): Promise<{ success: boolean; title?: string; error?: string }> {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "properties.title",
    });

    return {
      success: true,
      title: response.data.properties?.title || "Untitled Spreadsheet",
    };
  } catch (error: any) {
    console.error("Connection Test Error:", error);
    return {
      success: false,
      error: error.message || "연결 실패",
    };
  }
}

export function extractSpreadsheetId(url: string): string | null {
  // Matches /spreadsheets/d/ID/
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
