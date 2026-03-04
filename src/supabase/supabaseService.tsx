import { supabase } from "./config";

export interface SaveDrawingResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function saveDrawingToSupabase(
  userId: string,
  userName: string,
  title: string,
  canvas: HTMLCanvasElement,
): Promise<SaveDrawingResult> {
  try {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }
      }, "image/png");
    });

    const fileName = `${userId}/${Date.now()}_${title.replace(/[^a-z0-9]/gi, "_")}.png`;

    const { error: storageError } = await supabase.storage
      .from("drawings")
      .upload(fileName, blob, {
        contentType: "image/png",
        cacheControl: "3600",
      });

    if (storageError) throw storageError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("drawings").getPublicUrl(fileName);

    const { data, error: dbError } = await supabase
      .from("drawings")
      .insert([
        {
          author_id: userId,
          author_name: userName,
          title: title,
          image_url: publicUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) throw dbError;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error saving drawing:", error);
    return {
      success: false,
      error: error.message || "Failed to save drawing",
    };
  }
}

export async function getAllDrawings() {
  const { data, error } = await supabase
    .from("drawings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
