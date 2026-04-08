import React, { useState } from "react";

interface SignupFormProps {
  onSwitch: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitch }) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    let errorMsg = "";

    if (name === "email") {
      if (!value) errorMsg = "Required";
      else if (!validateEmail(value)) errorMsg = "Invalid email format.";
      else {
        const existingUsers = JSON.parse(
          localStorage.getItem("nike_users") || "[]",
        );
        if (
          existingUsers.some(
            (u: any) => u.email.toLowerCase() === value.toLowerCase(),
          )
        ) {
          errorMsg = "Email is already registered.";
        }
      }
    }

    if (name === "password" && !validatePassword(value)) {
      errorMsg = "Password must meet requirements.";
    }

    const currentYear = new Date().getFullYear();
    if (
      name === "day" &&
      (!value || parseInt(value) < 1 || parseInt(value) > 31)
    )
      errorMsg = "Invalid";
    if (
      name === "month" &&
      (!value || parseInt(value) < 1 || parseInt(value) > 12)
    )
      errorMsg = "Invalid";
    if (
      name === "year" &&
      (!value || parseInt(value) < 1900 || parseInt(value) > currentYear)
    )
      errorMsg = "Invalid";

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "number" && parseInt(value) < 0) return;

    setFormData({ ...formData, [name]: isCheckbox ? checked : value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors =
      Object.values(errors).some((err) => err !== "") ||
      !formData.day ||
      !formData.month ||
      !formData.year;

    if (hasErrors) {
      setErrors((prev) => ({
        ...prev,
        submit: "Please check the highlighted fields above.",
      }));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // MÔ PHỎNG API BACKEND
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const existingUsers = JSON.parse(
      localStorage.getItem("nike_users") || "[]",
    );
    existingUsers.push(formData);
    localStorage.setItem("nike_users", JSON.stringify(existingUsers));

    setIsSubmitting(false);
    setSuccessMessage("Account created successfully! Redirecting...");

    // Đợi 2s rồi chuyển về form Login
    setTimeout(() => {
      onSwitch();
    }, 2000);
  };

  if (successMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white p-4 text-[#111]">
        <div className="text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-medium">{successMessage}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 font-sans text-[#111]">
      <div className="w-full max-w-[460px]">
        <div className="flex gap-4 mb-2">
          <svg className="w-12" viewBox="0 0 24 24" fill="black">
            <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" />
          </svg>
        </div>

        <h1 className="text-[26px] font-medium leading-tight mb-6">
          Now let's make you a Nike Member.
        </h1>

        {errors.submit && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email*"
              required
              className={`w-full p-4 border rounded-md focus:outline-none ${touched.email && errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="surname"
                placeholder="Surname*"
                required
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                onChange={handleChange}
              />
            </div>
          </div>

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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm"
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
            className="w-full p-4 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:border-black text-[#111]"
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Shopping Preference*
            </option>
            <option value="men">Men's</option>
            <option value="women">Women's</option>
          </select>

          <div>
            <label className="block text-[14px] text-gray-600 mb-2">
              Date of Birth
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                name="day"
                placeholder="DD"
                className={`w-1/3 p-4 border rounded-md focus:outline-none ${touched.day && errors.day ? "border-red-500" : "border-gray-300"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <input
                type="number"
                name="month"
                placeholder="MM"
                className={`w-1/3 p-4 border rounded-md focus:outline-none ${touched.month && errors.month ? "border-red-500" : "border-gray-300"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <input
                type="number"
                name="year"
                placeholder="YYYY"
                className={`w-1/3 p-4 border rounded-md focus:outline-none ${touched.year && errors.year ? "border-red-500" : "border-gray-300"}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <p className="text-[12px] text-gray-500 mt-2">
              Get a Nike Member Reward every year on your Birthday.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="isSubscribed"
                className="w-5 h-5 accent-black rounded border-gray-300 mt-0.5"
                onChange={handleChange}
              />
              <span className="text-[14px] text-gray-600 group-hover:text-black transition-colors">
                Sign up for emails to get updates from Nike on products, offers
                and your Member benefits.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeTerms"
                required
                className="w-5 h-5 accent-black rounded border-gray-300 mt-0.5"
                onChange={handleChange}
              />
              <span className="text-[14px] text-gray-600">
                I agree to Nike's{" "}
                <span className="underline font-medium text-[#111]">
                  Privacy Policy
                </span>{" "}
                and{" "}
                <span className="underline font-medium text-[#111]">
                  Terms of Use.
                </span>
              </span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white px-8 py-4 rounded-full font-medium text-base hover:bg-gray-800 transition disabled:bg-gray-400 flex justify-center items-center"
            >
              {isSubmitting ? "Creating Account..." : "Join Us"}
            </button>
          </div>

          <div className="mt-6 text-center text-[14px]">
            <span className="text-gray-500">Already a Member? </span>
            <button
              type="button"
              onClick={onSwitch}
              className="font-medium underline hover:text-gray-600 ml-1 cursor-pointer"
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
