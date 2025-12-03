import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProfileTable from "./components/ProfileTable.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-gray-50 min-h-screen">
      <Toaster richColors position="top-center" />
      <div className="flex justify-center items-start pt-8">
        <div className="w-3/4 max-w-4xl">
          <ProfileTable />
        </div>
      </div>
    </div>
  </StrictMode>
);