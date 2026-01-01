import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Main Layout - Includes navbar and footer
 * Used for marketing pages (home, features, pricing, docs, downloads)
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

