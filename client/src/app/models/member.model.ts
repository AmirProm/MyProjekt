import { Photo } from "./photo.model";

export interface Member {
    email: string;
    userName: string;
    age: number;
    lastActive: Date;
    introduction: string;
    lookingFor: string;
    interests: string;
    gender: string;
    city: string;
    country: string;
    photos: Photo[];
}