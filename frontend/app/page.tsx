import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ParticleBackground from "@/components/ParticleBackground";
import FeatureShowcase from "@/components/FeatureShowcase";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Dynamic Particle Background */}
      <ParticleBackground />

      {/* Premium Navbar */}
      <Navbar />
      
      {/* Main Content containing Hero */}
      <main className="flex-1">
        <Hero />
        <FeatureShowcase />
      </main>
    </div>
  );
}
