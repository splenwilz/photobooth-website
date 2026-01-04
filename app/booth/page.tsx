"use client";

/**
 * Photo Booth Simulation
 * 
 * Simulates the full photo booth experience from hardware check to print.
 * Uses a state machine pattern to manage screen transitions.
 * 
 * Flow:
 * 1. Hardware Check (printer, PCB, camera)
 * 2. Welcome Screen (touch to start)
 * 3. Product Selection (strips vs 4x6)
 * 4. Template/Style Selection
 * 5. Camera Countdown & Capture
 * 6. Preview
 * 7. Print Progress
 * 8. Thank You / Complete
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/* ============================================
 * Types & Constants
 * ============================================ */

type BoothScreen = 
  | "hardware_check"
  | "welcome"
  | "product_select"
  | "strip_options"
  | "template_select"
  | "camera"
  | "preview"
  | "printing"
  | "complete";

type ProductType = "strips" | "4x6" | null;
type StyleType = "template" | "bw" | "color" | null;

interface HardwareStatus {
  printer: "checking" | "ready" | "error";
  camera: "checking" | "ready" | "error";
  pcb: "checking" | "ready" | "error";
}

// Strip templates with actual preview images
const STRIP_TEMPLATES = [
  { id: "lay1", name: "Classic", preview: "/templates/strip-614x1864a/lay1/preview.png", color: "#0891B2" },
  { id: "lay2", name: "Elegant", preview: "/templates/strip-614x1864b/lay2/preview.png", color: "#A855F7" },
  { id: "lay3", name: "Modern", preview: "/templates/strip-614x1864c/lay3/preview.png", color: "#10B981" },
  { id: "lay4", name: "Vintage", preview: "/templates/strip-614x1864d/lay4/preview.png", color: "#F59E0B" },
  { id: "lay5", name: "Minimal", preview: "/templates/strip-614x1864e/lay5/preview.png", color: "#EC4899" },
  { id: "lay6", name: "Bold", preview: "/templates/strip-614x1864f/lay6/preview.png", color: "#EF4444" },
  { id: "lay7", name: "Artistic", preview: "/templates/strip-614x1864g/lay7/preview.png", color: "#8B5CF6" },
  { id: "lay8", name: "Playful", preview: "/templates/strip-614x1864h/lay8/preview.png", color: "#14B8A6" },
  { id: "lay9", name: "Retro", preview: "/templates/strip-614x1864i/lay9/preview.png", color: "#F97316" },
  { id: "lay10", name: "Chic", preview: "/templates/strip-614x1864j/lay10/preview.png", color: "#6366F1" },
  { id: "lay11", name: "Party", preview: "/templates/strip-614x1864k/lay11/preview.png", color: "#D946EF" },
  { id: "lay12", name: "Festive", preview: "/templates/strip-614x1864l/lay12/preview.png", color: "#0EA5E9" },
];

// 4x6 templates with actual preview images  
const TEMPLATES_4X6 = [
  { id: "4x6-1", name: "Classic Portrait", preview: "/templates/4x6-1864x1228/1-layb3/preview.png", color: "#0891B2" },
];

/* ============================================
 * Main Component
 * ============================================ */

export default function BoothSimulation() {
  // Screen state machine
  const [screen, setScreen] = useState<BoothScreen>("hardware_check");
  
  // Selection states
  const [product, setProduct] = useState<ProductType>(null);
  const [style, setStyle] = useState<StyleType>(null);
  const [template, setTemplate] = useState<string | null>(null);
  
  // Camera states
  const [photoCount, setPhotoCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  // Hardware check state
  const [hardware, setHardware] = useState<HardwareStatus>({
    printer: "checking",
    camera: "checking",
    pcb: "checking",
  });

  // Print progress
  const [printProgress, setPrintProgress] = useState(0);

  // Hardware check control
  const [hardwareCheckComplete, setHardwareCheckComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Photos needed based on product type
  const photosNeeded = product === "strips" ? 4 : 1;

  /* ============================================
   * Hardware Check Effect
   * Simulates camera failure on first attempt to demonstrate error handling
   * ============================================ */
  useEffect(() => {
    if (screen !== "hardware_check") return;

    // Simulate hardware checks with staggered timing
    const checkHardware = async () => {
      // Reset states at start of check (inside async to avoid cascading renders)
      setHardwareCheckComplete(false);
      // Reset hardware states to checking
      setHardware({ printer: "checking", camera: "checking", pcb: "checking" });
      
      // Small delay to ensure state updates before proceeding
      await new Promise(r => setTimeout(r, 100));

      // Check PCB first (fastest)
      await new Promise(r => setTimeout(r, 800));
      setHardware(prev => ({ ...prev, pcb: "ready" }));

      // Check Camera - SIMULATE FAILURE on first attempt (retryCount === 0)
      await new Promise(r => setTimeout(r, 1200));
      if (retryCount === 0) {
        // Simulate camera connection failure
        setHardware(prev => ({ ...prev, camera: "error" }));
      } else {
        // After retry, camera works
        setHardware(prev => ({ ...prev, camera: "ready" }));
      }

      // Check Printer (slowest - needs warm up)
      await new Promise(r => setTimeout(r, 1500));
      setHardware(prev => ({ ...prev, printer: "ready" }));

      // Mark check as complete
      setHardwareCheckComplete(true);

      // If all ready (retry succeeded), move to welcome
      if (retryCount > 0) {
        await new Promise(r => setTimeout(r, 500));
        setScreen("welcome");
      }
    };

    checkHardware();
  }, [screen, retryCount]);

  // Retry hardware check
  const retryHardwareCheck = () => {
    setRetryCount(prev => prev + 1);
    setHardwareCheckComplete(false);
    setHardware({ printer: "checking", camera: "checking", pcb: "checking" });
  };

  // Continue despite errors (with warning)
  const continueWithErrors = () => {
    setScreen("welcome");
  };

  /* ============================================
   * Photo Capture - defined before useEffect that uses it
   * ============================================ */
  const capturePhoto = useCallback(() => {
    // Add a demo "photo" (in reality this would be base64 image data)
    const demoPhotos = ["📸", "🎭", "😎", "🥳"];
    setCapturedPhotos(prev => [...prev, demoPhotos[prev.length % 4]]);
    
    setPhotoCount(prev => {
      const newCount = prev + 1;
      if (newCount >= photosNeeded) {
        // All photos taken - move to preview
        setTimeout(() => setScreen("preview"), 500);
      }
      return newCount;
    });
  }, [photosNeeded]);

  /* ============================================
   * Countdown Effect
   * ============================================ */
  useEffect(() => {
    if (screen !== "camera") return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Take photo
          capturePhoto();
          return 3; // Reset for next photo
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, capturePhoto]);

  /* ============================================
   * Print Effect
   * ============================================ */
  useEffect(() => {
    if (screen !== "printing") return;

    const interval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreen("complete"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [screen]);

  /* ============================================
   * Reset Function
   * ============================================ */
  const resetBooth = () => {
    setScreen("welcome");
    setProduct(null);
    setStyle(null);
    setTemplate(null);
    setPhotoCount(0);
    setCountdown(3);
    setCapturedPhotos([]);
    setPrintProgress(0);
  };

  /* ============================================
   * Screen Renders
   * ============================================ */

  // Hardware Check Screen
  const hasHardwareError = hardware.pcb === "error" || hardware.camera === "error" || hardware.printer === "error";
  
  const renderHardwareCheck = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-zinc-900 to-black p-8">
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
        hasHardwareError && hardwareCheckComplete
          ? "bg-linear-to-br from-[#EF4444] to-[#DC2626]"
          : "bg-linear-to-br from-[#0891B2] to-[#10B981]"
      }`}>
        {hasHardwareError && hardwareCheckComplete ? (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        )}
      </div>
      
      <h1 className="text-3xl font-bold mb-2">PhotoBoothX</h1>
      <p className={`mb-12 ${hasHardwareError && hardwareCheckComplete ? "text-[#EF4444]" : "text-zinc-500"}`}>
        {hasHardwareError && hardwareCheckComplete 
          ? "Hardware issue detected" 
          : "Initializing system..."}
      </p>

      <div className="w-full max-w-md space-y-4">
        {/* PCB Check */}
        <HardwareCheckItem 
          label="Control Board (PCB)" 
          status={hardware.pcb}
          icon="🔌"
        />
        
        {/* Camera Check */}
        <HardwareCheckItem 
          label="Camera System" 
          status={hardware.camera}
          icon="📷"
        />
        
        {/* Printer Check */}
        <HardwareCheckItem 
          label="DNP RX1hs Printer" 
          status={hardware.printer}
          icon="🖨️"
        />
      </div>

      {/* Show buttons when check is complete and there's an error */}
      {hardwareCheckComplete && hasHardwareError ? (
        <div className="mt-10 space-y-4 w-full max-w-md">
          {/* Error message */}
          <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-center">
            <p className="text-[#EF4444] font-medium mb-1">Camera Connection Failed</p>
            <p className="text-zinc-400 text-sm">Unable to connect to the camera. Please check the USB connection.</p>
          </div>

          {/* Retry Button */}
          <button
            type="button"
            onClick={retryHardwareCheck}
            className="w-full py-4 rounded-2xl bg-[#0891B2] hover:bg-[#0E7490] transition-all flex items-center justify-center gap-3 font-semibold text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Connection
          </button>

          {/* Continue Anyway Button */}
          <button
            type="button"
            onClick={continueWithErrors}
            className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all flex items-center justify-center gap-3 text-zinc-300 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            Continue Anyway
          </button>

          {/* Help text */}
          <p className="text-center text-zinc-600 text-sm">
            Continuing with errors may result in limited functionality
          </p>
        </div>
      ) : (
        <p className="text-zinc-600 text-sm mt-12">
          Please wait while we prepare your experience...
        </p>
      )}
    </div>
  );

  // Welcome Screen
  const renderWelcome = () => (
    <button 
      type="button"
      className="w-full flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black p-8 cursor-pointer relative overflow-hidden text-left border-0"
      onClick={() => setScreen("product_select")}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0891B2]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#0891B2]/30">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Create Amazing
        </h1>
        <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#0891B2]">
          Photo Memories
        </h2>

        <p className="text-xl text-zinc-400 mb-16">
          Capture moments that last forever
        </p>

        {/* Touch prompt */}
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/20 animate-pulse">
          <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-xl font-medium">Touch the screen to start</span>
        </div>

        {/* Price hint */}
        <p className="text-zinc-600 mt-8 text-sm">
          Starting at $5.00
        </p>
      </div>

      {/* Corner branding */}
      <div className="absolute bottom-8 left-8 flex items-center gap-2 text-zinc-700">
        <span className="text-sm">Powered by</span>
        <span className="font-semibold">PhotoBoothX</span>
      </div>
    </button>
  );

  // Product Selection Screen
  const renderProductSelect = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black p-8 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#0891B2]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#F59E0B]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Ready to capture
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
            Choose Your Photos
          </h1>
          <p className="text-xl text-zinc-400">Select the perfect format for your memories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photo Strip Option - Full Background Image */}
          <button
            type="button"
            onClick={() => {
              setProduct("strips");
              setScreen("strip_options");
            }}
            className="group relative rounded-3xl transition-all duration-300 hover:scale-[1.02] overflow-hidden h-[420px] md:h-[480px]"
          >
            {/* Background Image */}
            <Image
              src="/Images/strip-sample.jpg"
              alt="Photo strip sample"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30 group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />
            
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#0891B2] to-[#10B981] rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300 -z-10" />
            
            {/* Border overlay */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/10 group-hover:border-[#0891B2]/50 transition-colors" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8 z-10">
              {/* Top section */}
              <div className="flex justify-between items-start">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="text-3xl">🎞️</span>
                </div>
                {/* Popular badge */}
                <div className="px-4 py-1.5 rounded-full bg-[#0891B2] text-white text-xs font-bold shadow-lg shadow-[#0891B2]/30">
                  MOST POPULAR
                </div>
              </div>

              {/* Bottom section */}
              <div>
                <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                  Photo Strips
                </h2>
                <p className="text-white/70 text-lg mb-6">Classic 2×6 inch strips with 4 poses</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["4 Poses", "2 Copies", "Templates"].map((feature) => (
                    <span 
                      key={feature} 
                      className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">$5</span>
                    <span className="text-2xl text-white/60">.00</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0891B2] text-white font-semibold group-hover:bg-[#0E7490] transition-colors shadow-lg">
                    <span>Select</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* 4x6 Option - Full Background Image */}
          <button
            type="button"
            onClick={() => {
              setProduct("4x6");
              setScreen("template_select");
            }}
            className="group relative rounded-3xl transition-all duration-300 hover:scale-[1.02] overflow-hidden h-[420px] md:h-[480px]"
          >
            {/* Background Image */}
            <Image
              src="/Images/4x6-sample.jpg"
              alt="4x6 photo sample"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30 group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />
            
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#F59E0B] to-[#F97316] rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300 -z-10" />
            
            {/* Border overlay */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/10 group-hover:border-[#F59E0B]/50 transition-colors" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8 z-10">
              {/* Top section */}
              <div className="flex justify-between items-start">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="text-3xl">🖼️</span>
                </div>
                {/* Premium badge */}
                <div className="px-4 py-1.5 rounded-full bg-linear-to-r from-[#F59E0B] to-[#F97316] text-white text-xs font-bold shadow-lg shadow-[#F59E0B]/30">
                  PREMIUM
                </div>
              </div>

              {/* Bottom section */}
              <div>
                <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                  4×6 Photo
                </h2>
                <p className="text-white/70 text-lg mb-6">Classic postcard-size prints</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Large Format", "Gallery Quality", "Multiple Layouts"].map((feature) => (
                    <span 
                      key={feature} 
                      className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">$7</span>
                    <span className="text-2xl text-white/60">.00</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#F59E0B] text-white font-semibold group-hover:bg-[#D97706] transition-colors shadow-lg">
                    <span>Select</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Back button */}
        <div className="flex justify-center mt-12">
          <button 
            type="button"
            onClick={() => setScreen("welcome")}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Start
          </button>
        </div>

        {/* Bottom info */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>Card & Cash accepted</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Prints in ~10 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Strip Options Screen (Template vs B&W vs Color) - Enhanced
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  
  const renderStripOptions = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 md:p-8 relative overflow-hidden">
      {/* Dynamic background that responds to hovered option */}
      <div className="absolute inset-0 transition-all duration-700">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-black to-zinc-900" />
        
        {/* Template glow */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full bg-linear-to-r from-[#A855F7]/20 to-transparent transition-opacity duration-500 ${
            hoveredStyle === "template" ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* B&W glow */}
        <div 
          className={`absolute top-0 left-1/4 right-1/4 h-full bg-linear-to-b from-white/10 via-transparent to-white/10 transition-opacity duration-500 ${
            hoveredStyle === "bw" ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* Color glow */}
        <div 
          className={`absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-[#10B981]/20 to-transparent transition-opacity duration-500 ${
            hoveredStyle === "color" ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* Ambient floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#0891B2]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header with animated elements */}
        <div className="text-center mb-10 md:mb-14">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm mb-6">
            <span className="text-zinc-500">Photo Strips</span>
            <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#0891B2] font-medium">Choose Style</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-white">Pick Your </span>
            <span className="relative">
              <span className="bg-linear-to-r from-[#A855F7] via-[#0891B2] to-[#10B981] bg-clip-text text-transparent">
                Vibe
              </span>
              {/* Sparkle decorations */}
              <span className="absolute -top-2 -right-6 text-2xl animate-bounce" style={{ animationDuration: "2s" }}>✨</span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-md mx-auto">
            Each style creates a unique mood for your photos
          </p>
        </div>

        {/* Style Cards - Larger, more visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          
          {/* Template Option - Featured */}
          <button
            type="button"
            onClick={() => {
              setStyle("template");
              setScreen("template_select");
            }}
            onMouseEnter={() => setHoveredStyle("template")}
            onMouseLeave={() => setHoveredStyle(null)}
            className="group relative rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden aspect-3/4 md:aspect-auto md:h-[450px]"
          >
            {/* Multi-layer background */}
            <div className="absolute inset-0">
              {/* Base gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-[#A855F7] via-[#EC4899] to-[#F59E0B]" />
              
              {/* Animated mesh gradient */}
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  background: "radial-gradient(circle at 20% 80%, #F59E0B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #A855F7 0%, transparent 50%)",
                }}
              />
              
              {/* Floating template previews */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Stacked template cards */}
                  <div className="absolute top-8 left-6 w-16 md:w-24 h-24 md:h-36 bg-white rounded-xl shadow-2xl transform -rotate-12 opacity-60 group-hover:opacity-90 group-hover:-rotate-6 transition-all duration-500">
                    <div className="absolute inset-1 rounded-lg bg-linear-to-br from-pink-200 to-purple-200" />
                  </div>
                  <div className="absolute top-12 right-6 w-16 md:w-24 h-24 md:h-36 bg-white rounded-xl shadow-2xl transform rotate-12 opacity-60 group-hover:opacity-90 group-hover:rotate-6 transition-all duration-500">
                    <div className="absolute inset-1 rounded-lg bg-linear-to-br from-cyan-200 to-blue-200" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 md:w-28 h-28 md:h-40 bg-white rounded-xl shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 z-10">
                    <div className="absolute inset-1 rounded-lg bg-linear-to-br from-amber-200 to-orange-200" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl md:text-4xl">🎨</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            
            {/* Outer glow on hover */}
            <div className="absolute -inset-2 bg-linear-to-r from-[#A855F7] to-[#EC4899] rounded-4xl opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 -z-10" />
            
            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/10 group-hover:border-white/30 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              {/* Top badge */}
              <div className="flex justify-between items-start">
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Popular
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/90 text-xs font-medium">
                  {STRIP_TEMPLATES.length} designs
                </div>
              </div>

              {/* Bottom info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Templates</h2>
                <p className="text-white/70 mb-5 text-sm md:text-base">Stunning frames & designs to make your photos pop</p>
                
                {/* Preview strip */}
                <div className="flex gap-2 mb-5">
                  {STRIP_TEMPLATES.slice(0, 4).map((t) => (
                    <div 
                      key={`preview-${t.id}`}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 border-white/30 group-hover:border-white/60 transition-colors"
                    >
                      <Image 
                        src={t.preview} 
                        alt={t.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 text-white font-semibold text-lg group-hover:gap-4 transition-all">
                  <span>Browse All</span>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Black & White Option */}
          <button
            type="button"
            onClick={() => {
              setStyle("bw");
              setTemplate("bw");
              setScreen("camera");
            }}
            onMouseEnter={() => setHoveredStyle("bw")}
            onMouseLeave={() => setHoveredStyle(null)}
            className="group relative rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden aspect-3/4 md:aspect-auto md:h-[450px]"
          >
            {/* Background layers */}
            <div className="absolute inset-0">
              {/* Diagonal B&W split */}
              <div className="absolute inset-0 bg-linear-to-br from-white via-zinc-400 to-zinc-900" />
              
              {/* Film grain texture */}
              <div 
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
              />
              
              {/* Decorative photo strip */}
              <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                <div className="w-20 md:w-28 h-48 md:h-64 bg-white rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                  {/* Film strip holes */}
                  <div className="absolute left-1 top-0 bottom-0 w-3 flex flex-col justify-around py-2">
                    {["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"].map((id) => (
                      <div key={id} className="w-2 h-2 rounded-full bg-zinc-300" />
                    ))}
                  </div>
                  <div className="absolute right-1 top-0 bottom-0 w-3 flex flex-col justify-around py-2">
                    {["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"].map((id) => (
                      <div key={id} className="w-2 h-2 rounded-full bg-zinc-300" />
                    ))}
                  </div>
                  {/* Photo frames */}
                  <div className="absolute inset-x-5 inset-y-2 flex flex-col gap-1">
                    <div className="flex-1 bg-zinc-200 rounded" />
                    <div className="flex-1 bg-zinc-300 rounded" />
                    <div className="flex-1 bg-zinc-400 rounded" />
                    <div className="flex-1 bg-zinc-500 rounded" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
            
            {/* Glow */}
            <div className="absolute -inset-2 bg-white rounded-4xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10" />
            
            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-zinc-600/30 group-hover:border-white/40 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
                  {/* Mini B&W gradient */}
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-white to-black" />
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/90 text-xs font-medium">
                  Classic
                </div>
              </div>

              {/* Bottom */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Black & White</h2>
                <p className="text-white/70 mb-5 text-sm md:text-base">Timeless, dramatic, and endlessly elegant</p>
                
                {/* Grayscale spectrum */}
                <div className="flex gap-1 mb-5">
                  {[100, 80, 60, 40, 20, 0].map((shade) => (
                    <div 
                      key={`shade-${shade}`}
                      className="flex-1 h-3 md:h-4 rounded-full transition-transform group-hover:scale-y-125"
                      style={{ 
                        backgroundColor: `rgb(${Math.round(shade * 2.55)}, ${Math.round(shade * 2.55)}, ${Math.round(shade * 2.55)})`,
                        transitionDelay: `${shade}ms`
                      }}
                    />
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 text-white font-semibold text-lg group-hover:gap-4 transition-all">
                  <span>Go Classic</span>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Full Color Option */}
          <button
            type="button"
            onClick={() => {
              setStyle("color");
              setTemplate("color");
              setScreen("camera");
            }}
            onMouseEnter={() => setHoveredStyle("color")}
            onMouseLeave={() => setHoveredStyle(null)}
            className="group relative rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden aspect-3/4 md:aspect-auto md:h-[450px]"
          >
            {/* Animated rainbow background */}
            <div className="absolute inset-0">
              <div 
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 25%, #4ECDC4 50%, #45B7D1 75%, #A855F7 100%)",
                  backgroundSize: "400% 400%",
                  animation: "gradientShift 8s ease infinite",
                }}
              />
              
              {/* Floating color bubbles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-yellow-400/60 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "3s" }} />
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-cyan-400/60 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
                <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-pink-400/60 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }} />
                <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-green-400/60 rounded-full blur-xl animate-pulse" />
              </div>
              
              {/* Camera icon decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                <div className="relative">
                  <div className="w-32 h-24 md:w-40 md:h-28 bg-white/90 rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/30" />
                    </div>
                  </div>
                  {/* Flash */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-lg transform rotate-12" />
                </div>
              </div>
            </div>
            
            {/* Bottom overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            
            {/* Glow */}
            <div className="absolute -inset-2 bg-linear-to-r from-[#10B981] via-[#0891B2] to-[#A855F7] rounded-4xl opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 -z-10" />
            
            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/10 group-hover:border-[#10B981]/50 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #A855F7, #FF6B6B)",
                    }}
                  />
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[#10B981]/30 backdrop-blur-sm border border-[#10B981]/40 text-[#10B981] text-xs font-medium">
                  Vibrant
                </div>
              </div>

              {/* Bottom */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Full Color</h2>
                <p className="text-white/70 mb-5 text-sm md:text-base">Vivid, true-to-life, bursting with energy</p>
                
                {/* Color spectrum */}
                <div 
                  className="h-3 md:h-4 rounded-full mb-5 group-hover:h-5 transition-all"
                  style={{
                    background: "linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #A855F7)",
                  }}
                />

                {/* CTA */}
                <div className="flex items-center gap-3 text-white font-semibold text-lg group-hover:gap-4 transition-all">
                  <span>Go Colorful</span>
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/30 flex items-center justify-center group-hover:bg-[#10B981]/50 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Back button */}
        <div className="flex justify-center mt-10 md:mt-14">
          <button 
            type="button"
            onClick={() => setScreen("product_select")}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-zinc-900/80 border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-[#0891B2]/50 hover:bg-zinc-800/80 transition-all"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Photo Type</span>
          </button>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );

  // Template Selection Screen - 3-Card Carousel
  const [carouselPage, setCarouselPage] = useState(0);
  const CARDS_PER_PAGE = 3;
  
  const renderTemplateSelect = () => {
    const templates = product === "strips" ? STRIP_TEMPLATES : TEMPLATES_4X6;
    const isStrips = product === "strips";
    const totalPages = Math.ceil(templates.length / CARDS_PER_PAGE);
    
    // Get visible templates for current page
    const startIndex = carouselPage * CARDS_PER_PAGE;
    const visibleTemplates = templates.slice(startIndex, startIndex + CARDS_PER_PAGE);
    
    // Navigate carousel
    const goToNext = () => {
      setCarouselPage((prev) => (prev + 1) % totalPages);
    };
    
    const goToPrev = () => {
      setCarouselPage((prev) => (prev - 1 + totalPages) % totalPages);
    };
    
    const canGoNext = carouselPage < totalPages - 1;
    const canGoPrev = carouselPage > 0;
    
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Elegant background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-[#0891B2]/10 via-black to-[#A855F7]/5" />
          {/* Subtle glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0891B2]/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="pt-8 pb-6 px-6 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm mb-4">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0891B2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0891B2]"></span>
                </span>
                <span className="text-[#0891B2] font-medium">{templates.length} Templates</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">Page {carouselPage + 1} of {totalPages}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-white">Choose Your </span>
              <span className="bg-linear-to-r from-[#0891B2] to-[#22D3EE] bg-clip-text text-transparent">Template</span>
            </h1>
            <p className="text-zinc-400 text-lg">Tap any template to start capturing</p>
          </div>

          {/* 3-Card Carousel */}
          <div className="flex-1 flex items-center justify-center px-4 md:px-16 py-6">
            <div className="w-full max-w-6xl flex items-center gap-4">
              {/* Previous Button */}
              <button
                type="button"
                onClick={goToPrev}
                disabled={!canGoPrev}
                className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                  canGoPrev 
                    ? "bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-lg shadow-[#0891B2]/30" 
                    : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Cards Container */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {visibleTemplates.map((t, index) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      setTemplate(t.id);
                      setScreen("camera");
                    }}
                    className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glow effect on hover */}
                    <div 
                      className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-300"
                      style={{ backgroundColor: t.color }}
                    />
                    
                    {/* Card */}
                    <div className="relative bg-[#111111] rounded-2xl overflow-hidden border-2 border-zinc-800 group-hover:border-transparent transition-colors">
                      {/* Colored top border on hover */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: t.color }}
                      />
                      
                      {/* Template Preview */}
                      <div className={`relative ${isStrips ? "aspect-2/3" : "aspect-4/3"} bg-linear-to-b from-zinc-800 to-zinc-900`}>
                        <Image
                          src={t.preview}
                          alt={`${t.name} template`}
                          fill
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Quick select overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div 
                            className="px-6 py-3 rounded-full text-white font-bold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform"
                            style={{ backgroundColor: t.color }}
                          >
                            <span>Select</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Name & Info */}
                      <div className="p-4 text-center border-t border-zinc-800">
                        <h4 className="font-bold text-white text-lg mb-1">{t.name}</h4>
                        <p className="text-sm text-zinc-500">Tap to select</p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Empty slots if less than 3 templates on page */}
                {visibleTemplates.length === 1 && <div key="empty-1" className="hidden md:block" />}
                {visibleTemplates.length <= 2 && <div key="empty-2" className="hidden md:block" />}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={goToNext}
                disabled={!canGoNext}
                className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                  canGoNext 
                    ? "bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-lg shadow-[#0891B2]/30" 
                    : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Page Indicator Dots */}
          <div className="flex justify-center gap-2 pb-4">
            {templates.map((t, tIdx) => {
              // Only show one dot per page
              if (tIdx % CARDS_PER_PAGE !== 0) return null;
              const pageNum = Math.floor(tIdx / CARDS_PER_PAGE);
              return (
                <button
                  type="button"
                  key={`page-dot-${t.id}`}
                  onClick={() => setCarouselPage(pageNum)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    pageNum === carouselPage 
                      ? "w-8 bg-[#0891B2]" 
                      : "w-2 bg-zinc-600 hover:bg-zinc-500"
                  }`}
                />
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="pb-8 px-6">
            <div className="max-w-md mx-auto">
              <button 
                type="button"
                onClick={() => setScreen(isStrips ? "strip_options" : "product_select")}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-[#0891B2] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Styles
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Camera Screen
  const renderCamera = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8 relative">
      {/* Photo counter */}
      <div className="absolute top-8 left-8 px-4 py-2 rounded-full bg-zinc-800/80 backdrop-blur">
        <span className="font-mono">
          Photo {photoCount + 1} of {photosNeeded}
        </span>
      </div>

      {/* Style indicator */}
      <div className="absolute top-8 right-8 px-4 py-2 rounded-full bg-zinc-800/80 backdrop-blur">
        {style === "bw" && "🔳 Black & White"}
        {style === "color" && "🌈 Full Color"}
        {style === "template" && `🎨 ${template}`}
        {product === "4x6" && `📷 ${template}`}
      </div>

      {/* Camera viewfinder */}
      <div className="relative w-full max-w-3xl aspect-4/3 rounded-3xl bg-zinc-900 border-4 border-zinc-700 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"].map((cellId) => (
            <div key={cellId} className="border border-white/10" />
          ))}
        </div>

        {/* Center focus */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-[#0891B2] rounded-xl flex items-center justify-center">
            <div className="w-4 h-4 bg-[#0891B2] rounded-full" />
          </div>
        </div>

        {/* Simulated live feed hint */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-sm font-medium">LIVE</span>
        </div>

        {/* Previous photos thumbnail strip */}
        {capturedPhotos.length > 0 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {capturedPhotos.map((photo, idx) => (
              <div key={`thumb-${idx}-${photo}`} className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-600 flex items-center justify-center text-xl">
                {photo}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="mt-12 text-center">
        <div className="text-9xl font-bold text-[#0891B2] animate-pulse">
          {countdown}
        </div>
        <p className="text-zinc-400 mt-4 text-xl">
          {countdown === 3 && "Get ready..."}
          {countdown === 2 && "Strike a pose!"}
          {countdown === 1 && "Smile!"}
        </p>
      </div>

      {/* Tips */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-zinc-800/80 backdrop-blur">
        <span className="text-zinc-400">💡 Look at the camera and smile!</span>
      </div>
    </div>
  );

  // Preview Screen
  const renderPreview = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-zinc-900 to-black p-8">
      <h1 className="text-4xl font-bold mb-4">Looking Great!</h1>
      <p className="text-zinc-400 mb-8">Here&apos;s your {product === "strips" ? "photo strip" : "photo"}</p>

      {/* Preview */}
      <div className="relative mb-12">
        {product === "strips" ? (
          // Strip preview
          <div className="w-40 h-80 bg-white rounded-xl p-3 shadow-2xl shadow-black/50">
            <div className="h-full flex flex-col gap-2">
              {capturedPhotos.map((photo, idx) => (
                <div 
                  key={`preview-${idx}-${photo}`} 
                  className={`flex-1 rounded-lg flex items-center justify-center text-4xl ${
                    style === "bw" ? "bg-zinc-300 grayscale" : "bg-linear-to-br from-zinc-200 to-zinc-300"
                  }`}
                >
                  {photo}
                </div>
              ))}
            </div>
            {/* Branding */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
              PhotoBoothX
            </div>
          </div>
        ) : (
          // 4x6 preview
          <div className="w-72 h-48 bg-white rounded-xl p-3 shadow-2xl shadow-black/50">
            <div className={`h-full rounded-lg flex items-center justify-center text-6xl ${
              style === "bw" ? "bg-zinc-300 grayscale" : "bg-linear-to-br from-zinc-200 to-zinc-300"
            }`}>
              {capturedPhotos[0] || "📸"}
            </div>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
        <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce delay-150">🎉</div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            // Retake - reset photos and go back to camera
            setPhotoCount(0);
            setCapturedPhotos([]);
            setCountdown(3);
            setScreen("camera");
          }}
          className="px-8 py-4 rounded-2xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-all flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retake Photos
        </button>

        <button
          type="button"
          onClick={() => setScreen("printing")}
          className="px-8 py-4 rounded-2xl bg-[#0891B2] hover:bg-[#0E7490] transition-all flex items-center gap-3 font-semibold"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Print Now!
        </button>
      </div>
    </div>
  );

  // Printing Screen
  const renderPrinting = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-zinc-900 to-black p-8">
      {/* Animated printer */}
      <div className="relative mb-12">
        <div className="text-8xl animate-bounce">🖨️</div>
        
        {/* Paper coming out animation */}
        <div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 bg-white rounded transition-all duration-1000"
          style={{ height: `${printProgress * 0.6}px` }}
        />
      </div>

      <h1 className="text-4xl font-bold mb-4">Printing Your Photos...</h1>
      <p className="text-zinc-400 mb-8">Please wait, this only takes a moment</p>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-[#0891B2] to-[#10B981] rounded-full transition-all duration-100"
            style={{ width: `${printProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-zinc-500">
          <span>Processing...</span>
          <span>{printProgress}%</span>
        </div>
      </div>

      {/* Status updates */}
      <div className="mt-12 space-y-2 text-center">
        <p className={`transition-opacity ${printProgress > 0 ? "text-[#10B981]" : "text-zinc-600"}`}>
          ✓ Image processed
        </p>
        <p className={`transition-opacity ${printProgress > 30 ? "text-[#10B981]" : "text-zinc-600"}`}>
          {printProgress > 30 ? "✓" : "○"} Sending to printer
        </p>
        <p className={`transition-opacity ${printProgress > 60 ? "text-[#10B981]" : "text-zinc-600"}`}>
          {printProgress > 60 ? "✓" : "○"} Printing in progress
        </p>
        <p className={`transition-opacity ${printProgress >= 100 ? "text-[#10B981]" : "text-zinc-600"}`}>
          {printProgress >= 100 ? "✓" : "○"} Complete!
        </p>
      </div>
    </div>
  );

  // Complete Screen
  const renderComplete = () => (
    <button 
      type="button"
      className="w-full flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-zinc-900 to-black p-8 cursor-pointer relative overflow-hidden text-left border-0"
      onClick={resetBooth}
    >
      {/* Celebration effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0891B2]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center">
        {/* Success animation */}
        <div className="w-32 h-32 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-[#10B981]/40 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
        <p className="text-2xl text-zinc-400 mb-8">
          {product === "strips" 
            ? "Grab your photo strips from the tray below!" 
            : "Your 4x6 photo is ready!"}
        </p>

        {/* Tips */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="px-6 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700">
            <span className="text-zinc-400">📥 Check the print tray</span>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700">
            <span className="text-zinc-400">⏳ Allow 10 seconds to dry</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/20">
          <span className="text-xl">Touch screen to start over</span>
        </div>

        {/* Social prompt */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 max-w-md mx-auto">
          <p className="text-zinc-400 mb-2">Share your photos!</p>
          <p className="text-2xl font-semibold text-[#0891B2]">#PhotoBoothX</p>
        </div>
      </div>

      {/* Auto restart timer hint */}
      <p className="absolute bottom-8 text-zinc-600 text-sm">
        Screen will reset automatically in 30 seconds
      </p>
    </button>
  );

  /* ============================================
   * Main Render
   * ============================================ */
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {screen === "hardware_check" && renderHardwareCheck()}
      {screen === "welcome" && renderWelcome()}
      {screen === "product_select" && renderProductSelect()}
      {screen === "strip_options" && renderStripOptions()}
      {screen === "template_select" && renderTemplateSelect()}
      {screen === "camera" && renderCamera()}
      {screen === "preview" && renderPreview()}
      {screen === "printing" && renderPrinting()}
      {screen === "complete" && renderComplete()}
    </div>
  );
}

/* ============================================
 * Sub-components
 * ============================================ */

function HardwareCheckItem({ 
  label, 
  status, 
  icon 
}: { 
  label: string; 
  status: "checking" | "ready" | "error"; 
  icon: string;
}) {
  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500
      ${status === "ready" 
        ? "bg-[#10B981]/10 border-[#10B981]/30" 
        : status === "error"
        ? "bg-red-500/10 border-red-500/30"
        : "bg-zinc-800/50 border-zinc-700"
      }
    `}>
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className={`text-sm ${
          status === "ready" ? "text-[#10B981]" : 
          status === "error" ? "text-red-400" : 
          "text-zinc-500"
        }`}>
          {status === "checking" && "Checking..."}
          {status === "ready" && "Ready"}
          {status === "error" && "Error - Please contact staff"}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center">
        {status === "checking" && (
          <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
        )}
        {status === "ready" && (
          <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "error" && (
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
    </div>
  );
}

