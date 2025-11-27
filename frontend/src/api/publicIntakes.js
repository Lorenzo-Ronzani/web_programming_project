import { buildApiUrl } from "../api";

export async function createPublicIntake(data) {
  const url = buildApiUrl("createPublicIntake");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updatePublicIntake(id, data) {
  const url = buildApiUrl("updatePublicIntake");
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  return await res.json();
}

export async function deletePublicIntake(id) {
  const url = buildApiUrl("deletePublicIntake") + `?id=${id}`;
  const res = await fetch(url, { method: "DELETE" });
  return await res.json();
}
