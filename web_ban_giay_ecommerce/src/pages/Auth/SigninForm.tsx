import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { signInUser, clearAuthMessage } from "../../store/authSlice";
import { Logo } from "../../components/ui/Logo";
import { useNavigate } from "react-router-dom";

interface SigninFormProps {
  onSwitch: () => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSwitch }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // <-- KHỞI TẠO NAVIGATE

  // Lấy thêm state 'user' từ Redux
  const { isSubmitting, authMessage, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Nếu trong Redux có dữ liệu user (nghĩa là đăng nhập thành công)
    if (user) {
      const timer = setTimeout(() => {
        navigate("/"); // Chuyển về trang chủ
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (authMessage) dispatch(clearAuthMessage());
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return;
    dispatch(signInUser(formData));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 font-sans text-[#111]">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 flex justify-start">
          <Logo className="h-12" />
        </div>

        <h1 className="text-[26px] font-medium leading-tight mb-8">
          Enter your email and password to sign in.
        </h1>

        {authMessage && (
          <div
            className={`p-4 mb-6 rounded-md text-sm font-medium ${authMessage.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}
          >
            {authMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email*"
            className={`w-full p-4 border rounded-md focus:outline-none ${touched.email && errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"}`}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password*"
              className="w-full p-4 pr-12 border border-gray-300 rounded-md focus:border-black focus:outline-none"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 text-[14px]">
            <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-5 h-5 accent-black"
                onChange={handleChange}
              />
              Keep me signed in
            </label>
            <a href="#" className="text-gray-400 underline hover:text-black">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-[14px]">
          <span className="text-gray-500">Not a Member? </span>
          <button
            onClick={onSwitch}
            className="font-medium underline ml-1 cursor-pointer"
          >
            Join Us.
          </button>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
