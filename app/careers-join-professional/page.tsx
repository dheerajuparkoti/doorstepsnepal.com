import type { Metadata } from "next";
import CareersPage from "./page-client";

export const metadata: Metadata = {
  title: "Careers & Join as Professional | DoorStep Nepal",
  description:
    "Join DoorStep Nepal as a service professional. Earn more, manage your schedule, and grow your business with Nepal's leading home services platform.",
  openGraph: {
    title: "Careers & Join as Professional | DoorStep Nepal",
    description:
      "Grow your career by joining DoorStep Nepal as a verified service professional.",
    type: "website",
  },
};

export default function CareersServerPage() {
  return <CareersPage />;
}
