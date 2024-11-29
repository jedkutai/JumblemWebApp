import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { AuthService } from "./AuthService";
import { UserModel } from "../Models/UserModel";
import { FollowModel } from "../Models/FollowModel";
import { ReportUsernameModel } from "../Models/ReportUsernameModel";

export class UserService {
  static async deleteAccount(user: UserModel): Promise<void> {
    const db = getFirestore();

    // Clear user's daily puzzles
    const dailyPuzzlesRef = collection(db, `users/${user.id}/dailyPuzzles`);
    const puzzleDocs = await getDocs(dailyPuzzlesRef);
    for (const docSnapshot of puzzleDocs.docs) {
      await deleteDoc(doc(dailyPuzzlesRef, docSnapshot.id));
    }

    // Delete "people you follow" references
    const peopleYouFollowRef = collection(db, "follows");
    const peopleYouFollowQuery = query(peopleYouFollowRef, where("userId", "==", user.id));
    const peopleYouFollowSnapshot = await getDocs(peopleYouFollowQuery);
    for (const docSnapshot of peopleYouFollowSnapshot.docs) {
      await deleteDoc(doc(db, "follows", docSnapshot.id));
    }

    // Delete "people that follow you" references
    const peopleThatFollowYouQuery = query(peopleYouFollowRef, where("userToFollowId", "==", user.id));
    const peopleThatFollowYouSnapshot = await getDocs(peopleThatFollowYouQuery);
    for (const docSnapshot of peopleThatFollowYouSnapshot.docs) {
      await deleteDoc(doc(db, "follows", docSnapshot.id));
    }

    // Delete the account
    await AuthService.deleteAccount();
  }

  static async followUser(user: UserModel, userToFollow: UserModel): Promise<void> {
    const db = getFirestore();
    const followsRef = collection(db, "follows");
    const followsQuery = query(
      followsRef,
      where("userId", "==", user.id),
      where("userToFollowId", "==", userToFollow.id)
    );

    const followsSnapshot = await getDocs(followsQuery);

    if (followsSnapshot.empty) {
      // Follow the user
      const followDoc = doc(followsRef);
      const newFollow: FollowModel = {
        id: followDoc.id,
        userId: user.id,
        userToFollowId: userToFollow.id,
        timestamp: Timestamp.now()
      };
      await setDoc(followDoc, newFollow);
    }
  }

  static async unfollowUser(user: UserModel, userToFollow: UserModel): Promise<void> {
    const db = getFirestore();
    const followsRef = collection(db, "follows");
    const followsQuery = query(
      followsRef,
      where("userId", "==", user.id),
      where("userToFollowId", "==", userToFollow.id)
    );

    const followsSnapshot = await getDocs(followsQuery);

    for (const docSnapshot of followsSnapshot.docs) {
      await deleteDoc(doc(db, "follows", docSnapshot.id));
    }
  }

  static async reportUsername(reportedUserId: string): Promise<void> {
    const db = getFirestore();
    const reportsRef = collection(db, "reports");

    const reportQuery = query(reportsRef, where("reportedUserID", "==", reportedUserId));
    const snapshot = await getDocs(reportQuery);

    if (!snapshot.empty) {
      // Update existing report
      const docSnapshot = snapshot.docs[0];
      const previousReport = docSnapshot.data() as ReportUsernameModel;
      previousReport.count += 1;
      await setDoc(doc(reportsRef, docSnapshot.id), previousReport);
    } else {
      // Create a new report
      const reportDoc = doc(reportsRef);
      const newReport: ReportUsernameModel = {
        id: reportDoc.id,
        reportedUserID: reportedUserId,
        count: 1,
      };
      await setDoc(reportDoc, newReport);
    }
  }
}
