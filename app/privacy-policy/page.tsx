import type { Metadata } from "next";
import PrivacyPolicyPage from "./page-client";

export const metadata: Metadata = {
  title: "Privacy Policy | DoorStep Nepal",
  description:
    "Learn how DoorStep Nepal collects, uses, and protects your personal data. Our privacy policy covers data collection, storage, and your rights.",
  openGraph: {
    title: "Privacy Policy | DoorStep Nepal",
    description:
      "Learn how DoorStep Nepal collects, uses, and protects your personal data.",
    type: "website",
  },
};

export default function PrivacyPolicyServerPage() {
  return <PrivacyPolicyPage />;
}
