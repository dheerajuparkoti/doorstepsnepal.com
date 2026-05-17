import type { Metadata } from "next";
import CareersClientPage from "./careers-client";

export const metadata: Metadata = {
  title: "Join as a Professional",
  description:
    "Start earning with Doorsteps Nepal. Join our network of verified service professionals in Kathmandu and grow your business.",
  keywords: [
    "join as professional Nepal",
    "service professional jobs",
    "Doorsteps Nepal careers",
    "freelance home services Nepal",
  ],
  openGraph: {
    title: "Join as a Professional | Doorsteps Nepal",
    description:
      "Start earning with Doorsteps Nepal. Join our network of verified service professionals in Kathmandu.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join as a Professional | Doorsteps Nepal",
    description:
      "Start earning with Doorsteps Nepal. Join our network of verified service professionals in Kathmandu.",
  },
  alternates: {
    canonical: "/careers-join-professional",
  },
};

export default function CareersJoinProfessionalPage() {
  return <CareersClientPage />;
}
