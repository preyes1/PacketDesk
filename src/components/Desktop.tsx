"use client";

import { useDesktopStore } from "../store/desktopStore";
import Window from "./Window";
import Taskbar from "./Taskbar";

export default function Desktop() {
  const windows = useDesktopStore((s) => s.windows);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Wallpaper (image) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/wallpapers/pixel-art.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />

      {/* Window layer */}
      <div className="absolute inset-0">
        {windows.map((w) => (
          <Window key={w.id} win={w} />
        ))}
      </div>

      <Taskbar />
    </div>
  );
}
