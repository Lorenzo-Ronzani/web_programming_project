import { buildApiUrl } from "../api";

/*
  createAdmission
  Sends a POST request to create a new admission entry.
  Backend requires: program_id, title, requirements, etc.
*/
export async function createAdmission({
  program_id,
  title,
  requirements,
  transferability,
  language_proficiency,
  academic_upgrading,
}) {
  try {
    const url = buildApiUrl("createAdmission");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        program_id,             // now included
        title,
        requirements,
        transferability,
        language_proficiency,
        academic_upgrading,
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
  Sends a PUT request to update an existing admission.
  Backend requires: id + updated fields.
*/
export async function updateAdmission(id, data) {
  try {
    const url = buildApiUrl("updateAdmission");

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        ...data,
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


/*
  deleteAdmission
  Sends a DELETE request for an admission entry.
*/
export async function deleteAdmission(id) {
  try {
    const url = buildApiUrl("deleteAdmission") + `?id=${id}`;

    const response = await fetch(url, {
      method: "DELETE",
    });

    return await response.json();
  } catch (err) {
    console.error("deleteAdmission error:", err);
    return {
      success: false,
      message: "Network error calling deleteAdmission",
    };
  }
}
