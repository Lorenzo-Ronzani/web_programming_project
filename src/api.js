/**
 * Builds the correct API URL depending on the environment.
 *
 * DEV (VITE_USE_CLOUD_RUN = false):
 *   - Uses Firebase Emulator:
 *     http://localhost:5001/project/us-central1/<functionName>
 *
 * PROD (VITE_USE_CLOUD_RUN = true):
 *   - Uses Cloud Run subdomains created by Firebase Functions v2:
 *     https://<functionName>-<domain>.a.run.app
 *
 * @param {string} functionName - The name of the Cloud Function endpoint (ex: "getCourses")
 * @returns {string} Full API URL ready to be used in fetch()
 */
export function buildApiUrl(functionName) {
  const USE_CLOUD_RUN = import.meta.env.VITE_USE_CLOUD_RUN === "true";
  const DOMAIN = import.meta.env.VITE_API_DOMAIN;

  if (!DOMAIN) {
    console.error("VITE_API_DOMAIN is missing in environment variables");
    return "";
  }

  // --- PRODUCTION MODE ---
  // Cloud Run format: https://<funcName>-<domain>
  if (USE_CLOUD_RUN) {
    return `https://${functionName}-${DOMAIN}`;
  }

  // --- DEVELOPMENT MODE ---
  // Firebase Emulator format: http://localhost:5001/.../us-central1/<funcName>
  return `http://${DOMAIN}/${functionName}`;
}
