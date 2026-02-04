import Footer from '@/Components/Layout/Footer/Footer';
import Hero from '@/Components/Sections/Hero/Hero';
import Capabilities from '@/Components/Sections/Capabilities/Capabilities';
import Projects from '@/Components/Sections/Projects/Projects';
import Business from '@/Components/Sections/Business/Business';
import Contact from '@/Components/Sections/Contact/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Projects />
      <Business />
      <Contact />
      <Footer />
    </>
  );
}
