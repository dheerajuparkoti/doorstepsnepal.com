"use client";

import React from "react";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/lib/i18n/context";
import {
  ArrowLeft,
  Star,
  MapPin,
  Shield,
  Clock,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  Upload,
} from "lucide-react";
import Loading from "./loading";

const professional = {
  id: "1",
  name: "Ram Bahadur Thapa",
  nameNp: "राम बहादुर थापा",
  photo: "/placeholder.svg?height=200&width=200",
  rating: 4.9,
  reviews: 156,
  experience: 8,
  location: "Kathmandu",
  locationNp: "काठमाडौं",
  verified: true,
  price: 500,
  priceUnit: "per hour",
  skills: ["Pipe Repair", "Installation", "Maintenance"],
  completedJobs: 234,
  responseTime: "15 min",
};

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function BookingPage() {
  const params = useParams();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    description: "",
    urgency: "normal",
  });

  const serviceFee = 50;
  const estimatedTotal = professional.price + serviceFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Handle booking submission
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Link
            href={`/services/plumbing`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {/* Placeholder for translation */}
            "back"
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{"selectDateTime"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="mb-3 block">{"selectDate"}</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    {selectedDate && (
                      <div>
                        <Label className="mb-3 block">{"selectTime"}</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className="text-sm"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="mb-3 block">{"urgency"}</Label>
                      <RadioGroup
                        value={formData.urgency}
                        onValueChange={(value) =>
                          setFormData({ ...formData, urgency: value })
                        }
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">{"normalService"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="urgent" id="urgent" />
                          <Label htmlFor="urgent">
                            {"urgentService"} (+Rs. 200)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="emergency" id="emergency" />
                          <Label htmlFor="emergency">
                            {"emergencyService"} (+Rs. 500)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      className="w-full"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(2)}
                    >
                      {"continue"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{"serviceDetails"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{"fullName"}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={"enterFullName"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{"phoneNumber"}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+977 98XXXXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">{"serviceAddress"}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={"enterAddress"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="landmark">{"landmark"}</Label>
                      <Input
                        id="landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder={"nearbyLandmark"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">{"problemDescription"}</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={"describeIssue"}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>{"uploadPhotos"}</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mt-2">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {"dragDropPhotos"}
                        </p>
                        <Button variant="outline" className="mt-2 bg-transparent" size="sm">
                          {"browseFiles"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setStep(1)}
                      >
                        {"back"}
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={
                          !formData.name || !formData.phone || !formData.address
                        }
                        onClick={() => setStep(3)}
                      >
                        {"continue"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{"paymentMethod"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          paymentMethod === "cash"
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Banknote className="w-6 h-6 text-primary" />
                        <div className="flex-1">
                          <Label htmlFor="cash" className="font-medium">
                            {"cashOnDelivery"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {"payAfterService"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          paymentMethod === "esewa"
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value="esewa" id="esewa" />
                        <Smartphone className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <Label htmlFor="esewa" className="font-medium">
                            "eSewa"
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {"payViaEsewa"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          paymentMethod === "khalti"
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value="khalti" id="khalti" />
                        <CreditCard className="w-6 h-6 text-purple-600" />
                        <div className="flex-1">
                          <Label htmlFor="khalti" className="font-medium">
                            "Khalti"
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {"payViaKhalti"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          paymentMethod === "imepay"
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value="imepay" id="imepay" />
                        <Smartphone className="w-6 h-6 text-red-600" />
                        <div className="flex-1">
                          <Label htmlFor="imepay" className="font-medium">
                            "IME Pay"
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {"payViaImePay"}
                          </p>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setStep(2)}
                      >
                        {"back"}
                      </Button>
                      <Button className="flex-1" onClick={handleSubmit}>
                        {"confirmBooking"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {"bookingConfirmed"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {"bookingConfirmationMessage"}
                    </p>

                    <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm text-muted-foreground mb-1">
                        {"bookingId"}
                      </p>
                      <p className="font-mono font-semibold text-foreground">
                        DN-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          {"viewBookings"}
                        </Button>
                      </Link>
                      <Link href="/" className="flex-1">
                        <Button className="w-full">{"backToHome"}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <aside className="lg:w-80">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{"bookingSummary"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={professional.photo || "/placeholder.svg"}
                        alt={professional.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {"Ram Bahadur Thapa"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {professional.rating}
                        {professional.verified && (
                          <Badge
                            variant="secondary"
                            className="text-xs gap-1 ml-1"
                          >
                            <Shield className="w-3 h-3" />
                            {"verified"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    {selectedDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {"date"}
                        </span>
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {"time"}
                        </span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {"serviceType"}
                      </span>
                      <span className="font-medium capitalize">
                        {formData.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {"serviceCharge"}
                      </span>
                      <span>Rs. {professional.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {"platformFee"}
                      </span>
                      <span>Rs. {serviceFee}</span>
                    </div>
                    {formData.urgency === "urgent" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {"urgentCharge"}
                        </span>
                        <span>Rs. 200</span>
                      </div>
                    )}
                    {formData.urgency === "emergency" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {"emergencyCharge"}
                        </span>
                        <span>Rs. 500</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                      <span>{"total"}</span>
                      <span className="text-primary">
                        Rs.{" "}
                        {estimatedTotal +
                          (formData.urgency === "urgent"
                            ? 200
                            : formData.urgency === "emergency"
                              ? 500
                              : 0)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {"finalPriceNote"}
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function Loading() {
  return null;
}
