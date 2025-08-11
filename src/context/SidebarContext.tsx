"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Ctx = {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (b: boolean) => void;
};
const SidebarContext = createContext<Ctx | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("admin_sidebar_expanded");
    if (s != null) setExpanded(s === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_sidebar_expanded", isExpanded ? "1" : "0");
  }, [isExpanded]);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isHovered,
        isMobileOpen,
        toggleSidebar: () => setExpanded((p) => !p),
        toggleMobileSidebar: () => setMobileOpen((p) => !p),
        setIsHovered,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const c = useContext(SidebarContext);
  if (!c) throw new Error("useSidebar must be used inside SidebarProvider");
  return c;
};
