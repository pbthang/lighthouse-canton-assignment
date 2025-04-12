import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

function App() {
  return (
    <SidebarProvider className="font-sans">
      <AppSidebar />
      <main className="w-full">
        <div className="flex gap-2 items-center border-b border-border p-2">
          <SidebarTrigger />
          <h1 className="text-sm">Risk Monitoring Application</h1>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default App;
