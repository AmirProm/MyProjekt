export interface RegisterUser {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string | undefined;
}