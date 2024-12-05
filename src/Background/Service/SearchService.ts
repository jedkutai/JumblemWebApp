import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { UserModel } from "../Models/UserModel";

export class SearchService {
  static async searchDatabase(searchText: string): Promise<UserModel[]> {
    const db = getFirestore();
    const lowercasedSearchText = searchText.toLowerCase();

    // Firestore query to search users by username
    const userQuery = query(
      collection(db, "users"),
      where("username", ">=", lowercasedSearchText),
      where("username", "<=", lowercasedSearchText + "\uf8ff")
    );

    try {
      const snapshot = await getDocs(userQuery);

      // Map documents to UserModel objects
      const searchResults: UserModel[] = snapshot.docs.map((doc) => doc.data() as UserModel);

      // Sort results alphabetically by username
      return searchResults.sort((a, b) => (a.username || "\uf8ff").localeCompare(b.username || "\uf8ff"));
    } catch (error) {
      throw error;
    }
  }
}
