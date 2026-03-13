export async function uploadPublicFile(input: {
  supabase: any;
  bucket: "branding" | "products";
  file: File;
  folder: string;
}): Promise<string> {
  const fileExt = input.file.name.includes(".") ? input.file.name.split(".").pop() : "bin";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const path = `${input.folder}/${fileName}`;
  const bytes = new Uint8Array(await input.file.arrayBuffer());

  const { error } = await input.supabase.storage.from(input.bucket).upload(path, bytes, {
    contentType: input.file.type || "application/octet-stream",
    upsert: true
  });

  if (error) {
    throw new Error(`No se pudo subir archivo: ${error.message}`);
  }

  const { data } = input.supabase.storage.from(input.bucket).getPublicUrl(path);
  return data.publicUrl;
}
