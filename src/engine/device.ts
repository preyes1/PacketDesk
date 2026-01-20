// this is for special effects that the engine can request (not simple output)
// can add game sound effects here too later
export type EngineEffect = 
    | { type: "CLEAR_SCREEN" ;}

// Everything the engine can say back after a command is run
export type EngineResult = {
    // What should the output be?
    outputLines: string[];
    // What should the prompt be now? (SW1>, SW1#, etc))
    prompt: string;
    // Any special effects to trigger?
    effects?: EngineEffect[];
}

// an interface is like a contract
// Any object that implements Device must have these two methods
// allows you to do router.execute("command") or switch.execute("command")
export interface Device{
    // object must have execute method that takes a string (command) and returns an EngineResult
    // execute basically means "run a CLI command"
    execute(command: string): EngineResult;
    // object must also have getPrompt method that returns a string
    // (SW1>, SW1#, etc))
    getPrompt(): string;
}