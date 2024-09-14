"use client";
import { Button } from "./ui/button";

export default function DarkModeButton() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };
  return (
    <Button className="shadow-xl rounded-full" onClick={toggleDarkMode}>
      Toggle Dark Mode
    </Button>
  );
}
