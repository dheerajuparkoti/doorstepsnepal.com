import type { Metadata } from "next";
import CancellationRefundPolicyPage from "./page-client";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | DoorStep Nepal",
  description:
    "Understand DoorStep Nepal's cancellation and refund policy — how cancellations work, refund timelines, and eligibility.",
  openGraph: {
    title: "Cancellation & Refund Policy | DoorStep Nepal",
    description:
      "DoorStep Nepal's cancellation and refund policy for home service bookings.",
    type: "website",
  },
};

export default function CancellationRefundServerPage() {
  return <CancellationRefundPolicyPage />;
}
