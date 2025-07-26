const allowedOrigins = [
    "https://app.fitfly.tech",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
];

export function getCorsHeaders(origin?: string | null): Record<string, string> {
    const allowedOrigin = origin && allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];

    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Credentials": "true",
    };
}

// Legacy export for backward compatibility
export const corsHeaders = getCorsHeaders();
