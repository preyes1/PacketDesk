"use client";

import { run } from "node:test";
import { useMemo, useState } from "react";
import { SwitchDevice } from "../engine/switchDevice";

// defining Line object, type can either be "out" or "in" and text is a string
type Line = { type: "out" | "in"; text: string};

// have to put this outside of the TerminalApp function so that the device state persists across re-renders
// if we put it inside TerminalApp, everytime user types a command the component re-renders and creates a new SwitchDevice
const device = new SwitchDevice();

// defines a react component called TerminalApp
export default function TerminalApp() {
    // tells react to create a state variable called "lines",
    // which is an array of Line objects
    // and a function to update "lines" using setLines
    // <Line[]> is just telling typescript that lines is an array of Line objects

    // setLines is like the key to change the lines variable (if we chagned lines directly react would not know to re-render)
    // anytime we call setLines, react will re-render the component with the new value of lines
    const [lines, setLines] = useState<Line[]>([
        { type: "out", text: "Welcome to NetDeskOS v0.1" },
        { type: "out", text: "Type: help" },
    ]);

    // creates another state variable called input, which is a string
    // and a function to update input using setInput (same as setLines where it's the key to change input)
    const [input, setInput] = useState("");
    const [prompt, setPrompt] = useState(device.getPrompt());
    
    // function to run commands inputted by user
    function runCommand(cmdRaw: string) {
        // removes whitespace from both ends of user input and runs the command on the device
        return device.execute(cmdRaw.trim());

    }
    
    // runs when user submits the form (presses enter)
    function onSubmit(e: React.FormEvent) {
        // prevents the default form submission behavior (which would reload the page)
        e.preventDefault();

        // saves the current input (input is a state variable) value to a variable called cmd
        // clears setInput so the input field is empty again
        const cmd = input; 
        setInput("");
        // saves the current prompt to promptBefore 
        const promptBefore = prompt;
        // runs the command and saves the output to a variable called result
        const result = runCommand(cmd);

        // creates a new array of lines by taking the previous lines and adding a new line
        // prev is just the previous value of lines
        setLines((prev) => [...prev, { type: "in", text: `${promptBefore} ${cmd}`}]);

        setPrompt(result.prompt);

        // checks if the output is an array 
        // (many times the output is nothing i.e. when you add IP address to interface)
        //if (Array.isArray(result.outputLines)) { <-- THIS WOULD ALWAYS BE TRUE BC IT'S ALWAYS AN ARRAY
        if (result.outputLines.length > 0) {
            //takes the values of result.outputLines and maps them to Line objects with type "out"
            // ...out.map is just spreading the array returned by map into individual elements
            // without ... out.map would return a nested array which is not what we want
            setLines((prev) => [...prev, ...result.outputLines.map((t) => ({ type: "out" as const, text: t }))]);
        }
    }
    return (
    <div className="h-full w-full bg-black text-white font-mono text-sm p-3 overflow-auto pixel-ui">
      <div className="space-y-1">
        {/* for every line in lines, render one <div> */}
        {lines.map((l, idx) => (
            //if user input (type "in"), make text green, else normal (white) text
          <div key={idx} className={l.type === "in" ? "text-green-300" : ""}>
            {l.text}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-2 flex gap-2">
        <span className="text-green-300">{prompt}</span>
        {/* user types -> onChange fires -> setInput(newText)
        -> React re-renders -> value={input} -> input displays newText */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black outline-none"
          autoFocus
        />
      </form>
    </div>
  );
}