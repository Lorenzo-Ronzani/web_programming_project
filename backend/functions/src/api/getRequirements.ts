// ------------------------------------------------------
// getRequirements.ts - List all requirements
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getRequirements = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const snapshot = await db.collection("requirements").get();

    const items = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      items,
    });

  } catch (error: any) {
    console.error("GET REQUIREMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch requirements",
    });
  }
});
