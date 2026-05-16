import type { Metadata } from "next";
import FAQPage from "./page-client";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | DoorStep Nepal",
  description:
    "Find answers to common questions about booking, payments, professionals, and services on DoorStep Nepal.",
  openGraph: {
    title: "FAQs | DoorStep Nepal",
    description:
      "Find answers to common questions about DoorStep Nepal's home services platform.",
    type: "website",
  },
};

export default function FAQServerPage() {
  return <FAQPage />;
}
