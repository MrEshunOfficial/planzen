"use client";
import React from "react";
import { motion } from "framer-motion";
import ProfileNav from "@/components/ui/ProfileNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex items-center justify-center gap-2 relative p-2">
      <ProfileNav />
      <motion.section className="flex-1 h-full overflow-x-hidden overflow-y-auto relative border">
        {children}
      </motion.section>
    </div>
  );
};

export default Layout;
