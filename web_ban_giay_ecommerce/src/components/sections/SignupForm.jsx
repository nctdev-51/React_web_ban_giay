import React, { useState } from 'react';

const SignupForm = ({onSwitch}) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        surname: '',
        password: '',
        shoppingPreference: '',
        day: '',
        month: '',
        year: '',
        isSubscribed: false,
        agreeTerms: false
    });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    // Hàm kiểm tra mật khẩu
    const validatePassword = (pass) => {
        // Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(pass);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });

        let errorMsg = '';

        // 1. Kiểm tra Email
        if (name === 'email') {
            if (!value) {
                errorMsg = 'Email không được để trống.';
            } else if (!validateEmail(value)) {
                errorMsg = 'Định dạng email không hợp lệ.';
            } else {
                const existingUsers = JSON.parse(localStorage.getItem('nike_users') || '[]');
                const isDuplicate = existingUsers.some(user => user.email.toLowerCase() === value.toLowerCase());
                if (isDuplicate) errorMsg = 'Email này đã được đăng ký.';
            }
        }

        // 2. Kiểm tra Password
        if (name === 'password') {
            if (!validatePassword(value)) {
                errorMsg = 'Mật khẩu chưa đủ độ mạnh (8 ký tự, gồm chữ hoa, thường và số).';
            }
        }

        // 3. Kiểm tra Ngày/Tháng
        const currentYear = new Date().getFullYear();
        if (name === 'day') {
            const d = parseInt(value);
            if (!value) errorMsg = 'Required';
            else if (d < 1 || d > 31) errorMsg = '1-31 only';
        }

        if (name === 'month') {
            const m = parseInt(value);
            if (!value) errorMsg = 'Required';
            else if (m < 1 || m > 12) errorMsg = '1-12 only';
        }

        if (name === 'year') {
            const y = parseInt(value);
            if (!value) errorMsg = 'Required';
            // Kiểm tra năm sinh hợp lệ (ví dụ từ 1900 đến năm hiện tại)
            else if (y < 1900 || y > currentYear) {
                errorMsg = `1900-${currentYear}`;
            }
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'number' && value < 0) return;

        setFormData({   
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra lỗi trước khi lưu
        const hasErrors = Object.values(errors).some(err => err !== '');
        if (hasErrors) {
            alert('Vui lòng sửa các lỗi trước khi đăng ký.');
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem('nike_users') || '[]');
        existingUsers.push(formData);
        localStorage.setItem('nike_users', JSON.stringify(existingUsers));

        alert('Đăng ký thành công!');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white p-4 font-sans text-black">
            <div className="w-full max-w-[460px]">
                <div className="flex gap-4 mb-2">
                    <svg className="w-12" viewBox="0 0 24 24" fill="black"><path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" /></svg>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/1200px-Jumpman_logo.svg.png" alt="Jordan" className="h-8" />
                </div>

                <h1 className="text-[26px] font-medium leading-tight mb-4">Now let's make you a Nike Member.</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            required
                            className={`w-full p-4 border rounded-md focus:outline-none ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.email && errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                    </div>

                    {/* First Name & Surname */}
                    <div className="flex gap-4">
                        <input type="text" name="firstName" placeholder="First Name*" required className="w-1/2 p-4 border border-gray-300 rounded-md focus:outline-none focus:border-black" onChange={handleChange} />
                        <input type="text" name="surname" placeholder="Surname*" required className="w-1/2 p-4 border border-gray-300 rounded-md focus:outline-none focus:border-black" onChange={handleChange} />
                    </div>

                   {/* Password */}
                    <div>
                        <div className="relative">
                            <input
                                // Thay đổi type dựa trên state showPassword (bạn cần khai báo: const [showPassword, setShowPassword] = useState(false))
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password*"
                                required
                                // Thêm pr-12 để chữ không đè lên con mắt
                                className={`w-full p-4 pr-12 border rounded-md focus:outline-none ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {/* Nút con mắt */}
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
                        </div>

                        {touched.password && errors.password ? (
                            <div className="mt-2 text-[12px] text-red-500 space-y-1">
                                <p>✕ Minimum of 8 characters</p>
                                <p>✕ Uppercase, lowercase letters and one number</p>
                            </div>
                        ) : (
                            <div className="mt-2 text-[12px] text-gray-500 space-y-1">
                                <p>✕ Minimum of 8 characters</p>
                                <p>✕ Uppercase, lowercase letters and one number</p>
                            </div>
                        )}
                    </div>

                    {/* Shopping Preference */}
                    <select name="shoppingPreference" required className="w-full p-4 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:border-black text-gray-500" onChange={handleChange}>
                        <option value="">Shopping Preference*</option>
                        <option value="men">Men's</option>
                        <option value="women">Women's</option>
                    </select>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-[14px] mb-2">Date of Birth</label>
                        <div className="flex gap-2">
                            {/* Day */}
                            <div className="w-1/3">
                                <input 
                                    type="number" 
                                    name="day" 
                                    placeholder="Day*" 
                                    className={`w-full p-4 border rounded-md focus:outline-none ${touched.day && errors.day ? 'border-red-500' : 'border-gray-300'}`} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                />
                                {touched.day && errors.day && <p className="text-red-500 text-[10px] mt-1">{errors.day}</p>}
                            </div>

                            {/* Month */}
                            <div className="w-1/3">
                                <input 
                                    type="number" 
                                    name="month" 
                                    placeholder="Month*" 
                                    className={`w-full p-4 border rounded-md focus:outline-none ${touched.month && errors.month ? 'border-red-500' : 'border-gray-300'}`} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                />
                                {touched.month && errors.month && <p className="text-red-500 text-[10px] mt-1">{errors.month}</p>}
                            </div>

                            {/* Year */}
                            <div className="w-1/3">
                                <input 
                                    type="number" 
                                    name="year" 
                                    placeholder="Year*" 
                                    className={`w-full p-4 border rounded-md focus:outline-none ${touched.year && errors.year ? 'border-red-500' : 'border-gray-300'}`} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                />
                                {touched.year && errors.year && <p className="text-red-500 text-[10px] mt-1">{errors.year}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4 pt-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" name="isSubscribed" className="w-5 h-5 accent-black" onChange={handleChange} />
                            <span className="text-[14px] text-gray-600">Sign up for emails to get updates from Nike.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" name="agreeTerms" required className="w-5 h-5 accent-black" onChange={handleChange} />
                            <span className="text-[14px] text-gray-600">I agree to Nike's <span className="underline font-bold text-black cursor-pointer">Privacy Policy</span> and <span className="underline font-bold text-black cursor-pointer">Terms of Use.</span></span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:opacity-70 transition-opacity">
                            Create Account
                        </button>
                    </div>

                    <div className="mt-5 text-center text-[14px]">
                        <span className="text-gray-500">Already a Member? </span>
                        <button onClick={onSwitch} className="font-bold underline hover:text-gray-600 ml-1 cursor-pointer">Sign in.</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;