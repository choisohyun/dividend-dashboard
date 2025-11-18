"use server";

import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function saveReportImage(
  imageData: string,
  filename: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const session = await requireAuth();
  const supabase = await createClient();

  try {
    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to Supabase Storage
    const filePath = `${session.user.id}/${filename}`;
    
    const { data, error } = await supabase.storage
      .from("report_images")
      .upload(filePath, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("report_images")
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("Image save error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getReportImages(): Promise<
  Array<{ name: string; url: string; created_at: string }>
> {
  const session = await requireAuth();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.storage
      .from("report_images")
      .list(session.user.id, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("List images error:", error);
      return [];
    }

    return data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("report_images")
        .getPublicUrl(`${session.user.id}/${file.name}`);

      return {
        name: file.name,
        url: urlData.publicUrl,
        created_at: file.created_at,
      };
    });
  } catch (error) {
    console.error("Get images error:", error);
    return [];
  }
}

export async function deleteReportImage(filename: string): Promise<boolean> {
  const session = await requireAuth();
  const supabase = await createClient();

  try {
    const filePath = `${session.user.id}/${filename}`;
    
    const { error } = await supabase.storage
      .from("report_images")
      .remove([filePath]);

    if (error) {
      console.error("Delete image error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete image error:", error);
    return false;
  }
}

