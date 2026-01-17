export interface User {
    _id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
    isEmailVerified?: boolean;
}

export interface AuthData extends User {
    token: string;
}

export interface AuthResponse {
    success: boolean;
    status: number;
    message: string;
    data: AuthData;
}
