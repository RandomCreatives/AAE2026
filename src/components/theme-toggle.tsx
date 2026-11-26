"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const sync = () => setLight(document.documentElement.classList.contains("light"));
    sync();
    window.addEventListener("addis-theme-change", sync);
    return () => window.removeEventListener("addis-theme-change", sync);
  }, []);

  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    setLight(next);
    window.dispatchEvent(new Event("addis-theme-change"));
    try {
      localStorage.setItem("addis-theme", next ? "light" : "dark");
    } catch {
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={light}
      className={className}
    >
      {light ? "Dark" : "Light"}
    </button>
  );
}
