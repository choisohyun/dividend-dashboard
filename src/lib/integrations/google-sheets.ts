/**
 * Google Sheets Integration (Placeholder)
 * 
 * To enable Google Sheets integration:
 * 1. Create a Google Cloud Project
 * 2. Enable Google Sheets API
 * 3. Create Service Account or API Key
 * 4. Add credentials to .env.local
 * 
 * For now, this is a placeholder implementation.
 */

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  range: string;
  apiKey?: string;
}

export async function readGoogleSheet(config: GoogleSheetsConfig): Promise<string[][]> {
  // Placeholder implementation
  // In production, use googleapis package
  
  throw new Error(
    "Google Sheets 연동은 Week 4에서 완성됩니다. " +
    "API 키 설정이 필요합니다."
  );
}

export function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

