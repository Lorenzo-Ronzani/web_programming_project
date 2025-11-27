import { buildApiUrl } from "../api";

// CREATE
export async function createTuition(data) {
  try {
    const url = buildApiUrl("createTuition");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("createTuition error:", err);
    return { success: false, message: "Network error calling createTuition" };
  }
}

// UPDATE
export async function updateTuition(id, data) {
  try {
    const url = buildApiUrl("updateTuition");

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });

    return await res.json();
  } catch (err) {
    console.error("updateTuition error:", err);
    return { success: false, message: "Network error calling updateTuition" };
  }
}

// DELETE
export async function deleteTuition(id) {
  try {
    const url = buildApiUrl("deleteTuition") + `?id=${id}`;
    const res = await fetch(url, { method: "DELETE" });
    return await res.json();
  } catch (err) {
    console.error("deleteTuition error:", err);
    return { success: false, message: "Network error calling deleteTuition" };
  }
}
