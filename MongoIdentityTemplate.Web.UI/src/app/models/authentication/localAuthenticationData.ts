import { Gender } from "../common/gender";

export interface LocalAuthenticationData {
    token: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    expiresOn: Date;
    gender: Gender;
}