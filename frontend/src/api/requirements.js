import { buildApiUrl } from "../api";

// CREATE
export async function createRequirement(data) {
  try {
    const url = buildApiUrl("createRequirement");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (err) {
    console.error("createRequirement error:", err);
    return { success: false, message: "Network error calling createRequirement" };
  }
}

// UPDATE
export async function updateRequirement(id, data) {
  try {
    const url = buildApiUrl("updateRequirement");

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });

    return await response.json();
  } catch (err) {
    console.error("updateRequirement error:", err);
    return { success: false, message: "Network error calling updateRequirement" };
  }
}

// DELETE
export async function deleteRequirement(id) {
  try {
    const url = buildApiUrl("deleteRequirement") + `?id=${id}`;

    const response = await fetch(url, { method: "DELETE" });
    return await response.json();
  } catch (err) {
    console.error("deleteRequirement error:", err);
    return { success: false, message: "Network error calling deleteRequirement" };
  }
}
