import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/utils/firebase/admin";
import { Role } from "@/utils/context/interface/Auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const resolvedParams = await params;
    const uid = resolvedParams.uid;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);

    // Get the admin user's data
    const adminDoc = await adminDb
      .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
      .doc(decodedToken.uid)
      .get();

    const adminData = adminDoc.data();

    // Check if the user is a super-admin or admin
    if (
      !adminData ||
      (adminData.role !== Role.SUPER_ADMIN && adminData.role !== Role.ADMIN)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get the target user's data
    const targetUserDoc = await adminDb
      .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
      .doc(uid)
      .get();

    const targetUserData = targetUserDoc.data();

    // Prevent deletion of other admins or super-admins
    if (
      targetUserData &&
      (targetUserData.role === Role.ADMIN ||
        targetUserData.role === Role.SUPER_ADMIN)
    ) {
      return NextResponse.json(
        { error: "Cannot delete admin or super-admin accounts" },
        { status: 403 }
      );
    }

    // Delete user from Firestore
    await adminDb
      .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
      .doc(uid)
      .delete();

    // Delete user from Authentication
    await getAuth().deleteUser(uid);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
