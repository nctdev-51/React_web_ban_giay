import React, { useState } from "react";

interface SigninFormProps {
  onSwitch: () => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // States cho UX thực tế
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setAuthMessage(null); // Xóa thông báo lỗi API khi người dùng gõ lại
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    if (name === "email") {
      if (!value) {
        setErrors((prev) => ({ ...prev, email: "Please enter your email." }));
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Valid email is required." }));
      return;
    }

    setIsSubmitting(true);
    setAuthMessage(null);

    // GIẢ LẬP GỌI API BACKEND (Đợi 1.5s)
    // Thực tế sẽ là: const res = await axios.post('/api/auth/login', formData);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const existingUsers = JSON.parse(
      localStorage.getItem("nike_users") || "[]",
    );
    const user = existingUsers.find(
      (u: any) =>
        u.email === formData.email && u.password === formData.password,
    );

    setIsSubmitting(false);

    if (user) {
      setAuthMessage({
        type: "success",
        text: `Welcome back, ${user.firstName || "Member"}!`,
      });
      // TODO: Lưu token, chuyển hướng (navigate) về trang chủ hoặc trang User
    } else {
      setAuthMessage({
        type: "error",
        text: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 font-sans text-[#111]">
      <div className="w-full max-w-[460px]">
        <div className="flex gap-4 mb-8">
          <svg className="w-12" viewBox="0 0 24 24" fill="black">
            <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" />
          </svg>
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
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email*"
              className={`w-full p-4 border rounded-md focus:outline-none transition-all ${
                touched.email && errors.email
                  ? "border-red-500 bg-red-50 placeholder-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password*"
              className={`w-full p-4 pr-12 border rounded-md focus:outline-none transition-all ${
                touched.password && errors.password
                  ? "border-red-500 bg-red-50 placeholder-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
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

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-5 h-5 accent-black rounded border-gray-300 cursor-pointer"
                onChange={handleChange}
              />
              <span className="text-[14px] text-gray-500 group-hover:text-black transition-colors">
                Keep me signed in
              </span>
            </label>
            <a
              href="#"
              className="text-[14px] text-gray-400 underline hover:text-black transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <p className="text-[12px] text-gray-500 text-center px-4 leading-5">
            By logging in, you agree to Nike's{" "}
            <span className="underline font-medium text-[#111] cursor-pointer">
              Privacy Policy
            </span>{" "}
            and{" "}
            <span className="underline font-medium text-[#111] cursor-pointer">
              Terms of Use
            </span>
            .
          </p>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex justify-center items-center"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px]">
          <span className="text-gray-500">Not a Member? </span>
          <button
            onClick={onSwitch}
            className="font-medium underline hover:text-gray-600 ml-1 cursor-pointer"
          >
            Join Us.
          </button>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
