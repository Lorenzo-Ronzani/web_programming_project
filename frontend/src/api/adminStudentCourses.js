// Update grade for a specific studentCourse record
export async function apiUpdateStudentCourseGrade(recordId, data, buildApiUrl) {
  const response = await fetch(buildApiUrl("updateStudentCourseGrade"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: recordId,
      ...data
    })
  });

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to update grade.");
  }

  return json;
}
