import type { Metadata } from "next";
import DownloadsClientPage from "./downloads-client";

export const metadata: Metadata = {
  title: "Download the App",
  description:
    "Get the Doorsteps Nepal app on iOS and Android. Book home services instantly — plumbing, cleaning, electrical, beauty, and more.",
  keywords: [
    "Doorsteps Nepal app",
    "home services app Nepal",
    "download app",
    "iOS Android Nepal",
  ],
  openGraph: {
    title: "Download the Doorsteps Nepal App",
    description:
      "Get the Doorsteps Nepal app on iOS and Android. Book home services instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download the Doorsteps Nepal App",
    description:
      "Get the Doorsteps Nepal app on iOS and Android. Book home services instantly.",
  },
  alternates: {
    canonical: "/downloads-app",
  },
};

export default function DownloadsAppPage() {
  return <DownloadsClientPage />;
}
