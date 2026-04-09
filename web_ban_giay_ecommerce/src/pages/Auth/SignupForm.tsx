import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  signUpUser,
  resetSignupStatus,
  clearAuthMessage,
} from "../../store/authSlice";
import { Logo } from "../../components/ui/Logo";

interface SignupFormProps {
  onSwitch: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitch }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSubmitting, authMessage, signupSuccess } = useSelector(
    (state: RootState) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    surname: "",
    password: "",
    shoppingPreference: "",
    day: "",
    month: "",
    year: "",
    isSubscribed: false,
    agreeTerms: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (signupSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetSignupStatus());
        onSwitch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [signupSuccess, onSwitch, dispatch]);

  // --- LOGIC KIỂM TRA ĐỊNH DẠNG ---
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    let errorMsg = "";
    const currentYear = new Date().getFullYear();

    if (name === "email") {
      if (!value) errorMsg = "Required";
      else if (!validateEmail(value))
        errorMsg = "Please enter a valid email address.";
    }

    if (name === "password" && !validatePassword(value)) {
      errorMsg = "Password does not meet requirements.";
    }

    if (name === "day" && (parseInt(value) < 1 || parseInt(value) > 31))
      errorMsg = "Invalid";
    if (name === "month" && (parseInt(value) < 1 || parseInt(value) > 12))
      errorMsg = "Invalid";
    if (
      name === "year" &&
      (parseInt(value) < 1900 || parseInt(value) > currentYear)
    )
      errorMsg = "Invalid";

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({ ...formData, [name]: val });

    // Xóa lỗi khi người dùng bắt đầu sửa lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (authMessage) dispatch(clearAuthMessage());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra lần cuối trước khi gửi
    if (
      !validateEmail(formData.email) ||
      !validatePassword(formData.password)
    ) {
      setErrors((prev) => ({
        ...prev,
        submit: "Please check the highlighted fields.",
      }));
      return;
    }

    dispatch(signUpUser(formData));
  };

  if (signupSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-medium">{authMessage?.text}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 font-sans text-[#111]">
      <div className="w-full max-w-[460px]">
        {/* --- ĐÃ THAY BẰNG LOGO NHÓM 12 --- */}
        <div className="mb-6 flex justify-start">
          <Logo className="h-12" />
        </div>

        <h1 className="text-[26px] font-medium leading-tight mb-6">
          Now let's make you a Nike Member.
        </h1>

        {(authMessage?.type === "error" || errors.submit) && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
            {authMessage?.text || errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email*"
              required
              className={`w-full p-4 border rounded-md focus:outline-none transition-all ${touched.email && errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-4">
            <input
              name="firstName"
              placeholder="First Name*"
              required
              className="w-1/2 p-4 border border-gray-300 rounded-md focus:border-black focus:outline-none"
              onChange={handleChange}
            />
            <input
              name="surname"
              placeholder="Surname*"
              required
              className="w-1/2 p-4 border border-gray-300 rounded-md focus:border-black focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password*"
                required
                className={`w-full p-4 pr-12 border rounded-md focus:outline-none ${touched.password && errors.password ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div
              className={`mt-2 text-[12px] space-y-1 ${touched.password && errors.password ? "text-red-500" : "text-gray-500"}`}
            >
              <p>✕ Minimum of 8 characters</p>
              <p>✕ Uppercase, lowercase letters and one number</p>
            </div>
          </div>

          <select
            name="shoppingPreference"
            required
            className="w-full p-4 border border-gray-300 rounded-md bg-white focus:border-black focus:outline-none"
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Shopping Preference*
            </option>
            <option value="men">Men's</option>
            <option value="women">Women's</option>
          </select>

          {/* Date of Birth */}
          <div>
            <label className="block text-[14px] text-gray-600 mb-2">
              Date of Birth
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                name="day"
                placeholder="DD"
                className={`w-1/3 p-4 border rounded-md focus:outline-none ${touched.day && errors.day ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <input
                type="number"
                name="month"
                placeholder="MM"
                className={`w-1/3 p-4 border rounded-md focus:outline-none ${touched.month && errors.month ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <input
                type="number"
                name="year"
                placeholder="YYYY"
                className={`w-1/3 p-4 border rounded-md focus:outline-none ${touched.year && errors.year ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-[14px] text-gray-600 group">
              <input
                type="checkbox"
                name="isSubscribed"
                className="w-5 h-5 accent-black mt-0.5"
                onChange={handleChange}
              />
              <span>
                Sign up for emails to get updates from Nike on products, offers
                and Member benefits.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer text-[14px] text-gray-600 group">
              <input
                type="checkbox"
                name="agreeTerms"
                required
                className="w-5 h-5 accent-black mt-0.5"
                onChange={handleChange}
              />
              <span>
                I agree to Nike's{" "}
                <span className="underline font-medium text-black">
                  Privacy Policy
                </span>{" "}
                and{" "}
                <span className="underline font-medium text-black">
                  Terms of Use
                </span>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating Account..." : "Join Us"}
          </button>

          <div className="mt-6 text-center text-[14px]">
            <span className="text-gray-500">Already a Member? </span>
            <button
              type="button"
              onClick={onSwitch}
              className="font-medium underline ml-1 hover:text-gray-600 cursor-pointer"
            >
              Sign in.
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
