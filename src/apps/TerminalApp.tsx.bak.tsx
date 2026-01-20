"use client";

import { useMemo, useState } from "react";

type Line = { type: "out" | "in"; text: string };

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { type: "out", text: "Welcome to NetDeskOS v0.1" },
    { type: "out", text: "Type: help" },
  ]);
  const [input, setInput] = useState("");

  const prompt = useMemo(() => "SW1>", []);

  function runCommand(cmdRaw: string) {
    const cmd = cmdRaw.trim();

    if (!cmd) return;

    const lower = cmd.toLowerCase();
    if (lower === "help") {
      return [
        "Commands:",
        "  help",
        "  clear",
        "  show ip int brief",
        "  vlan 10",
      ];
    }
    if (lower === "clear") {
      setLines([]);
      return null;
    }
    if (lower === "show ip int brief") {
      return [
        "Interface       IP-Address      OK? Method Status  Protocol",
        "Vlan1           192.168.1.10    YES NVRAM  up      up",
        "Gig0/1          unassigned      YES unset  up      up",
      ];
    }
    if (lower === "vlan 10") {
      return ["Creating VLAN 10...", "OK"];
    }
    return [`% Unknown command: ${cmd}`];
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setInput("");

    setLines((prev) => [...prev, { type: "in", text: `${prompt} ${cmd}` }]);

    const out = runCommand(cmd);
    if (Array.isArray(out)) {
      setLines((prev) => [...prev, ...out.map((t) => ({ type: "out" as const, text: t }))]);
    }
  }

  return (
    <div className="h-full w-full bg-black text-white font-mono text-sm p-3 overflow-auto pixel-ui">
      <div className="space-y-1">
        {lines.map((l, idx) => (
          <div key={idx} className={l.type === "in" ? "text-green-300" : ""}>
            {l.text}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-2 flex gap-2">
        <span className="text-green-300">{prompt}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black outline-none border-b border-white/20"
          autoFocus
        />
      </form>
    </div>
  );
}
