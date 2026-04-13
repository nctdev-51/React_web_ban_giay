import { useState } from "react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

export default function AuthPage({ isSignup }: { isSignup: boolean }) {
  // Trạng thái để biết đang ở màn hình Đăng nhập (signin) hay Đăng ký (signup)
  let view: string= "";
  if(isSignup) {
    view = "signup";
  } else {
    view = "signin";
  }
  const [currentView, setCurrentView] = useState<string>(view);

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
