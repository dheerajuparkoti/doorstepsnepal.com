"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Phone, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate OTP send
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Check if user exists (simulated - in real app, check backend)
    const isNewUser = !localStorage.getItem("userSetupComplete");
    
    setIsLoading(false);
    
    if (isNewUser) {
      // Store phone for setup
      localStorage.setItem("userPhone", phone);
      router.push("/setup");
    } else {
      // Existing user - go to dashboard
      router.push("/dashboard");
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-none lg:shadow-lg lg:border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">
            {step === "phone" ? "Welcome Back" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to continue"
              : `We sent a 6-digit code to +977 ${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "phone" ? (
            <>
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
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhone(value);
                        setError("");
                      }}
                      className="pl-10"
                      maxLength={10}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || phone.length < 10}
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
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("phone")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Change number
              </button>

              <div className="space-y-4">
                <Label className="text-center block">Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setError("");
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Didn't receive the code? "}
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium"
                >
                  Resend OTP
                </button>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
