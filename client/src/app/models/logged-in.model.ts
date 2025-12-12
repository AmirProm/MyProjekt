export interface LoggedIn {
    email: string;
    userName: string; 
    age: number
    token: string;
    profilePhotoUrl: string | undefined;
    roles: string[];
}