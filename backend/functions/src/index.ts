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
export { getUsers } from "./api/getUsers";
export { getCoursesUsers } from "./api/getCoursesUsers";


// Programs APIs ------------------------------------------------------------------------
export { getPrograms } from "./api/getPrograms";
export { getProgramById } from "./api/getProgramById";
export { createProgram } from "./api/createProgram";
export { updateProgram } from "./api/updateProgram";
export { deleteProgram } from "./api/deleteProgram";

// Program Structure APIs ---------------------------------------------------------------
export { createProgramStructure } from "./api/createProgramStructure";
export { getProgramStructure } from "./api/getProgramStructure";
export { getProgramStructureById } from "./api/getProgramStructureById";
export { updateProgramStructure } from "./api/updateProgramStructure";
export { deleteProgramStructure } from "./api/deleteProgramStructure";

// Requirements APIs --------------------------------------------------------------------
export { createRequirement } from "./api/createRequirement";
export { getRequirements } from "./api/getRequirements";
export { getRequirementById } from "./api/getRequirementById";
export { updateRequirement } from "./api/updateRequirement";
export { deleteRequirement } from "./api/deleteRequirement";

// Tuition APIs -------------------------------------------------------------------------
export { createTuition } from "./api/createTuition";
export { getTuition } from "./api/getTuition";
export { getTuitionById } from "./api/getTuitionById";
export { updateTuition } from "./api/updateTuition";
export { deleteTuition } from "./api/deleteTuition";

// Admissions APIs ----------------------------------------------------------------------
export { createAdmission } from "./api/createAdmission";
export { getAdmissions } from "./api/getAdmissions";
export { getAdmissionById } from "./api/getAdmissionById";
export { updateAdmission } from "./api/updateAdmission";
export { deleteAdmission } from "./api/deleteAdmission";

// Public Intakes APIs ------------------------------------------------------------------
export { createPublicIntake } from "./api/createPublicIntake";
export { getPublicIntakes } from "./api/getPublicIntakes";
export { getPublicIntakeById } from "./api/getPublicIntakeById";
export { updatePublicIntake } from "./api/updatePublicIntake";
export { deletePublicIntake } from "./api/deletePublicIntake";

// ------------------------------------------------------
// Firestore triggers
// ------------------------------------------------------
export { assignStudentId } from "./api/createUserId";
