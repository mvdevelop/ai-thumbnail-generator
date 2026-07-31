
import React from "react";
import SoftBackdrop from "./SoftBackdrop";

interface LoginForm {
  name: string;
  email: string;
  password: string;
}

function Login() {
  const [state, setState] = React.useState("login");
  const [formData, setFormData] = React.useState<LoginForm>({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = React.useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!state.includes("register") && !formData.name.trim()) {
      newErrors.name = "Name is required for registration";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);

      // Reset form on success
      setFormData({ name: '', email: '', password: '' });

    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Removi o fragmento <> e usei a div como container principal
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      
      {/* 1. Movi o Backdrop para dentro do container e adicionei z-0 ou classe de posição se necessário */}
      <div className="absolute inset-0 z-0">
        <SoftBackdrop />
      </div>

      <form
        onSubmit={handleSubmit}
        // 2. O z-10 garante que o formulário fique acima das cores do backdrop
        className="relative z-10 w-full max-w-[350px] text-center bg-white/5 border border-white/10 rounded-2xl px-8 backdrop-blur-md shadow-2xl"
      >
        <h1 className="text-white text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          {state === "login" ? "Please sign in to continue" : "Create your account"}
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /> </svg>
            <input type="text" name="name" placeholder="Name" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.name} onChange={handleChange} required />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white/5 ring-1 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
          <input type="email" name="email" placeholder="Email id" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.email} onChange={handleChange} required />
        </div>

        <div className={`flex items-center mt-4 w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ${errors.password ? 'ring-red-500/60' : ''}`}>          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
          <input type="password" name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.password} onChange={handleChange} required />
        </div>
        {errors.password && (<p className="text-red-400 text-sm mt-1 ml-6">{errors.password}</p>)}

        <div className="mt-4 text-left">
          <button type="button" className="text-sm text-pink-400 hover:underline">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-6 w-full h-11 rounded-full text-white bg-pink-600 hover:bg-pink-500 transition font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {state === "login" ? "Logging in..." : "Creating account..."}
            </span>
          ) : (
            state === "login" ? "Login" : "Sign up"
          )}
        </button>

        <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-400 text-sm mt-3 mb-10 cursor-pointer">
          {state === "login" ? "Don't have an account?" : "Already have an account?"}
          <span className="text-pink-400 hover:underline ml-1">click here</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
