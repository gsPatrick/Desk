import Footer from '@/Components/Layout/Footer/Footer';
import Hero from '@/Components/Sections/Hero/Hero';
import Capabilities from '@/Components/Sections/Capabilities/Capabilities';
import Projects from '@/Components/Sections/Projects/Projects';
import Services from '@/Components/Sections/Services/Services';
import Hiring from '@/Components/Sections/Hiring/Hiring';
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
      <Services />
      <Hiring />
      <Business />
      <Contact />
      <Footer />
    </>
  );
}
