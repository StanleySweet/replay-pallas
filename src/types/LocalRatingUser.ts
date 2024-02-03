import { User } from "./User";

interface LocalRatingUser {
    "rank": number,
    "rating": string,
    "matches": number,
    "user": User
}

export type {
    LocalRatingUser
};
