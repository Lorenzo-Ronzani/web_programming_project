import { buildApiUrl } from "../api";

/*
  createAdmission
  Sends a POST request to create a new admission entry.
*/
export async function createAdmission({
  title,
  requirements,
  transferability,
  languageProficiency,
  academicUpgrading,
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
    return {
      success: false,
      message: "Network error calling createAdmission",
    };
  }
}

/*
  updateAdmission
  Sends a PUT request to update an existing admission entry.
  The backend expects: { id, ...updatedFields }
*/
export async function updateAdmission(id, data) {
  try {
    const url = buildApiUrl("updateAdmission");

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,         // required by backend
        ...data,    // updated values
      }),
    });

    return await response.json();
  } catch (err) {
    console.error("updateAdmission error:", err);
    return {
      success: false,
      message: "Network error calling updateAdmission",
    };
  }
}
