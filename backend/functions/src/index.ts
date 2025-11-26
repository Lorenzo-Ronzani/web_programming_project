// ------------------------------------------------------
// Firebase Cloud Functions v2 - Main Entry Point
// ------------------------------------------------------
// This file exports all HTTP functions and Firestore triggers.
// Each function is defined in its own module for clarity and separation of concerns.

//import { onRequest } from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

// ------------------------------------------------------
// Import API endpoints (HTTP callable functions)
// ------------------------------------------------------

export { createUser } from "./api/createUser";
export { loginUser } from "./api/loginUser";
export { getCourses } from "./api/getCourses";
export { getPrograms } from "./api/getPrograms";
export { getUsers } from "./api/getUsers";
export { getCoursesUsers } from "./api/getCoursesUsers";



// Admissions APIs ------------------------------------------
export { createAdmission } from "./api/createAdmission";
export { getAdmissions } from "./api/getAdmissions";
export { getAdmissionById } from "./api/getAdmissionById";
export { updateAdmission } from "./api/updateAdmission";
export { deleteAdmission } from "./api/deleteAdmission";

// ------------------------------------------------------
// Firestore triggers
// ------------------------------------------------------
export { assignStudentId } from "./api/createUserId";
