import type { Metadata } from "next";
import TutorialsGuidesPage from "./page-client";

export const metadata: Metadata = {
  title: "Tutorials & Guides | DoorStep Nepal",
  description:
    "Step-by-step guides and video tutorials for using DoorStep Nepal — for customers booking services and professionals managing orders.",
  openGraph: {
    title: "Tutorials & Guides | DoorStep Nepal",
    description:
      "Guides and tutorials for customers and professionals on DoorStep Nepal.",
    type: "website",
  },
};

export default function TutorialsGuidesServerPage() {
  return <TutorialsGuidesPage />;
}
