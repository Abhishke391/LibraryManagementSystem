import { createContext, useContext, useState } from "react";
import axiosInstance from "../services/AxiosInstance";


interface AuthContextType {
    user: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AouthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));

    const login = async (email: string, password: string) => {
        const res = await axiosInstance.post("/auth/login", {email, password});
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', res.data.email);
        setUser(res.data.email);
    }

    const register = async (email: string, password: string) => {
        const res = await axiosInstance.post('/auth/register', {email, password});
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', res.data.email);
        setUser(res.data.email);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
} 