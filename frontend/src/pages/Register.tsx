import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {register} = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await register(email, password);
            toast.success("Registration successful");
            navigate("/");
        } catch (error:any) {
            toast.error("Registration failed");
            const message = error instanceof Error ? error.message : String(error);
            if(message === "Unauthorized") {
                toast.error("Invalid credentials.");
            } else if (message === "Not Found") {
                toast.error("User not found.");
            } else {
                toast.error(message || 'Registration failed.');
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
    );
}