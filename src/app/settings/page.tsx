"use client";

import SettingsPage from "@/components/SettingsPage";
import { useAppContext } from "@/context/AppContext";
// import { useRouter } from "next/navigation";

export default function Settings() {
  const { settings, handleSettingsChange } = useAppContext();
  // const router = useRouter();

  // const handleNavigateToSplit = () => {
  //   router.push("/calculator");
  // };

  // const handleNavigateToHistory = () => {
  //   router.push("/history");
  // };

  return (
    <SettingsPage
      settings={settings}
      onSettingsChange={handleSettingsChange}
      // onNavigateToSplit={handleNavigateToSplit}
      // onNavigateToHistory={handleNavigateToHistory}
    />
  );
}
