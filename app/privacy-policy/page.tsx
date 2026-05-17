import type { Metadata } from "next";
import PrivacyPolicyClientPage from "./privacy-policy-client";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Doorsteps Nepal collects, uses, and protects your personal data. Read our full privacy policy.",
  openGraph: {
    title: "Privacy Policy | Doorsteps Nepal",
    description:
      "Learn how Doorsteps Nepal collects, uses, and protects your personal data.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Doorsteps Nepal",
    description:
      "Learn how Doorsteps Nepal collects, uses, and protects your personal data.",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />;
}
