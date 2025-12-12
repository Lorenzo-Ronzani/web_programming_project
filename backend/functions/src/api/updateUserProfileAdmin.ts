import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateUserProfileAdmin = onRequest(
  { cors: true },
  async (req: any, res: any) => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Only POST allowed" });
    }

    try {
      const {
        studentId,
        firstName,
        lastName,
        phone,
        addressNumber,
        streetName,
        city,
        province,
        postalCode,
        photo,
        role,
      } = req.body;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Missing required field: studentId",
        });
      }

      // Find user by studentId
      // Your Firestore structure: /users/{uid}
      const usersRef = db.collection("users");
      const query = await usersRef.where("studentId", "==", studentId).get();

      if (query.empty) {
        return res.status(404).json({
          success: false,
          message: `User with studentId ${studentId} not found`,
        });
      }

      const doc = query.docs[0];
      const userRef = usersRef.doc(doc.id);

      // Update fields
      const updateData: any = {
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
        addressNumber: addressNumber || "",
        streetName: streetName || "",
        city: city || "",
        province: province || "",
        postalCode: postalCode || "",
        photo: photo || "",
        role: role || "student",
        updatedAt: new Date().toISOString(),
      };

      await userRef.update(updateData);

      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        updatedId: doc.id,
      });
    } catch (error: any) {
      console.error("ERROR updateUserProfileAdmin:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update user",
      });
    }
  }
);
