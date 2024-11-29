export interface ReportUsernameModel {
    id: string;             // Unique identifier for the report
    reportedUserID: string; // ID of the user being reported
    count: number;          // Count of reports for the username
}
