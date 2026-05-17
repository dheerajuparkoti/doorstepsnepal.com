import type { Metadata } from "next";
import SafetyPolicyPage from "./page-client";

export const metadata: Metadata = {
  title: "Safety Policy | DoorStep Nepal",
  description:
    "DoorStep Nepal's safety guidelines and policies for customers and professionals to ensure safe, trusted home service experiences.",
  openGraph: {
    title: "Safety Policy | DoorStep Nepal",
    description:
      "Safety guidelines for customers and professionals on DoorStep Nepal.",
    type: "website",
  },
};

export default function SafetyPolicyServerPage() {
  return <SafetyPolicyPage />;
}
