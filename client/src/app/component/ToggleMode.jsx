"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import { useTheme } from "next-themes";
import {Button} from "@/components/ui/button"

const ToggleMode = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Make sure component is mounted before rendering (fixes hydration errors)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="secondary" size="icon" disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="hover:cursor-pointer hover:text-primary" />
      ) : (
        <Moon className="hover:cursor-pointer hover:text-primary" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ToggleMode;
