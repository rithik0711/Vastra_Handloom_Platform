import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login submitted:", {
      email,
      password,
    });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    if (credentialResponse?.credential) {
      console.log("Google credential received");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#f7f3eb]">

      {/* Background */}
      <img src="/images/back.png" alt="Vastra Background" className="absolute inset-0 w-full h-full object-cover" />

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-black/[0.02]" />

      {/* Login Card */}
      <div className="absolute left-1/2 right-auto top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-24px)] max-w-[390px] h-[calc(100vh-16px)] max-h-[720px] bg-[#fcfbf7]/[0.98] border border-white/70 rounded-[18px] shadow-[0_15px_45px_rgba(35,25,15,0.20)] flex flex-col items-center overflow-hidden md:left-auto md:right-[8%] md:translate-x-0 md:w-[480px] md:max-w-none md:h-[calc(100vh-24px)] md:max-h-none md:rounded-[16px] lg:w-[520px]">

        {/* Logo */}
        <div className="w-[82%] h-[29%] min-h-[155px] max-h-[220px] flex items-center justify-center shrink-0 sm:h-[31%] sm:min-h-[170px] sm:max-h-[250px] md:w-[390px] md:h-[34%] md:min-h-0 md:max-h-[290px] lg:w-[410px] lg:h-[36%]">
          <img src="/images/logo.png" alt="Vastra Logo" className="w-full h-full object-contain" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-[86%] max-w-[330px] flex flex-col sm:max-w-[340px] md:w-[80%] md:max-w-[360px] lg:max-w-[380px]">

          {/* Email */}
          <div className="w-full mb-[11px] sm:mb-[13px] md:mb-[15px]">

            <label htmlFor="email" className="block text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#292421] mb-[5px]">
              Email
            </label>

            <div className="relative w-full">

              {/* Email Icon */}
              <span className="absolute left-[11px] sm:left-[12px] md:left-[13px] top-1/2 -translate-y-1/2 text-[#817b74] pointer-events-none z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px] md:w-[19px] md:h-[19px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>

              {/* Email Input */}
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="box-border w-full h-[42px] sm:h-[44px] md:h-[46px] pl-[38px] sm:pl-[40px] md:pl-[42px] pr-[10px] bg-white border border-[#c7c0b6] rounded-[9px] md:rounded-[10px] text-[13px] md:text-[14px] text-[#302b27] placeholder-[#a29b93] outline-none transition focus:border-[#8b5b24] focus:ring-2 focus:ring-[#c08a35]/20" />

            </div>
          </div>

          {/* Password */}
          <div className="w-full">

            <label htmlFor="password" className="block text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#292421] mb-[5px]">
              Password
            </label>

            <div className="relative w-full">

              {/* Lock Icon */}
              <span className="absolute left-[11px] sm:left-[12px] md:left-[13px] top-1/2 -translate-y-1/2 text-[#817b74] pointer-events-none z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px] md:w-[19px] md:h-[19px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>

              {/* Password Input */}
              <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="box-border w-full h-[42px] sm:h-[44px] md:h-[46px] pl-[38px] sm:pl-[40px] md:pl-[42px] pr-[42px] bg-white border border-[#c7c0b6] rounded-[9px] md:rounded-[10px] text-[13px] md:text-[14px] text-[#302b27] placeholder-[#a29b93] outline-none transition focus:border-[#8b5b24] focus:ring-2 focus:ring-[#c08a35]/20" />

              {/* Show / Hide */}
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-[10px] md:right-[12px] top-1/2 -translate-y-1/2 text-[#77716b] hover:text-[#4a1525] transition">

                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px] md:w-[19px] md:h-[19px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px] md:w-[19px] md:h-[19px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.274 4.057 5.064 7 9.542 7 4.477 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}

              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mt-[5px]">
              <a href="#forgot-password" className="text-[11px] sm:text-[12px] md:text-[13px] text-[#6d665f] underline hover:text-[#4a1525] transition">
                Forgot password?
              </a>
            </div>

          </div>

          {/* Sign In */}
          <button type="submit" className="w-full h-[43px] sm:h-[45px] md:h-[48px] mt-[14px] sm:mt-[16px] md:mt-[18px] rounded-full bg-gradient-to-r from-[#4A1525] via-[#7A263B] to-[#D09229] text-white text-[15px] sm:text-[16px] md:text-[17px] font-medium tracking-wide shadow-[0_5px_14px_rgba(74,21,37,0.22)] hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center">
            Sign In
          </button>

        </form>

        {/* OR Divider */}
        <div className="w-[86%] max-w-[330px] sm:max-w-[340px] md:w-[80%] md:max-w-[360px] lg:max-w-[380px] flex items-center gap-[8px] my-[11px] sm:my-[13px] md:my-[15px]">
          <div className="flex-1 h-px bg-[#d8d1c8]" />
          <span className="text-[10px] md:text-[11px] text-[#8a837b]">OR</span>
          <div className="flex-1 h-px bg-[#d8d1c8]" />
        </div>

        {/* Google Login */}
        <div className="w-[86%] max-w-[330px] sm:max-w-[340px] md:w-[80%] md:max-w-[360px] lg:max-w-[380px] flex justify-center overflow-hidden">
          <div className="w-full flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="outline" size="large" text="signin_with" shape="rectangular" width="100%" logo_alignment="left" />
          </div>
        </div>

        {/* Bottom Space */}
        <div className="flex-1" />

      </div>
    </div>
  );
}