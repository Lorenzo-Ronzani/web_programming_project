// ------------------------------------------------------
// Firebase Functions v2 - Entry Point
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import tasks
export { importUsers } from "./api/importUsers";
export { importPrograms } from "./api/importPrograms";
export { importCourses } from "./api/importCourses";
export { importCoursesEnrolled } from "./api/importCoursesEnrolled";  

// Query tasks
export { createUser } from "./api/createUser";
export { loginUser } from "./api/loginUser";
export { getCourses } from "./api/getCourses";
export { getPrograms } from "./api/getPrograms";
export { getUsers } from "./api/getUsers";
export { getCoursesUsers } from "./api/getCoursesUsers";



// Test function
export const hello = onRequest({ cors: true }, (req, res) => {
  logger.info("Hello function called!", { structuredData: true });
  res.status(200).json({ message: "Hello from Firebase Backend with CORS!" });
});
