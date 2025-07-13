
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";

interface TaxonomyLayoutProps {
  children: React.ReactNode;
}

export const TaxonomyLayout: React.FC<TaxonomyLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
