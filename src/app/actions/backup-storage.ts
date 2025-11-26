"use server";

import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { performBackupForUser } from "@/lib/backup/service";
import { revalidatePath } from "next/cache";

export async function getBackupHistory() {
  const session = await requireAuth();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.storage
      .from("backups")
      .list(session.user.id, {
        limit: 10,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) throw error;

    return data.map((file) => ({
      name: file.name,
      createdAt: file.created_at,
      size: file.metadata?.size || 0,
    }));
  } catch (error) {
    console.error("Get backup history error:", error);
    return [];
  }
}

export async function triggerManualBackup() {
  const session = await requireAuth();
  
  // Use the service function but check auth first
  // Note: performBackupForUser uses service role key, so it bypasses RLS
  // This is safe because we verified session.user.id
  const result = await performBackupForUser(session.user.id);
  
  revalidatePath("/settings");
  return result;
}

export async function downloadBackupFile(fileName: string) {
  const session = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("backups")
    .download(`${session.user.id}/${fileName}`);

  if (error) throw error;

  return await data.text();
}

export async function deleteBackupFile(fileName: string) {
  const session = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("backups")
    .remove([`${session.user.id}/${fileName}`]);

  if (error) throw error;
  
  revalidatePath("/settings");
  return { success: true };
}

