import Navbar from "@/components/Navbar";
import LandingPosterHero from "@/components/LandingPosterHero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingPosterHero />
      </main>
      <Footer />
    </div>
  );
}
