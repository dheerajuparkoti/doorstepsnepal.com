"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, LocateFixed, Loader2, Copy, CheckCircle2, AlertCircle } from "lucide-react";

interface SectionProps {
  id?: string;
}

// Office coordinates
const OFFICE_COORDINATES = {
  lat: 27.746616,
  lng: 85.330536
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Format distance for display
const formatDistance = (km: number): { km: string; miles: string } => {
  return {
    km: km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
    miles: km < 1.6 ? `${Math.round(km * 1000 * 0.000621371)} mi` : `${(km * 0.621371).toFixed(1)} mi`
  };
};

export default function LocationSection({ id }: SectionProps) {
  const { locale } = useI18n();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<{ km: string; miles: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Get user's location
  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(locale === "ne" ? "तपाईंको ब्राउजरले स्थान पहिचान समर्थन गर्दैन" : "Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Calculate distance
        const distanceKm = calculateDistance(
          latitude, 
          longitude, 
          OFFICE_COORDINATES.lat, 
          OFFICE_COORDINATES.lng
        );
        setDistance(formatDistance(distanceKm));
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = locale === "ne" ? "स्थान पहिचान अनुमति अस्वीकार गरियो" : "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = locale === "ne" ? "स्थान जानकारी उपलब्ध छैन" : "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = locale === "ne" ? "स्थान पहिचान समय सीमा समाप्त" : "Location request timed out";
            break;
          default:
            errorMessage = locale === "ne" ? "अज्ञात त्रुटि" : "Unknown error";
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Copy coordinates to clipboard
  const copyCoordinates = () => {
    const coords = `${OFFICE_COORDINATES.lat}, ${OFFICE_COORDINATES.lng}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Open in Google Maps
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}`;
    window.open(url, '_blank');
  };

  // Get Google Maps embed URL (no API key required)
  const getMapEmbedUrl = () => {
    return `https://maps.google.com/maps?q=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}&z=15&output=embed`;
  };

  return (
    <section id={id} className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {locale === "ne" ? "हाम्रो स्थान" : "Our Location"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {locale === "ne" 
              ? "हामीलाई भ्रमण गर्नुहोस् वा आफ्नो स्थानबाट दूरी जाँच गर्नुहोस्" 
              : "Visit us or check the distance from your location"}
          </p>
        </div>

  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Cards stacked vertically */}
          <div className="flex flex-col gap-6">
            {/* Main Info Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-2">
                      {locale === "ne" ? "कार्यालय ठेगाना" : "Office Address"}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Kathmandu, Nepal
                    </p>
                    
                    {/* Coordinates with copy button */}
                    <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                      <code className="text-sm font-mono truncate">
                        {OFFICE_COORDINATES.lat.toFixed(6)}, {OFFICE_COORDINATES.lng.toFixed(6)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={copyCoordinates}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Nearby Landmarks */}
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-primary" />
                        {locale === "ne" ? "नजिकैका स्थलचिन्हहरू" : "Nearby Landmarks"}
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• {locale === "ne" ? "ठमेल" : "Thamel"} - 2.5 km</li>
                        <li>• {locale === "ne" ? "दरबार मार्ग" : "Durbar Marg"} - 1.8 km</li>
                        <li>• {locale === "ne" ? "मैतीदेवी" : "Maitidevi"} - 1.2 km</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/*  Distance Calculator Card */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 shrink-0">
                    <LocateFixed className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-2">
                      {locale === "ne" ? "तपाईंको स्थानबाट दूरी" : "Distance from Your Location"}
                    </h3>
                    
                    {!userLocation && !distance && !locationError && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {locale === "ne" 
                            ? "आफ्नो स्थानबाट कार्यालयको दूरी जाँच गर्नुहोस्" 
                            : "Check the distance from your location to our office"}
                        </p>
                        <Button 
                          onClick={getUserLocation}
                          disabled={isLocating}
                          className="gap-2"
                        >
                          {isLocating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {locale === "ne" ? "पहिचान हुँदै..." : "Locating..."}
                            </>
                          ) : (
                            <>
                              <LocateFixed className="h-4 w-4" />
                              {locale === "ne" ? "मेरो स्थान पत्ता लगाउनुहोस्" : "Detect My Location"}
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {locationError && (
                      <div className="bg-destructive/10 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-destructive mb-1">
                              {locale === "ne" ? "त्रुटि" : "Error"}
                            </p>
                            <p className="text-sm text-muted-foreground">{locationError}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={getUserLocation}
                              className="mt-3"
                            >
                              {locale === "ne" ? "पुन: प्रयास गर्नुहोस्" : "Try Again"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {userLocation && distance && (
                      <div className="space-y-4">
                        {/* Distance Display */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-primary/10 p-4 rounded-lg text-center">
                            <div className="text-sm text-muted-foreground mb-1">KM</div>
                            <div className="text-2xl font-bold text-primary">{distance.km}</div>
                          </div>
                          <div className="bg-primary/10 p-4 rounded-lg text-center">
                            <div className="text-sm text-muted-foreground mb-1">MILES</div>
                            <div className="text-2xl font-bold text-primary">{distance.miles}</div>
                          </div>
                        </div>

                        {/* Travel Time Estimate */}
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Navigation className="h-4 w-4 shrink-0" />
                            {locale === "ne" 
                              ? `अनुमानित यात्रा समय: लगभग ${Math.round(parseFloat(distance.km.split(' ')[0]) / 40 * 60)} मिनेट (कार)`
                              : `Estimated travel time: approx ${Math.round(parseFloat(distance.km.split(' ')[0]) / 40 * 60)} minutes (by car)`
                            }
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Button onClick={openGoogleMaps} className="gap-2">
                            <Navigation className="h-4 w-4" />
                            {locale === "ne" ? "दिशा निर्देश प्राप्त गर्नुहोस्" : "Get Directions"}
                          </Button>
                          <Button variant="outline" onClick={getUserLocation} className="gap-2">
                            <LocateFixed className="h-4 w-4" />
                            {locale === "ne" ? "पुन: गणना गर्नुहोस्" : "Recalculate"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="flex flex-col gap-6">
            {/*  Map Card  */}
            <Card className="border-none shadow-sm overflow-hidden flex-1">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-[400px] md:h-[450px]">
                  <iframe
                    title="Office Location"
                    src={getMapEmbedUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  
                  {/* Map Overlay */}
                  {userLocation && distance && (
                    <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">
                          {locale === "ne" 
                            ? `तपाईं यहाँबाट ${distance.km} टाढा हुनुहुन्छ`
                            : `You are ${distance.km} away from here`
                          }
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/*  Additional Info Card */}
            <Card className="border-none shadow-sm bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 shrink-0">
                    <Navigation className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-3">
                      {locale === "ne" ? "भ्रमण समय" : "Visiting Hours"}
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• {locale === "ne" ? "सोमवार - शुक्रवार: ९:०० - १८:००" : "Monday - Friday: 9:00 AM - 6:00 PM"}</p>
                      <p>• {locale === "ne" ? "आइतवार: १०:०० - १५:००" : "Sunday: 10:00 AM - 3:00 PM"}</p>
                
                    <p>• {locale === "ne" ?" शनिवार: बन्द" : "Saturday: Closed"}</p>
                    </div>
                    

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

    
      </div>
    </section>
  );
}