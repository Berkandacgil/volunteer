/**
 * Cloudflare R2'ye dosya yüklemek için client-side helper
 * Next.js API route üzerinden çalışır
 */
export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Dosya yüklenirken bir hata oluştu");
  }

  const data = await response.json();
  return data.url;
}

export async function uploadProjectImage(file: File): Promise<string> {
  return uploadImage(file, "projects");
}

export async function uploadProfileImage(file: File): Promise<string> {
  return uploadImage(file, "profiles");
}

export async function uploadUpdateImage(file: File): Promise<string> {
  return uploadImage(file, "updates");
}
