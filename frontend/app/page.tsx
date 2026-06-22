"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ParticleBackground from "@/components/ParticleBackground";
import FeatureShowcase from "@/components/FeatureShowcase";
import RoleSelectionModal from "@/components/RoleSelectionModal";

export default function Home() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Dynamic Particle Background */}
      <ParticleBackground />

      {/* Premium Navbar */}
      <Navbar onGetStartedClick={() => setIsRoleModalOpen(true)} />
      
      {/* Main Content containing Hero */}
      <main className="flex-1">
        <Hero onGetStartedClick={() => setIsRoleModalOpen(true)} />
        <FeatureShowcase />
      </main>

      {/* Onboarding Role Modal */}
      <RoleSelectionModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
      />
    </div>
  );
}

