import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { Outlet } from "react-router";

export const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
