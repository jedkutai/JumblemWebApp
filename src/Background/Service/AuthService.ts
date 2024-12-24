import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { UserModel } from "../Models/UserModel";
import { FetchService } from "./FetchService";
import { PublicUsernameModel } from "../Models/PublicUsernameModel";

export class AuthService {
  static async uploadUserData(uid: string, email: string): Promise<void> {
    const db = getFirestore();
    const user: UserModel = {
      id: uid,
      email: email.toLowerCase(),
      standardRating: 1500,
      timestamp: Timestamp.now()
    };
    try {
      await setDoc(doc(db, "users", uid), user);
    } catch (error) {
    }
  }

  static async setUsername(user: UserModel, newUsername: string): Promise<void> {
    const db = getFirestore();
    const updatedUser = {
      ...user,
      username: newUsername.toLowerCase(),
      usernameDisplayed: newUsername,
    };
  
    const publicUsername: PublicUsernameModel = {
      id: user.id,
      userNameLowercased: newUsername.toLowerCase(),
      timestamp: Timestamp.now(),
    };
  
    try {
      // Update the user's information in the `users` collection
      await setDoc(doc(db, 'users', user.id), updatedUser);
  
      // Add the username to the `publicUsernames` collection
      await setDoc(doc(db, 'publicUsernames', user.id), publicUsername);
  
    } catch (error) {
    }
  }

  static async createAccount(email: string, password: string): Promise<string> {
    const auth = getAuth();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;
  
      await this.uploadUserData(uid, email.toLowerCase());
      return uid;
    } catch (error: any) {
      // Throw the error so it can be handled by the calling function
      throw error;
    }
  }
  

  static isUserEmailVerified(): boolean {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return false;
    return user.emailVerified;
  }


  static async login(email: string, password: string): Promise<UserModel | null> {
    const auth = getAuth();

    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    const user = await FetchService.fetchUserByUid(uid);
    return user;
  }

  // static async automaticLogin(): Promise<UserModel | null> {
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (user) {
  //     try {
  //       const loggedInUser = await FetchService.fetchUserByUid(user.uid);
  //       return loggedInUser;
  //     } catch (error) {
  //       return null;
  //     }
  //   }

  //   return null;
  // }

  static async signOut(): Promise<void> {
    const auth = getAuth();
    await auth.signOut();
  }

  static async resetPassword(email: string): Promise<void> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }

  static async deleteAccount(): Promise<void> {
    const auth = getAuth();
    const db = getFirestore();

    try {
      const user = auth.currentUser;
      if (user && !user.isAnonymous) {
        const userDoc = doc(db, "users", user.uid);
        const publicUsernameDoc = doc(db, "publicUsernames", user.uid);
        await deleteDoc(userDoc);
        await deleteDoc(publicUsernameDoc);
        await deleteUser(user);
      }
    } catch (error) {
    }
  }
}
