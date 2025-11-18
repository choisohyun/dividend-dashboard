import { describe, it, expect } from "vitest";
import { validateBackupData } from "@/app/actions/restore";
import type { BackupData } from "@/app/actions/backup";

describe("Backup and Restore Integration", () => {
  const validBackup: BackupData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    userId: "test-user-id",
    data: {
      holdings: [
        {
          id: "1",
          userId: "test-user-id",
          symbol: "SCHD",
          quantity: "100",
          avgCost: "30000",
        },
      ],
      dividends: [
        {
          id: "1",
          userId: "test-user-id",
          symbol: "SCHD",
          payDate: "2024-03-15",
          grossAmount: "100000",
          netAmount: "85000",
        },
      ],
      cashFlows: [],
      transactions: [],
    },
  };

  describe("validateBackupData", () => {
    it("should validate correct backup data", async () => {
      const backupJson = JSON.stringify(validBackup);
      const result = await validateBackupData(backupJson);

      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.version).toBe("1.0");
    });

    it("should reject invalid JSON", async () => {
      const result = await validateBackupData("invalid json{");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("읽을 수 없습니다");
    });

    it("should reject wrong version", async () => {
      const wrongVersion = { ...validBackup, version: "2.0" };
      const backupJson = JSON.stringify(wrongVersion);
      const result = await validateBackupData(backupJson);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("버전");
    });

    it("should reject missing data structure", async () => {
      const incomplete = { version: "1.0", exportDate: new Date().toISOString() };
      const backupJson = JSON.stringify(incomplete);
      const result = await validateBackupData(backupJson);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("형식");
    });
  });
});

