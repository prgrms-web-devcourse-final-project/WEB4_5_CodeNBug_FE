import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./providers/theme-provider";

export default function App() {
  return (
    <ThemeProvider>
      <Toaster richColors closeButton position="top-center" />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
