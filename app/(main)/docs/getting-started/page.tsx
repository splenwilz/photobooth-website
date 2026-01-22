import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Get your PhotoBoothX up and running in under 10 minutes. Step-by-step guide.",
};

const steps = [
  {
    number: "01",
    title: "Download and Install",
    content: `Download PhotoBoothX for your operating system from our downloads page. 
    
**Windows:** Run the installer and follow the prompts. PhotoBoothX will be installed to your Program Files folder.

**macOS:** Open the DMG file and drag PhotoBoothX to your Applications folder.

The installation typically takes less than 2 minutes.`,
  },
  {
    number: "02",
    title: "Connect Your Camera",
    content: `PhotoBoothX supports most DSLR cameras from Canon, Nikon, and Sony.

1. Connect your camera via USB to your computer
2. Turn on the camera and set it to PC/Tether mode
3. PhotoBoothX will automatically detect the camera
4. You should see a live preview in the app

**Tip:** If using a webcam, it will be detected automatically - no configuration needed.`,
  },
  {
    number: "03",
    title: "Set Up Your Printer",
    content: `For instant prints, connect a dye-sublimation printer.

1. Install your printer's official drivers
2. Connect the printer via USB
3. In PhotoBoothX, go to Settings → Printer
4. Select your printer from the dropdown
5. Run a test print to verify

**Supported printers:** DNP DS-RX1, DNP DS620, HiTi P525L, Mitsubishi CP-D70DW, and more.`,
  },
  {
    number: "04",
    title: "Choose a Template",
    content: `PhotoBoothX comes with 100+ pre-built templates.

1. Go to Templates in the main menu
2. Browse by category (Strips, 4x6, Square, etc.)
3. Click a template to preview it
4. Click "Use Template" to activate it

**Customization:** Click "Edit" on any template to add your own logos, text, and graphics.`,
  },
  {
    number: "05",
    title: "Configure Payments (Optional)",
    content: `If you're running a paid booth, set up payments.

1. Go to Settings → Payments
2. Choose your payment method (Coin, Card, or Both)
3. Set prices for each product type
4. Run a test transaction

**Free Play Mode:** For private events, enable Free Play in Settings to disable payments.`,
  },
  {
    number: "06",
    title: "Start Your Booth",
    content: `You're ready to go!

1. Click "Start Booth" on the main screen
2. The attract screen will display, waiting for guests
3. Guests tap the screen to start their session
4. Photos are captured, displayed, and printed automatically

**Pro Tip:** Download our mobile app to monitor your booth remotely during events.`,
  },
];

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-16 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
          <Link href="/docs" className="hover:text-[var(--foreground)]">Docs</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Getting Started</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Getting Started
          </h1>
          <p className="text-[var(--muted)]">
            Get your PhotoBoothX up and running in under 10 minutes. 
            This guide will walk you through the essential setup steps.
          </p>
        </div>

        {/* Prerequisites */}
        <div className="p-6 rounded-xl border border-[#0891B2]/20 bg-[#0891B2]/5 mb-12">
          <h2 className="font-semibold text-[#22D3EE] mb-3">Before you start</h2>
          <ul className="space-y-2 text-sm text-[var(--foreground-secondary)]">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              A computer running Windows 10+ or macOS 12+
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              A DSLR camera or webcam (optional for testing)
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              A dye-sub printer (optional - can test without)
            </li>
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold text-[var(--muted)]">
                  {step.number}
                </div>
                <div className="flex-1 pt-2">
                  <h2 className="text-xl font-semibold mb-4">{step.title}</h2>
                  <div className="prose prose-invert prose-sm max-w-none">
                    {step.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-[var(--muted)] whitespace-pre-line mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-16 pt-12 border-t border-white/5">
          <h2 className="text-xl font-semibold mb-6">Next Steps</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/docs/camera-setup"
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
            >
              <h3 className="font-medium mb-1">Camera Configuration →</h3>
              <p className="text-sm text-[var(--muted)]">Fine-tune your camera settings</p>
            </Link>
            <Link
              href="/docs/templates"
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
            >
              <h3 className="font-medium mb-1">Using Templates →</h3>
              <p className="text-sm text-[var(--muted)]">Create custom photo layouts</p>
            </Link>
            <Link
              href="/docs/mobile-app"
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
            >
              <h3 className="font-medium mb-1">Mobile App Guide →</h3>
              <p className="text-sm text-[var(--muted)]">Monitor booths remotely</p>
            </Link>
            <Link
              href="/docs/payment-setup"
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
            >
              <h3 className="font-medium mb-1">Payment Setup →</h3>
              <p className="text-sm text-[var(--muted)]">Configure coins and cards</p>
            </Link>
          </div>
        </div>

        {/* Help */}
        <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/[0.02] text-center">
          <p className="text-[var(--muted)]">
            Need help? <Link href="/support" className="text-cyan-400 hover:text-cyan-300">Contact support</Link> or{" "}
            <a href="https://discord.gg/photoboothx" className="text-[#22D3EE] hover:text-[#0891B2]">join our Discord</a>
          </p>
        </div>
      </div>
    </div>
  );
}

