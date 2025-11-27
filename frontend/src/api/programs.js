// src/api/programs.js
import { buildApiUrl } from "../api";

/*
  Create Program (POST)
*/
export async function createProgram(data) {
  try {
    const url = buildApiUrl("createProgram");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (err) {
    console.error("createProgram error:", err);
    return { success: false, message: "Network error calling createProgram" };
  }
}

/*
  Update Program (PUT)
*/
export async function updateProgram(id, data) {
  try {
    const url = buildApiUrl("updateProgram");

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });

    return await response.json();
  } catch (err) {
    console.error("updateProgram error:", err);
    return { success: false, message: "Network error calling updateProgram" };
  }
}

/*
  Delete Program (DELETE)
*/
export async function deleteProgram(id) {
  try {
    const url = buildApiUrl("deleteProgram") + `?id=${id}`;

    const response = await fetch(url, { method: "DELETE" });
    return await response.json();
  } catch (err) {
    console.error("deleteProgram error:", err);
    return { success: false, message: "Network error calling deleteProgram" };
  }
}
