

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    email: string;
    password: string;
    role: "admin" | "user";
    status: "active" | "disabled";
}

export interface Register {
    firstname?: string;
    lastname?: string;
    dateOfBirth?: string;
    email?: string;
    password?: string;
}

export interface Registered {
    id: string;
    token: string;
}

export interface GetUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    dateOfBirth: string;
    status: "active" | "disabled";
}


export type MissingParam = { missing: string; message: string };
export type ErrorResponse = { error: boolean; message: string | MissingParam[] };
