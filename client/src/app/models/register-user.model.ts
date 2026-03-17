export interface RegisterUser {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    gender: string;
    dateOfBirth: string | undefined;
}