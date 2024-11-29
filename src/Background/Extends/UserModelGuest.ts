import { Timestamp } from "firebase/firestore";
import { UserModel } from "../Models/UserModel";

export const UserModelGuest: UserModel = {
    id: "GUEST",
    email: "",
    username: "guest",
    usernameDisplayed: "Guest",
    standardRating: 1500,
    timestamp: Timestamp.now()
};
