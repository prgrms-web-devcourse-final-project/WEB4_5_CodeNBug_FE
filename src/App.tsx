import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./providers/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query/query-client";
import { NotificationProvider } from "./providers/notification-provider";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ThemeProvider>
          <Toaster richColors closeButton position="top-center" />
          <RouterProvider router={router} />
        </ThemeProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
