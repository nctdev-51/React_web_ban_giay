import { useState } from "react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

export default function AuthPage() {
  // Trạng thái để biết đang ở màn hình Đăng nhập (signin) hay Đăng ký (signup)
  const [currentView, setCurrentView] = useState<"signin" | "signup">("signin");

  return (
    <div className="bg-white min-h-screen">
      {currentView === "signin" ? (
        <SigninForm onSwitch={() => setCurrentView("signup")} />
      ) : (
        <SignupForm onSwitch={() => setCurrentView("signin")} />
      )}
    </div>
  );
}
