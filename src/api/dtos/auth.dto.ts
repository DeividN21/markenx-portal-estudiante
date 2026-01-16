export interface AuthMeResponse {
    username: string | null;
    email: string | null;
    fullName: string | null;
    roles: string[];
}
