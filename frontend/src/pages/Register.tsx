import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { validatePassword, getPasswordStrengthColor } from "../utils/passwordValidator";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {register} = useAuth();
    const navigate = useNavigate();
    const passwordValidation = validatePassword(password);
    const strengthColor = getPasswordStrengthColor(passwordValidation.strength);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordValidation.isValid) {
            passwordValidation.errors.forEach(error => toast.error(error));
            return;
        }

        try {
            await register(email, password);
            toast.success("Registration successful");
            navigate("/");
        } catch (error:any) {
            // toast.error("Registration failed");
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                  <span className={`text-sm font-semibold capitalize ${strengthColor}`}>
                    {passwordValidation.strength}
                  </span>
                </div>
                <div className="space-y-1">
                  {passwordValidation.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <X size={16} />
                      <span>{error}</span>
                    </div>
                  ))}
                  {passwordValidation.isValid && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check size={16} />
                      <span>Password is strong</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!passwordValidation.isValid || !email}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
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