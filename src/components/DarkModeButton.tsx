"use client";
import { useEffect } from "react";
import { Button } from "./ui/button";

export default function DarkModeButton() {
  // Toggles dark mode and saves the theme in localStorage
  const toggleDarkMode = () => {
    const htmlElement = document.documentElement;
    const isDarkMode = htmlElement.classList.toggle("dark");

    // Save the user preference in localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  };

  // Check localStorage for theme preference on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Button className="shadow-xl rounded-full" onClick={toggleDarkMode}>
      Toggle Dark Mode
    </Button>
  );
}
