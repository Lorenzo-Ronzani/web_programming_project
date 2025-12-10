// src/api/courses.js
import { buildApiUrl } from "../api";

/*
  ===========================================
  CREATE COURSE  
  POST /createCourse
  ===========================================
*/
export async function createCourse(data) {
  try {
    const url = buildApiUrl("createCourse");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (err) {
    console.error("createCourse error:", err);
    return { success: false, message: "Network error creating course" };
  }
}

/*
  ===========================================
  UPDATE COURSE  
  PUT /updateCourse
  ===========================================
*/
export async function updateCourse(id, data) {
  try {
    const url = buildApiUrl("updateCourse");

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });

    return await response.json();
  } catch (err) {
    console.error("updateCourse error:", err);
    return { success: false, message: "Network error updating course" };
  }
}

/*
  ===========================================
  DELETE COURSE  
  DELETE /deleteCourse?id=123
  ===========================================
*/
export async function deleteCourse(id) {
  try {
    const url = buildApiUrl("deleteCourse") + `?id=${id}`;

    const response = await fetch(url, { method: "DELETE" });
    return await response.json();
  } catch (err) {
    console.error("deleteCourse error:", err);
    return { success: false, message: "Network error deleting course" };
  }
}

/*
  ===========================================
  GET COURSE BY ID  
  GET /getCourseById?id=123
  ===========================================
*/
export async function getCourseById(id) {
  try {
    const url = buildApiUrl("getCourseById") + `?id=${id}`;

    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error("getCourseById error:", err);
    return { success: false, message: "Network error retrieving course" };
  }
}

/*
  ===========================================
  GET ALL COURSES  
  GET /getCourses
  ===========================================
*/
export async function getCourses() {
  try {
    const url = buildApiUrl("getCourses");

    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error("getCourses error:", err);
    return { success: false, message: "Network error fetching courses" };
  }
}
