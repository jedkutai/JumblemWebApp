import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export class Checks {
  // Validate email with a regex
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i;
    return emailRegex.test(email);
  }

  // Validate password: At least 8 characters and no spaces
  static isValidPassword(password: string): boolean {
    return password.length >= 8 && !password.includes(" ");
  }

  // Validate both email and password for signup
  static isValidSignUp(email: string, password: string): boolean {
    return this.isValidEmail(email) && this.isValidPassword(password);
  }

  // Validate username: 4-16 characters, alphanumeric only
  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    return usernameRegex.test(username);
  }

  // Check username availability in Firestore
  static async isUsernameAvailable(username: string): Promise<boolean> {
    if (!this.isValidUsername(username)) {
      console.log("Username isnt legit");
      return false;
    } else {
      try {
        const db = getFirestore();
        const usernamesRef = collection(db, "publicUsernames");
        const usernameQuery = query(usernamesRef, where("userNameLowercased", "==", username.toLowerCase()));
        const snapshot = await getDocs(usernameQuery);
        console.log(`Username isnt taken: ${snapshot.empty}`);
        return snapshot.empty; // If no documents are found, the username is available
      } catch (error) {
        console.error("Failed to check username:", error);
        return false;
      }
    }
    
  }
}
