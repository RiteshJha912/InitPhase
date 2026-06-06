# Small Security Improvement Plan

These changes should improve production security without changing existing app behavior or API contracts.

1. **Restrict CORS**
   - Allow only the deployed frontend domain and local development URLs instead of using unrestricted `cors()`.

2. **Add Security Headers**
   - Add `helmet` to the Express server for safer browser headers.
   - Configure a conservative Content Security Policy after testing PDF export and external fonts.

3. **Rate-Limit Sensitive Routes**
   - Add strict limits to login, registration, BRD generation, repository analysis, and change-impact generation.
   - Add a moderate global API rate limit.

4. **Harden JWT Handling**
   - Use a strong production-only `JWT_SECRET`.
   - Keep token expiry short and consistently redirect users after `401` responses.
   - As a later migration, consider secure `HttpOnly` cookies instead of `localStorage`.

5. **Validate and Sanitize Inputs**
   - Add schema validation for request bodies, MongoDB IDs, enum values, URL inputs, and maximum lengths.
   - Reject unexpected fields to reduce mass-assignment and malformed-input risks.

6. **Protect External Integrations**
   - Allow only `https://github.com/...` repository URLs.
   - Add request timeouts, response-size limits, and safe error messages for GitHub and Groq calls.

7. **Improve Production Error Handling**
   - Add a centralized Express error handler.
   - Return generic client errors while logging detailed errors only on the server.
   - Never log tokens, passwords, API keys, or full authorization headers.

8. **Add Safe Operational Defaults**
   - Set JSON request-size limits.
   - Keep dependencies patched with regular `npm audit` review.
   - Add database backups, environment-secret rotation, and alerts for repeated authentication failures.

## Recommended First Pass

Start with restricted CORS, `helmet`, rate limiting, request-size limits, and centralized validation. These provide strong protection with minimal production risk.
