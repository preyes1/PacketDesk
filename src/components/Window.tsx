"use client";

import { Rnd } from "react-rnd";
import { DesktopWindow, useDesktopStore } from "../store/desktopStore";
import TerminalApp from "../apps/TerminalApp";

function AppRenderer({ app }: { app: DesktopWindow["app"] }) {
  if (app === "terminal") return <TerminalApp />;
  return <div className="p-4">Unknown app</div>;
}

export default function Window({ win }: { win: DesktopWindow }) {
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const toggleMinimize = useDesktopStore((s) => s.toggleMinimize);
  const updateBounds = useDesktopStore((s) => s.updateBounds);
  const activeId = useDesktopStore((s) => s.activeId);

  if (win.minimized) return null;

  const isActive = activeId === win.id;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      bounds="parent"
      onDragStart={() => focusWindow(win.id)}
      onResizeStart={() => focusWindow(win.id)}
      onDragStop={(_, d) => updateBounds(win.id, { x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, pos) =>
        updateBounds(win.id, {
          w: ref.offsetWidth,
          h: ref.offsetHeight,
          x: pos.x,
          y: pos.y,
        })
      }
      style={{ zIndex: win.z }}
      className="absolute"
    >
      <div
        onMouseDown={() => focusWindow(win.id)}
        className={[
          "pixel-window h-full w-full bg-zinc-100",
          isActive ? "ring-2 ring-black" : "opacity-95",
          "flex flex-col overflow-hidden",
        ].join(" ")}
      >
        <div className="pixel-titlebar bg-zinc-200 px-2 py-1 flex items-center justify-between">
          <div className="font-mono text-xs">{win.title}</div>
          <div className="flex gap-2">
            <button className="pixel-button bg-white px-2 text-xs" onClick={() => toggleMinimize(win.id)}>
              _
            </button>
            <button className="pixel-button bg-white px-2 text-xs" onClick={() => closeWindow(win.id)}>
              X
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <AppRenderer app={win.app} />
        </div>
      </div>
    </Rnd>
  );
}
