import { describe, it, expect, vi } from "vitest";
import { performBackupForUser } from "@/lib/backup/service";
import { db } from "@/lib/db";

// Mock Supabase Client
const mockUpload = vi.fn();
const mockList = vi.fn();
const mockRemove = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        list: mockList,
        remove: mockRemove,
      }),
    },
  }),
}));

// Mock Drizzle
vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

describe("Backup Service", () => {
  const userId = "test-user-id";

  it("should perform backup successfully", async () => {
    // Setup mocks
    mockUpload.mockResolvedValue({ data: { path: "test-path" }, error: null });
    mockList.mockResolvedValue({ data: [], error: null });

    const result = await performBackupForUser(userId);

    expect(result.success).toBe(true);
    expect(mockUpload).toHaveBeenCalled();
    expect(db.update).toHaveBeenCalled();
  });

  it("should handle upload errors", async () => {
    mockUpload.mockResolvedValue({ data: null, error: new Error("Upload failed") });

    const result = await performBackupForUser(userId);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should cleanup old backups", async () => {
    // Mock 5 existing backups
    const oldBackups = Array.from({ length: 5 }, (_, i) => ({
      name: `backup-${i}.json`,
      created_at: new Date().toISOString(),
    }));

    mockUpload.mockResolvedValue({ data: { path: "test-path" }, error: null });
    mockList.mockResolvedValue({ data: oldBackups, error: null });

    await performBackupForUser(userId);

    // Should try to remove the oldest one (since we keep 4)
    expect(mockRemove).toHaveBeenCalled();
  });
});

