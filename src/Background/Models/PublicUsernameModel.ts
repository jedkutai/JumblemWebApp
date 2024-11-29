import { Timestamp } from "firebase/firestore";

export interface PublicUsernameModel {
    id: string; // Unique identifier for the username
    userNameLowercased: string; // Lowercased version of the username for uniformity
    timestamp: Timestamp // Firebase Timestamp for when the username was created
  }
  

  