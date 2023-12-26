import { Gender } from "../common/gender";

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: Gender;
}