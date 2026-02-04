
import { Metadata } from 'next';
import HeroSection from '@/components/about/hero-section';
import MissionVisionSection from '@/components/about/mission-vision-section';
import TeamSection from '@/components/about/team-section';
import StatsSection from '@/components/about/stats-section';
import ContactSection from '@/components/about/contact-section';
import { WhyChooseSection } from '@/components/home/why-choose-section';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// export const metadata: Metadata = {
//   title: 'About Us - Doorstep Services',
//   description: 'Learn about our mission, vision, and why thousands trust us for their home service needs.',
// };


export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection id="hero" />
      <WhyChooseSection id="why-choose" /> 
      <MissionVisionSection id="mission" /> 
      <TeamSection id="team" /> 
      <StatsSection id="stats" />
      <ContactSection id="contact" /> 
      <Footer />
    </main>
  );
}