## 2026-05-17 - Add Missing Security Headers
**Vulnerability:** Missing standard HTTP security headers (XSS protection, clickjacking, MIME sniffing).
**Learning:** Default Next.js configuration doesn't automatically apply these headers. This was a standard defense-in-depth enhancement.
**Prevention:** Always configure  in `next.config.js` with standard security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy, X-XSS-Protection) when setting up a new Next.js project.
## 2024-05-17 - Add Missing Security Headers
**Vulnerability:** Missing standard HTTP security headers (XSS protection, clickjacking, MIME sniffing).
**Learning:** Default Next.js configuration doesnt automatically apply these headers. This was a standard defense-in-depth enhancement.
**Prevention:** Always configure async headers() in next.config.js with standard security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy, X-XSS-Protection) when setting up a new Next.js project.
