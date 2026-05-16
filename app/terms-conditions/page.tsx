import type { Metadata } from "next";
import TermsAndConditionsPage from "./page-client";

export const metadata: Metadata = {
  title: "Terms & Conditions | DoorStep Nepal",
  description:
    "Read the terms and conditions governing your use of DoorStep Nepal's platform and home services.",
  openGraph: {
    title: "Terms & Conditions | DoorStep Nepal",
    description:
      "Terms governing your use of DoorStep Nepal's platform and home services.",
    type: "website",
  },
};

export default function TermsServerPage() {
  return <TermsAndConditionsPage />;
}
