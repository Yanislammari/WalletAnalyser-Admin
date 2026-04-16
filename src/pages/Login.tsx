import React, { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import Background from "../components/Background";
import { useAuth } from "../providers/AuthProvider";

const Login: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { login, login2Fa, resend2Fa } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(30);

  const getErrorMessage = (backendMessage: string): string => {
    switch (backendMessage) {
      case "Invalid email credentials":
        return "Email not found. Please check your email.";
      case "Password not set for this user":
        return "This account does not have a password set yet.";
      case "Invalid password credentials":
        return "Incorrect password. Please try again.";
      case "Email already exists":
        return "An account with this email already exists.";
      case "Username already exists":
        return "This username is already taken.";
      default:
        return "Something went wrong. Please try again later.";
    }
  };  

  useEffect(() => {
    if (step !== "2fa") return;
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleOtpChange = (val: string, i: number) => {
    const next = [...otp];   // copy the array (never mutate state directly)
    next[i] = val;           // update the digit at position i
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
    if( i === 5 && val != "" ) handle2FALogin(next.join(""));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(paste.split("").concat(Array(6).fill("")).slice(0, 6));
    document.getElementById(`otp-${Math.min(paste.length, 5)}`)?.focus();
    if(paste.length === 6) handle2FALogin(paste);
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const next = [...otp];
      next[i - 1] = "";
      setOtp(next);
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleLogin = async () => {
    if (!email && !password) {
      toast.error("Email and password are required.");
      return;
    }
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      setStep("2fa");
    }
    catch (error: any) {
      const message = getErrorMessage(error.message);
      toast.error(message);
    }
    finally {
      setLoading(false);
    }
  };

  const handle2FALogin = async (code? : string) => {
    const finalCode = code ?? otp.join(""); // ["4","8","2","9","1","7"] → "482917"
    if(finalCode.length < 6){
      toast.error("The code must be 6 digit")
      return
    }
    setLoading(true);
    try {
      await login2Fa(finalCode);
      toast.success("Authentication successful!");
      navigate("/home", { replace: true });
    }
    catch (error: any) {
      toast.error(error.message);
      if(error.message === "The code has expired, you need to login again" || error.message === "No token found. Please login first."){
        setEmail("");
        setPassword("");
        setOtp(["", "", "", "", "", ""]);
        setStep("credentials");
      }
    }
    finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setResendCooldown(30);
    try {
      await resend2Fa();
      toast.success("A new code has been sent, check your spam");
    }
    catch (error: any) {
      toast.error(error.message);
      if(error.message === "The code has expired, you need to login again" || "No token found. Please login first."){
        setEmail("");
        setPassword("");
        setOtp(["", "", "", "", "", ""]);
        setStep("credentials");
      }
    }
    finally {
      setLoading(false);
    }
  };


  if (step === "2fa") {
    return (
      <Background>
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-sm text-gray-900 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              Wallet<span className="text-purple-600">Analyser</span>{" "}
              <span className="text-base font-normal text-gray-400">Admin</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Two-factor authentication</p>
          </div>

          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            A 6-digit code was sent to<br />
            <strong className="text-gray-800">{email}</strong>
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ""), i)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                onPaste={handlePaste}
                className={`w-11 h-14 text-center text-xl font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition
                  ${digit ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-white/90"}`}
              />
            ))}
          </div>

          <button
            onClick={()=>handle2FALogin(undefined)}
            disabled={otp.some((d) => !d) || loading}
            className={`btn bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl normal-case text-base border-none mb-4
              ${otp.some((d) => !d) || loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Verify"}
          </button>

          <p className="text-sm text-gray-400">
            Didn't receive it?{" "}
            <button
              disabled={resendCooldown > 0}
              onClick={handleResend}
              className="text-purple-600 hover:underline disabled:opacity-40 disabled:cursor-default hover:cursor-pointer"
            >
              Resend code
            </button>
          </p>
          {resendCooldown > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Resend available in 0:{resendCooldown.toString().padStart(2, "0")}
            </p>
          )}

          <button
            onClick={() => setStep("credentials")}
            className="text-sm text-gray-400 hover:text-gray-600 mt-4 hover:cursor-pointer"
          >
            ← Back to login
          </button>
        </div>
      </Background>
    );
  }
  return (
    <Background>
      <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-sm text-gray-900">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            Login to Wallet<span className="text-purple-600">Analyser</span> Admin
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className={`btn bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl normal-case text-base border-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
          </button>
        </div>
      </div>
    </Background>
  );
}

export default Login;
