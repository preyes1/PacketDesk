import type { Device, EngineResult } from "./device";

export class SwitchDevice implements Device {
  // Engine needs to keep track of hostname and mode (USER/PRIV)
  // private means UI can't access these properties directly (so it can't change them)
  private hostname: string;
  private mode: "USER" | "PRIV" | "CONFIG";
  private interfaces: {
    [key: string]: {
      address: { ipv4: string; prefix: number } | null;
      status: "up" | "down";
    };
  };
  private vlans: {
    [key: number]: {
      name: string;
      interfaces: string[];
    };
  };

  // everytime a new SwitchDevice is created, it starts with
  // default hostname of "Switch" and mode "USER"
  constructor(hostname = "Switch") {
    this.hostname = hostname;
    this.mode = "USER";
    this.interfaces = {
      "Interface Gi0/1": { address: null, status: "down" },
      "Interface Gi0/2": { address: null, status: "down" },
      "Interface Gi0/3": { address: null, status: "down" },
      "Interface Gi0/4": { address: null, status: "down" },
      "Interface Gi0/5": { address: null, status: "down" },
      "VLAN 1": { address: null, status: "down" },
    };
    this.vlans = { 1: { name: "default", interfaces: [] } };
  }

  // gets the prompt based on the current mode
  getPrompt(): string {
    // conditional based on current mode
    if (this.mode === "USER") {
      return `${this.hostname}>`;
    } else if (this.mode === "PRIV") {
      return `${this.hostname}#`;
    } else if (this.mode === "CONFIG") {
      return `${this.hostname}(config)#`;
    } else {
      // this should never happen
      return `${this.hostname}?what?`;
    }
  }
  // takes raw command and returns EngineResult
  execute(commandRaw: string): EngineResult {
    // removes whitespace from both ends of user input
    const cmd = commandRaw.trim();

    // Gets the current prompt (if empty enter, just return prompt)
    const prompt = this.getPrompt();

    // If the command is empty (user just pressed enter), then just return prompt
    // This is EngineResult object
    if (!cmd) return { outputLines: [], prompt };

    const lower = cmd.toLowerCase();

    //////// COMMAND HANDLING BASED ON MODE ////////

    if (this.mode === "USER") {
      //USER MODE COMMANDS
      if (lower === "enable" || lower === "en") {
        this.mode = "PRIV";
        return { outputLines: [], prompt: this.getPrompt() };
      } else {
        return {
          outputLines: [`% Unknown command in USER mode: ${cmd}`],
          prompt,
        };
      } // end of USER mode commands
    } else if (this.mode === "PRIV") {
      //PRIV MODE COMMANDS
      if (
        lower === "show ip interface brief" ||
        lower === "show ip int brief"
      ) {
        return {
          outputLines: [
            "Interface       IP-Address      OK? Method Status  Protocol",
            "Vlan1",
          ],
          prompt,
        };
      } else if (lower === "exit") {
        this.mode = "USER";
        return { outputLines: [], prompt: this.getPrompt() };
      } else if (lower === "configure terminal" || lower === "conf t") {
        this.mode = "CONFIG";
        return {
          outputLines: [
            "Enter configuration commands, one per line. End with CNTL/Z.",
          ],
          prompt: this.getPrompt(),
        };
      } // end of PRIV mode commands
    } else if (this.mode === "CONFIG") {
      //CONFIG MODE COMMANDS
      if (lower.startsWith("hostname ")) {
        // changes hostname to whatever user typed after "hostname "
        const parts = cmd.split(" ");
        if (parts.length >= 2) {
          this.hostname = parts[1];
          return {
            outputLines: [],
            prompt: this.getPrompt(),
          };
        } else {
          return {
            outputLines: ["% Incomplete command."],
            prompt,
          };
        }
      } else if (lower === "exit") {
        this.mode = "PRIV";
        return { outputLines: [], prompt: this.getPrompt() };
      }
    } // If command not recognized in any mode, return unknown command message
    return {
      outputLines: [`% Unknown command: ${cmd}`],
      prompt,
    };
  }
}
