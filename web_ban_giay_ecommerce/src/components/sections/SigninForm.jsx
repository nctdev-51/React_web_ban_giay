import React, { useState } from 'react';

const SigninForm = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({}); // Thêm state quản lý lỗi định dạng
    const [showPassword, setShowPassword] = useState(false);

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Xóa lỗi ngay khi người dùng bắt đầu gõ lại
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });

        // Kiểm tra định dạng khi blur ra ngoài
        if (name === 'email') {
            if (!value) {
                setErrors(prev => ({ ...prev, email: 'Please enter your email.' }));
            } else if (!validateEmail(value)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra lại lần nữa trước khi login
        if (!validateEmail(formData.email)) {
            setErrors(prev => ({ ...prev, email: 'Valid email is required.' }));
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem('nike_users') || '[]');
        const user = existingUsers.find(
            (u) => u.email === formData.email && u.password === formData.password
        );

        if (user) {
            alert(`Welcome back, ${user.firstName}!`);
        } else {
            alert('Invalid email or password.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white p-4 font-sans text-black">
            <div className="w-full max-w-[460px]">
                {/* Logo Section */}
                <div className="flex gap-4 mb-8">
                    <svg className="w-12" viewBox="0 0 24 24" fill="black"><path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" /></svg>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/1200px-Jumpman_logo.svg.png" alt="Jordan" className="h-8" />
                </div>

                <h1 className="text-[26px] font-medium leading-tight mb-8">
                    Enter your email and password to sign in.
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            className={`w-full p-4 border rounded-md focus:outline-none transition-all ${
                                touched.email && errors.email ? 'border-red-500 bg-red-50 placeholder-red-500' : 'border-gray-300 focus:border-black'
                            }`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password*"
                            className={`w-full p-4 pr-12 border rounded-md focus:outline-none transition-all ${
                                touched.password && errors.password ? 'border-red-500 bg-red-50 placeholder-red-500' : 'border-gray-300 focus:border-black'
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
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-[12px] mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Phần còn lại giữ nguyên... */}
                    <div className="flex items-center justify-between py-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="rememberMe" className="w-5 h-5 accent-black" onChange={handleChange} />
                            <span className="text-[14px] text-gray-500">Keep me signed in</span>
                        </label>
                        <a href="#" className="text-[14px] text-gray-400 underline hover:text-black">Forgot password?</a>
                    </div>

                    <p className="text-[12px] text-gray-500 text-center px-4 leading-5">
                        By logging in, you agree to Nike's <span className="underline font-bold text-black cursor-pointer">Privacy Policy</span> and <span className="underline font-bold text-black cursor-pointer">Terms of Use</span>.
                    </p>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:opacity-70 transition-opacity">
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-[14px]">
                    <span className="text-gray-500">Not a Member? </span>
                    <button onClick={onSwitch} className="font-bold underline hover:text-gray-600 ml-1 cursor-pointer">Join Us.</button>
                </div>
            </div>
        </div>
    );
};

export default SigninForm;