/** Only allow same-origin relative paths as post-login redirects. */
export function safeCallbackUrl(
  raw: FormDataEntryValue | string | null | undefined,
  fallback = "/discover"
) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (
    value.startsWith("/login") ||
    value.startsWith("/register") ||
    value.startsWith("/api/")
  ) {
    return fallback;
  }
  return value;
}
