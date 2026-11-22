

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getToken(): Promise<string> {
  // Use the absolute URL to be safe on Vercel
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const res = await fetch(`${baseUrl}/api/token`, { 
    cache: "no-store",
    credentials: "include", // Ensure cookies are sent to your own API route
  });

  if (!res.ok) {
    throw new Error("Please log in to continue");
  }

  const data = await res.json();
  return data.token as string;
}

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", body, auth = true }: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    try {
      headers["Authorization"] = `Bearer ${await getToken()}`;
    } catch {
      // Removed the 'error' variable to fix the ESLint red line
      throw new Error("Session expired. Please log in again.");
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    credentials: "include", // Critical for cross-origin cookies
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}