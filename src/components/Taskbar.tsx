"use client";

import { useDesktopStore } from "../store/desktopStore";

export default function Taskbar() {
  const openWindow = useDesktopStore((s) => s.openWindow);
  const windows = useDesktopStore((s) => s.windows);
  const toggleMinimize = useDesktopStore((s) => s.toggleMinimize);
  const focusWindow = useDesktopStore((s) => s.focusWindow);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-zinc-200 pixel-window flex items-center px-2 gap-2">
      <button
        className="pixel-button bg-white px-3 py-1 font-mono text-xs"
        onClick={() => openWindow("terminal")}
      >
        + Terminal
      </button>

      <div className="flex-1 flex gap-2 overflow-auto">
        {windows.map((w) => (
          <button
            key={w.id}
            className="pixel-button bg-white px-2 py-1 font-mono text-xs whitespace-nowrap"
            onClick={() => (w.minimized ? focusWindow(w.id) : toggleMinimize(w.id))}
          >
            {w.title}
          </button>
        ))}
      </div>

      <div className="font-mono text-xs px-2">NetDeskOS</div>
    </div>
  );
}
