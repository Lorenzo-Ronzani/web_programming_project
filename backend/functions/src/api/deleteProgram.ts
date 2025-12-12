import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const deleteProgram = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Only DELETE allowed" });
  }

  try {
    const programId = req.query.id;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: "Program ID is required",
      });
    }

    // DELETE PROGRAM
    await db.collection("programs").doc(programId).delete();

    // DELETE RELATED DOCUMENTS
    const collectionsToDelete = [
      "program_structure",
      "admissions",
      "public_intakes",
      "requirements",
      "tuition",
    ];

    for (const col of collectionsToDelete) {
      const snap = await db
        .collection(col)
        .where("program_id", "==", programId)
        .get();

      const batch = db.batch();

      snap.docs.forEach(doc => batch.delete(doc.ref));

      await batch.commit(); // Delete all related documents
    }

    return res.status(200).json({
      success: true,
      message: "Program and all related data deleted successfully",
    });

  } catch (error: any) {
    console.error("DELETE PROGRAM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete program",
    });
  }
});
