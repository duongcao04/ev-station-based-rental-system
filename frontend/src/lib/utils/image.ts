import { BASE_URL } from "@/lib/axios";

/**
 * Converts a relative image URL from backend to full URL
 * @param url - Relative URL from backend (e.g., "/upload/kyc/filename.jpg")
 * @returns Full URL for the image
 */
export function getImageUrl(url?: string | null): string {
  if (!url) {
    return "/placeholder.svg";
  }

  // If already a full URL (starts with http:// or https://), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If starts with /upload, handle specially for API Gateway
  if (url.startsWith("/upload")) {
    // BASE_URL is typically "http://localhost:8000/api" (API Gateway)
    // But /upload routes are at "http://localhost:8000/upload" (without /api)
    // So we need to remove /api from BASE_URL for upload paths
    let baseUrl = BASE_URL.trim();
    
    // Remove trailing slash if present
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Remove /api suffix if present (for API Gateway)
    // Handle both "/api" and "/api/" cases
    if (baseUrl.endsWith("/api")) {
      baseUrl = baseUrl.slice(0, -4); // Remove "/api"
    }
    
    return `${baseUrl}${url}`;
  }

  // For other relative URLs, return as is (or handle as needed)
  return url;
}

