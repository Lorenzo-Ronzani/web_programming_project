import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const registerStudentCourse = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    // Apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed. Use POST.",
      });
    }

    const { student_id, program_id, course_id, term } = req.body;

    // Validação mínima de campos obrigatórios
    if (!student_id || !program_id || !course_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: student_id, program_id, course_id.",
      });
    }

    // [VALIDAÇÕES AVANÇADAS REMOVIDAS]
    // Aqui depois voltaremos a adicionar, passo a passo:
    // - Verificar se o student tem program ativo
    // - Verificar se o course pertence ao program / term
    // - Verificar duplicidade de registro
    // etc.

    const now = new Date().toISOString();

    const newItem = {
      student_id,
      program_id,
      course_id,
      term: term || null,          // opcional, se quiser já registrar o term
      status: "registered",        // status simples por enquanto
      registered_at: now,
      updated_at: now,
    };

    const newDoc = await db.collection("studentCourses").add(newItem);

    return res.status(201).json({
      success: true,
      message: "Course registered successfully (basic insert, no validations).",
      item: {
        id: newDoc.id,
        ...newItem,
      },
    });

  } catch (error: any) {
    console.error("REGISTER STUDENT COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
});
