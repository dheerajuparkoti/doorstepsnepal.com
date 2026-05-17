
import { Metadata } from 'next';
import HeroSection from '@/components/about/hero-section';
import MissionVisionSection from '@/components/about/mission-vision-section';
import TeamSection from '@/components/about/team-section';
import StatsSection from '@/components/about/stats-section';
import ContactSection from '@/components/about/contact-section';
import { WhyChooseSection } from '@/components/home/why-choose-section';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import LocationSection from '@/components/about/location-section';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Doorsteps Nepal — our mission, vision, and why thousands trust us for home services in Kathmandu.',
  openGraph: {
    title: 'About Doorsteps Nepal',
    description: 'Learn about Doorsteps Nepal — our mission, vision, and why thousands trust us for home services in Kathmandu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Doorsteps Nepal',
    description: 'Learn about Doorsteps Nepal — our mission, vision, and why thousands trust us for home services in Kathmandu.',
  },
  alternates: {
    canonical: '/about',
  },
};


export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection id="hero" />
      <WhyChooseSection id="why-choose" /> 
      <MissionVisionSection id="mission" /> 
      {/* <TeamSection id="team" />  */}
      <StatsSection id="stats" />
      <ContactSection id="contact" /> 
        <LocationSection id="ourLocation" /> 
      <Footer />
    </main>
  );
}