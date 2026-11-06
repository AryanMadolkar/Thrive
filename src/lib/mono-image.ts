/** Max edge length for uploaded photos (keeps data URLs manageable). */
const MAX_EDGE = 1400;
const JPEG_QUALITY = 0.78;

/**
 * Convert an uploaded image file to a grayscale JPEG data URL.
 */
export async function fileToGrayscaleDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8MB");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process image");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    // Rec. 601 luma
    const y = (data[i]! * 0.299 + data[i + 1]! * 0.587 + data[i + 2]! * 0.114) | 0;
    data[i] = y;
    data[i + 1] = y;
    data[i + 2] = y;
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 * Force remote photo URLs toward monochrome when the host supports it
 * (Unsplash). Other hosts rely on CSS grayscale at display time.
 */
export function toMonochromeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.hostname === "images.unsplash.com" ||
      parsed.hostname.endsWith(".unsplash.com")
    ) {
      parsed.searchParams.set("sat", "-100");
      return parsed.toString();
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function isImageSource(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("data:image/")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
