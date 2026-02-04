import Footer from '@/Components/Layout/Footer/Footer';
import Hero from '@/Components/Sections/Hero/Hero';
import Capabilities from '@/Components/Sections/Capabilities/Capabilities';
import Projects from '@/Components/Sections/Projects/Projects';
import Business from '@/Components/Sections/Business/Business';
import Contact from '@/Components/Sections/Contact/Contact';
import ImpactSection from '@/Components/Sections/Impact/ImpactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <ImpactSection />
      <Projects />
      <Business />
      <Contact />
      <Footer />
    </>
  );
}
