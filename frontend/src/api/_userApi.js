import { buildApiUrl } from "./buildApiUrl";

export async function registerUser({ email, password, firstName, lastName, role = "student" }) {
  try {
    const url = buildApiUrl("createUser");  

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role
      }),
    });

    return await response.json();
  } catch (err) {
    console.error("registerUser error:", err);
    return { success: false, message: "Network error calling registerUser" };
  }
}
