// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { AuthLayout } from "@/components/auth/auth-layout";
// import { User, Briefcase, Home, Loader2, CheckCircle2 } from "lucide-react";

// type UserMode = "customer" | "professional";

// const genders = [
//   { value: "male", label: "Male" },
//   { value: "female", label: "Female" },
//   { value: "other", label: "Other" },
//   { value: "prefer-not-to-say", label: "Prefer not to say" },
// ];

// const ageGroups = [
//   { value: "18-24", label: "18-24 years" },
//   { value: "25-34", label: "25-34 years" },
//   { value: "35-44", label: "35-44 years" },
//   { value: "45-54", label: "45-54 years" },
//   { value: "55-64", label: "55-64 years" },
//   { value: "65+", label: "65+ years" },
// ];

// export default function SetupPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     gender: "",
//     ageGroup: "",
//     email: "",
//     mode: "" as UserMode | "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }
//     if (!formData.gender) {
//       newErrors.gender = "Please select your gender";
//     }
//     if (!formData.ageGroup) {
//       newErrors.ageGroup = "Please select your age group";
//     }
//     if (!formData.mode) {
//       newErrors.mode = "Please select how you want to use Doorsteps";
//     }
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     setIsLoading(true);
    
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500));
    
//     // Store user data
//     localStorage.setItem("userSetupComplete", "true");
//     localStorage.setItem("userName", formData.name);
//     localStorage.setItem("userGender", formData.gender);
//     localStorage.setItem("userAgeGroup", formData.ageGroup);
//     localStorage.setItem("userEmail", formData.email);
//     localStorage.setItem("userMode", formData.mode);
    
//     setIsLoading(false);
    
//     // Redirect based on selected mode
//     router.push("/dashboard");
//   };

//   const handleModeSelect = (mode: UserMode) => {
//     setFormData((prev) => ({ ...prev, mode }));
//     setErrors((prev) => ({ ...prev, mode: "" }));
//   };

//   return (
//     <AuthLayout>
//       <Card className="border-0 shadow-none lg:shadow-lg lg:border">
//         <CardHeader className="text-center pb-2">
//           <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
//           <CardDescription>
//             Tell us a bit about yourself to get started
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-5">
//           {/* Name */}
//           <div className="space-y-2">
//             <Label htmlFor="name">
//               Full Name <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="name"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChange={(e) => {
//                 setFormData((prev) => ({ ...prev, name: e.target.value }));
//                 setErrors((prev) => ({ ...prev, name: "" }));
//               }}
//             />
//             {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
//           </div>

//           {/* Gender & Age Group row */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>
//                 Gender <span className="text-destructive">*</span>
//               </Label>
//               <Select
//                 value={formData.gender}
//                 onValueChange={(value) => {
//                   setFormData((prev) => ({ ...prev, gender: value }));
//                   setErrors((prev) => ({ ...prev, gender: "" }));
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {genders.map((g) => (
//                     <SelectItem key={g.value} value={g.value}>
//                       {g.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label>
//                 Age Group <span className="text-destructive">*</span>
//               </Label>
//               <Select
//                 value={formData.ageGroup}
//                 onValueChange={(value) => {
//                   setFormData((prev) => ({ ...prev, ageGroup: value }));
//                   setErrors((prev) => ({ ...prev, ageGroup: "" }));
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {ageGroups.map((ag) => (
//                     <SelectItem key={ag.value} value={ag.value}>
//                       {ag.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.ageGroup && <p className="text-sm text-destructive">{errors.ageGroup}</p>}
//             </div>
//           </div>

//           {/* Email (optional) */}
//           <div className="space-y-2">
//             <Label htmlFor="email">
//               Email <span className="text-muted-foreground text-xs">(Optional)</span>
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="your@email.com"
//               value={formData.email}
//               onChange={(e) => {
//                 setFormData((prev) => ({ ...prev, email: e.target.value }));
//                 setErrors((prev) => ({ ...prev, email: "" }));
//               }}
//             />
//             {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
//           </div>

//           {/* Mode Selection */}
//           <div className="space-y-3">
//             <Label>
//               How do you want to use Doorsteps? <span className="text-destructive">*</span>
//             </Label>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {/* Customer Mode */}
//               <button
//                 type="button"
//                 onClick={() => handleModeSelect("customer")}
//                 className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                   formData.mode === "customer"
//                     ? "border-primary bg-primary/5 ring-2 ring-primary/20"
//                     : "border-border hover:border-primary/50 hover:bg-muted/50"
//                 }`}
//               >
//                 {formData.mode === "customer" && (
//                   <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
//                 )}
//                 <div className="flex items-center gap-3 mb-2">
//                   <div
//                     className={`p-2 rounded-lg ${
//                       formData.mode === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"
//                     }`}
//                   >
//                     <Home className="h-5 w-5" />
//                   </div>
//                   <span className="font-semibold">Customer</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Book services for your home
//                 </p>
//               </button>

//               {/* Professional Mode */}
//               <button
//                 type="button"
//                 onClick={() => handleModeSelect("professional")}
//                 className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                   formData.mode === "professional"
//                     ? "border-primary bg-primary/5 ring-2 ring-primary/20"
//                     : "border-border hover:border-primary/50 hover:bg-muted/50"
//                 }`}
//               >
//                 {formData.mode === "professional" && (
//                   <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
//                 )}
//                 <div className="flex items-center gap-3 mb-2">
//                   <div
//                     className={`p-2 rounded-lg ${
//                       formData.mode === "professional" ? "bg-primary text-primary-foreground" : "bg-muted"
//                     }`}
//                   >
//                     <Briefcase className="h-5 w-5" />
//                   </div>
//                   <span className="font-semibold">Professional</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Offer your services to customers
//                 </p>
//               </button>
//             </div>
//             {errors.mode && <p className="text-sm text-destructive">{errors.mode}</p>}
//             <p className="text-xs text-muted-foreground">
//               You can switch between modes anytime from your dashboard
//             </p>
//           </div>

//           {/* Submit Button */}
//           <Button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full"
//             size="lg"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Setting up...
//               </>
//             ) : (
//               <>
//                 <User className="h-4 w-4 mr-2" />
//                 Complete Setup
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>
//     </AuthLayout>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthLayout } from "@/components/auth/auth-layout";
import { User, Briefcase, Home, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserMode = "customer" | "professional";

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const ageGroups = [
  { value: "18-24", label: "18-24 years" },
  { value: "25-34", label: "25-34 years" },
  { value: "35-44", label: "35-44 years" },
  { value: "45-54", label: "45-54 years" },
  { value: "55-64", label: "55-64 years" },
  { value: "65+", label: "65+ years" },
];

export default function SetupPage() {
  const router = useRouter();
  const { setupProfile, user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    ageGroup: "",
    email: "",
    mode: "" as UserMode | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill phone number from user context
  const phoneNumber = user?.phone_number || user?.phone || "";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }
    
    if (!formData.ageGroup) {
      newErrors.ageGroup = "Please select your age group";
    }
    
    if (!formData.mode) {
      newErrors.mode = "Please select how you want to use Doorsteps";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      // Use auth context setupProfile function
      await setupProfile({
        full_name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        gender: formData.gender,
        age_group: formData.ageGroup,
        user_type: formData.mode,
      });
      
      // setupProfile will handle redirection automatically
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
      setIsLoading(false);
    }
  };

  const handleModeSelect = (mode: UserMode) => {
    setFormData((prev) => ({ ...prev, mode }));
    setErrors((prev) => ({ ...prev, mode: "" }));
  };

  return (
      <ProtectedRoute requireSetupComplete={false}>
    <AuthLayout>
      <Card className="border-0 shadow-none lg:shadow-lg lg:border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Phone number display (read-only) */}
          {phoneNumber && (
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Phone Number</Label>
              <div className="p-3 bg-muted/50 rounded-md border border-input">
                <p className="font-medium">+977 {phoneNumber}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This phone number is verified and will be used for all communications
                </p>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Gender & Age Group row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, gender: value }));
                  setErrors((prev) => ({ ...prev, gender: "" }));
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                Age Group <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.ageGroup}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, ageGroup: value }));
                  setErrors((prev) => ({ ...prev, ageGroup: "" }));
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((ag) => (
                    <SelectItem key={ag.value} value={ag.value}>
                      {ag.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ageGroup && <p className="text-sm text-destructive">{errors.ageGroup}</p>}
            </div>
          </div>

          {/* Email (optional) */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            <p className="text-xs text-muted-foreground">
              We'll use this for important updates and notifications
            </p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <Label>
              How do you want to use Doorsteps? <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Mode */}
              <button
                type="button"
                onClick={() => handleModeSelect("customer")}
                disabled={isLoading}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  formData.mode === "customer"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {formData.mode === "customer" && (
                  <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      formData.mode === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Home className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Customer</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Book services for your home and personal needs
                </p>
                <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                  <li>• Find and book services</li>
                  <li>• Manage your bookings</li>
                  <li>• Review professionals</li>
                </ul>
              </button>

              {/* Professional Mode */}
              <button
                type="button"
                onClick={() => handleModeSelect("professional")}
                disabled={isLoading}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  formData.mode === "professional"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {formData.mode === "professional" && (
                  <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      formData.mode === "professional" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Professional</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Offer your services to customers
                </p>
                <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                  <li>• Create service listings</li>
                  <li>• Manage your bookings</li>
                  <li>• Get customer reviews</li>
                </ul>
              </button>
            </div>
            {errors.mode && <p className="text-sm text-destructive">{errors.mode}</p>}
            <p className="text-xs text-muted-foreground">
              You can switch between modes anytime from your dashboard
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Setting up your profile...
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Complete Setup
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
    </ProtectedRoute>
  );
}