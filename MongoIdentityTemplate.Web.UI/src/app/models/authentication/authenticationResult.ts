import { Gender } from "../common/gender";

export interface AuthenticationResult {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    roles: string[];
    token: string;
    expiresIn: number;
}