import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AuthProvider from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider className="font-sans">
          <AppSidebar />
          <SidebarInset>
            <main className="w-full">
              <div className="flex gap-2 items-center border-b border-border p-2">
                <SidebarTrigger />
                <h1 className="text-sm">Risk Monitoring Application</h1>
              </div>
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
