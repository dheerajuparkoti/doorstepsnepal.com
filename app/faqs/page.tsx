import type { Metadata } from "next";
import FaqsClientPage from "./faqs-client";
import { JsonLd, faqPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Doorsteps Nepal services, bookings, payments, cancellations, and more.",
  openGraph: {
    title: "Frequently Asked Questions | Doorsteps Nepal",
    description:
      "Find answers to common questions about Doorsteps Nepal services, bookings, payments, cancellations, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Doorsteps Nepal",
    description:
      "Find answers to common questions about Doorsteps Nepal services, bookings, payments, cancellations, and more.",
  },
  alternates: {
    canonical: "/faqs",
  },
};

const STATIC_FAQS = [
  { question: "What is Doorsteps Nepal?", answer: "Doorsteps Nepal is a Nepal-based digital service platform connecting customers with independent, verified professionals for home and personal services." },
  { question: "Where are your services available?", answer: "Currently, our services are available only within Kathmandu Valley." },
  { question: "How do I book a service?", answer: "Select a service, choose your preferred professional, pick a date and time, provide your address, and confirm the booking online." },
  { question: "Can I book services for the same day?", answer: "Yes, same-day booking is available for selected services, subject to professional availability." },
  { question: "What payment methods do you accept?", answer: "We accept cash on service completion, digital wallets (eSewa, Khalti, IME Pay), and bank transfer for selected services." },
  { question: "Can I cancel my booking?", answer: "Yes. You can cancel as per our Refund & Cancellation Policy. Refund eligibility depends on how early you cancel." },
  { question: "Are service professionals verified?", answer: "Yes. All professionals go through ID verification and basic background checks before onboarding." },
  { question: "How can I join as a service professional?", answer: "Visit the Join as Professional page and submit the application form." },
  { question: "How long does a refund take?", answer: "Refunds are processed within 3–7 working days, depending on your payment method." },
  { question: "How do I contact Doorsteps Nepal?", answer: "Email: doorstepnepal@gmail.com | Phone / WhatsApp: 9851407706, 9851407707 | Address: Kathmandu, Nepal" },
];

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(STATIC_FAQS)} />
      <FaqsClientPage />
    </>
  );
}
