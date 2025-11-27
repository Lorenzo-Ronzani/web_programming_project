import { buildApiUrl } from "../api";

// CREATE
export async function createProgramStructure(data) {
  try {
    const url = buildApiUrl("createProgramStructure");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("createProgramStructure error:", err);
    return { success: false, message: "Network error calling createProgramStructure" };
  }
}

// UPDATE
export async function updateProgramStructure(id, data) {
  try {
    const url = buildApiUrl("updateProgramStructure");

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });

    return await res.json();
  } catch (err) {
    console.error("updateProgramStructure error:", err);
    return { success: false, message: "Network error calling updateProgramStructure" };
  }
}

// DELETE
export async function deleteProgramStructure(id) {
  try {
    const url = buildApiUrl("deleteProgramStructure") + `?id=${id}`;
    const res = await fetch(url, { method: "DELETE" });
    return await res.json();
  } catch (err) {
    console.error("deleteProgramStructure error:", err);
    return { success: false, message: "Network error calling deleteProgramStructure" };
  }
}
