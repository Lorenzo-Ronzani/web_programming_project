export function buildApiUrl(functionName) {
  const USE_CLOUD_RUN = import.meta.env.VITE_USE_CLOUD_RUN === "true";
  const DOMAIN = import.meta.env.VITE_API_DOMAIN;

  if (!DOMAIN) {
    console.error("VITE_API_DOMAIN is missing in environment variables");
    return "";
  }

  if (USE_CLOUD_RUN) {
    return `https://${functionName}-${DOMAIN}`;
  }

  return `http://${DOMAIN}/${functionName}`;
}
