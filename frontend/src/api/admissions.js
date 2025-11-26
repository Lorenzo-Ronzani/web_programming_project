import { buildApiUrl } from "../api";

export async function createAdmission({ 
  title, 
  requirements, 
  transferability, 
  languageProficiency, 
  academicUpgrading 
}) {
  try {
    const url = buildApiUrl("createAdmission");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        requirements,
        transferability,
        languageProficiency,
        academicUpgrading,
      }),
    });

    return await response.json();
  } catch (err) {
    console.error("createAdmission error:", err);
    return { success: false, message: "Network error calling createAdmission" };
  }
}