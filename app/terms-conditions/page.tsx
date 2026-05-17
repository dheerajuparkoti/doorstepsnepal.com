import type { Metadata } from "next";
import TermsAndConditionsPage from "./page-client";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions governing your use of Doorsteps Nepal platform and services.",
  openGraph: {
    title: "Terms & Conditions | Doorsteps Nepal",
    description:
      "Read the terms and conditions governing your use of Doorsteps Nepal platform and services.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Doorsteps Nepal",
    description:
      "Read the terms and conditions governing your use of Doorsteps Nepal platform and services.",
  },
  alternates: {
    canonical: "/terms-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsServerPage() {
  return <TermsAndConditionsPage />;
}
