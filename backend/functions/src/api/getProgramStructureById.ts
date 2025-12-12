import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getProgramStructureById = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "GET only.",
      });
    }

    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Program ID is required.",
      });
    }

    let docSnap = await db.collection("program_structure").doc(id).get();

    if (!docSnap.exists) {
      const querySnap = await db
        .collection("program_structure")
        .where("program_id", "==", id)
        .limit(1)
        .get();

      if (!querySnap.empty) {
        docSnap = querySnap.docs[0];
      }
    }

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Program structure not found.",
      });
    }

    return res.status(200).json({
      success: true,
      item: {
        id: docSnap.id,
        ...docSnap.data(),
      },
    });
  } catch (error: any) {
    console.error("GET PROGRAM STRUCTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
});
