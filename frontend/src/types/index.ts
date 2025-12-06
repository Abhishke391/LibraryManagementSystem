export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    email: string;
}