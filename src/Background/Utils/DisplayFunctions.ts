export class DisplayFunctions {

    static displayUsername(usernameDisplayed?: string): string {
        let username = usernameDisplayed ?? "N/A";
        let result = username;
        if (username.length > 10) {
            result = username.slice(0, 8) + "...";
        }

        return result;
    }
}