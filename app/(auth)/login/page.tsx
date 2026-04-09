"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Phone, Mail, ArrowRight, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginMethod = "phone" | "email";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyOTP, loginViaEmail, verifyEmailOTP } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setError("");
    setIsLoading(true);
    try {
      if (loginMethod === "phone") {
        if (phone.length < 10) {
          setError("Please enter a valid 10-digit phone number");
          setIsLoading(false);
          return;
        }
        await login(phone);
      } else {
        if (!email.includes("@")) {
          setError("Please enter a valid email address");
          setIsLoading(false);
          return;
        }
        await loginViaEmail(email);
      }
      startCountdown();
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      if (loginMethod === "phone") {
        await verifyOTP(phone, otp);
      } else {
        await verifyEmailOTP(email, otp);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      if (loginMethod === "phone") {
        await login(phone);
      } else {
        await loginViaEmail(email);
      }
      startCountdown();
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodSwitch = (method: LoginMethod) => {
    setLoginMethod(method);
    setStep("input");
    setPhone("");
    setEmail("");
    setOtp("");
    setError("");
    setCountdown(0);
  };

  const contactDisplay = loginMethod === "phone" ? `+977 ${phone}` : email;

  return (
    <AuthLayout>
      <Card className="border-0 shadow-none lg:shadow-lg lg:border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">
            {step === "input" ? "Welcome Back" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === "input"
              ? "Enter your details to continue"
              : `We sent a 4-digit code to ${contactDisplay}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "input" ? (
            <>
              {/* Tab toggle */}
              <div className="flex rounded-lg border border-input p-1 gap-1">
                <button
                  onClick={() => handleMethodSwitch("phone")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === "phone"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  Phone
                </button>
                <button
                  onClick={() => handleMethodSwitch("email")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === "email"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              </div>

              {loginMethod === "phone" ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-muted rounded-md border border-input text-sm font-medium">
                      +977
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="98XXXXXXXX"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setError("");
                        }}
                        className="pl-10"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={
                  isLoading ||
                  (loginMethod === "phone" ? phone.length < 10 : !email.includes("@"))
                }
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="/terms-conditions" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("input"); setOtp(""); setError(""); }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4" />
                {loginMethod === "phone" ? "Change number" : "Change email"}
              </button>

              <div className="space-y-4">
                <Label className="text-center block">Enter 4-digit OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setError("");
                    }}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <p className="text-center text-xs text-muted-foreground">
                  Enter the 4-digit code sent to {contactDisplay}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 4}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {"Didn't receive the code? "}
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading || countdown > 0}
                    className="text-primary hover:underline font-medium disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  OTP is valid for 5 minutes
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
